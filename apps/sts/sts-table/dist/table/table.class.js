"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sts_common_1 = require("sts-common");
const api_connection_class_1 = require("./api/api.connection.class");
const api_connection_emiter_enum_1 = require("./api/enums/api.connection.emiter.enum");
const dashboard_class_1 = require("./dashboard/dashboard.class");
const hardware_class_1 = require("./hardware/hardware.class");
const general_logger_constants_1 = require("@slcn-pkg/general-logger-constants");
const states_1 = require("./states");
const sign_board_1 = require("./signBoard/sign.board");
const wheel_tcs_1 = require("./wheelTcs/wheel.tcs");
const cut_off_class_1 = require("./cut-off/cut-off.class");
/**
 * Represents a roulette table class.
 * This class handles the functionality and state of a table.
 * It communicates with the hardware, API, and MQTT broker to perform various operations.
 * The class provides methods to configure the table, set light colors and intensity, and handle incoming MQTT messages.
 * It also has methods to set the table offline and online, and process periodic tasks.
 */
class TableClass {
    /**
     * Initializes a new instance of the TableClass class.
     * This constructor configures the table, sets up API connections, and subscribes to MQTT topics.
     * It also initializes the table's state, including the roulette state, hardware, and sign board state.
     *
     * @param {TableClassConfigInterface} _configInterface - The configuration interface for the table class.
     */
    constructor(_configInterface) {
        this._configInterface = _configInterface;
        this._skins = [];
        this._tableNumberConfig = 0;
        this._signBoardState = {};
        this._gameNumberEmitter = undefined;
        this._saveGameEmitter = undefined;
        this._winningNumbersEmitter = undefined;
        this._winningNumbersDataEmitter = undefined;
        this._configurationEmitter = undefined;
        this._tableEmitter = undefined;
        this._casino = undefined;
        this._checkModuleAreOnline_respOld = "";
        this._cutOffClass = new cut_off_class_1.CutOffClass();
        this.processMqttHardwareRx = (p_v, p_parts) => {
            try {
                // public the table number
                const tableNumber = this._tableEmitter?.tableNumber ? this._tableEmitter.tableNumber : 0;
                this._hardwareClass.setSevenSegmentDisplay(tableNumber);
                // process the hardware
                const hardwareAux = JSON.parse(p_v.payload);
                const { resultKey, mqttTx } = this._hardwareClass.processHardware(hardwareAux, this._wheelTcs.getWheelState(), this._gameNumberEmitter, this._wheelTcs.getWheelWinningNumber());
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
            }
            catch (error) {
                // empty
            }
        };
        this.setTableNumberConfig = () => {
            const tableNumber = this._configInterface.tableNumber;
            if (tableNumber === undefined) {
                this._tableNumberConfig = 0;
            }
            else if (typeof tableNumber === "number") {
                if (tableNumber < 0)
                    this._tableNumberConfig = 0;
                else if (tableNumber > 99)
                    this._tableNumberConfig = 0;
                else
                    this._tableNumberConfig = tableNumber;
            }
            else
                this._tableNumberConfig = 0;
        };
        /**
         * Retrieves the game emission based on the provided emission type and result.
         * @param p_typeEmission - The type of emission.
         * @param p_result - The result of the emission.
         */
        this.getGameEmision = (p_typeEmission, p_result) => {
            if (p_typeEmission === api_connection_emiter_enum_1.ApiConnectionEmiterEnum.winningNumber) {
                this._winningNumbersEmitter = p_result.winningNumbers;
                this._winningNumbersDataEmitter = p_result.winningNumbersData;
            }
            else if (p_typeEmission === api_connection_emiter_enum_1.ApiConnectionEmiterEnum.configuration) {
                this.findConfigurationChanges(this._configurationEmitter, p_result.configuration);
                this._configurationEmitter = p_result.configuration;
                this.loadSkins(this._configurationEmitter);
            }
            else if (p_typeEmission === api_connection_emiter_enum_1.ApiConnectionEmiterEnum.gameNumber) {
                this._gameNumberEmitter = p_result.gameNumber;
            }
            else if (p_typeEmission === api_connection_emiter_enum_1.ApiConnectionEmiterEnum.saveGame) {
                this._saveGameEmitter = p_result.saveGame;
                this.insertNewGameEmitter(p_result.lastSavedGameRecord);
            }
            else if (p_typeEmission === api_connection_emiter_enum_1.ApiConnectionEmiterEnum.tableId) {
                this._tableEmitter = p_result.table;
            }
            this.setDashBoardData();
        };
        this.getCutOffApi = (p_cutOffInterface) => {
            try {
                this._cutOffClass.setCutOff(p_cutOffInterface);
                const bCutOffEnabled = this._cutOffClass.enabled;
                const strMsg = `LAST-CUT-OFF --> ${bCutOffEnabled} --> ${this._cutOffClass.cutOffTime} ###################################################################`;
                console.log(strMsg);
            }
            catch {
                // empty
            }
        };
        this.insertNewGameEmitter = (p_newGame) => {
            try {
                if (this._winningNumbersDataEmitter === undefined)
                    return;
                if (p_newGame === undefined)
                    return;
                if (this._winningNumbersDataEmitter[0].id !== p_newGame.id) {
                    this._winningNumbersDataEmitter.unshift(p_newGame);
                    this._winningNumbersDataEmitter = this._winningNumbersDataEmitter.slice(0, 200);
                }
            }
            catch (error) {
                // empty
            }
        };
        /**
         * Processes the new winning number.
         *
         * @param p_dataRx - The data received from the server.
         */
        this.procNewWinningNumber = (p_dataRx) => {
            const rpm = p_dataRx.speed ?? 30;
            const gameNumber = this._gameNumberEmitter !== undefined ? this._gameNumberEmitter + 1 : 1;
            if (p_dataRx.winningNumber === undefined) {
                //empty
            }
            else {
                const tableIdEmitter = this._tableEmitter?.id ?? 0;
                const data = {
                    gameNumber: gameNumber,
                    winNumber: p_dataRx.winningNumber,
                    rpm: rpm,
                    clockwise: p_dataRx.clockWise === sts_common_1.ClockWiseEnum.ClockWise,
                    openTable: true,
                    croupierId: undefined,
                    tableId: tableIdEmitter,
                };
                this._api
                    .saveGame(data)
                    .then(() => {
                    this.log(general_logger_constants_1.LevelsLoggerEnum.info, "Game has been saved");
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
        this.procRxWheel = (p_dataRx, p_parts) => {
            try {
                const { state, change } = this._wheelTcs.procRxWheel(p_dataRx);
                if (change) {
                    switch (state) {
                        case sts_common_1.GralWheelStateEnum.OFF_LINE:
                            break;
                        case sts_common_1.GralWheelStateEnum.PLACE_YOUR_BETS:
                            break;
                        case sts_common_1.GralWheelStateEnum.NO_MORE_BETS:
                            break;
                        case sts_common_1.GralWheelStateEnum.WINNING_NUMBER:
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
            }
            catch (error) {
                //empty
            }
        };
        /**
         * Processes the periodic sign board configuration.
         *
         * @param p_signBoarId - The ID of the sign board.
         */
        this.procPeriodicSignBoardConfig = (p_signBoarId) => {
            const result = this._signBoard.signBoardConfig(p_signBoarId, this._configurationEmitter, this._tableEmitter, this.getCurrentSkin());
            // Publish the response to the specified topic
            if (result) {
                this._configInterface.mqttSubject.tx$.next(result);
            }
        };
        this.procPeriodicSignBoardStatus = (p_signBoarId) => {
            // Retrieve the table state
            const tableIdEmitter = this._tableEmitter?.id ?? 0;
            const table_state = this._rouletteState.setTableState(this._wheelTcs.getWheelState());
            const result = this._signBoard.signBoardStatus(p_signBoarId, tableIdEmitter, this._configurationEmitter, this._winningNumbersEmitter, table_state, this.checkModuleAreOnline("H+W+A"), this._gameNumberEmitter);
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
        this.procPeriodicSignBoard = () => {
            this._configInterface.tableId.forEach((p_signBoarId) => {
                const state = this._signBoardState[p_signBoarId];
                if (state.configured === true) {
                    this.procPeriodicSignBoardConfig(state.id);
                    this.procPeriodicSignBoardStatus(state.id);
                }
            });
        };
        this.processKeys = (p_keyNumber, p_action, p_time) => {
            try {
                this.log(general_logger_constants_1.LevelsLoggerEnum.debug, `Key ${p_keyNumber} ${p_action} at ${p_time}`);
                if (p_keyNumber === 0 && p_action === true && p_time > 2000) {
                    const openTable = this._rouletteState.toggleOpenTable();
                    this.log(general_logger_constants_1.LevelsLoggerEnum.warning, `Open Table: ${openTable}`);
                }
            }
            catch (error) {
                //empty
            }
        };
        this.getCasino = () => {
            this._api
                .getCasinoFromDb()
                .then((p_casino) => {
                this._casino = p_casino;
                this._dashboard.connect(this._casino);
            })
                .catch((err) => {
                this.logError(err);
            });
        };
        this.setDashBoardData = () => {
            const tableIdEmitter = this._tableEmitter?.id ?? 0;
            const data = {
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
        this.checkModuleAreOnline = (p_selector) => {
            let resp = "";
            const hardwareOnLine = this._hardwareClass.getOnline() ? "H" : "h";
            const apiOnLine = this._api.checkApiState().state ? "A" : "a";
            const wheelOnLine = this._wheelTcs.isOnLine() ? "W" : "w";
            const dashboardOnLine = this._dashboard.isOnLine() ? "D" : "d";
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
                const strMsg = `checkModuleAreOnline --> ${resp} --> ${new Date().toISOString()}`;
                this.log(general_logger_constants_1.LevelsLoggerEnum.info, strMsg);
            }
            return resp;
        };
        this.checkSignboardOffline = () => {
            const TIME_OUT_SIGNBOARD = 10000;
            const now = Date.now();
            this._configInterface.tableId.forEach((p_signBoarId) => {
                const id = p_signBoarId;
                const configured = this._signBoardState[id].configured;
                const remoteTs = this._signBoardState[id].remoteTs;
                if (now - remoteTs > TIME_OUT_SIGNBOARD && configured === true) {
                    this._signBoardState[id].status = "OFF_LINE";
                    this._signBoardState[id].configured = false;
                    this._signBoardState[id].remoteTs = 0;
                }
            });
        };
        this.procRxSignBoard = (p_parts, p_payload) => {
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
            }
            catch (error) {
                //empty
            }
        };
        this.loadSkins = (p_configurationEmitter) => {
            try {
                //empty
                if (p_configurationEmitter !== undefined) {
                    const auxSkins = [];
                    if (Object.values(sts_common_1.SkinEnum).includes(p_configurationEmitter.skin))
                        auxSkins.push(p_configurationEmitter.skin);
                    if (Object.values(sts_common_1.SkinEnum).includes(p_configurationEmitter.skin2))
                        auxSkins.push(p_configurationEmitter.skin2);
                    if (Object.values(sts_common_1.SkinEnum).includes(p_configurationEmitter.skin3))
                        auxSkins.push(p_configurationEmitter.skin3);
                    if (Object.values(sts_common_1.SkinEnum).includes(p_configurationEmitter.skin4))
                        auxSkins.push(p_configurationEmitter.skin4);
                    if (Object.values(sts_common_1.SkinEnum).includes(p_configurationEmitter.skin5))
                        auxSkins.push(p_configurationEmitter.skin5);
                    if (Object.values(sts_common_1.SkinEnum).includes(p_configurationEmitter.skin6))
                        auxSkins.push(p_configurationEmitter.skin6);
                    if (Object.values(sts_common_1.SkinEnum).includes(p_configurationEmitter.skin7))
                        auxSkins.push(p_configurationEmitter.skin7);
                    if (Object.values(sts_common_1.SkinEnum).includes(p_configurationEmitter.skin8))
                        auxSkins.push(p_configurationEmitter.skin8);
                    this._skins = auxSkins;
                }
                else {
                    this._skins = [];
                }
            }
            catch (error) {
                this._skins = [];
            }
        };
        this.getCurrentSkin = () => {
            let resp;
            try {
                //check the lenght
                if (this._skins.length > 0 && this._skins.length <= 8 && this._configurationEmitter !== undefined) {
                    const now = Date.now();
                    const rest = Math.floor(now / (60 * 1000 * this._configurationEmitter.skinRotationTime));
                    const position = rest % this._skins.length;
                    resp = this._skins[position];
                }
                else {
                    resp = sts_common_1.SkinEnum.BOX;
                }
            }
            catch (error) {
                resp = sts_common_1.SkinEnum.BOX;
            }
            return resp;
        };
        this.findConfigurationChanges = (p_current, p_new) => {
            // check if the configuration changed
            if (p_current !== undefined && p_new !== undefined) {
                if (p_current.colorOfLights !== p_new.colorOfLights) {
                    this._hardwareClass.setLightColorConfig(p_new.colorOfLights);
                    const strMsg = `colorOfLights --> ${p_new.colorOfLights} --> ${new Date().toISOString()}`;
                    this.log(general_logger_constants_1.LevelsLoggerEnum.debug, strMsg);
                }
                if (p_current.lightsIntensity !== p_new.lightsIntensity) {
                    this._hardwareClass.setLightsIntensity(p_new.lightsIntensity);
                }
            }
            else if (p_new !== undefined) {
                this._hardwareClass.setLightColorConfig(p_new.colorOfLights);
                this._hardwareClass.setLightsIntensity(p_new.lightsIntensity);
            }
        };
        this.log = (p_level, p_msg) => {
            if (this._logger !== null)
                this._logger.proc(p_level, p_msg);
        };
        this.logError = (p_error) => {
            if (this._logger !== null)
                this._logger.procError(p_error);
        };
        this._logger = _configInterface.logger;
        const dashBoardConfig = {
            srvName: _configInterface.serverName,
            ip: _configInterface.ip,
            portHttp: _configInterface.portHttp,
            portHttps: _configInterface.portHttps,
            serviceId: _configInterface.serviceId,
        };
        this._rouletteState = new states_1.RouletteStateClass();
        this._hardwareClass = new hardware_class_1.HardwareClass(4);
        this._wheelTcs = new wheel_tcs_1.WheelTcsClass(this._logger);
        this._signBoard = new sign_board_1.SignBoardClass();
        this._dashboard = new dashboard_class_1.DashboardClass(dashBoardConfig);
        const apiConfig = {
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
        this._api = new api_connection_class_1.ApiConnectionClass(apiConfig);
        _configInterface.tableId.forEach((p_signBoarId) => {
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
        const subsTopicSignBoard = {
            topic: `sts/SignBoard/c/#`,
            qos: 0,
        };
        _configInterface.mqttSubject.subscribe$.next(subsTopicSignBoard);
        let hardwareId = _configInterface.hardwareId !== "" ? _configInterface.hardwareId : _configInterface.serviceId;
        if (hardwareId === undefined)
            hardwareId = "unknown";
        const subsTopicHardware = {
            topic: `sts/Hardware/${hardwareId}/rx`,
            qos: 0,
        };
        _configInterface.mqttSubject.subscribe$.next(subsTopicHardware);
        let wheelId = _configInterface.wheelId !== "" ? _configInterface.wheelId : _configInterface.serviceId;
        if (wheelId === undefined)
            wheelId = "unknown";
        const subsTopicWheel = {
            topic: `sts/wheel/${wheelId}/state`,
            qos: 0,
        };
        _configInterface.mqttSubject.subscribe$.next(subsTopicWheel);
        // The code block processes the received MQTT messages.
        _configInterface.mqttSubject.rx$.subscribe({
            next: (v) => {
                try {
                    const parts = v.topic;
                    if (parts[0] === "sts") {
                        if (parts[1] === "Hardware" && parts[2] === _configInterface.hardwareId && parts[3] === "rx") {
                            // process the hardware (MQTT)
                            this.processMqttHardwareRx(v, parts);
                        }
                        else if (parts[1] === "wheel" && parts[2] === _configInterface.wheelId && parts[3] === "state") {
                            const state = JSON.parse(v.payload);
                            this.procRxWheel(state, parts);
                        }
                        else if (parts[1] === "SignBoard" && parts[2] === "c") {
                            this.procRxSignBoard(parts, v.payload);
                        }
                    }
                }
                catch (error) {
                    // empty
                }
            },
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            error: (error) => {
                /* empty */
            },
        });
        setInterval(this.procPeriodicSignBoard, 500);
        this.setTableNumberConfig();
        this._hardwareClass.setLightColorConfig(this._configInterface.colorOfLights);
        this._hardwareClass.setLightsIntensity(this._configInterface.lightsIntensity);
        this._hardwareClass.setSemaphoreIntensity(this._configInterface.semaphoreIntensity);
        this._hardwareClass.setSevenSegmentDisplay(this._tableNumberConfig);
        this.log(general_logger_constants_1.LevelsLoggerEnum.info, `CONFIG tableId -------> ${this._configInterface.tableId}`);
        this.log(general_logger_constants_1.LevelsLoggerEnum.info, `CONFIG tableType: ----> ${this._configInterface.tableType}`);
    }
}
exports.default = TableClass;
