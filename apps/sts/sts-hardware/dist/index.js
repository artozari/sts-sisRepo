"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("class-validator");
const config_class_1 = require("@slcn-pkg/config-class");
const mqtt_client_class_1 = require("@slcn-pkg/mqtt-client-class");
const mqtt_client_observable_class_1 = require("@slcn-pkg/mqtt-client-observable-class");
const express_app_class_1 = require("@slcn-pkg/express-app-class");
const hardware_1 = require("./hardware");
const individual_validator_class_1 = require("./individualValidators/classes/individual.validator.class");
const general_logger_class_1 = require("@slcn-pkg/general-logger-class");
const node_path_1 = __importDefault(require("node:path"));
const APP_VERSION = "0.0.0";
const APP_NAME = "sts-hardware";
// This line logs the string "Prueba Typescript..." to the console.
console.log("STS Hardware");
// *********************
// *** CONFIGURATION ***
// *********************
const callBackIndividualConfig = (p_obj) => {
    let resp;
    try {
        if (p_obj === null || p_obj === undefined) {
            throw new Error("Object is null or undefined");
        }
        const dataCheck = new individual_validator_class_1.IndividualValidatorClass(p_obj);
        resp = (0, class_validator_1.validateSync)(dataCheck, { whitelist: true });
        if (resp instanceof Array && resp.length === 0) {
            resp = dataCheck;
        }
    }
    catch (error) {
        resp = error;
    }
    return resp;
};
const callBackGeneralConfig = (p_obj) => {
    let resp;
    try {
        if (p_obj === null || p_obj === undefined) {
            throw new Error("Object is null or undefined");
        }
        const dataCheck = new config_class_1.GeneralConfigValidatorClass(p_obj);
        resp = (0, class_validator_1.validateSync)(dataCheck, { whitelist: true });
        if (resp instanceof Array && resp.length === 0) {
            resp = dataCheck;
        }
    }
    catch (error) {
        resp = error;
    }
    return resp;
};
const CONFIG = new config_class_1.ConfigClass(APP_NAME, APP_VERSION, __dirname, callBackGeneralConfig, callBackIndividualConfig, undefined, undefined);
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
    srvVersion: CONFIG.get(["APP", "SRV_VER"]),
    srvName,
    level: CONFIG.get(["LOGGER", "level"]),
};
const LOGGER = new general_logger_class_1.GeneralLoggerClass(configLogger);
// *******************
// *** MQTT CLIENT ***
// *******************
const subject = new mqtt_client_observable_class_1.MqttObservableClass();
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
    subject,
};
const MQTT = new mqtt_client_class_1.MqttClientClass(mqttClientConfig, null);
MQTT.start();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const hardware = new hardware_1.HardwareClass(CONFIG, subject, LOGGER);
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
const APP = new express_app_class_1.ExpressAppClass(configExpress, LOGGER, undefined);
//set routes
// APP.setRouter(EMAIL.getRouterMailingList());
APP.listen();
