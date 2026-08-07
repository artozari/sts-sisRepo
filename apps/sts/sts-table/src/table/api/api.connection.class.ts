import * as http from "node:http";
import events from "node:events";

import { ApiConnectionConfigInterface } from "./interfaces/api.connection.config.interface";
import { ApiConnectionEmiterEnum } from "./enums/api.connection.emiter.enum";
import { ApiConnectionEmiterInterface } from "./interfaces/api.connection.emiter.interface";
import { ApiConnectionSaveGameInterface } from "./interfaces/api.connection.save.game.interface";
import { CommunicationStatisticsClass } from "@slcn-pkg/communication-statistics-class";
import { HttpClientClass, HttpVerbsEnum } from "@slcn-pkg/http-client-class";
import { CutOffInterface, LastCutOffInterface, StsCasinoInterface, StsConfigurationInterface, StsGameInterface, StsTableInterface } from "sts-common";
import ErrorMessageFunc from "@slcn-pkg/utility-libraries/dist/error-message/error.message.func";
import { GeneralLoggerClass } from "@slcn-pkg/general-logger-class";
import { LevelsLoggerEnum } from "@slcn-pkg/general-logger-constants";

interface SendVerbHttpInterface {
    status: number | undefined;
    res: string;
}

interface QueryTypeInterface {
    key: string;
    value: string;
}

const BIT_API_STATE_TIME: number = 10000;

export enum BitApiStateEnum {
    TableId,
    GameNumber,
    WinningNumber,
    Configuration,
    Max,
}

export class ApiConnectionClass {
    // private _casino: StsCasinoInterface | undefined = undefined;
    private _tableId: number | undefined = undefined;
    private _configTableId: number | undefined = undefined;
    private _table: StsTableInterface | undefined = undefined;
    private _lastGameNumber: number | undefined = undefined;
    private _lastSavedGameRecord: StsGameInterface | undefined = undefined;
    private _lastWinningNumber: number[] | undefined = undefined;
    private _lastWinningNumberData: StsGameInterface[] | undefined = undefined;
    private _stsConfiguration: StsConfigurationInterface | undefined = undefined;
    private _lastResponse: number | undefined = undefined;
    private readonly _tableStatistics: CommunicationStatisticsClass = new CommunicationStatisticsClass(30, 10);
    private readonly _gameNumberStatistics: CommunicationStatisticsClass = new CommunicationStatisticsClass(30, 10);
    private readonly _saveWinningNumberStatistics: CommunicationStatisticsClass = new CommunicationStatisticsClass(30, 10);
    public gameEmitter = new events.EventEmitter();
    private readonly _httpClientClass: HttpClientClass;
    private _bitApiState: number[];
    private readonly _logger: GeneralLoggerClass | null;

    constructor(private readonly _config: ApiConnectionConfigInterface) {
        this._logger = _config.logger;
        this._bitApiState = new Array(BitApiStateEnum.Max).fill(0);

        setTimeout(this.periodicProc, 50);
        setInterval(this.periodicProc, 2000);
        setInterval(this.periodicApiState, 1000);
        setTimeout(() => {
            this.periodicCutOff();
            setInterval(this.periodicCutOff, 10000);
        }, 2000);

        this.gameEmitter.on(ApiConnectionEmiterEnum.tableId, () => {
            this._bitApiState[BitApiStateEnum.TableId] = Date.now();
            this._config.getGameEmision(ApiConnectionEmiterEnum.tableId, this.loadEmiterInterface());
        });

        this.gameEmitter.on(ApiConnectionEmiterEnum.gameNumber, () => {
            this._bitApiState[BitApiStateEnum.GameNumber] = Date.now();
            this._config.getGameEmision(ApiConnectionEmiterEnum.gameNumber, this.loadEmiterInterface());
        });

        this.gameEmitter.on(ApiConnectionEmiterEnum.saveGame, () => {
            this._config.getGameEmision(ApiConnectionEmiterEnum.saveGame, this.loadEmiterInterface());
        });

        this.gameEmitter.on(ApiConnectionEmiterEnum.winningNumber, () => {
            this._bitApiState[BitApiStateEnum.WinningNumber] = Date.now();
            this._config.getGameEmision(ApiConnectionEmiterEnum.winningNumber, this.loadEmiterInterface());
        });

        this.gameEmitter.on(ApiConnectionEmiterEnum.configuration, () => {
            this._bitApiState[BitApiStateEnum.Configuration] = Date.now();
            this._config.getGameEmision(ApiConnectionEmiterEnum.configuration, this.loadEmiterInterface());
        });

        this._httpClientClass = new HttpClientClass(this._config.url, this._config.port, this._config.timeout);
    }

