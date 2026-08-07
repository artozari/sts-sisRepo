import { MqttSubscribeObservableInterface, MqttTxObservableInterface, MqttRxObservableInterface } from "@slcn-pkg/mqtt-client-observable-class";
import { CasinoPublisherConfigInterface } from "./interfaces/Casino.publisher.config.interface";

export class CasinoPublisherClass {
    requestSync = 0;
    constructor(private readonly _config: CasinoPublisherConfigInterface) {
        // Subscribe to MQTT
        const subsTopic: MqttSubscribeObservableInterface = {
            topic: `STS-MESAS/STS-Casino/GameSync/8`,
            qos: 0,
        };
        _config.subject.subscribe$.next(subsTopic);

        // El bloque de código procesa los mensajes MQTT recibidos.
        _config.subject.rx$.subscribe({
            next: (v: MqttRxObservableInterface) => {
                //--> Aquí se procesa el mensaje MQTT recibido. Se extrae el último segmento del topic para verificar si es un número, lo que indicaría una solicitud de sincronización.
                const topicString = Array.isArray(v.topic) ? v.topic.join("/") : v.topic;
                const parts = topicString.split("/");
                const last = parts[parts.length - 1];
                if (typeof last === "string") {
                    //--> Verifica que el último segmento del topic sea una cadena de texto antes de procesarlo.
                    try {
                        console.log(last);
                        if (/^\d+$/.test(last)) {
                            this.requestSync = 1;
                        }
                    } catch (error) {
                        console.error(error, "Error processing MQTT message");
                    }
                }
            },
            error: (error: unknown) => {
                console.error(error);
            },
        });
    }

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
            console.log("\x1b[36;47;1m " + payload.toString() + " \x1b[0m");
        } catch (error) {
            console.error("Error pushing games to casino:", error);
        }
    }
}
