"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiConnectionClass = exports.BitApiStateEnum = void 0;
const http = __importStar(require("node:http"));
const node_events_1 = __importDefault(require("node:events"));
const api_connection_emiter_enum_1 = require("./enums/api.connection.emiter.enum");
const communication_statistics_class_1 = require("@slcn-pkg/communication-statistics-class");
const http_client_class_1 = require("@slcn-pkg/http-client-class");
const error_message_func_1 = __importDefault(require("@slcn-pkg/utility-libraries/dist/error-message/error.message.func"));
const general_logger_constants_1 = require("@slcn-pkg/general-logger-constants");
const BIT_API_STATE_TIME = 10000;
var BitApiStateEnum;
(function (BitApiStateEnum) {
    BitApiStateEnum[BitApiStateEnum["TableId"] = 0] = "TableId";
    BitApiStateEnum[BitApiStateEnum["GameNumber"] = 1] = "GameNumber";
    BitApiStateEnum[BitApiStateEnum["WinningNumber"] = 2] = "WinningNumber";
    BitApiStateEnum[BitApiStateEnum["Configuration"] = 3] = "Configuration";
    BitApiStateEnum[BitApiStateEnum["Max"] = 4] = "Max";
})(BitApiStateEnum || (exports.BitApiStateEnum = BitApiStateEnum = {}));
class ApiConnectionClass {
    constructor(_config) {
        this._config = _config;
        // private _casino: StsCasinoInterface | undefined = undefined;
        this._tableId = undefined;
        this._configTableId = undefined;
        this._table = undefined;
        this._lastGameNumber = undefined;
        this._lastSavedGameRecord = undefined;
        this._lastWinningNumber = undefined;
        this._lastWinningNumberData = undefined;
        this._stsConfiguration = undefined;
        this._lastResponse = undefined;
        this._tableStatistics = new communication_statistics_class_1.CommunicationStatisticsClass(30, 10);
        this._gameNumberStatistics = new communication_statistics_class_1.CommunicationStatisticsClass(30, 10);
        this._saveWinningNumberStatistics = new communication_statistics_class_1.CommunicationStatisticsClass(30, 10);
        this.gameEmitter = new node_events_1.default.EventEmitter();
        this.periodicApiState = () => {
            try {
                const now = Date.now();
                for (let i = 0; i < BitApiStateEnum.Max; i++) {
                    const t = this._bitApiState[i];
                    if (t > 0) {
                        if (now - t > BIT_API_STATE_TIME) {
                            this._bitApiState[i] = 0;
                        }
                    }
                }
            }
            catch (error) {
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
        this.checkApiState = () => {
            let flags = 0;
            let state = false;
            try {
                const now = Date.now();
                let id = 0; // Bit ID
                for (const t of this._bitApiState) {
                    if (t > 0) {
                        // If the state is not old and not too old, set the corresponding bit in the response.
                        if (now - t < BIT_API_STATE_TIME && now - t >= 0) {
                            const bit = 1 << id; // Set the bit in the response.
                            flags = flags | bit;
                        }
                    }
                    id = id + 1; // Increment the bit ID.
                }
                if (flags === 0b1011 || flags === 0b1111) {
                    state = true;
                }
            }
            catch (error) {
                // If an error occurs, set the response to 0.
                flags = 0;
                state = false;
            }
            const resp = { state, flags };
            return resp;
        };
        this.loadEmiterInterface = () => {
            const tableId = this._tableId ?? 0;
            const resp = {
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
        this.getTimeOutValue = () => {
            return 5000;
        };
        this.periodicProc = () => {
            try {
                this.getApiPing()
                    .then()
                    .catch(() => { });
                if (this._lastResponse !== undefined) {
                    const deltaT = Date.now() - this._lastResponse;
                    const timeOutValue = this.getTimeOutValue();
                    if (deltaT > timeOutValue) {
                        this._tableId = undefined;
                        this._configTableId = undefined;
                        this._lastGameNumber = undefined;
                        this._lastResponse = undefined;
                    }
                }
            }
            catch (error) {
                console.log("error", error);
            }
        };
        this.getUrl = () => {
            let url = this._config.url;
            if (this._config.port > 0) {
                url = url + ":" + this._config.port;
            }
            url = this._config.ssl ? "https://" + url : "http://" + url;
            return url;
        };
        this.getApiPing = () => {
            return new Promise((resolve, reject) => {
                try {
                    const t = Date.now();
                    const path = `/api/ping`;
                    this._httpClientClass
                        .sendVerbHttp(path, http_client_class_1.HttpVerbsEnum.GET, [], "")
                        .then((res) => {
                        const resp = JSON.parse(res.res);
                        const deltaT = Date.now() - t;
                        if (res.status === 200 && resp.srv === "sts-api") {
                            this._lastResponse = Date.now();
                            this.getTableIdFromDb()
                                .then(() => { })
                                .catch(() => { });
                            this._tableStatistics.newData(true, deltaT);
                            resolve();
                        }
                        else {
                            this._tableStatistics.newData(false, 0);
                            reject(new Error("Error getting ping"));
                        }
                    })
                        .catch((err) => {
                        this._tableStatistics.newData(false, 0);
                        const errMsg = (0, error_message_func_1.default)(err);
                        reject(new Error(errMsg));
                    });
                }
                catch (err) {
                    const errMsg = (0, error_message_func_1.default)(err);
                    reject(new Error(errMsg));
                }
            });
        };
        this.getLastCutOffFromDb = () => {
            return new Promise((resolve, reject) => {
                const path = `/api/cutoff/last`;
                this._httpClientClass
                    .sendVerbHttp(path, http_client_class_1.HttpVerbsEnum.GET, [], "")
                    .then((res) => {
                    const resp = JSON.parse(res.res);
                    if (res.status === 200) {
                        resolve(resp.enabled ?? null);
                    }
                    else {
                        const strError = `Data from Last Cutoff "${this._config.tableId}" could not be received. Status code: ${res.status}`;
                        this.log(general_logger_constants_1.LevelsLoggerEnum.error, strError);
                        this._tableStatistics.newData(false, 0);
                        reject(new Error("Error Last Cutoff"));
                    }
                })
                    .catch((err) => {
                    this.logError(err);
                    this._tableStatistics.newData(false, 0);
                    const errMsg = (0, error_message_func_1.default)(err);
                    reject(new Error(errMsg));
                });
            });
        };
        this.getTableIdFromDb = () => {
            return new Promise((resolve, reject) => {
                try {
                    const t = Date.now();
                    const path = `/api/${this._config.version}/table/key/${this._config.tableId}`;
                    this._httpClientClass
                        .sendVerbHttp(path, http_client_class_1.HttpVerbsEnum.GET, [], "")
                        .then((res) => {
                        const resp = JSON.parse(res.res);
                        const deltaT = Date.now() - t;
                        if (res.status === 200 && resp.id !== undefined) {
                            this._tableId = resp.id;
                            this._configTableId = resp.configTableId;
                            this._table = resp;
                            this._lastResponse = Date.now();
                            this.getConfigurationTableFromDb()
                                .then(() => { })
                                .catch(() => { });
                            this._tableStatistics.newData(true, deltaT);
                            this.gameEmitter.emit(api_connection_emiter_enum_1.ApiConnectionEmiterEnum.tableId);
                            this.log(general_logger_constants_1.LevelsLoggerEnum.debug, `Data from table "${this._config.tableId}" has been received.`);
                            resolve(resp.id);
                        }
                        else {
                            const strError = `Data from table "${this._config.tableId}" could not be received. Status code: ${res.status}`;
                            this.log(general_logger_constants_1.LevelsLoggerEnum.error, strError);
                            this._tableStatistics.newData(false, 0);
                            reject(new Error("Error getting Table iD number"));
                        }
                    })
                        .catch((err) => {
                        this.logError(err);
                        this._tableStatistics.newData(false, 0);
                        const errMsg = (0, error_message_func_1.default)(err);
                        reject(new Error(errMsg));
                    });
                }
                catch (err) {
                    if (err instanceof Error)
                        this.logError(err);
                    else
                        this.log(general_logger_constants_1.LevelsLoggerEnum.error, "Server internal Error in getTableIdFromDb");
                    const errMsg = (0, error_message_func_1.default)(err);
                    reject(new Error(errMsg));
                }
            });
        };
        this.getLastGameNumberFromDb = () => {
            return new Promise((resolve, reject) => {
                try {
                    if (this._tableId !== undefined) {
                        const t = Date.now();
                        const queries = [
                            { key: "q", value: "1" },
                            { key: "table", value: `${this._tableId}` },
                            { key: "enabled", value: "true" },
                        ];
                        const path = `/api/${this._config.version}/game`;
                        this._httpClientClass
                            .sendVerbHttp(path, http_client_class_1.HttpVerbsEnum.GET, queries, "")
                            .then((res) => {
                            const resp = JSON.parse(res.res);
                            const deltaT = Date.now() - t;
                            if (res.status === 200 && resp[0].gameNumber !== undefined) {
                                let changedGameNumber = false;
                                if (this._lastGameNumber !== resp[0].gameNumber) {
                                    this._lastGameNumber = resp[0].gameNumber;
                                    changedGameNumber = true;
                                }
                                this._lastResponse = Date.now();
                                if (this._lastWinningNumber === undefined || changedGameNumber)
                                    this.getHistoricalWinningNumberFromDb()
                                        .then(() => { })
                                        .catch(() => { });
                                this._gameNumberStatistics.newData(true, deltaT);
                                this.gameEmitter.emit(api_connection_emiter_enum_1.ApiConnectionEmiterEnum.gameNumber);
                                resolve(this._lastGameNumber);
                            }
                            else {
                                this._gameNumberStatistics.newData(false, 0);
                                const err = new Error("Error getting last game number");
                                reject(err);
                            }
                        })
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            .catch((err) => {
                            this._gameNumberStatistics.newData(false, 0);
                            const errMsg = (0, error_message_func_1.default)(err);
                            reject(new Error(errMsg));
                        });
                    }
                }
                catch (err) {
                    const errMsg = (0, error_message_func_1.default)(err);
                    reject(new Error(errMsg));
                }
            });
        };
        this.getConfigurationTableFromDb = () => {
            return new Promise((resolve, reject) => {
                try {
                    if (this._tableId !== undefined) {
                        const t = Date.now();
                        const queries = [
                            { key: "q", value: "1" },
                            { key: "table", value: `${this._configTableId}` },
                            { key: "enabled", value: "true" },
                        ];
                        const path = `/api/${this._config.version}/configuration`;
                        this._httpClientClass
                            .sendVerbHttp(path, http_client_class_1.HttpVerbsEnum.GET, queries, "")
                            .then((res) => {
                            const resp = JSON.parse(res.res);
                            const deltaT = Date.now() - t;
                            if (res.status === 200 && resp.length === 1 && resp[0].id !== undefined) {
                                this._stsConfiguration = resp[0];
                                this._lastResponse = Date.now();
                                this.getLastGameNumberFromDb()
                                    .then(() => { })
                                    .catch(() => { });
                                this._tableStatistics.newData(true, deltaT);
                                this.gameEmitter.emit(api_connection_emiter_enum_1.ApiConnectionEmiterEnum.configuration);
                                this.log(general_logger_constants_1.LevelsLoggerEnum.debug, `Data from configuration table "${this._config.tableId}" has been received.`);
                                resolve(resp[0]);
                            }
                            else {
                                const strError = `Data from configuration table "${this._config.tableId}" could not be received. Status code: ${res.status}`;
                                this.log(general_logger_constants_1.LevelsLoggerEnum.error, strError);
                                this._gameNumberStatistics.newData(false, 0);
                                const err = new Error(strError);
                                reject(err);
                            }
                        })
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            .catch((err) => {
                            this.logError(err);
                            this._gameNumberStatistics.newData(false, 0);
                            const errMsg = (0, error_message_func_1.default)(err);
                            reject(new Error(errMsg));
                        });
                    }
                    else {
                        const errMsg = `The "${this._config.tableId}" tableId is undefined`;
                        const e = new Error(errMsg);
                        this.logError(e);
                        reject(e);
                    }
                }
                catch (err) {
                    const errMsg = (0, error_message_func_1.default)(err);
                    const e = new Error(errMsg);
                    this.logError(e);
                    reject(e);
                }
            });
        };
        this.getTableId = () => this._tableId;
        this.getGameNumber = () => {
            return this._lastGameNumber;
        };
        this.isOnLine = () => {
            let resp = false;
            try {
                if (this._lastResponse !== undefined) {
                    if (Date.now() - this._lastResponse < this.getTimeOutValue()) {
                        resp = true;
                    }
                }
            }
            catch (error) {
                resp = false;
            }
            return resp;
        };
        this.saveGame = (p_data) => {
            return new Promise((resolve, reject) => {
                try {
                    const t = Date.now();
                    const path = `/api/${this._config.version}/game`;
                    const queries = [];
                    this._httpClientClass
                        .sendVerbHttp(path, http_client_class_1.HttpVerbsEnum.POST, queries, JSON.stringify(p_data))
                        .then((res) => {
                        const resp = JSON.parse(res.res);
                        if (res.status === 201 && resp.gameNumber !== undefined) {
                            this.getHistoricalWinningNumberFromDb()
                                .then(() => { })
                                .catch(() => { });
                            const deltaT = Date.now() - t;
                            this._lastSavedGameRecord = resp;
                            this._lastGameNumber = resp.gameNumber;
                            this._lastResponse = Date.now();
                            this._saveWinningNumberStatistics.newData(true, deltaT);
                            this.gameEmitter.emit(api_connection_emiter_enum_1.ApiConnectionEmiterEnum.saveGame);
                            const strMsg = `Game saved with game number "${p_data.gameNumber}" and win number "${p_data.winNumber}".`;
                            this.log(general_logger_constants_1.LevelsLoggerEnum.debug, strMsg);
                            resolve(this._lastGameNumber);
                        }
                        else {
                            this._saveWinningNumberStatistics.newData(false, 0);
                            const strMsg = `Error saving game with game number "${p_data.gameNumber}" and win number "${p_data.winNumber}".`;
                            this.log(general_logger_constants_1.LevelsLoggerEnum.error, strMsg);
                            const err = new Error(strMsg);
                            reject(err);
                        }
                    })
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        .catch((err) => {
                        this._saveWinningNumberStatistics.newData(false, 0);
                        const errMsg = (0, error_message_func_1.default)(err);
                        reject(new Error(errMsg));
                    });
                }
                catch (err) {
                    const errMsg = (0, error_message_func_1.default)(err);
                    reject(new Error(errMsg));
                }
            });
        };
        this.getHistoricalWinningNumberFromDb = () => {
            return new Promise((resolve, reject) => {
                try {
                    const t = Date.now();
                    // const url: string = `${this.getUrl()}/api/${this._config.version}/game?q=200&table=${this._tableId}&enabled=true`;
                    // const url: string = `${this.getUrl()}`;
                    const path = `/api/${this._config.version}/game`;
                    const queries = [
                        { key: "q", value: "200" },
                        { key: "table", value: `${this._tableId}` },
                        { key: "enabled", value: "true" },
                    ];
                    this._httpClientClass
                        .sendVerbHttp(path, http_client_class_1.HttpVerbsEnum.GET, queries, "")
                        .then((res) => {
                        const resp = JSON.parse(res.res);
                        const deltaT = Date.now() - t;
                        if (res.status === 200 && resp[0].winNumber !== undefined) {
                            this._lastWinningNumberData = resp;
                            this._lastWinningNumber = [];
                            resp.forEach((item) => {
                                if (this._lastWinningNumber === undefined)
                                    this._lastWinningNumber = [];
                                this._lastWinningNumber.push(item.winNumber);
                            });
                            this._lastResponse = Date.now();
                            this._saveWinningNumberStatistics.newData(true, deltaT);
                            this.gameEmitter.emit(api_connection_emiter_enum_1.ApiConnectionEmiterEnum.winningNumber);
                            resolve(this._lastWinningNumber);
                        }
                        else {
                            this._saveWinningNumberStatistics.newData(false, 0);
                            const err = new Error("Error getting historical winning number");
                            reject(err);
                        }
                    })
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        .catch((err) => {
                        this._saveWinningNumberStatistics.newData(false, 0);
                        const errMsg = (0, error_message_func_1.default)(err);
                        reject(new Error(errMsg));
                    });
                }
                catch (err) {
                    const errMsg = (0, error_message_func_1.default)(err);
                    reject(new Error(errMsg));
                }
            });
        };
        this.getCasinoFromDb = () => {
            return new Promise((resolve, reject) => {
                try {
                    const t = Date.now();
                    const queries = [{ key: "q", value: "1" }];
                    const path = `/api/${this._config.version}/casino`;
                    this._httpClientClass
                        .sendVerbHttp(path, http_client_class_1.HttpVerbsEnum.GET, queries, "")
                        .then((res) => {
                        const resp = JSON.parse(res.res);
                        const deltaT = Date.now() - t;
                        if (res.status === 200 && resp[0].id !== undefined) {
                            this._lastResponse = Date.now();
                            this._tableStatistics.newData(true, deltaT);
                            this.gameEmitter.emit(api_connection_emiter_enum_1.ApiConnectionEmiterEnum.casino);
                            resolve(resp[0]);
                        }
                        else {
                            this._tableStatistics.newData(false, 0);
                            reject(new Error("Error getting Casino from DB"));
                        }
                    })
                        .catch((err) => {
                        this._tableStatistics.newData(false, 0);
                        const errMsg = (0, error_message_func_1.default)(err);
                        reject(new Error(errMsg));
                    });
                }
                catch (err) {
                    const errMsg = (0, error_message_func_1.default)(err);
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
        this.sendVerbHttp = (p_hostname, p_port, p_path, p_queries, p_method, p_body) => {
            return new Promise((resolve, reject) => {
                try {
                    let queries = "";
                    if (p_queries !== undefined) {
                        let queryConnector = "?";
                        p_queries.forEach((query) => {
                            const aux = `${query.key}=${query.value}`;
                            queries += queryConnector + aux;
                            queryConnector = "&";
                        });
                    }
                    const optionsPost = {
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
                    const req = http.request(optionsPost, (res) => {
                        let dataRx = "";
                        res.setEncoding("utf8");
                        res.on("data", (chunk) => {
                            dataRx += chunk;
                        });
                        res.on("end", () => {
                            const resp = {
                                res: dataRx,
                                status: res.statusCode,
                            };
                            resolve(resp);
                        });
                    });
                    req.on("error", (e) => {
                        reject(new Error(`VERB (${p_method})----> problem with request: ${e.message}`));
                    });
                    // Write data to request body
                    req.write(p_body);
                    req.end();
                }
                catch (err) {
                    const errMsg = (0, error_message_func_1.default)(err);
                    reject(new Error(errMsg));
                }
            });
        };
        this.log = (p_level, p_msg) => {
            if (this._logger !== null)
                this._logger.proc(p_level, p_msg);
        };
        this.logError = (p_error) => {
            if (this._logger !== null)
                this._logger.procError(p_error);
        };
        this.periodicCutOff = () => {
            try {
                this.getLastCutOffFromDb()
                    .then((respEnabled) => {
                    // Handle the response
                    if (respEnabled !== null) {
                        this._config.getCutOff(respEnabled);
                    }
                })
                    .catch((_err) => {
                    console.log(_err);
                });
                if (this._lastResponse !== undefined) {
                    const deltaT = Date.now() - this._lastResponse;
                    const timeOutValue = this.getTimeOutValue();
                    if (deltaT > timeOutValue) {
                        this._tableId = undefined;
                        this._configTableId = undefined;
                        this._lastGameNumber = undefined;
                        this._lastResponse = undefined;
                    }
                }
            }
            catch (error) {
                console.log("error", error);
            }
        };
        this._logger = _config.logger;
        this._bitApiState = new Array(BitApiStateEnum.Max).fill(0);
        setTimeout(this.periodicProc, 50);
        setInterval(this.periodicProc, 2000);
        setInterval(this.periodicApiState, 1000);
        setTimeout(() => {
            this.periodicCutOff();
            setInterval(this.periodicCutOff, 10000);
        }, 2000);
        this.gameEmitter.on(api_connection_emiter_enum_1.ApiConnectionEmiterEnum.tableId, () => {
            this._bitApiState[BitApiStateEnum.TableId] = Date.now();
            this._config.getGameEmision(api_connection_emiter_enum_1.ApiConnectionEmiterEnum.tableId, this.loadEmiterInterface());
        });
        this.gameEmitter.on(api_connection_emiter_enum_1.ApiConnectionEmiterEnum.gameNumber, () => {
            this._bitApiState[BitApiStateEnum.GameNumber] = Date.now();
            this._config.getGameEmision(api_connection_emiter_enum_1.ApiConnectionEmiterEnum.gameNumber, this.loadEmiterInterface());
        });
        this.gameEmitter.on(api_connection_emiter_enum_1.ApiConnectionEmiterEnum.saveGame, () => {
            this._config.getGameEmision(api_connection_emiter_enum_1.ApiConnectionEmiterEnum.saveGame, this.loadEmiterInterface());
        });
        this.gameEmitter.on(api_connection_emiter_enum_1.ApiConnectionEmiterEnum.winningNumber, () => {
            this._bitApiState[BitApiStateEnum.WinningNumber] = Date.now();
            this._config.getGameEmision(api_connection_emiter_enum_1.ApiConnectionEmiterEnum.winningNumber, this.loadEmiterInterface());
        });
        this.gameEmitter.on(api_connection_emiter_enum_1.ApiConnectionEmiterEnum.configuration, () => {
            this._bitApiState[BitApiStateEnum.Configuration] = Date.now();
            this._config.getGameEmision(api_connection_emiter_enum_1.ApiConnectionEmiterEnum.configuration, this.loadEmiterInterface());
        });
        this._httpClientClass = new http_client_class_1.HttpClientClass(this._config.url, this._config.port, this._config.timeout);
    }
}
exports.ApiConnectionClass = ApiConnectionClass;