    private readonly periodicApiState = (): void => {
        try {
            const now: number = Date.now();
            for (let i: number = 0; i < BitApiStateEnum.Max; i++) {
                const t: number = this._bitApiState[i];
                if (t > 0) {
                    if (now - t > BIT_API_STATE_TIME) {
                        this._bitApiState[i] = 0;
                    }
                }
            }
        } catch (error) {
            //empty
        }
    };

    /**
     * The `checkApiState` method checks the state of the API and returns a number which represents the state as a bit field.
     * The bits are set according to the following enumeration:
     * - Bit 0: Table ID
     * - Bit 1: Game Number
     * - Bit 2: Winning Number
     * - Bit 3: Configuration
     * If the state is not set, the bit is 0, otherwise it is 1.
     * The method returns the state as a number.
     * @returns {number} The state of the API as a bit field.
     */
    public checkApiState = (): { state: boolean; flags: number } => {
        let flags: number = 0;
        let state: boolean = false;

        try {
            const now: number = Date.now();
            let id: number = 0; // Bit ID
            for (const t of this._bitApiState) {
                if (t > 0) {
                    // If the state is not old and not too old, set the corresponding bit in the response.
                    if (now - t < BIT_API_STATE_TIME && now - t >= 0) {
                        const bit: number = 1 << id; // Set the bit in the response.
                        flags = flags | bit;
                    }
                }
                id = id + 1; // Increment the bit ID.
            }

            if (flags === 0b1011 || flags === 0b1111) {
                state = true;
            }
        } catch (error) {
            // If an error occurs, set the response to 0.
            flags = 0;
            state = false;
        }

        const resp = { state, flags };
        return resp;
    };

    private readonly loadEmiterInterface = (): ApiConnectionEmiterInterface => {
        const tableId: number = this._tableId ?? 0;

        const resp: ApiConnectionEmiterInterface = {
            tableId,
            table: this._table,
            gameNumber: this._lastGameNumber,
            saveGame: this._lastGameNumber,
            winningNumbers: this._lastWinningNumber,
            winningNumbersData: this._lastWinningNumberData,
            statistics: undefined,
            configuration: this._stsConfiguration,
            lastSavedGameRecord: this._lastSavedGameRecord,
        };
        return resp;
    };

    private readonly getTimeOutValue = (): number => {
        return 5000;
    };

    private readonly periodicProc = () => {
        try {
            this.getApiPing()
                .then()
                .catch(() => {});

            if (this._lastResponse !== undefined) {
                const deltaT: number = Date.now() - this._lastResponse;
                const timeOutValue: number = this.getTimeOutValue();
                if (deltaT > timeOutValue) {
                    this._tableId = undefined;
                    this._configTableId = undefined;
                    this._lastGameNumber = undefined;
                    this._lastResponse = undefined;
                }
            }
        } catch (error) {
            console.log("error", error);
        }
    };

    private readonly getUrl = (): string => {
        let url: string = this._config.url;
        if (this._config.port > 0) {
            url = url + ":" + this._config.port;
        }
        url = this._config.ssl ? "https://" + url : "http://" + url;
        return url;
    };

    private readonly getApiPing = (): Promise<void> => {
        return new Promise<void>((resolve, reject) => {
            try {
                const t: number = Date.now();
                const path: string = `/api/ping`;

                this._httpClientClass
                    .sendVerbHttp(path, HttpVerbsEnum.GET, [], "")
                    .then((res: SendVerbHttpInterface) => {
                        const resp = JSON.parse(res.res);

                        const deltaT: number = Date.now() - t;

                        if (res.status === 200 && resp.srv === "sts-api") {
                            this._lastResponse = Date.now();
                            this.getTableIdFromDb()
                                .then(() => {})
                                .catch(() => {});
                            this._tableStatistics.newData(true, deltaT);
                            resolve();
                        } else {
                            this._tableStatistics.newData(false, 0);
                            reject(new Error("Error getting ping"));
                        }
                    })
                    .catch((err) => {
                        this._tableStatistics.newData(false, 0);
                        const errMsg: string = ErrorMessageFunc(err);
                        reject(new Error(errMsg));
                    });
            } catch (err) {
                const errMsg: string = ErrorMessageFunc(err);
                reject(new Error(errMsg));
            }
        });
    };

