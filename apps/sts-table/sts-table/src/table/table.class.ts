import { MqttRxObservableInterface, MqttSubscribeObservableInterface, MqttTxObservableInterface } from "@slcn-pkg/mqtt-client-observable-class";
import {
    ClockWiseEnum,
    CutOffInterface,
    GralWheelStateEnum,
    GralWheelStateInterface,
    SkinEnum,
    StsCasinoInterface,
    StsConfigurationInterface,
    StsGameInterface,
    StsHardwareMqttRx,
    StsTableInterface,
    // StsHardwareMqttTx,
} from "sts-common";
import { ApiConnectionClass } from "./api/api.connection.class";
import { ApiConnectionConfigInterface } from "./api/interfaces/api.connection.config.interface";
import { ApiConnectionEmiterEnum } from "./api/enums/api.connection.emiter.enum";
import { ApiConnectionEmiterInterface } from "./api/interfaces/api.connection.emiter.interface";
import { ApiConnectionSaveGameInterface } from "./api/interfaces/api.connection.save.game.interface";
import { DashboardClass } from "./dashboard/dashboard.class";
import { DashBoardClassConfigInterface } from "./interfaces/dash.board.class.config.interface";
import { DashBoardClassDataInterface } from "./interfaces/dash.board.class.data.interface";
import { GeneralLoggerClass } from "@slcn-pkg/general-logger-class";
import { HardwareClass } from "./hardware/hardware.class";
import { LevelsLoggerEnum } from "@slcn-pkg/general-logger-constants";
import { RouletteStateClass, RouletteStateEnum } from "./states";
import { SignBoardClass } from "./signBoard/sign.board";
import { SignBoardStateInterface } from "../interfaces/sign.board.state.interface";
import { TableClassConfigInterface } from "./interfaces/table.class.config.interface";
import { WheelTcsClass } from "./wheelTcs/wheel.tcs";
import { CutOffClass } from "./cut-off/cut-off.class";

/**
 * Represents a roulette table class.
 * This class handles the functionality and state of a table.
 * It communicates with the hardware, API, and MQTT broker to perform various operations.
 * The class provides methods to configure the table, set light colors and intensity, and handle incoming MQTT messages.
 * It also has methods to set the table offline and online, and process periodic tasks.
 */
export default class TableClass {
    private _skins: SkinEnum[] = [];
    private readonly _rouletteState: RouletteStateClass;
    private readonly _api: ApiConnectionClass;
    private _tableNumberConfig: number = 0;
    private _signBoardState: Record<string, SignBoardStateInterface> = {};
    private _gameNumberEmitter: number | undefined = undefined;
    private _saveGameEmitter: number | undefined = undefined;
    private _winningNumbersEmitter: number[] | undefined = undefined;
    private _winningNumbersDataEmitter: StsGameInterface[] | undefined = undefined;
    private _configurationEmitter: StsConfigurationInterface | undefined = undefined;
    private _tableEmitter: StsTableInterface | undefined = undefined;
    private readonly _hardwareClass: HardwareClass;
    private readonly _wheelTcs: WheelTcsClass;
    private readonly _signBoard: SignBoardClass;
    private _casino: StsCasinoInterface | undefined = undefined;
    private readonly _dashboard: DashboardClass;
    private _checkModuleAreOnline_respOld: string = "";
    private readonly _logger: GeneralLoggerClass | null;
    private readonly _cutOffClass: CutOffClass = new CutOffClass();

