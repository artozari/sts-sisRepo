import { validateSync, ValidationError } from "class-validator";

import { ConfigClass, ConfigFileValidatorType, GeneralConfigValidatorClass, GeneralConfigValidatorInterface } from "@slcn-pkg/config-class";
import { ExpressAppClass } from "@slcn-pkg/express-app-class";
import { MqttClientClass, MqttClientConfigInterface } from "@slcn-pkg/mqtt-client-class";
import { MqttObservableClass } from "@slcn-pkg/mqtt-client-observable-class";
import { TcsWheelClass } from "./TcsWheel/tcs.wheel";
import { TscWheelConfigInterface } from "./interfaces/tsc.wheel.config.interface";
import { IndividualValidatorClass } from "./individualValidators/classes/individual.validator.class";
import { IndividualValidatorInterface } from "./individualValidators/interfaces/individual.validator.interface";
import { GeneralLoggerClass, GeneralLoggerInterface } from "@slcn-pkg/general-logger-class";
import { DatePatternLoggerEnum, StrLevelsLoggerEnum, StrMaxFilesLoggerEnum, StrMaxSizeLoggerEnum } from "@slcn-pkg/general-logger-constants";
import path from "node:path";
import { ExpressAppConfigInterface } from "@slcn-pkg/express-app-class/dist/interfaces";

const APP_VERSION: string = "1.0.0";
const APP_NAME: string = "sts-wheel";

// This line logs the string "Prueba Typescript..." to the console.
console.log(APP_NAME, APP_VERSION, new Date());

// *********************
// *** CONFIGURATION ***
// *********************
const callBackIndividualConfig = (p_obj: object | null | undefined): ConfigFileValidatorType => {
    let resp: ConfigFileValidatorType;

    try {
        if (p_obj === null || p_obj === undefined) {
            throw new Error("Object is null or undefined");
        }
        const dataCheck: IndividualValidatorClass = new IndividualValidatorClass(p_obj as IndividualValidatorInterface);
        resp = validateSync(dataCheck, { whitelist: true });
        if (resp instanceof Array && resp.length === 0) {
            resp = dataCheck;
        }
    } catch (error) {
        resp = error as Error;
    }
    return resp;
};

const callBackGeneralConfig = (p_obj: object | null | undefined): ConfigFileValidatorType => {
    let resp: ValidationError[] | Error | object;

    try {
        if (p_obj === null || p_obj === undefined) {
            throw new Error("Object is null or undefined");
        }
        const dataCheck: GeneralConfigValidatorClass = new GeneralConfigValidatorClass(p_obj as GeneralConfigValidatorInterface);
        resp = validateSync(dataCheck, { whitelist: true });
        if (resp instanceof Array && resp.length === 0) {
            resp = dataCheck;
        }
    } catch (error) {
        resp = error as Error;
    }
    return resp;
};

const CONFIG: ConfigClass = new ConfigClass(APP_NAME, APP_VERSION, __dirname, callBackGeneralConfig, callBackIndividualConfig, undefined, undefined);

// **********************
// *** GENERAL LOGGER ***
// **********************
const srvName: string = CONFIG.get(["APP", "SRV_NAME"]);
const configLogger: GeneralLoggerInterface = {
    datePattern: CONFIG.get(["LOGGER", "datePattern"]) as DatePatternLoggerEnum,
    zippedArchive: CONFIG.getBoolean(["LOGGER", "zippedArchive"]) as boolean,
    maxSize: CONFIG.get(["LOGGER", "maxSize"]) as StrMaxSizeLoggerEnum,
    maxFiles: CONFIG.get(["LOGGER", "maxFiles"]) as StrMaxFilesLoggerEnum,
    cwd: path.join(CONFIG.get(["APP", "CWD"]), "apps", "sts", srvName),
    srvVersion: CONFIG.get(["APP", "SRV_VER"]),
    srvName,
    level: CONFIG.get(["LOGGER", "level"]) as StrLevelsLoggerEnum,
};
const LOGGER: GeneralLoggerClass = new GeneralLoggerClass(configLogger);

// *******************
// *** MQTT CLIENT ***
// *******************
const subject: MqttObservableClass = new MqttObservableClass();
const mqttClientConfig: MqttClientConfigInterface = {
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
const MQTT: MqttClientClass = new MqttClientClass(mqttClientConfig, null);
MQTT.start();

// ***************************
// ******** STS-WHEEL ********
// ***************************
const timeout: number | undefined = CONFIG.getNumber(["COMM", "timeout"]);
const wheelConfig: TscWheelConfigInterface = {
    port: CONFIG.get(["COMM", "port"]),
    baudRate: CONFIG.getNumber(["COMM", "baudRate"]) as 4800 | 9600 | 19200 | 38400 | 57600 | 115200,
    dataBits: CONFIG.getNumber(["COMM", "dataBits"]) as 5 | 6 | 7 | 8,
    stopBits: CONFIG.getNumber(["COMM", "stopBits"]) as 1 | 1.5 | 2,
    parity: CONFIG.get(["COMM", "parity"]) as "none" | "even" | "odd" | "mark" | "space",
    timeout: timeout ?? 5000,
    mqttSubject: subject,
    serviceId: CONFIG.getServiceId(false) ?? "unknown",
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const wheel: TcsWheelClass = new TcsWheelClass(wheelConfig);

// *******************
// *** SERVER HTTP ***
// *******************
const configExpress: ExpressAppConfigInterface = {
    cors: CONFIG.getArray(["CORS"]),
    srvName,
    srvVersion: CONFIG.get(["APP", "SRV_VER"]),
    srvId: CONFIG.getServiceId(false) ?? "unknown",
    srvIdFull: CONFIG.getServiceId(true) ?? "unknown",
    httpPort: CONFIG.getNumber(["HTTP", "PORT"]) ?? 80,
    httpsPort: CONFIG.getNumber(["HTTP", "PORTS"]) ?? 443,
};
const APP: ExpressAppClass = new ExpressAppClass(configExpress, LOGGER, undefined);
//set routes
// APP.setRouter(EMAIL.getRouterMailingList());
APP.listen();