    private readonly getLastCutOffFromDb = (): Promise<CutOffInterface | null> => {
        return new Promise<CutOffInterface | null>((resolve, reject) => {
            const path: string = `/api/cutoff/last`;

            this._httpClientClass
                .sendVerbHttp(path, HttpVerbsEnum.GET, [], "")
                .then((res: SendVerbHttpInterface) => {
                    const resp: LastCutOffInterface = JSON.parse(res.res);

                    if (res.status === 200) {
                        resolve(resp.enabled ?? null);
                    } else {
                        const strError: string = `Data from Last Cutoff "${this._config.tableId}" could not be received. Status code: ${res.status}`;
                        this.log(LevelsLoggerEnum.error, strError);
                        this._tableStatistics.newData(false, 0);
                        reject(new Error("Error Last Cutoff"));
                    }
                })
                .catch((err) => {
                    this.logError(err);
                    this._tableStatistics.newData(false, 0);
                    const errMsg: string = ErrorMessageFunc(err);
                    reject(new Error(errMsg));
                });
        });
    };

    private readonly getTableIdFromDb = (): Promise<number> => {
        return new Promise<number>((resolve, reject) => {
            try {
                const t: number = Date.now();
                const path: string = `/api/${this._config.version}/table/key/${this._config.tableId}`;

                this._httpClientClass
                    .sendVerbHttp(path, HttpVerbsEnum.GET, [], "")
                    .then((res: SendVerbHttpInterface) => {
                        const resp: StsTableInterface = JSON.parse(res.res);

                        const deltaT: number = Date.now() - t;

                        if (res.status === 200 && resp.id !== undefined) {
                            this._tableId = resp.id;
                            this._configTableId = resp.configTableId;
                            this._table = resp;
                            this._lastResponse = Date.now();
                            this.getConfigurationTableFromDb()
                                .then(() => {})
                                .catch(() => {});
                            this._tableStatistics.newData(true, deltaT);
                            this.gameEmitter.emit(ApiConnectionEmiterEnum.tableId);
                            this.log(LevelsLoggerEnum.debug, `Data from table "${this._config.tableId}" has been received.`);
                            resolve(resp.id);
                        } else {
                            const strError: string = `Data from table "${this._config.tableId}" could not be received. Status code: ${res.status}`;
                            this.log(LevelsLoggerEnum.error, strError);
                            this._tableStatistics.newData(false, 0);
                            reject(new Error("Error getting Table iD number"));
                        }
                    })
                    .catch((err) => {
                        this.logError(err);
                        this._tableStatistics.newData(false, 0);
                        const errMsg: string = ErrorMessageFunc(err);
                        reject(new Error(errMsg));
                    });
            } catch (err) {
                if (err instanceof Error) this.logError(err);
                else this.log(LevelsLoggerEnum.error, "Server internal Error in getTableIdFromDb");
                const errMsg: string = ErrorMessageFunc(err);
                reject(new Error(errMsg));
            }
        });
    };

