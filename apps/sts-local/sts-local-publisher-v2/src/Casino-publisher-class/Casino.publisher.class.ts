import { MqttTxObservableInterface, MqttRxObservableInterface, MqttSubscribeObservableInterface } from "@slcn-pkg/mqtt-client-observable-class";
import { CasinoPublisherConfigInterface } from "./interfaces/Casino.publisher.config.interface";

export interface PendingSyncRequest {
    tableNumber: string;
    from: number;
    receivedAt: number;
}

export class CasinoPublisherClass {
    requestSync = 0;
    pendingSync: PendingSyncRequest | null = null;
    constructor(private readonly _config: CasinoPublisherConfigInterface) {
        // V2: suscripción wildcard por casinoCode para broker único
        // Central publicará en STS-MESAS/{casinoCode}/STS-Casino/GameSync/{tableNumber}
        // Nos suscribimos a todas las variantes (con y sin casinoCode) para compatibilidad
        const topics: MqttSubscribeObservableInterface[] = [
            { topic: `STS-MESAS/+/STS-Casino/GameSync/#`, qos: 0 },
            { topic: `STS-MESAS/STS-Casino/GameSync/#`, qos: 0 },
        ];
        for (const t of topics) {
            _config.subject.subscribe$.next(t);
        }

        // El bloque de código procesa los mensajes MQTT recibidos.
        _config.subject.rx$.subscribe({
            next: (v: MqttRxObservableInterface) => {
                try {
                    // suscribe a cualquier mensaje de gameSync con número de mesa al final
                    // ejemplo: STS-MESAS/STS-Casino/gameSync/123
                    // descartamos el caracter especial '#' porque no es un número

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
                        } else {
                            this.pendingSync = { tableNumber, from, receivedAt: Date.now() };
                        }
                        this.requestSync = 1;
                        console.log(`[GameSync] Solicitud mesa ${tableNumber} desde last_game_registered=${from}`);
                    }
                } catch (error) {
                    console.error(error);
                }
            },
            error: (error: unknown) => {
                console.error(error);
            },
        });
    }

    private readonly extractLastRegistered = (payload: unknown): number | null => {
        try {
            let obj: any = payload;
            if (typeof payload === "string") {
                if (payload.trim() === "") return null;
                obj = JSON.parse(payload);
            } else if (payload instanceof Uint8Array) {
                const GlobalBuffer = (globalThis as any).Buffer;
                let str: string;
                if (GlobalBuffer && typeof GlobalBuffer.from === "function") {
                    str = GlobalBuffer.from(payload as any).toString("utf8");
                } else {
                    str = String(payload);
                }
                if (str.trim() === "") return null;
                obj = JSON.parse(str);
            } else if (obj !== null && typeof obj === "object") {
                // objeto ya parseado (p.ej. desde el observable)
            } else {
                return null;
            }
            if (obj === null || typeof obj !== "object") return null;
            const raw = obj.last_game_registered ?? obj.lastGameRegistered ?? obj.last_game ?? obj.lastGame ?? obj.from;
            const n = Number(raw);
            if (!Number.isFinite(n) || n < 0) return null;
            return Math.floor(n);
        } catch {
            return null;
        }
    };

    public readonly clearSync = () => {
        this.pendingSync = null;
        this.requestSync = 0;
    };

    public readonly ensureGameSyncSubscriptions = () => {
        const topics: MqttSubscribeObservableInterface[] = [
            { topic: `STS-MESAS/+/STS-Casino/GameSync/#`, qos: 0 },
            { topic: `STS-MESAS/STS-Casino/GameSync/#`, qos: 0 },
        ];
        for (const t of topics) {
            this._config.subject.subscribe$.next(t);
        }
        console.log("[GameSync] Re-suscripción tras reconfiguración MQTT casino.");
    };

    // Publicar en MQTT
    public readonly publishMqtt = (p_dataTx: MqttTxObservableInterface) => {
        try {
            this._config.subject.tx$.next(p_dataTx);
        } catch (error) {
            console.error(error);
        }
    };

    public readonly start = () => {
        console.info("Casino Publisher Started");
    };

    public pushGamesToCasino(payload: string) {
        try {
            console.log("\x1b[36;47;1m Envio de pyload \x1b[0m");
        } catch (error) {
            console.error("Error pushing games to casino:", error);
        }
    }
}
