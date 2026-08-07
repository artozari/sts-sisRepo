"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardClass = void 0;
const sts_common_1 = require("sts-common");
const node_util_1 = require("node:util");
const mqtt_client_class_1 = require("@slcn-pkg/mqtt-client-class");
const mqtt_client_observable_class_1 = require("@slcn-pkg/mqtt-client-observable-class");
class DashboardClass {
    constructor(_dasboardConfig) {
        this._dasboardConfig = _dasboardConfig;
        this._isConnected = false;
        this._setInterval = undefined;
        this._casino = undefined;
        this._mqtt_refresh_time_msec = 20000;
        this._mqttDashboard = null;
        this._dataTable = undefined;
        this.send = () => {
            try {
                if (this._mqttDashboard === null)
                    return;
                if (this._mqttDashboard.isConected() === false)
                    return;
                const mqttTx = {
                    ts: undefined,
                    gameNumber: undefined,
                    casinoData: undefined,
                    tableData: undefined,
                    configData: undefined,
                    winningNumbersData: undefined,
                    status: undefined,
                };
                if (this._dataTable === undefined)
                    return;
                if (this._dataTable.casino === undefined)
                    return;
                if (this._dataTable.table === undefined)
                    return;
                mqttTx.gameNumber = this._dataTable.gameNumber ?? undefined;
                mqttTx.ts = this._dataTable.ts ?? undefined;
                if (this._dataTable.winningNumbersData !== undefined) {
                    this._dataTable.winningNumbersData.forEach((game) => {
                        const { id, createdAt, gameNumber, winNumber, rpm, openTable, clockwise, enabled, croupierId, tableId } = game;
                        const tuple = [id, createdAt, gameNumber, winNumber, rpm, clockwise, openTable, enabled, croupierId, tableId];
                        if (mqttTx.winningNumbersData === undefined)
                            mqttTx.winningNumbersData = [];
                        mqttTx.winningNumbersData.push(tuple);
                    });
                }
                const casinoData = [
                    "casinoCode",
                    this._dataTable.casino.casinoCode,
                    "name",
                    this._dataTable.casino.name,
                    "country",
                    this._dataTable.casino.country,
                    "province",
                    this._dataTable.casino.province,
                    "city",
                    this._dataTable.casino.city,
                    "address",
                    this._dataTable.casino.address,
                    "mqtt_refresh_time_msec",
                    this._dataTable.casino.mqtt_refresh_time_msec,
                ];
                mqttTx.casinoData = casinoData;
                const tableData = [
                    "id",
                    this._dataTable.table.id,
                    "name",
                    this._dataTable.table.name,
                    "shortName",
                    this._dataTable.table.shortName,
                    "tableNumber",
                    this._dataTable.table.tableNumber,
                    "key",
                    this._dataTable.table.key,
                    "positionX",
                    this._dataTable.table.posX,
                    "positionY",
                    this._dataTable.table.posY,
                    "layout",
                    this._dataTable.table.layout,
                    "noSmoking",
                    this._dataTable.table.noSmoking,
                ];
                mqttTx.tableData = tableData;
                if (this._dataTable.configuration !== undefined) {
                    const configData = [
                        "wheelType",
                        this._dataTable.configuration.wheelType,
                        "skyn",
                        this._dataTable.configuration.skin,
                        "chip",
                        this._dataTable.configuration.chip,
                        "max",
                        this._dataTable.configuration.max,
                        "min",
                        this._dataTable.configuration.min,
                        "colorOfLights",
                        this._dataTable.configuration.colorOfLights,
                        "lightsIntensity",
                        this._dataTable.configuration.lightsIntensity,
                        "b36",
                        this._dataTable.configuration.b36,
                        "b18",
                        this._dataTable.configuration.b18,
                        "b12",
                        this._dataTable.configuration.b12,
                        "b9",
                        this._dataTable.configuration.b9,
                        "b7",
                        this._dataTable.configuration.b7,
                        "b6",
                        this._dataTable.configuration.b6,
                        "bCha1",
                        this._dataTable.configuration.bCha1,
                        "bCha2",
                        this._dataTable.configuration.bCha2,
                        "language",
                        this._dataTable.configuration.lang,
                        "language2",
                        this._dataTable.configuration.lang2,
                        "language3",
                        this._dataTable.configuration.lang3,
                    ];
                    mqttTx.configData = configData;
                }
                const semaphoreStatus = this.getSemaphoreStatus();
                const tableStatus = [
                    "semaphore",
                    semaphoreStatus.state,
                    "semaphoreGames",
                    semaphoreStatus.gamesQ
                ];
                mqttTx.status = tableStatus;
                const mqttTxJson = JSON.stringify(mqttTx);
                const topic = `sts/dashboard/local/${this._dataTable.casino.casinoCode}/${this._dataTable.table.shortName}`;
                this._mqttDashboard.publish(topic, mqttTxJson);
            }
            catch (error) {
                // empty
            }
        };
        this.connect = (p_casino) => {
            try {
                const bChangeCasino = (0, node_util_1.isDeepStrictEqual)(this._casino, p_casino) === false;
                this._isConnected = true;
                let mqtt_refresh_time_msec = isNaN(p_casino.mqtt_refresh_time_msec) ? 20000 : 1000 * p_casino.mqtt_refresh_time_msec;
                if (mqtt_refresh_time_msec > 60000 || mqtt_refresh_time_msec < 1000) {
                    mqtt_refresh_time_msec = 20000;
                }
                const bSetInterval = this._setInterval === undefined;
                if (bSetInterval === true || bChangeCasino === true) {
                    this.reloadConfig(p_casino, mqtt_refresh_time_msec);
                }
            }
            catch (error) {
                // empty
            }
        };
        this.reloadConfig = (p_casino, p_mqtt_refresh_time_msec) => {
            try {
                this._casino = p_casino;
                if (this._setInterval !== undefined)
                    clearInterval(this._setInterval);
                this._mqtt_refresh_time_msec = p_mqtt_refresh_time_msec;
                this._setInterval = setInterval(this.send, this._mqtt_refresh_time_msec);
                this.disconnectMqtt();
            }
            catch (error) {
                // empty
            }
        };
        this.disconnectMqtt = () => {
            try {
                if (this._mqttDashboard !== null) {
                    if (this._mqttDashboard.isConected()) {
                        this._mqttDashboard.close();
                    }
                }
                setTimeout(this.connectMqtt, 2000);
            }
            catch (error) {
                // empty
            }
        };
        this.connectMqtt = () => {
            try {
                this._mqttDashboard = null;
                if (this._casino !== undefined) {
                    const subject = new mqtt_client_observable_class_1.MqttObservableClass();
                    const mqttClientConfig = {
                        name: "MQTT_DASHBOARD",
                        srvName: this._dasboardConfig.srvName,
                        ip: this._dasboardConfig.ip,
                        urlMqtt: this._casino.mqtt_url ?? "localhost",
                        portMqtt: this._casino.mqtt_port ?? 1883,
                        username: this._casino.mqtt_user ?? "",
                        password: this._casino.mqtt_password ?? "",
                        portHttp: this._dasboardConfig.portHttp,
                        portHttps: this._dasboardConfig.portHttps,
                        protocol: this._casino.mqtt_protocol ?? "wss",
                        serviceId: this._dasboardConfig.serviceId,
                        subject,
                    };
                    this._mqttDashboard = new mqtt_client_class_1.MqttClientClass(mqttClientConfig, null);
                    this._mqttDashboard.start();
                }
            }
            catch (error) {
                // empty
            }
        };
        this.setData = (p_data) => {
            this._dataTable = p_data;
        };
        this.isOnLine = () => {
            let resp;
            try {
                if (this._mqttDashboard === null) {
                    resp = false;
                }
                else {
                    resp = this._mqttDashboard.isConected();
                }
            }
            catch (error) {
                resp = false;
            }
            return resp;
        };
        this.getSemaphoreStatus = () => {
            const resp = {};
            try {
                const min = 10;
                const green = 4;
                const yellow = 2;
                let gamesQ = 0;
                if (this._dataTable) {
                    if (this._dataTable.winningNumbersData !== undefined) {
                        const now = Date.now();
                        const milliSecs = 60 * 1000 * min;
                        for (const game in this._dataTable.winningNumbersData) {
                            const gameObj = this._dataTable.winningNumbersData[game];
                            const createdAt = new Date(gameObj.createdAt);
                            const diff = now - createdAt.getTime();
                            if (milliSecs >= diff) {
                                gamesQ += 1;
                            }
                            else
                                break;
                        }
                    }
                }
                if (gamesQ >= green) {
                    resp.state = sts_common_1.DashboardSemaphoreStateEnum.Green;
                    resp.gamesQ = gamesQ;
                }
                else if (gamesQ >= yellow) {
                    resp.state = sts_common_1.DashboardSemaphoreStateEnum.Yellow;
                    resp.gamesQ = gamesQ;
                }
                else {
                    resp.state = sts_common_1.DashboardSemaphoreStateEnum.Red;
                    resp.gamesQ = gamesQ;
                }
            }
            catch (error) {
                resp.state = sts_common_1.DashboardSemaphoreStateEnum.Red;
                resp.gamesQ = 0;
            }
            return resp;
        };
        this._mqtt_refresh_time_msec = 20000;
    }
}
exports.DashboardClass = DashboardClass;