    private readonly getLastGameNumberFromDb = (): Promise<number> => {
        return new Promise<number>((resolve, reject) => {
            try {
                if (this._tableId !== undefined) {
                    const t: number = Date.now();

                    const queries: QueryTypeInterface[] = [
                        { key: "q", value: "1" },
                        { key: "table", value: `${this._tableId}` },
                        { key: "enabled", value: "true" },
                    ];
                    const path: string = `/api/${this._config.version}/game`;

                    this._httpClientClass
                        .sendVerbHttp(path, HttpVerbsEnum.GET, queries, "")
                        .then((res: SendVerbHttpInterface) => {
                            interface ResponseInterface {
                                gameNumber: number;
                            }
                            const resp: ResponseInterface[] = JSON.parse(res.res);

                            const deltaT: number = Date.now() - t;

                            if (res.status === 200 && resp[0].gameNumber !== undefined) {
                                let changedGameNumber: boolean = false;
                                if (this._lastGameNumber !== resp[0].gameNumber) {
                                    this._lastGameNumber = resp[0].gameNumber;
                                    changedGameNumber = true;
                                }
                                this._lastResponse = Date.now();
                                if (this._lastWinningNumber === undefined || changedGameNumber)
                                    this.getHistoricalWinningNumberFromDb()
                                        .then(() => {})
                                        .catch(() => {});
                                this._gameNumberStatistics.newData(true, deltaT);
                                this.gameEmitter.emit(ApiConnectionEmiterEnum.gameNumber);
                                resolve(this._lastGameNumber);
                            } else {
                                this._gameNumberStatistics.newData(false, 0);
                                const err = new Error("Error getting last game number");
                                reject(err);
                            }
                        })
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        .catch((err) => {
                            this._gameNumberStatistics.newData(false, 0);
                            const errMsg: string = ErrorMessageFunc(err);
                            reject(new Error(errMsg));
                        });
                }
            } catch (err) {
                const errMsg: string = ErrorMessageFunc(err);
                reject(new Error(errMsg));
            }
        });
    };

    private readonly getConfigurationTableFromDb = (): Promise<StsConfigurationInterface> => {
        return new Promise<StsConfigurationInterface>((resolve, reject) => {
            try {
                if (this._tableId !== undefined) {
                    const t: number = Date.now();

                    const queries: QueryTypeInterface[] = [
                        { key: "q", value: "1" },
                        { key: "table", value: `${this._configTableId}` },
                        { key: "enabled", value: "true" },
                    ];
                    const path: string = `/api/${this._config.version}/configuration`;

                    this._httpClientClass
                        .sendVerbHttp(path, HttpVerbsEnum.GET, queries, "")
                        .then((res: SendVerbHttpInterface) => {
                            const resp: StsConfigurationInterface[] = JSON.parse(res.res);

                            const deltaT: number = Date.now() - t;

                            if (res.status === 200 && resp.length === 1 && resp[0].id !== undefined) {
                                this._stsConfiguration = resp[0];
                                this._lastResponse = Date.now();
                                this.getLastGameNumberFromDb()
                                    .then(() => {})
                                    .catch(() => {});
                                this._tableStatistics.newData(true, deltaT);
                                this.gameEmitter.emit(ApiConnectionEmiterEnum.configuration);
                                this.log(LevelsLoggerEnum.debug, `Data from configuration table "${this._config.tableId}" has been received.`);
                                resolve(resp[0]);
                            } else {
                                const strError: string = `Data from configuration table "${this._config.tableId}" could not be received. Status code: ${res.status}`;
                                this.log(LevelsLoggerEnum.error, strError);
                                this._gameNumberStatistics.newData(false, 0);
                                const err = new Error(strError);
                                reject(err);
                            }
                        })
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        .catch((err) => {
                            this.logError(err);
                            this._gameNumberStatistics.newData(false, 0);
                            const errMsg: string = ErrorMessageFunc(err);
                            reject(new Error(errMsg));
                        });
                } else {
                    const errMsg: string = `The "${this._config.tableId}" tableId is undefined`;
                    const e: Error = new Error(errMsg);
                    this.logError(e);
                    reject(e);
                }
            } catch (err) {
                const errMsg: string = ErrorMessageFunc(err);
                const e: Error = new Error(errMsg);
                this.logError(e);
                reject(e);
            }
        });
    };

    public getTableId = (): number | undefined => this._tableId;

    public getGameNumber = (): number | undefined => {
        return this._lastGameNumber;
    };

    public isOnLine = (): boolean => {
        let resp: boolean = false;

        try {
            if (this._lastResponse !== undefined) {
                if (Date.now() - this._lastResponse < this.getTimeOutValue()) {
                    resp = true;
                }
            }
        } catch (error) {
            resp = false;
        }

        return resp;
    };