    /**
     * Initializes a new instance of the TableClass class.
     * This constructor configures the table, sets up API connections, and subscribes to MQTT topics.
     * It also initializes the table's state, including the roulette state, hardware, and sign board state.
     *
     * @param {TableClassConfigInterface} _configInterface - The configuration interface for the table class.
     */
    constructor(private readonly _configInterface: TableClassConfigInterface) {
        this._logger = _configInterface.logger;

        const dashBoardConfig: DashBoardClassConfigInterface = {
            srvName: _configInterface.serverName,
            ip: _configInterface.ip,
            portHttp: _configInterface.portHttp,
            portHttps: _configInterface.portHttps,
            serviceId: _configInterface.serviceId,
        };

        this._rouletteState = new RouletteStateClass();
        this._hardwareClass = new HardwareClass(4);
        this._wheelTcs = new WheelTcsClass(this._logger);
        this._signBoard = new SignBoardClass();
        this._dashboard = new DashboardClass(dashBoardConfig);

        const apiConfig: ApiConnectionConfigInterface = {
            url: _configInterface.urlApi,
            port: Number(_configInterface.portApi),
            ssl: _configInterface.sslApi,
            version: "v1",
            logger: this._logger,
            // tableId: "00:15:5d:25:be:bd__8021__9021",        // development
            // tableId: "sts-table__00155d156404__8020__9020",  // Monte
            tableId: _configInterface.serviceId,
            getGameEmision: this.getGameEmision,
            getCutOff: this.getCutOffApi,
            timeout: 2500,
        };
        this._api = new ApiConnectionClass(apiConfig);

        _configInterface.tableId.forEach((p_signBoarId: string) => {
            this._signBoardState[p_signBoarId] = {
                id: p_signBoarId,
                status: "OFF_LINE",
                remoteTs: 0,
                localTs: 0,
                configured: false,
            };
        });

        setInterval(this.checkModuleAreOnline, 5000);
        setInterval(this.getCasino, 10000);
        setInterval(this.checkSignboardOffline, 1000);

        const subsTopicSignBoard: MqttSubscribeObservableInterface = {
            topic: `sts/SignBoard/c/#`,
            qos: 0,
        };
        _configInterface.mqttSubject.subscribe$.next(subsTopicSignBoard);

        let hardwareId: string = _configInterface.hardwareId !== "" ? _configInterface.hardwareId : _configInterface.serviceId;
        if (hardwareId === undefined) hardwareId = "unknown";
        const subsTopicHardware: MqttSubscribeObservableInterface = {
            topic: `sts/Hardware/${hardwareId}/rx`,
            qos: 0,
        };
        _configInterface.mqttSubject.subscribe$.next(subsTopicHardware);

        let wheelId: string = _configInterface.wheelId !== "" ? _configInterface.wheelId : _configInterface.serviceId;
        if (wheelId === undefined) wheelId = "unknown";
        const subsTopicWheel: MqttSubscribeObservableInterface = {
            topic: `sts/wheel/${wheelId}/state`,
            qos: 0,
        };
        _configInterface.mqttSubject.subscribe$.next(subsTopicWheel);

        // The code block processes the received MQTT messages.
        _configInterface.mqttSubject.rx$.subscribe({
            next: (v: MqttRxObservableInterface) => {
                try {
                    const parts: string[] = v.topic;
                    if (parts[0] === "sts") {
                        if (parts[1] === "Hardware" && parts[2] === _configInterface.hardwareId && parts[3] === "rx") {
                            // process the hardware (MQTT)
                            this.processMqttHardwareRx(v, parts);
                        } else if (parts[1] === "wheel" && parts[2] === _configInterface.wheelId && parts[3] === "state") {
                            const state: GralWheelStateInterface = <GralWheelStateInterface>JSON.parse(v.payload);
                            this.procRxWheel(state, parts);
                        } else if (parts[1] === "SignBoard" && parts[2] === "c") {
                            this.procRxSignBoard(parts, v.payload);
                        }
                    }
                } catch (error) {
                    // empty
                }
            },
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            error: (error: unknown) => {
                /* empty */
            },
        });

        setInterval(this.procPeriodicSignBoard, 500);

        this.setTableNumberConfig();
        this._hardwareClass.setLightColorConfig(this._configInterface.colorOfLights);
        this._hardwareClass.setLightsIntensity(this._configInterface.lightsIntensity);
        this._hardwareClass.setSemaphoreIntensity(this._configInterface.semaphoreIntensity);
        this._hardwareClass.setSevenSegmentDisplay(this._tableNumberConfig);

        this.log(LevelsLoggerEnum.info, `CONFIG tableId -------> ${this._configInterface.tableId}`);
        this.log(LevelsLoggerEnum.info, `CONFIG tableType: ----> ${this._configInterface.tableType}`);
    }

