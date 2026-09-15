import { ConfigClass } from "./config/config.class";
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

console.log("\x1b[44m\x1b[30m\x1b[1m\x1b[3mIniciando STS Local Publisher V2 (casinoCode desde DB)!!!\x1b[0m");

// ===== MQTT LOCAL (sala) — via ConfigClass / archivo + .env fallback =====
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

// ===== MQTT CASINO (remoto) — placeholders, se reconfigura con DB =====
const subjectCasino: MqttObservableClass = new MqttObservableClass();

// Config inicial fallback por si DB no responde al arrancar (env)
import { ConfigCasinoClass } from "./config/configCasino.class";
const CONFIGCASINO_FALLBACK: ConfigCasinoClass = new ConfigCasinoClass();
let currentCasinoMqttConfig: MqttClientConfigInterface = {
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

let MQTT_CASINO: MqttClientClass = new MqttClientClass(currentCasinoMqttConfig, null);
MQTT_CASINO.start();

const CASINO_PUBLISHER: CasinoPublisherClass = new CasinoPublisherClass({
    subject: subjectCasino,
});
CASINO_PUBLISHER.start();

// ===== API local — bootstrap via .env o localhost =====
const apiUrl = process.env.API_URL ?? "http://127.0.0.1:8023";
const HEALTH_CHECK = new ApiCheckClass({
    baseUrl: apiUrl,
    path: "/api/v1/game",
    interval: 10000,
    timeout: 10000,
});
HEALTH_CHECK.start();

let gamesWinning: string;
let tableStatus: any;
let tableConf: string;
let casinoConf: string;
let currentCasinoCode: string | null = null;
let mainInterval: NodeJS.Timeout | null = null;
let isShuttingDown = false;
let isMainLoopRunning = false;

const recreateCasinoMqttIfNeeded = (casinoRecord: any) => {
    try {
        // Campos en Casino_table: mqtt_url, mqtt_port, mqtt_protocol, mqtt_user, mqtt_password, mqtt_tls
        const urlMqtt = casinoRecord.mqtt_url ?? casinoRecord.mqttUrl ?? currentCasinoMqttConfig.urlMqtt;
        const portMqtt = String(casinoRecord.mqtt_port ?? casinoRecord.mqttPort ?? currentCasinoMqttConfig.portMqtt);
        const protocol = casinoRecord.mqtt_protocol ?? casinoRecord.mqttProtocol ?? currentCasinoMqttConfig.protocol;
        const username = casinoRecord.mqtt_user ?? casinoRecord.mqttUser ?? currentCasinoMqttConfig.username;
        const password = casinoRecord.mqtt_password ?? casinoRecord.mqttPassword ?? currentCasinoMqttConfig.password;

        const changed =
            urlMqtt !== currentCasinoMqttConfig.urlMqtt ||
            portMqtt !== currentCasinoMqttConfig.portMqtt ||
            protocol !== currentCasinoMqttConfig.protocol ||
            username !== currentCasinoMqttConfig.username ||
            password !== currentCasinoMqttConfig.password;

        if (!changed) return;

        console.log(`\x1b[43m\x1b[30m[MQTT Casino] Reconfigurando broker desde DB: ${urlMqtt}:${portMqtt} (${protocol}) casino=${casinoRecord.casinoCode}\x1b[0m`);

        try {
            MQTT_CASINO.close();
        } catch (e) {
            console.error("Error cerrando MQTT casino previo:", e);
        }

        currentCasinoMqttConfig = {
            name: casinoRecord.casinoCode ?? currentCasinoMqttConfig.name,
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
        MQTT_CASINO = new MqttClientClass(currentCasinoMqttConfig, null);
        MQTT_CASINO.start();
        // El nuevo cliente debe re-suscribirse: Subject es sin replay y la suscripción original
        // se emitió solo en el constructor de CasinoPublisherClass.
        try {
            CASINO_PUBLISHER.ensureGameSyncSubscriptions();
        } catch (e) {
            console.error("[MQTT Casino] Error re-suscribiendo GameSync:", e);
        }
    } catch (e) {
        console.error("[MQTT Casino] Error al reconfigurar desde DB:", e);
    }
};

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
    if (isMainLoopRunning) {
        console.warn("[WARN] Ciclo principal solapado omitido (API lenta >3s). Evita 3/s y juegos duplicados.");
        return;
    }
    isMainLoopRunning = true;
    try {
        const response = await HEALTH_CHECK.queryEndpoint("/api/v1/game?q=1");
    if (response.success) {
        gamesWinning = response.data;
    } else {
        console.error("[API Error] game", response.error);
    }

    let firstGamePayload = gamesWinning;
    try {
        const games = JSON.parse(gamesWinning);
        if (Array.isArray(games) && games.length > 0) {
            firstGamePayload = JSON.stringify(games[0]);
        }
    } catch (e) {
        console.error(e);
    }

    const responseTable = await HEALTH_CHECK.queryEndpoint("/api/v1/table/1");
    if (responseTable.success) {
        tableConf = responseTable.data;
    } else {
        console.error("[API Error] table", responseTable.error);
    }

    // ===== Obtener casinoCode y broker desde DB local (único o último) =====
    let casinoCode: string | null = null;
    let casinoRecord: any = null;
    const responseCasino = await HEALTH_CHECK.queryEndpoint("/api/v1/casino?q=1");
    if (responseCasino.success) {
        try {
            const parsed = JSON.parse(responseCasino.data);
            if (Array.isArray(parsed) && parsed.length > 0) {
                // q=1 ya ordena por id desc → último; si viniera sin q, tomamos el de mayor id
                casinoRecord = parsed[0];
                if (parsed.length > 1) {
                    // ordenar por id desc por si acaso
                    const sorted = [...parsed].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
                    casinoRecord = sorted[0];
                }
            } else if (parsed && typeof parsed === "object" && parsed.casinoCode) {
                casinoRecord = parsed;
            }
            if (casinoRecord?.casinoCode) {
                casinoCode = String(casinoRecord.casinoCode);
                casinoConf = JSON.stringify(casinoRecord);
                currentCasinoCode = casinoCode;
                recreateCasinoMqttIfNeeded(casinoRecord);
            } else {
                console.warn("\x1b[41m[WARN] Casino_table vacía o sin casinoCode — no se publicará a casino este ciclo. Cargar via POST /api/v1/casino\x1b[0m");
            }
        } catch (e) {
            console.error("[Casino Parse Error]", e, responseCasino.data?.slice(0, 200));
        }
    } else {
        console.warn(`\x1b[41m[WARN] No se pudo obtener casino de DB local: ${responseCasino.error} — status ${responseCasino.statusCode}\x1b[0m`);
        console.warn("Verificar que sts-api tenga al menos 1 fila en Casino_table (POST /api/v1/casino)");
    }

    tableStatus = LOCAL_PUBLISHER.getTableStatus();

    // Validar que tenemos casinoCode antes de publicar a un solo broker
    if (!casinoCode) {
        console.warn("[SKIP] Sin casinoCode no se publica a broker único (evita colisión). tableNumber:", tableStatus?.tableNumber);
        return;
    }

    let tableNumber: string;
    try {
        tableNumber = String(JSON.parse(tableConf!).tableNumber);
    } catch {
        tableNumber = String(tableStatus?.tableNumber ?? "0");
    }

    // Enriquecer payloads con casinoCode
    let enrichedTableStatus: any;
    try {
        enrichedTableStatus = { ...tableStatus, casinoCode, tableNumber };
    } catch {
        enrichedTableStatus = { casinoCode, tableNumber, ...tableStatus };
    }

    let enrichedGamePayload: string;
    try {
        const gameObj = JSON.parse(firstGamePayload);
        enrichedGamePayload = JSON.stringify({ ...gameObj, casinoCode, tableNumber: Number(tableNumber) });
    } catch {
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

    (async () => {
        const SYNC_BASE_Q = 2000;
        const SYNC_MAX_Q = 10000;
        const SYNC_CHUNK = 500;
        const pending = CASINO_PUBLISHER.pendingSync;
        if (!pending) {
            if ((CASINO_PUBLISHER as any).requestSync === 1) {
                // Solicitud legacy sin payload válido: no enviar nada por decisión explícita
                console.warn("[GameSync] requestSync legacy sin last_game_registered: se ignora, no se envía nada.");
                CASINO_PUBLISHER.clearSync();
            }
            return;
        }
        if (pending.tableNumber !== String(tableNumber)) {
            console.warn(`[GameSync] Mesa solicitada ${pending.tableNumber} difiere de mesa local ${tableNumber}. Se responde con datos locales.`);
        }
        const from = pending.from;
        try {
            let response = await HEALTH_CHECK.queryEndpoint(`/api/v1/game?q=${SYNC_BASE_Q}`);
            if (!response.success) {
                console.error("[API Error] game sync", response.error);
                return; // conservar pendingSync para reintentar en el próximo ciclo
            }
            let games: any[] = [];
            try {
                const parsed = JSON.parse(response.data);
                if (Array.isArray(parsed)) games = parsed;
            } catch {}
            if (games.length === 0) {
                console.warn(`[GameSync] Sin juegos en API local para mesa ${tableNumber}. Nada que enviar.`);
                CASINO_PUBLISHER.clearSync();
                return;
            }
            // Si el lote vino truncado (q completo) y el mínimo aún es mayor que from+1,
            // re-pedir con un q mayor para cubrir todo el hueco (hasta SYNC_MAX_Q)
            const minInBatch = Math.min(...games.map((g: any) => Number(g.gameNumber)).filter((n: number) => Number.isFinite(n)));
            const maxLocal = Math.max(...games.map((g: any) => Number(g.gameNumber)).filter((n: number) => Number.isFinite(n)));
            const need = Number.isFinite(maxLocal) ? maxLocal - from : 0;
            if (need > games.length && games.length >= SYNC_BASE_Q && Number.isFinite(minInBatch) && minInBatch > from + 1) {
                const biggerQ = Math.min(Math.max(need, SYNC_BASE_Q), SYNC_MAX_Q);
                if (biggerQ > SYNC_BASE_Q) {
                    console.log(`[GameSync] Hueco ${need} > lote base. Re-consultando con q=${biggerQ}.`);
                    const response2 = await HEALTH_CHECK.queryEndpoint(`/api/v1/game?q=${biggerQ}`);
                    if (response2.success) {
                        try {
                            const parsed2 = JSON.parse(response2.data);
                            if (Array.isArray(parsed2) && parsed2.length > 0) {
                                games = parsed2;
                                gamesWinning = response2.data;
                            }
                        } catch {}
                    } else {
                        console.error("[API Error] game sync (ampliado)", response2.error);
                    }
                }
                if (need > SYNC_MAX_Q) {
                    console.warn(`[GameSync] Faltan ${need} > max q=${SYNC_MAX_Q}. Se envían las ${SYNC_MAX_Q} más recientes en chunks; central re-pedirá el resto.`);
                }
            } else {
                gamesWinning = response.data;
            }
            // Solo faltantes, orden asc: la que sigue a `from` primero
            const missing = games
                .filter((g: any) => Number.isFinite(Number(g?.gameNumber)) && Number(g.gameNumber) > from)
                .sort((a: any, b: any) => Number(a.gameNumber) - Number(b.gameNumber));
            if (missing.length === 0) {
                console.log(`[GameSync] Sin faltantes: from=${from}, maxLocal=${Number.isFinite(maxLocal) ? maxLocal : "?"} . Nada que enviar.`);
                CASINO_PUBLISHER.clearSync();
                return;
            }
            const enrichedAll = missing.map((g: any) => ({ ...g, casinoCode, tableNumber: Number(tableNumber) }));
            console.log(`[GameSync] Enviando ${enrichedAll.length} jugadas faltantes (from=${from}, ${enrichedAll[0].gameNumber}..${enrichedAll[enrichedAll.length - 1].gameNumber}) en chunks de ${SYNC_CHUNK}.`);
            for (let i = 0; i < enrichedAll.length; i += SYNC_CHUNK) {
                const chunk = enrichedAll.slice(i, i + SYNC_CHUNK);
                CASINO_PUBLISHER.publishMqtt({
                    topic: `STS-MESAS/${casinoCode}/GameSync/${tableNumber}`,
                    payload: JSON.stringify(chunk),
                    qos: 1,
                    retain: false,
                });
                if (enrichedAll.length > SYNC_CHUNK) {
                    console.log(`[GameSync] Chunk ${i / SYNC_CHUNK + 1}/${Math.ceil(enrichedAll.length / SYNC_CHUNK)}: ${chunk.length} jugadas (${chunk[0].gameNumber}..${chunk[chunk.length - 1].gameNumber}).`);
                }
            }
            CASINO_PUBLISHER.clearSync();
        } catch (e) {
            console.error("[GameSync] Error inesperado:", e);
            // conservar pendingSync para reintentar
        }
    })();
    } finally {
        isMainLoopRunning = false;
    }
}, 3000);