    public saveGame = (p_data: ApiConnectionSaveGameInterface): Promise<number> => {
        return new Promise<number>((resolve, reject) => {
            try {
                const t: number = Date.now();
                const path: string = `/api/${this._config.version}/game`;
                const queries: QueryTypeInterface[] = [];

                this._httpClientClass
                    .sendVerbHttp(path, HttpVerbsEnum.POST, queries, JSON.stringify(p_data))
                    .then((res: SendVerbHttpInterface) => {
                        const resp: StsGameInterface = <StsGameInterface>JSON.parse(res.res);

                        if (res.status === 201 && resp.gameNumber !== undefined) {
                            this.getHistoricalWinningNumberFromDb()
                                .then(() => {})
                                .catch(() => {});

                            const deltaT: number = Date.now() - t;
                            this._lastSavedGameRecord = resp;
                            this._lastGameNumber = resp.gameNumber;
                            this._lastResponse = Date.now();
                            this._saveWinningNumberStatistics.newData(true, deltaT);
                            this.gameEmitter.emit(ApiConnectionEmiterEnum.saveGame);
                            const strMsg: string = `Game saved with game number "${p_data.gameNumber}" and win number "${p_data.winNumber}".`;
                            this.log(LevelsLoggerEnum.debug, strMsg);
                            resolve(this._lastGameNumber);
                        } else {
                            this._saveWinningNumberStatistics.newData(false, 0);
                            const strMsg: string = `Error saving game with game number "${p_data.gameNumber}" and win number "${p_data.winNumber}".`;
                            this.log(LevelsLoggerEnum.error, strMsg);
                            const err = new Error(strMsg);
                            reject(err);
                        }
                    })
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    .catch((err: Error) => {
                        this._saveWinningNumberStatistics.newData(false, 0);
                        const errMsg: string = ErrorMessageFunc(err);
                        reject(new Error(errMsg));
                    });
            } catch (err) {
                const errMsg: string = ErrorMessageFunc(err);
                reject(new Error(errMsg));
            }
        });
    };

    private readonly getHistoricalWinningNumberFromDb = (): Promise<number[]> => {
        return new Promise<number[]>((resolve, reject) => {
            try {
                const t: number = Date.now();
                // const url: string = `${this.getUrl()}/api/${this._config.version}/game?q=200&table=${this._tableId}&enabled=true`;
                // const url: string = `${this.getUrl()}`;
                const path: string = `/api/${this._config.version}/game`;

                const queries: QueryTypeInterface[] = [
                    { key: "q", value: "200" },
                    { key: "table", value: `${this._tableId}` },
                    { key: "enabled", value: "true" },
                ];

                this._httpClientClass
                    .sendVerbHttp(path, HttpVerbsEnum.GET, queries, "")
                    .then((res) => {
                        const resp: StsGameInterface[] = JSON.parse(res.res);

                        const deltaT: number = Date.now() - t;

                        if (res.status === 200 && resp[0].winNumber !== undefined) {
                            this._lastWinningNumberData = resp;
                            this._lastWinningNumber = [];
                            resp.forEach((item) => {
                                if (this._lastWinningNumber === undefined) this._lastWinningNumber = [];
                                this._lastWinningNumber.push(item.winNumber);
                            });
                            this._lastResponse = Date.now();
                            this._saveWinningNumberStatistics.newData(true, deltaT);
                            this.gameEmitter.emit(ApiConnectionEmiterEnum.winningNumber);
                            resolve(this._lastWinningNumber);
                        } else {
                            this._saveWinningNumberStatistics.newData(false, 0);
                            const err = new Error("Error getting historical winning number");
                            reject(err);
                        }
                    })
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    .catch((err) => {
                        this._saveWinningNumberStatistics.newData(false, 0);
                        const errMsg: string = ErrorMessageFunc(err);
                        reject(new Error(errMsg));
                    });
            } catch (err) {
                const errMsg: string = ErrorMessageFunc(err);
                reject(new Error(errMsg));
            }
        });
    };

