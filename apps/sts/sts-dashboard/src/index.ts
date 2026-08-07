import { ConfigClass } from "@slcn-pkg/config-class";
import { MqttClientClass, MqttClientConfigInterface } from "@slcn-pkg/mqtt-client-class";
import { MqttObservableClass } from "@slcn-pkg/mqtt-client-observable-class";
import { ExpressAppClass } from "@slcn-pkg/express-app-class";
import { RemoteDashboardClass } from "./remoteDashboard/remote.dashboard";
import { GeneralLoggerClass, GeneralLoggerInterface } from "@slcn-pkg/general-logger-class";
import { DatePatternLoggerEnum, StrLevelsLoggerEnum, StrMaxFilesLoggerEnum, StrMaxSizeLoggerEnum } from "@slcn-pkg/general-logger-constants";
import path from "node:path";
import { ExpressAppConfigInterface } from "@slcn-pkg/express-app-class/dist/interfaces";

const APP_VERSION: string = "0.0.0";
const APP_NAME: string = "sts-remote-sign";

// This line logs the string "Prueba Typescript..." to the console.
console.log("STS Remote Sign");

// *********************
// *** CONFIGURATION ***
// *********************
const CONFIG: ConfigClass = new ConfigClass(APP_NAME, APP_VERSION, __dirname);

// **********************
// *** GENERAL LOGGER ***
// **********************
const srvName: string = CONFIG.get(["APP", "SRV_NAME"]);
const configLogger: GeneralLoggerInterface = {
    datePattern: CONFIG.get(["LOGGER", "datePattern"]) as DatePatternLoggerEnum,
    zippedArchive: CONFIG.getBoolean(["LOGGER", "zippedArchive"]) as boolean,
    maxSize: CONFIG.get(["LOGGER", "maxSize"]) as StrMaxSizeLoggerEnum.TwentyMb,
    maxFiles: CONFIG.get(["LOGGER", "maxFiles"]) as StrMaxFilesLoggerEnum,
    cwd: path.join(CONFIG.get(["APP", "CWD"]), "apps", "sts", srvName),
    srvName,
    srvVersion: CONFIG.get(["APP", "SRV_VER"]),
    level: CONFIG.get(["LOGGER", "level"]) as StrLevelsLoggerEnum,
};
const logger: GeneralLoggerClass = new GeneralLoggerClass(configLogger);

// *******************
// *** MQTT CLIENT ***
// *******************
const localSubject: MqttObservableClass = new MqttObservableClass();
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
    subject: localSubject,
};
const MQTT: MqttClientClass = new MqttClientClass(mqttClientConfig, null);
MQTT.start();

// **************************
// *** MQTT REMOTE CLIENT ***
// **************************
const remoteSubject: MqttObservableClass = new MqttObservableClass();
const mqttRemoteClientConfig: MqttClientConfigInterface = {
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
const REMOTE_MQTT: MqttClientClass = new MqttClientClass(mqttRemoteClientConfig, null);
REMOTE_MQTT.start();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const hardware: RemoteDashboardClass = new RemoteDashboardClass(localSubject, remoteSubject);

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
const APP: ExpressAppClass = new ExpressAppClass(configExpress, logger, undefined);
//set routes
// APP.setRouter(EMAIL.getRouterMailingList());
APP.listen();
