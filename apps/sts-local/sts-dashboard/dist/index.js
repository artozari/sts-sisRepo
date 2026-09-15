"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_class_1 = require("@slcn-pkg/config-class");
const mqtt_client_class_1 = require("@slcn-pkg/mqtt-client-class");
const mqtt_client_observable_class_1 = require("@slcn-pkg/mqtt-client-observable-class");
const express_app_class_1 = require("@slcn-pkg/express-app-class");
const remote_dashboard_1 = require("./remoteDashboard/remote.dashboard");
const general_logger_class_1 = require("@slcn-pkg/general-logger-class");
const node_path_1 = __importDefault(require("node:path"));
const APP_VERSION = "0.0.0";
const APP_NAME = "sts-remote-sign";
// This line logs the string "Prueba Typescript..." to the console.
console.log("STS Remote Sign");
// *********************
// *** CONFIGURATION ***
// *********************
const CONFIG = new config_class_1.ConfigClass(APP_NAME, APP_VERSION, __dirname);
// **********************
// *** GENERAL LOGGER ***
// **********************
const srvName = CONFIG.get(["APP", "SRV_NAME"]);
const configLogger = {
    datePattern: CONFIG.get(["LOGGER", "datePattern"]),
    zippedArchive: CONFIG.getBoolean(["LOGGER", "zippedArchive"]),
    maxSize: CONFIG.get(["LOGGER", "maxSize"]),
    maxFiles: CONFIG.get(["LOGGER", "maxFiles"]),
    cwd: node_path_1.default.join(CONFIG.get(["APP", "CWD"]), "apps", "sts", srvName),
    srvName,
    srvVersion: CONFIG.get(["APP", "SRV_VER"]),
    level: CONFIG.get(["LOGGER", "level"]),
};
const logger = new general_logger_class_1.GeneralLoggerClass(configLogger);
// *******************
// *** MQTT CLIENT ***
// *******************
const localSubject = new mqtt_client_observable_class_1.MqttObservableClass();
const mqttClientConfig = {
    name: "MQTT",
    srvName: CONFIG.get(["APP", "SRV_NAME"]),
    ip: CONFIG.get(["APP", "IP"]),
    urlMqtt: CONFIG.get(["MQTT", "url"]),
    portMqtt: CONFIG.get(["MQTT", "port"]),
    username: CONFIG.get(["MQTT", "username"]),
    password: CONFIG.get(["MQTT", "password"]),
    portHttp: CONFIG.get(["APP", "PORT_HTTP"]),
    portHttps: CONFIG.get(["APP", "PORT_HTTPS"]),
    protocol: CONFIG.get(["MQTT", "protocol"]),
    serviceId: CONFIG.getServiceId(true) ?? "unknown",
    subject: localSubject,
};
const MQTT = new mqtt_client_class_1.MqttClientClass(mqttClientConfig, null);
MQTT.start();
// **************************
// *** MQTT REMOTE CLIENT ***
// **************************
const remoteSubject = new mqtt_client_observable_class_1.MqttObservableClass();
const mqttRemoteClientConfig = {
    name: "MQTT_REMOTE",
    srvName: CONFIG.get(["APP", "SRV_NAME"]),
    ip: CONFIG.get(["APP", "IP"]),
    urlMqtt: CONFIG.get(["MQTT_REMOTE", "url"]),
    portMqtt: CONFIG.get(["MQTT_REMOTE", "port"]),
    username: CONFIG.get(["MQTT_REMOTE", "username"]),
    password: CONFIG.get(["MQTT_REMOTE", "password"]),
    portHttp: CONFIG.get(["APP", "PORT_HTTP"]),
    portHttps: CONFIG.get(["APP", "PORT_HTTPS"]),
    protocol: CONFIG.get(["MQTT_REMOTE", "protocol"]),
    serviceId: CONFIG.getServiceId(true) ?? "unknown",
    subject: remoteSubject,
};
const REMOTE_MQTT = new mqtt_client_class_1.MqttClientClass(mqttRemoteClientConfig, null);
REMOTE_MQTT.start();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const hardware = new remote_dashboard_1.RemoteDashboardClass(localSubject, remoteSubject);
// *******************
// *** SERVER HTTP ***
// *******************
const configExpress = {
    cors: CONFIG.getArray(["CORS"]),
    srvName,
    srvVersion: CONFIG.get(["APP", "SRV_VER"]),
    srvId: CONFIG.getServiceId(false) ?? "unknown",
    srvIdFull: CONFIG.getServiceId(true) ?? "unknown",
    httpPort: CONFIG.getNumber(["HTTP", "PORT"]) ?? 80,
    httpsPort: CONFIG.getNumber(["HTTP", "PORTS"]) ?? 443,
};
const APP = new express_app_class_1.ExpressAppClass(configExpress, logger, undefined);
//set routes
// APP.setRouter(EMAIL.getRouterMailingList());
APP.listen();