    private readonly processMqttHardwareRx = (p_v: MqttRxObservableInterface, p_parts: string[]) => {
        try {
            // public the table number
            const tableNumber: number = this._tableEmitter?.tableNumber ? this._tableEmitter.tableNumber : 0;
            this._hardwareClass.setSevenSegmentDisplay(tableNumber);

            // process the hardware
            const hardwareAux: StsHardwareMqttRx | null = JSON.parse(p_v.payload);
            const { resultKey, mqttTx } = this._hardwareClass.processHardware(
                hardwareAux,
                this._wheelTcs.getWheelState(),
                this._gameNumberEmitter,
                this._wheelTcs.getWheelWinningNumber(),
            );

            // process the keys
            for (const key of resultKey) {
                this.processKeys(key.key, key.action, key.time);
            }

            // public the tx on mqtt
            if (mqttTx !== null) {
                this._configInterface.mqttSubject.tx$.next({
                    topic: `${p_parts[0]}/${p_parts[1]}/${p_parts[2]}/tx`,
                    payload: JSON.stringify(mqttTx),
                    qos: 0,
                    retain: false,
                });
            }
        } catch (error) {
            // empty
        }
    };

    private readonly setTableNumberConfig = () => {
        const tableNumber: number | undefined = this._configInterface.tableNumber;

        if (tableNumber === undefined) {
            this._tableNumberConfig = 0;
        } else if (typeof tableNumber === "number") {
            if (tableNumber < 0) this._tableNumberConfig = 0;
            else if (tableNumber > 99) this._tableNumberConfig = 0;
            else this._tableNumberConfig = tableNumber;
        } else this._tableNumberConfig = 0;
    };

    /**
     * Retrieves the game emission based on the provided emission type and result.
     * @param p_typeEmission - The type of emission.
     * @param p_result - The result of the emission.
     */
    private readonly getGameEmision = (p_typeEmission: ApiConnectionEmiterEnum, p_result: ApiConnectionEmiterInterface) => {
        if (p_typeEmission === ApiConnectionEmiterEnum.winningNumber) {
            this._winningNumbersEmitter = p_result.winningNumbers;
            this._winningNumbersDataEmitter = p_result.winningNumbersData;
        } else if (p_typeEmission === ApiConnectionEmiterEnum.configuration) {
            this.findConfigurationChanges(this._configurationEmitter, p_result.configuration);
            this._configurationEmitter = p_result.configuration;
            this.loadSkins(this._configurationEmitter);
        } else if (p_typeEmission === ApiConnectionEmiterEnum.gameNumber) {
            this._gameNumberEmitter = p_result.gameNumber;
        } else if (p_typeEmission === ApiConnectionEmiterEnum.saveGame) {
            this._saveGameEmitter = p_result.saveGame;
            this.insertNewGameEmitter(p_result.lastSavedGameRecord);
        } else if (p_typeEmission === ApiConnectionEmiterEnum.tableId) {
            this._tableEmitter = p_result.table;
        }

        this.setDashBoardData();
    };

    private readonly getCutOffApi = (p_cutOffInterface: CutOffInterface) => {
        try {
            this._cutOffClass.setCutOff(p_cutOffInterface);
            const bCutOffEnabled: boolean = this._cutOffClass.enabled;
            const strMsg: string = `LAST-CUT-OFF --> ${bCutOffEnabled} --> ${this._cutOffClass.cutOffTime} ###################################################################`;
            console.log(strMsg);
        } catch {
            // empty
        }
    };

    private readonly insertNewGameEmitter = (p_newGame: StsGameInterface | undefined): void => {
        try {
            if (this._winningNumbersDataEmitter === undefined) return;
            if (p_newGame === undefined) return;

            if (this._winningNumbersDataEmitter[0].id !== p_newGame.id) {
                this._winningNumbersDataEmitter.unshift(p_newGame);
                this._winningNumbersDataEmitter = this._winningNumbersDataEmitter.slice(0, 200);
            }
        } catch (error) {
            // empty
        }
    };

