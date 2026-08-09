import { ConfigClass } from "./config/config.class";
import { ConfigCasinoClass } from "./config/configCasino.class";
import { MqttObservableClass } from "@slcn-pkg/mqtt-client-observable-class";
import { MqttClientClass, MqttClientConfigInterface } from "@slcn-pkg/mqtt-client-class";
import { LocalPublisherClass } from "./local-publisher-class/local.publisher.class";
import { CasinoPublisherClass } from "./Casino-publisher-class/Casino.publisher.class";
import { ApiCheckClass } from "./api-class/Local.api.class";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

const envCandidates = [path.resolve(process.cwd(), ".env"), path.resolve(__dirname, "..", ".env"), path.resolve(__dirname, ".env")];

for (const envPath of envCandidates) {
    if (fs.existsSync(envPath)) {
        dotenv.config({ path: envPath });
        break;
    }
}

console.log("\x1b[44m\x1b[30m\x1b[1m\x1b[3mIniciando STS Local Publisher!!!\x1b[0m");

const CONFIGLOCAL: ConfigClass = new ConfigClass();
const subjectLocal: MqttObservableClass = new MqttObservableClass();

const mqttClientConfigLocal: MqttClientConfigInterface = {
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

const MQTT: MqttClientClass = new MqttClientClass(mqttClientConfigLocal, null);
MQTT.start();

const LOCAL_PUBLISHER: LocalPublisherClass = new LocalPublisherClass({
    subject: subjectLocal,
});
LOCAL_PUBLISHER.start();

const CONFIGCASINO: ConfigCasinoClass = new ConfigCasinoClass();
const subjectCasino: MqttObservableClass = new MqttObservableClass();

const mqttClientConfigCasino: MqttClientConfigInterface = {
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

const MQTT_CASINO: MqttClientClass = new MqttClientClass(mqttClientConfigCasino, null);
MQTT_CASINO.start();

const CASINO_PUBLISHER: CasinoPublisherClass = new CasinoPublisherClass({
    subject: subjectCasino,
});
CASINO_PUBLISHER.start();

const HEALTH_CHECK = new ApiCheckClass({
    baseUrl: process.env.API_URL!,
    path: "/api/v1/game",
    interval: 10000,
    timeout: 10000,
});
HEALTH_CHECK.start();

let gamesWinning: string;
let tableStatus;
let tableConf: string;
let mainInterval: NodeJS.Timeout | null = null;
let isShuttingDown = false;

const cleanup = (reason?: string, error?: unknown) => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    console.log(`[Shutdown] Iniciando limpieza${reason ? ` por ${reason}` : ""}`);
    if (error) {
        console.error(error instanceof Error ? error.stack || error.message : error);
    }

    if (mainInterval !== null) {
        clearInterval(mainInterval);
        mainInterval = null;
    }

    try {
        HEALTH_CHECK.stop();
    } catch (err) {
        console.error("Error deteniendo health check:", err);
    }

    try {
        MQTT.close();
    } catch (err) {
        console.error("Error cerrando MQTT local:", err);
    }

    try {
        MQTT_CASINO.close();
    } catch (err) {
        console.error("Error cerrando MQTT casino:", err);
    }

    process.exit(error ? 1 : 0);
};

process.on("SIGINT", () => cleanup("SIGINT"));
process.on("SIGTERM", () => cleanup("SIGTERM"));
process.on("uncaughtException", (err) => cleanup("uncaughtException", err));
process.on("unhandledRejection", (reason) => cleanup("unhandledRejection", reason));

mainInterval = setInterval(async () => {
    const response = await HEALTH_CHECK.queryEndpoint("/api/v1/game?q=1");
    if (response.success) {
        gamesWinning = response.data;
    } else {
        console.error("[API Error]", response.error);
    }

    let firstGamePayload = gamesWinning;
    try {
        const games = JSON.parse(gamesWinning);
        if (Array.isArray(games) && games.length > 0) {
            firstGamePayload = JSON.stringify(games[0]);
        }
    } catch (e) {
        // Si no es JSON válido, mantener el valor anterior
        console.error(e);
    }

    const responseTable = await HEALTH_CHECK.queryEndpoint("/api/v1/table/1");
    if (responseTable.success) {
        tableConf = responseTable.data;
    } else {
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

    (async () => {
        if (CASINO_PUBLISHER.requestSync === 1) {
            const response = await HEALTH_CHECK.queryEndpoint("/api/v1/game?q=2000"); //--> consulta para obtener los últimos 3000 juegos, luego se puede cambiar por la cantidad que se quiera, modificando la API
            if (response.success) {
                gamesWinning = response.data; //--> invertimos el orden de los juegos para que el más reciente sea el primero en la lista
                CASINO_PUBLISHER.publishMqtt({
                    topic: `STS-MESAS/GameSync/${JSON.parse(tableConf!).tableNumber}`,
                    payload: gamesWinning,
                    qos: 1,
                    retain: false,
                });
            } else {
                console.error("[API Error]", response.error);
            }
            CASINO_PUBLISHER.requestSync = 0;
        }
    })();
}, 3000);

/* API: a partir de aqui se realizan las peticiones */

// Iniciar el intervalo
