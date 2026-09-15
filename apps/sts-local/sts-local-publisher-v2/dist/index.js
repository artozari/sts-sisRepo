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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const config_class_1 = require("./config/config.class");
const mqtt_client_observable_class_1 = require("@slcn-pkg/mqtt-client-observable-class");
const mqtt_client_class_1 = require("@slcn-pkg/mqtt-client-class");
const local_publisher_class_1 = require("./local-publisher-class/local.publisher.class");
const Casino_publisher_class_1 = require("./Casino-publisher-class/Casino.publisher.class");
const Local_api_class_1 = require("./api-class/Local.api.class");
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const envCandidates = [path_1.default.resolve(process.cwd(), ".env"), path_1.default.resolve(__dirname, "..", ".env"), path_1.default.resolve(__dirname, ".env")];
for (const envPath of envCandidates) {
    if (fs_1.default.existsSync(envPath)) {
        dotenv_1.default.config({ path: envPath });
        break;
    }
}
console.log("\x1b[44m\x1b[30m\x1b[1m\x1b[3mIniciando STS Local Publisher V2 (casinoCode desde DB)!!!\x1b[0m");
const CONFIGLOCAL = new config_class_1.ConfigClass();
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
const subjectCasino = new mqtt_client_observable_class_1.MqttObservableClass();
const configCasino_class_1 = require("./config/configCasino.class");
const CONFIGCASINO_FALLBACK = new configCasino_class_1.ConfigCasinoClass();
let currentCasinoMqttConfig = {
    name: CONFIGCASINO_FALLBACK.name,
    srvName: CONFIGCASINO_FALLBACK.srvName,
    ip: CONFIGCASINO_FALLBACK.ip,
    urlMqtt: CONFIGCASINO_FALLBACK.urlMqtt,
    portMqtt: CONFIGCASINO_FALLBACK.portMqtt,
    username: CONFIGCASINO_FALLBACK.username,
    password: CONFIGCASINO_FALLBACK.password,
    portHttp: CONFIGCASINO_FALLBACK.portHttp,
    portHttps: CONFIGCASINO_FALLBACK.portHttps,
    protocol: CONFIGCASINO_FALLBACK.protocol,
    serviceId: CONFIGCASINO_FALLBACK.serviceId,
    subject: subjectCasino,
};
let MQTT_CASINO = new mqtt_client_class_1.MqttClientClass(currentCasinoMqttConfig, null);
MQTT_CASINO.start();
const CASINO_PUBLISHER = new Casino_publisher_class_1.CasinoPublisherClass({
    subject: subjectCasino,
});
CASINO_PUBLISHER.start();
const apiUrl = (_a = process.env.API_URL) !== null && _a !== void 0 ? _a : "http://127.0.0.1:8023";
const HEALTH_CHECK = new Local_api_class_1.ApiCheckClass({
    baseUrl: apiUrl,
    path: "/api/v1/game",
    interval: 10000,
    timeout: 10000,
});
HEALTH_CHECK.start();
let gamesWinning;
let tableStatus;
let tableConf;
let casinoConf;
let currentCasinoCode = null;
let mainInterval = null;
let isShuttingDown = false;
const recreateCasinoMqttIfNeeded = (casinoRecord) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    try {
        const urlMqtt = (_b = (_a = casinoRecord.mqtt_url) !== null && _a !== void 0 ? _a : casinoRecord.mqttUrl) !== null && _b !== void 0 ? _b : currentCasinoMqttConfig.urlMqtt;
        const portMqtt = String((_d = (_c = casinoRecord.mqtt_port) !== null && _c !== void 0 ? _c : casinoRecord.mqttPort) !== null && _d !== void 0 ? _d : currentCasinoMqttConfig.portMqtt);
        const protocol = (_f = (_e = casinoRecord.mqtt_protocol) !== null && _e !== void 0 ? _e : casinoRecord.mqttProtocol) !== null && _f !== void 0 ? _f : currentCasinoMqttConfig.protocol;
        const username = (_h = (_g = casinoRecord.mqtt_user) !== null && _g !== void 0 ? _g : casinoRecord.mqttUser) !== null && _h !== void 0 ? _h : currentCasinoMqttConfig.username;
        const password = (_k = (_j = casinoRecord.mqtt_password) !== null && _j !== void 0 ? _j : casinoRecord.mqttPassword) !== null && _k !== void 0 ? _k : currentCasinoMqttConfig.password;
        const changed = urlMqtt !== currentCasinoMqttConfig.urlMqtt ||
            portMqtt !== currentCasinoMqttConfig.portMqtt ||
            protocol !== currentCasinoMqttConfig.protocol ||
            username !== currentCasinoMqttConfig.username ||
            password !== currentCasinoMqttConfig.password;
        if (!changed)
            return;
        console.log(`\x1b[43m\x1b[30m[MQTT Casino] Reconfigurando broker desde DB: ${urlMqtt}:${portMqtt} (${protocol}) casino=${casinoRecord.casinoCode}\x1b[0m`);
        try {
            MQTT_CASINO.close();
        }
        catch (e) {
            console.error("Error cerrando MQTT casino previo:", e);
        }
        currentCasinoMqttConfig = {
            name: (_l = casinoRecord.casinoCode) !== null && _l !== void 0 ? _l : currentCasinoMqttConfig.name,
            srvName: currentCasinoMqttConfig.srvName,
            ip: currentCasinoMqttConfig.ip,
            urlMqtt,
            portMqtt,
            username,
            password,
            portHttp: currentCasinoMqttConfig.portHttp,
            portHttps: currentCasinoMqttConfig.portHttps,
            protocol,
            serviceId: currentCasinoMqttConfig.serviceId,
            subject: subjectCasino,
        };
        MQTT_CASINO = new mqtt_client_class_1.MqttClientClass(currentCasinoMqttConfig, null);
        MQTT_CASINO.start();
    }
    catch (e) {
        console.error("[MQTT Casino] Error al reconfigurar desde DB:", e);
    }
};
const cleanup = (reason, error) => {
    if (isShuttingDown)
        return;
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
    }
    catch (err) {
        console.error("Error deteniendo health check:", err);
    }
    try {
        MQTT.close();
    }
    catch (err) {
        console.error("Error cerrando MQTT local:", err);
    }
    try {
        MQTT_CASINO.close();
    }
    catch (err) {
        console.error("Error cerrando MQTT casino:", err);
    }
    process.exit(error ? 1 : 0);
};
process.on("SIGINT", () => cleanup("SIGINT"));
process.on("SIGTERM", () => cleanup("SIGTERM"));
process.on("uncaughtException", (err) => cleanup("uncaughtException", err));
process.on("unhandledRejection", (reason) => cleanup("unhandledRejection", reason));
mainInterval = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const response = yield HEALTH_CHECK.queryEndpoint("/api/v1/game?q=1");
    if (response.success) {
        gamesWinning = response.data;
    }
    else {
        console.error("[API Error] game", response.error);
    }
    let firstGamePayload = gamesWinning;
    try {
        const games = JSON.parse(gamesWinning);
        if (Array.isArray(games) && games.length > 0) {
            firstGamePayload = JSON.stringify(games[0]);
        }
    }
    catch (e) {
        console.error(e);
    }
    const responseTable = yield HEALTH_CHECK.queryEndpoint("/api/v1/table/1");
    if (responseTable.success) {
        tableConf = responseTable.data;
    }
    else {
        console.error("[API Error] table", responseTable.error);
    }
    let casinoCode = null;
    let casinoRecord = null;
    const responseCasino = yield HEALTH_CHECK.queryEndpoint("/api/v1/casino?q=1");
    if (responseCasino.success) {
        try {
            const parsed = JSON.parse(responseCasino.data);
            if (Array.isArray(parsed) && parsed.length > 0) {
                casinoRecord = parsed[0];
                if (parsed.length > 1) {
                    const sorted = [...parsed].sort((a, b) => { var _a, _b; return ((_a = b.id) !== null && _a !== void 0 ? _a : 0) - ((_b = a.id) !== null && _b !== void 0 ? _b : 0); });
                    casinoRecord = sorted[0];
                }
            }
            else if (parsed && typeof parsed === "object" && parsed.casinoCode) {
                casinoRecord = parsed;
            }
            if (casinoRecord === null || casinoRecord === void 0 ? void 0 : casinoRecord.casinoCode) {
                casinoCode = String(casinoRecord.casinoCode);
                casinoConf = JSON.stringify(casinoRecord);
                currentCasinoCode = casinoCode;
                recreateCasinoMqttIfNeeded(casinoRecord);
            }
            else {
                console.warn("\x1b[41m[WARN] Casino_table vacía o sin casinoCode — no se publicará a casino este ciclo. Cargar via POST /api/v1/casino\x1b[0m");
            }
        }
        catch (e) {
            console.error("[Casino Parse Error]", e, (_a = responseCasino.data) === null || _a === void 0 ? void 0 : _a.slice(0, 200));
        }
    }
    else {
        console.warn(`\x1b[41m[WARN] No se pudo obtener casino de DB local: ${responseCasino.error} — status ${responseCasino.statusCode}\x1b[0m`);
        console.warn("Verificar que sts-api tenga al menos 1 fila en Casino_table (POST /api/v1/casino)");
    }
    tableStatus = LOCAL_PUBLISHER.getTableStatus();
    if (!casinoCode) {
        console.warn("[SKIP] Sin casinoCode no se publica a broker único (evita colisión). tableNumber:", tableStatus === null || tableStatus === void 0 ? void 0 : tableStatus.tableNumber);
        return;
    }
    let tableNumber;
    try {
        tableNumber = String(JSON.parse(tableConf).tableNumber);
    }
    catch (_c) {
        tableNumber = String((_b = tableStatus === null || tableStatus === void 0 ? void 0 : tableStatus.tableNumber) !== null && _b !== void 0 ? _b : "0");
    }
    let enrichedTableStatus;
    try {
        enrichedTableStatus = Object.assign(Object.assign({}, tableStatus), { casinoCode, tableNumber });
    }
    catch (_d) {
        enrichedTableStatus = Object.assign({ casinoCode, tableNumber }, tableStatus);
    }
    let enrichedGamePayload;
    try {
        const gameObj = JSON.parse(firstGamePayload);
        enrichedGamePayload = JSON.stringify(Object.assign(Object.assign({}, gameObj), { casinoCode, tableNumber: Number(tableNumber) }));
    }
    catch (_e) {
        enrichedGamePayload = firstGamePayload;
    }
    CASINO_PUBLISHER.publishMqtt({
        topic: `STS-MESAS/${casinoCode}/statusTableServices/${tableNumber}`,
        payload: JSON.stringify(enrichedTableStatus),
        qos: 1,
        retain: false,
    });
    CASINO_PUBLISHER.publishMqtt({
        topic: `STS-MESAS/${casinoCode}/game/${tableNumber}`,
        payload: enrichedGamePayload,
        qos: 1,
        retain: false,
    });
    (() => __awaiter(void 0, void 0, void 0, function* () {
        if (CASINO_PUBLISHER.requestSync === 1) {
            const response = yield HEALTH_CHECK.queryEndpoint("/api/v1/game?q=2000");
            if (response.success) {
                gamesWinning = response.data;
                let syncPayload = gamesWinning;
                try {
                    const games = JSON.parse(gamesWinning);
                    if (Array.isArray(games)) {
                        const enriched = games.map((g) => (Object.assign(Object.assign({}, g), { casinoCode, tableNumber: Number(tableNumber) })));
                        syncPayload = JSON.stringify(enriched);
                    }
                }
                catch (_a) { }
                CASINO_PUBLISHER.publishMqtt({
                    topic: `STS-MESAS/${casinoCode}/GameSync/${tableNumber}`,
                    payload: syncPayload,
                    qos: 1,
                    retain: false,
                });
            }
            else {
                console.error("[API Error] game sync", response.error);
            }
            CASINO_PUBLISHER.requestSync = 0;
        }
    }))();
}), 3000);
