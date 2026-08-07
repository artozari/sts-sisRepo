"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("class-validator");
const config_class_1 = require("@slcn-pkg/config-class");
const express_app_class_1 = require("@slcn-pkg/express-app-class");
const mqtt_client_class_1 = require("@slcn-pkg/mqtt-client-class");
const mqtt_client_observable_class_1 = require("@slcn-pkg/mqtt-client-observable-class");
const tcs_wheel_1 = require("./TcsWheel/tcs.wheel");
const individual_validator_class_1 = require("./individualValidators/classes/individual.validator.class");
const general_logger_class_1 = require("@slcn-pkg/general-logger-class");
const node_path_1 = __importDefault(require("node:path"));
const APP_VERSION = "1.0.0";
const APP_NAME = "sts-wheel";
// This line logs the string "Prueba Typescript..." to the console.
console.log(APP_NAME, APP_VERSION, new Date());
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
    serviceId: (_a = CONFIG.getServiceId(true)) !== null && _a !== void 0 ? _a : "unknown",
    subject,
};
const MQTT = new mqtt_client_class_1.MqttClientClass(mqttClientConfig, null);
MQTT.start();
// ***************************
// ******** STS-WHEEL ********
// ***************************
const timeout = CONFIG.getNumber(["COMM", "timeout"]);
const wheelConfig = {
    port: CONFIG.get(["COMM", "port"]),
    baudRate: CONFIG.getNumber(["COMM", "baudRate"]),
    dataBits: CONFIG.getNumber(["COMM", "dataBits"]),
    stopBits: CONFIG.getNumber(["COMM", "stopBits"]),
    parity: CONFIG.get(["COMM", "parity"]),
    timeout: timeout !== null && timeout !== void 0 ? timeout : 5000,
    mqttSubject: subject,
    serviceId: (_b = CONFIG.getServiceId(false)) !== null && _b !== void 0 ? _b : "unknown",
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const wheel = new tcs_wheel_1.TcsWheelClass(wheelConfig);
// *******************
// *** SERVER HTTP ***
// *******************
const configExpress = {
    cors: CONFIG.getArray(["CORS"]),
    srvName,
    srvVersion: CONFIG.get(["APP", "SRV_VER"]),
    srvId: (_c = CONFIG.getServiceId(false)) !== null && _c !== void 0 ? _c : "unknown",
    srvIdFull: (_d = CONFIG.getServiceId(true)) !== null && _d !== void 0 ? _d : "unknown",
    httpPort: (_e = CONFIG.getNumber(["HTTP", "PORT"])) !== null && _e !== void 0 ? _e : 80,
    httpsPort: (_f = CONFIG.getNumber(["HTTP", "PORTS"])) !== null && _f !== void 0 ? _f : 443,
};
const APP = new express_app_class_1.ExpressAppClass(configExpress, LOGGER, undefined);
//set routes
// APP.setRouter(EMAIL.getRouterMailingList());
APP.listen();
