"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_class_1 = require("./config/config.class");
const configCasino_class_1 = require("./config/configCasino.class");
const mqtt_client_observable_class_1 = require("@slcn-pkg/mqtt-client-observable-class");
const mqtt_client_class_1 = require("@slcn-pkg/mqtt-client-class");
const local_publisher_class_1 = require("./local-publisher-class/local.publisher.class");
const Casino_publisher_class_1 = require("./Casino-publisher-class/Casino.publisher.class");
const Local_api_class_1 = require("./api-class/Local.api.class");
console.log("\x1b[44m\x1b[30m\x1b[1m\x1b[3mIniciando STS Local Publisher!!!\x1b[0m");
// const CONFIGLOCAL: ConfigClass = new ConfigCasinoClass();    // --> cambiar por el que se use
const CONFIGLOCAL = new config_class_1.ConfigClass(); // --> cambiar por el que se use
const subjectLocal = new mqtt_client_observable_class_1.MqttObservableClass();
const mqttClientConfigLocal = {
    name: CONFIGLOCAL.name,
    srvName: CONFIGLOCAL.srvName,
    ip: CONFIGLOCAL.ip,
    urlMqtt: CONFIGLOCAL.urlMqtt,
    portMqtt: CONFIGLOCAL.portMqtt,
    username: CONFIGLOCAL.username,
    password: CONFIGLOCAL.password,
    portHttp: CONFIGLOCAL.portHttp,
    portHttps: CONFIGLOCAL.portHttps,
    protocol: CONFIGLOCAL.protocol,
    serviceId: CONFIGLOCAL.serviceId,
    subject: subjectLocal,
};
const MQTT = new mqtt_client_class_1.MqttClientClass(mqttClientConfigLocal, null);
MQTT.start();
const LOCAL_PUBLISHER = new local_publisher_class_1.LocalPublisherClass({
    subject: subjectLocal,
});
LOCAL_PUBLISHER.start();
// EL segundo publisher para casino
const CONFIGCASINO = new configCasino_class_1.ConfigCasinoClass();
const subjectCasino = new mqtt_client_observable_class_1.MqttObservableClass();
const mqttClientConfigCasino = {
    name: CONFIGCASINO.name,
    srvName: CONFIGCASINO.srvName,
    ip: CONFIGCASINO.ip,
    urlMqtt: CONFIGCASINO.urlMqtt,
    portMqtt: CONFIGCASINO.portMqtt,
    username: CONFIGCASINO.username,
    password: CONFIGCASINO.password,
    portHttp: CONFIGCASINO.portHttp,
    portHttps: CONFIGCASINO.portHttps,
    protocol: CONFIGCASINO.protocol,
    serviceId: CONFIGCASINO.serviceId,
    subject: subjectCasino,
};
const MQTT_CASINO = new mqtt_client_class_1.MqttClientClass(mqttClientConfigCasino, null);
MQTT_CASINO.start();
const CASINO_PUBLISHER = new Casino_publisher_class_1.CasinoPublisherClass({
    subject: subjectCasino,
});
CASINO_PUBLISHER.start();
const HEALTH_CHECK = new Local_api_class_1.ApiCheckClass({
    baseUrl: "http://10.0.0.148:8023", //--> api hardcodeada, luego se puede cambiar por la ip del local publisher
    path: "/api/v1/game",
    interval: 10000,
    timeout: 10000,
});
HEALTH_CHECK.start();
let gamesWinning;
let tableStatus;
let tableConf;
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield HEALTH_CHECK.queryEndpoint("/api/v1/game?q=1");
    if (response.success) {
        gamesWinning = response.data;
    }
    else {
        console.error("[API Error]", response.error);
    }
    let firstGamePayload = gamesWinning;
    try {
        const games = JSON.parse(gamesWinning);
        if (Array.isArray(games) && games.length > 0) {
            firstGamePayload = JSON.stringify(games[0]);
        }
    }
    catch (e) {
        // Si no es JSON válido, mantener el valor anterior
        console.error(e);
    }
    const responseTable = yield HEALTH_CHECK.queryEndpoint("/api/v1/table/1");
    if (responseTable.success) {
        tableConf = responseTable.data;
    }
    else {
        console.error("[API Error]", responseTable.error);
    }
    tableStatus = LOCAL_PUBLISHER.getTableStatus();
    CASINO_PUBLISHER.publishMqtt({
        topic: "STS-MESAS/statusTableServices-" + tableStatus.tableNumber,
        payload: JSON.stringify(tableStatus),
        qos: 1,
        retain: false,
    });
    CASINO_PUBLISHER.publishMqtt({
        topic: `STS-MESAS/game/${JSON.parse(tableConf).tableNumber}`,
        payload: firstGamePayload,
        qos: 1,
        retain: false,
    });
    (() => __awaiter(void 0, void 0, void 0, function* () {
        if (CASINO_PUBLISHER.requestSync === 1) {
            const response = yield HEALTH_CHECK.queryEndpoint("/api/v1/game?q=1000"); //--> consulta para obtener los últimos 1000 juegos, luego se puede cambiar por la cantidad que se quiera, modificando la API
            if (response.success) {
                gamesWinning = response.data; //--> invertimos el orden de los juegos para que el más reciente sea el primero en la lista
                CASINO_PUBLISHER.publishMqtt({
                    topic: `STS-MESAS/GameSync/${JSON.parse(tableConf).tableNumber}`,
                    payload: gamesWinning,
                    qos: 1,
                    retain: false,
                });
            }
            else {
                console.error("[API Error]", response.error);
            }
            CASINO_PUBLISHER.requestSync = 0;
        }
    }))();
}), 3000);
/* API: a partir de aqui se realizan las peticiones */
// Iniciar el intervalo