    public getCasinoFromDb = (): Promise<StsCasinoInterface> => {
        return new Promise<StsCasinoInterface>((resolve, reject) => {
            try {
                const t: number = Date.now();

                const queries: QueryTypeInterface[] = [{ key: "q", value: "1" }];
                const path: string = `/api/${this._config.version}/casino`;

                this._httpClientClass
                    .sendVerbHttp(path, HttpVerbsEnum.GET, queries, "")
                    .then((res: SendVerbHttpInterface) => {
                        const resp: StsCasinoInterface[] = JSON.parse(res.res);

                        const deltaT: number = Date.now() - t;

                        if (res.status === 200 && resp[0].id !== undefined) {
                            this._lastResponse = Date.now();
                            this._tableStatistics.newData(true, deltaT);
                            this.gameEmitter.emit(ApiConnectionEmiterEnum.casino);
                            resolve(resp[0]);
                        } else {
                            this._tableStatistics.newData(false, 0);
                            reject(new Error("Error getting Casino from DB"));
                        }
                    })
                    .catch((err) => {
                        this._tableStatistics.newData(false, 0);
                        const errMsg: string = ErrorMessageFunc(err);
                        reject(new Error(errMsg));
                    });
            } catch (err) {
                const errMsg: string = ErrorMessageFunc(err);
                reject(new Error(errMsg));
            }
        });
    };

    /**
     * Sends an HTTP request with the specified parameters.
     *
     * @param p_hostname - The hostname of the server.
     * @param p_port - The port number of the server.
     * @param p_path - The path of the API endpoint.
     * @param p_queries - Optional array of query parameters.
     * @param p_method - The HTTP method to use.
     * @param p_body - The request body.
     * @returns A promise that resolves to the response of the HTTP request.
     * @throws If there is an error with the request or processing the response.
     */
    private readonly sendVerbHttp = (
        p_hostname: string,
        p_port: number,
        p_path: string,
        p_queries: void | QueryTypeInterface[],
        p_method: string,
        p_body: string,
    ): Promise<SendVerbHttpInterface> => {
        return new Promise((resolve, reject) => {
            try {
                let queries: string = "";
                if (p_queries !== undefined) {
                    let queryConnector: string = "?";
                    p_queries.forEach((query: QueryTypeInterface) => {
                        const aux: string = `${query.key}=${query.value}`;
                        queries += queryConnector + aux;
                        queryConnector = "&";
                    });
                }

                const optionsPost: http.RequestOptions = {
                    hostname: p_hostname,
                    port: p_port,
                    path: p_path + queries,
                    method: p_method,
                    headers: {
                        "Content-Type": "application/json",
                        "Content-Length": Buffer.byteLength(p_body),
                    },
                };

                console.log(`${p_method} ---->`, optionsPost.path);
                const req = http.request(optionsPost, (res: http.IncomingMessage) => {
                    let dataRx: string = "";

                    res.setEncoding("utf8");
                    res.on("data", (chunk) => {
                        dataRx += chunk;
                    });
                    res.on("end", () => {
                        const resp: SendVerbHttpInterface = {
                            res: dataRx,
                            status: res.statusCode,
                        };
                        resolve(resp);
                    });
                });

                req.on("error", (e: Error) => {
                    reject(new Error(`VERB (${p_method})----> problem with request: ${e.message}`));
                });

                // Write data to request body
                req.write(p_body);
                req.end();
            } catch (err) {
                const errMsg: string = ErrorMessageFunc(err);
                reject(new Error(errMsg));
            }
        });
    };

    private readonly log = (p_level: LevelsLoggerEnum, p_msg: string): void => {
        if (this._logger !== null) this._logger.proc(p_level, p_msg);
    };

    private readonly logError = (p_error: Error): void => {
        if (this._logger !== null) this._logger.procError(p_error);
    };

    private readonly periodicCutOff = () => {
        try {
            this.getLastCutOffFromDb()
                .then((respEnabled: CutOffInterface | null) => {
                    // Handle the response
                    if (respEnabled !== null) {
                        this._config.getCutOff(respEnabled);
                    }
                })
                .catch((_err) => {
                    console.log(_err);
                });

            if (this._lastResponse !== undefined) {
                const deltaT: number = Date.now() - this._lastResponse;
                const timeOutValue: number = this.getTimeOutValue();
                if (deltaT > timeOutValue) {
                    this._tableId = undefined;
                    this._configTableId = undefined;
                    this._lastGameNumber = undefined;
                    this._lastResponse = undefined;
                }
            }
        } catch (error) {
            console.log("error", error);
        }
    };
}
