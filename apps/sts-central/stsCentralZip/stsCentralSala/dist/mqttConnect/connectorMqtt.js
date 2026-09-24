"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = exports.casinoClients = exports.topicSrvGame = exports.topicSrvConfig = exports.topicCliGameSync = exports.topicCliConfig = exports.topicCliGame = void 0;
exports.getCasinoClient = getCasinoClient;
require("dotenv/config");
const mqtt_1 = __importDefault(require("mqtt"));
exports.topicCliGame = process.env.MQTT_TOPIC_GAME ?? "STS-MESAS/game/#";
exports.topicCliConfig = process.env.MQTT_TOPIC_CONFIG ?? "SimuSts/STS-Casino/Cli/Config/#";
exports.topicCliGameSync = process.env.MQTT_TOPIC_GAME_SYNC_SUB ?? "STS-MESAS/GameSync/#";
exports.topicSrvConfig = process.env.MQTT_TOPIC_CONFIG_SRV ?? "SimuSts/STS-Casino/Srv/Config";
exports.topicSrvGame = process.env.MQTT_TOPIC_GAME_SYNC ?? "STS-MESAS/STS-Casino/GameSync/";
function parseCasinos() {
    const raw = process.env.MQTT_CASINOS;
    if (!raw || raw.trim() === "") {
        throw new Error("MQTT_CASINOS no está definido en el .env. Configurá un JSON con la lista de casinos (casinoCode, url, username, password).");
    }
    let parsed;
    try {
        parsed = JSON.parse(raw);
    }
    catch (err) {
        throw new Error(`MQTT_CASINOS no es un JSON válido: ${err.message}`);
    }
    if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error("MQTT_CASINOS debe ser un array no vacío.");
    }
    return parsed;
}
function connectCasino(casino, topics) {
    const client = mqtt_1.default.connect(casino.url, {
        clientId: `sts-central-${casino.casinoCode}-${Math.random().toString(16).slice(2, 10)}`,
        clean: true,
        connectTimeout: 4000,
        username: casino.username ?? process.env.MQTT_USERNAME,
        password: casino.password ?? process.env.MQTT_PASSWORD,
        reconnectPeriod: 1000,
    });
    client.on("connect", () => {
        console.log(`Conectado al broker MQTT del casino ${casino.casinoCode}:`, casino.url);
        client.subscribe(topics, { qos: 1 }, (err) => {
            if (err) {
                console.error(`Error al suscribirse (casino ${casino.casinoCode}):`, err);
            }
            else {
                console.log(`Suscrito (casino ${casino.casinoCode}) a:`, topics.join(", "));
            }
        });
    });
    client.on("error", (err) => {
        console.error(`Error en el cliente MQTT del casino ${casino.casinoCode} (${casino.url}):`, err);
    });
    return client;
}
const casinos = parseCasinos();
const topicsToSubscribe = [exports.topicCliGame, exports.topicCliConfig, exports.topicCliGameSync];
exports.casinoClients = casinos.map((casino) => ({
    casinoCode: casino.casinoCode,
    client: connectCasino(casino, topicsToSubscribe),
    mqttBrokerUrl: casino.url,
    topicCliGame: exports.topicCliGame,
    topicCliConfig: exports.topicCliConfig,
    topicCliGameSync: exports.topicCliGameSync,
    topicSrvConfig: exports.topicSrvConfig,
    topicSrvGame: exports.topicSrvGame,
}));
function getCasinoClient(casinoCode) {
    return exports.casinoClients.find((c) => c.casinoCode === casinoCode);
}
// Backward compatibility: primer casino como cliente por defecto (legacy).
exports.client = exports.casinoClients[0]?.client;