    /**
     * Processes the new winning number.
     *
     * @param p_dataRx - The data received from the server.
     */
    private readonly procNewWinningNumber = (p_dataRx: GralWheelStateInterface): void => {
        const rpm: number = p_dataRx.speed ?? 30;
        const gameNumber: number = this._gameNumberEmitter !== undefined ? this._gameNumberEmitter + 1 : 1;

        if (p_dataRx.winningNumber === undefined) {
            //empty
        } else {
            const tableIdEmitter: number = this._tableEmitter?.id ?? 0;

            const data: ApiConnectionSaveGameInterface = {
                gameNumber: gameNumber,
                winNumber: p_dataRx.winningNumber,
                rpm: rpm,
                clockwise: p_dataRx.clockWise === ClockWiseEnum.ClockWise,
                openTable: true,
                croupierId: undefined,
                tableId: tableIdEmitter,
            };
            this._api
                .saveGame(data)
                .then(() => {
                    this.log(LevelsLoggerEnum.info, "Game has been saved");
                })
                .catch((error) => {
                    this.logError(error);
                });
            if (this._winningNumbersEmitter !== undefined) {
                this._winningNumbersEmitter.unshift(p_dataRx.winningNumber);
                this._winningNumbersEmitter = this._winningNumbersEmitter.slice(0, 200);
            }

            this.setDashBoardData();
        }
    };

    /**
     * Processes the received data from the sts-wheel service.
     *
     * @param p_dataRx - The received data from the sts-wheel service.
     */
    private readonly procRxWheel = (p_dataRx: GralWheelStateInterface, p_parts: string[]) => {
        try {
            const { state, change } = this._wheelTcs.procRxWheel(p_dataRx);
            if (change) {
                switch (state) {
                    case GralWheelStateEnum.OFF_LINE:
                        break;
                    case GralWheelStateEnum.PLACE_YOUR_BETS:
                        break;
                    case GralWheelStateEnum.NO_MORE_BETS:
                        break;
                    case GralWheelStateEnum.WINNING_NUMBER:
                        this.procNewWinningNumber(p_dataRx);
                        break;
                    default:
                        break;
                }
            }

            // mqtt response
            const mqttTx = {
                ts: new Date().toISOString(),
            };
            this._configInterface.mqttSubject.tx$.next({
                topic: `${p_parts[0]}/${p_parts[1]}/${p_parts[2]}/table`,
                payload: JSON.stringify(mqttTx),
                qos: 0,
                retain: false,
            });
        } catch (error) {
            //empty
        }
    };

    /**
     * Processes the periodic sign board configuration.
     *
     * @param p_signBoarId - The ID of the sign board.
     */
    private readonly procPeriodicSignBoardConfig = (p_signBoarId: string) => {
        const result: MqttTxObservableInterface | undefined = this._signBoard.signBoardConfig(p_signBoarId, this._configurationEmitter, this._tableEmitter, this.getCurrentSkin());

        // Publish the response to the specified topic
        if (result) {
            this._configInterface.mqttSubject.tx$.next(result);
        }
    };

    private readonly procPeriodicSignBoardStatus = (p_signBoarId: string) => {
        // Retrieve the table state
        const tableIdEmitter: number = this._tableEmitter?.id ?? 0;
        const table_state: RouletteStateEnum = this._rouletteState.setTableState(this._wheelTcs.getWheelState());
        const result: MqttTxObservableInterface | undefined = this._signBoard.signBoardStatus(
            p_signBoarId,
            tableIdEmitter,
            this._configurationEmitter,
            this._winningNumbersEmitter,
            table_state,
            this.checkModuleAreOnline("H+W+A"),
            this._gameNumberEmitter,
        );

        // Publish the response to the specified topic
        if (result) {
            this._configInterface.mqttSubject.tx$.next(result);
        }
    };

