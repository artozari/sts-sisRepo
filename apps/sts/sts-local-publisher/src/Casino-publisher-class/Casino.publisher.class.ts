import { MqttTxObservableInterface, MqttRxObservableInterface, MqttSubscribeObservableInterface } from "@slcn-pkg/mqtt-client-observable-class";
import { CasinoPublisherConfigInterface } from "./interfaces/Casino.publisher.config.interface";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";

const envCandidates = [path.resolve(process.cwd(), ".env"), path.resolve(__dirname, "..", ".env"), path.resolve(__dirname, ".env")];

for (const envPath of envCandidates) {
    if (fs.existsSync(envPath)) {
        dotenv.config({ path: envPath });
        break;
    }
}

export class CasinoPublisherClass {
    requestSync = 0;
    constructor(private readonly _config: CasinoPublisherConfigInterface) {
        const subsTopic: MqttSubscribeObservableInterface = {
            topic: `STS-MESAS/STS-Casino/GameSync/` + process.env.NUMERO_MAQUNA,
            qos: 0,
        };
        _config.subject.subscribe$.next(subsTopic);

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
            console.log("\x1b[36;47;1m " + payload.toString() + " \x1b[0m");
        } catch (error) {
            console.error("Error pushing games to casino:", error);
        }
    }
}
