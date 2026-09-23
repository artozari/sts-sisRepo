"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CasinoPublisherClass = void 0;
class CasinoPublisherClass {
    constructor(_config) {
        this._config = _config;
        this.requestSync = 0;
        this.pendingSync = null;
        this.extractLastRegistered = (payload) => {
            var _a, _b, _c, _d;
            try {
                let obj = payload;
                if (typeof payload === "string") {
                    if (payload.trim() === "")
                        return null;
                    obj = JSON.parse(payload);
                }
                else if (payload instanceof Uint8Array) {
                    const GlobalBuffer = globalThis.Buffer;
                    let str;
                    if (GlobalBuffer && typeof GlobalBuffer.from === "function") {
                        str = GlobalBuffer.from(payload).toString("utf8");
                    }
                    else {
                        str = String(payload);
                    }
                    if (str.trim() === "")
                        return null;
                    obj = JSON.parse(str);
                }
                else if (obj !== null && typeof obj === "object") {
                }
                else {
                    return null;
                }
                if (obj === null || typeof obj !== "object")
                    return null;
                const raw = (_d = (_c = (_b = (_a = obj.last_game_registered) !== null && _a !== void 0 ? _a : obj.lastGameRegistered) !== null && _b !== void 0 ? _b : obj.last_game) !== null && _c !== void 0 ? _c : obj.lastGame) !== null && _d !== void 0 ? _d : obj.from;
                const n = Number(raw);
                if (!Number.isFinite(n) || n < 0)
                    return null;
                return Math.floor(n);
            }
            catch (_e) {
                return null;
            }
        };
        this.clearSync = () => {
            this.pendingSync = null;
            this.requestSync = 0;
        };
        this.ensureGameSyncSubscriptions = () => {
            const topics = [
                { topic: `STS-MESAS/+/STS-Casino/GameSync/#`, qos: 0 },
                { topic: `STS-MESAS/STS-Casino/GameSync/#`, qos: 0 },
            ];
            for (const t of topics) {
                this._config.subject.subscribe$.next(t);
            }
            console.log("[GameSync] Re-suscripción tras reconfiguración MQTT casino.");
        };
        this.publishMqtt = (p_dataTx) => {
            try {
                this._config.subject.tx$.next(p_dataTx);
            }
            catch (error) {
                console.error(error);
            }
        };
        this.start = () => {
            console.info("Casino Publisher Started");
        };
        const topics = [
            { topic: `STS-MESAS/+/STS-Casino/GameSync/#`, qos: 0 },
            { topic: `STS-MESAS/STS-Casino/GameSync/#`, qos: 0 },
        ];
        for (const t of topics) {
            _config.subject.subscribe$.next(t);
        }
        _config.subject.rx$.subscribe({
            next: (v) => {
                try {
                    const topicString = Array.isArray(v.topic) ? v.topic.join("/") : v.topic;
                    const parts = topicString.split("/");
                    const last = parts[parts.length - 1];
                    console.log(last);
                    if (/^\d+$/.test(last)) {
                        const from = this.extractLastRegistered(v.payload);
                        if (from === null) {
                            console.warn(`[GameSync] Solicitud ignorada en ${topicString}: payload sin last_game_registered válido. No se enviará nada.`);
                            return;
                        }
                        const tableNumber = last;
                        if (this.pendingSync) {
                            this.pendingSync = {
                                tableNumber,
                                from: Math.min(this.pendingSync.from, from),
                                receivedAt: Date.now(),
                            };
                        }
                        else {
                            this.pendingSync = { tableNumber, from, receivedAt: Date.now() };
                        }
                        this.requestSync = 1;
                        console.log(`[GameSync] Solicitud mesa ${tableNumber} desde last_game_registered=${from}`);
                    }
                }
                catch (error) {
                    console.error(error);
                }
            },
            error: (error) => {
                console.error(error);
            },
        });
    }
    pushGamesToCasino(payload) {
        try {
            console.log("\x1b[36;47;1m Envio de pyload \x1b[0m");
        }
        catch (error) {
            console.error("Error pushing games to casino:", error);
        }
    }
}
exports.CasinoPublisherClass = CasinoPublisherClass;