    /**
     * Processes the periodic sign board.
     *
     * This method iterates over the table IDs specified in the configuration interface and performs
     * periodic sign board configuration and status updates for each configured sign board.
     *
     * @remarks
     * This method is called internally and should not be called directly.
     */
    private readonly procPeriodicSignBoard = () => {
        this._configInterface.tableId.forEach((p_signBoarId: string) => {
            const state: SignBoardStateInterface = this._signBoardState[p_signBoarId];
            if (state.configured === true) {
                this.procPeriodicSignBoardConfig(state.id);
                this.procPeriodicSignBoardStatus(state.id);
            }
        });
    };

    private readonly processKeys = (p_keyNumber: number, p_action: boolean, p_time: number): void => {
        try {
            this.log(LevelsLoggerEnum.debug, `Key ${p_keyNumber} ${p_action} at ${p_time}`);

            if (p_keyNumber === 0 && p_action === true && p_time > 2000) {
                const openTable = this._rouletteState.toggleOpenTable();
                this.log(LevelsLoggerEnum.warning, `Open Table: ${openTable}`);
            }
        } catch (error) {
            //empty
        }
    };

    private readonly getCasino = (): void => {
        this._api
            .getCasinoFromDb()
            .then((p_casino: StsCasinoInterface) => {
                this._casino = p_casino;
                this._dashboard.connect(this._casino);
            })
            .catch((err) => {
                this.logError(err);
            });
    };

    private readonly setDashBoardData = (): void => {
        const tableIdEmitter: number = this._tableEmitter?.id ?? 0;

        const data: DashBoardClassDataInterface = {
            winningNumbersData: this._winningNumbersDataEmitter,
            winningNumbers: this._winningNumbersEmitter,
            configuration: this._configurationEmitter,
            gameNumber: this._gameNumberEmitter,
            saveGame: this._saveGameEmitter,
            tableId: tableIdEmitter,
            table: this._tableEmitter,
            statistics: undefined,
            ts: Date.now(),
            casino: this._casino,
            lastSavedGameRecord: undefined,
        };

        this._dashboard.setData(data);
    };

    private readonly checkModuleAreOnline = (p_selector: void | string): string => {
        let resp: string = "";

        const hardwareOnLine: string = this._hardwareClass.getOnline() ? "H" : "h";
        const apiOnLine: string = this._api.checkApiState().state ? "A" : "a";
        const wheelOnLine: string = this._wheelTcs.isOnLine() ? "W" : "w";
        const dashboardOnLine: string = this._dashboard.isOnLine() ? "D" : "d";

        switch (p_selector) {
            case "hardware":
                resp = hardwareOnLine;
                break;
            case "api":
                resp = apiOnLine;
                break;
            case "wheel":
                resp = wheelOnLine;
                break;
            case "dashboard":
                resp = dashboardOnLine;
                break;
            case "H+W+A":
                resp = hardwareOnLine + wheelOnLine + apiOnLine;
                break;
            case undefined:
            case "all":
            default:
                resp = hardwareOnLine + wheelOnLine + apiOnLine + dashboardOnLine;
                break;
        }
        if (this._checkModuleAreOnline_respOld !== resp && (p_selector === "all" || p_selector === undefined)) {
            this._checkModuleAreOnline_respOld = resp;
            const strMsg: string = `checkModuleAreOnline --> ${resp} --> ${new Date().toISOString()}`;
            this.log(LevelsLoggerEnum.info, strMsg);
        }

        return resp;
    };

    private readonly checkSignboardOffline = (): void => {
        const TIME_OUT_SIGNBOARD: number = 10000;
        const now: number = Date.now();
        this._configInterface.tableId.forEach((p_signBoarId: string) => {
            const id: string = p_signBoarId;
            const configured: boolean = this._signBoardState[id].configured;
            const remoteTs: number = this._signBoardState[id].remoteTs;

            if (now - remoteTs > TIME_OUT_SIGNBOARD && configured === true) {
                this._signBoardState[id].status = "OFF_LINE";
                this._signBoardState[id].configured = false;
                this._signBoardState[id].remoteTs = 0;
            }
        });
    };

