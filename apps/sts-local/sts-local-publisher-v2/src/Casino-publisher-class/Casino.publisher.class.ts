import { MqttTxObservableInterface, MqttRxObservableInterface, MqttSubscribeObservableInterface } from "@slcn-pkg/mqtt-client-observable-class";
import { CasinoPublisherConfigInterface } from "./interfaces/Casino.publisher.config.interface";

export class CasinoPublisherClass {
    requestSync = 0;
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
                        this.requestSync = 1;
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