    private readonly procRxSignBoard = (p_parts: string[], p_payload: string): void => {
        try {
            const signBoarId = p_parts[3];
            const stateSignBoarId = JSON.parse(p_payload);
            const signBoardFound = this._configInterface.tableId.filter((id) => id == signBoarId);

            this._signBoardState[signBoarId] = {
                id: signBoarId,
                status: stateSignBoarId.status,
                remoteTs: stateSignBoarId.ts,
                localTs: Date.now(),
                configured: signBoardFound.length === 1,
            };
        } catch (error) {
            //empty
        }
    };

    private readonly loadSkins = (p_configurationEmitter: StsConfigurationInterface | undefined): void => {
        try {
            //empty
            if (p_configurationEmitter !== undefined) {
                const auxSkins: SkinEnum[] = [];
                if (Object.values(SkinEnum).includes(p_configurationEmitter.skin as SkinEnum)) auxSkins.push(p_configurationEmitter.skin as SkinEnum);
                if (Object.values(SkinEnum).includes(p_configurationEmitter.skin2 as SkinEnum)) auxSkins.push(p_configurationEmitter.skin2 as SkinEnum);
                if (Object.values(SkinEnum).includes(p_configurationEmitter.skin3 as SkinEnum)) auxSkins.push(p_configurationEmitter.skin3 as SkinEnum);
                if (Object.values(SkinEnum).includes(p_configurationEmitter.skin4 as SkinEnum)) auxSkins.push(p_configurationEmitter.skin4 as SkinEnum);
                if (Object.values(SkinEnum).includes(p_configurationEmitter.skin5 as SkinEnum)) auxSkins.push(p_configurationEmitter.skin5 as SkinEnum);
                if (Object.values(SkinEnum).includes(p_configurationEmitter.skin6 as SkinEnum)) auxSkins.push(p_configurationEmitter.skin6 as SkinEnum);
                if (Object.values(SkinEnum).includes(p_configurationEmitter.skin7 as SkinEnum)) auxSkins.push(p_configurationEmitter.skin7 as SkinEnum);
                if (Object.values(SkinEnum).includes(p_configurationEmitter.skin8 as SkinEnum)) auxSkins.push(p_configurationEmitter.skin8 as SkinEnum);
                this._skins = auxSkins;
            } else {
                this._skins = [];
            }
        } catch (error) {
            this._skins = [];
        }
    };

    private readonly getCurrentSkin = (): SkinEnum => {
        let resp: SkinEnum;

        try {
            //check the lenght
            if (this._skins.length > 0 && this._skins.length <= 8 && this._configurationEmitter !== undefined) {
                const now: number = Date.now();
                const rest: number = Math.floor(now / (60 * 1000 * this._configurationEmitter.skinRotationTime));
                const position: number = rest % this._skins.length;
                resp = this._skins[position];
            } else {
                resp = SkinEnum.BOX;
            }
        } catch (error) {
            resp = SkinEnum.BOX;
        }

        return resp;
    };

    private readonly findConfigurationChanges = (p_current: StsConfigurationInterface | undefined, p_new: StsConfigurationInterface | undefined): void => {
        // check if the configuration changed
        if (p_current !== undefined && p_new !== undefined) {
            if (p_current.colorOfLights !== p_new.colorOfLights) {
                this._hardwareClass.setLightColorConfig(p_new.colorOfLights);
                const strMsg: string = `colorOfLights --> ${p_new.colorOfLights} --> ${new Date().toISOString()}`;
                this.log(LevelsLoggerEnum.debug, strMsg);
            }
            if (p_current.lightsIntensity !== p_new.lightsIntensity) {
                this._hardwareClass.setLightsIntensity(p_new.lightsIntensity);
            }
        } else if (p_new !== undefined) {
            this._hardwareClass.setLightColorConfig(p_new.colorOfLights);
            this._hardwareClass.setLightsIntensity(p_new.lightsIntensity);
        }
    };

    private readonly log = (p_level: LevelsLoggerEnum, p_msg: string): void => {
        if (this._logger !== null) this._logger.proc(p_level, p_msg);
    };

    private readonly logError = (p_error: Error): void => {
        if (this._logger !== null) this._logger.procError(p_error);
    };
}
