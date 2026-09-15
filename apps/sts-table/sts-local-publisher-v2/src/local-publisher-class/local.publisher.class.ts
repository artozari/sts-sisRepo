import { MqttRxObservableInterface, MqttSubscribeObservableInterface, MqttTxObservableInterface } from "@slcn-pkg/mqtt-client-observable-class";
import { LocalPublisherConfigInterface } from "./interfaces/local.publisher.config.interface";

interface TableGeneralStatusInterface {
    general: boolean;
    hardware: {
        status: boolean;
        deltaTime: number;
        lastTime?: number;
    };
    signboard: {
        status: boolean;
        deltaTime: number;
        lastTime?: number;
    };
    wheel: {
        status: boolean;
        deltaTime: number;
        lastTime?: number;
    };
    tableNumber: string;
}

export class LocalPublisherClass {
    private readonly STATUS_TIMEOUT = 5000; //ms
    tableStatus: TableGeneralStatusInterface = {
        general: false,
        hardware: {
            status: false,
            deltaTime: 0,
        },
        signboard: {
            status: false,
            deltaTime: 0,
        },
        wheel: {
            status: false,
            deltaTime: 0,
        },
        tableNumber: "0",
    };

    constructor(private readonly _config: LocalPublisherConfigInterface) {
        // Inicializar variables
        // this.tableStatus;
        // Subscribe to MQTT
        const subsTopic: MqttSubscribeObservableInterface = {
            topic: `sts/#`,
            qos: 0,
        };

        _config.subject.subscribe$.next(subsTopic);

        // El bloque de código procesa los mensajes MQTT recibidos.
        _config.subject.rx$.subscribe({
            next: (v: MqttRxObservableInterface) => {
                try {
                    this.procMqtt(v);
                } catch (error) {
                    console.error(error);
                }
            },
            error: (error: unknown) => {
                console.error(error);
            },
        });

        // Evaluar periódicamente si algún dispositivo supera el timeout
        // setInterval(() => {
        //     this.publishMqtt({
        //         topic: "STS-ENVIAR-A-SALA/statusTableServices-" + this.tableStatus.tableNumber + 5,
        //         payload: JSON.stringify(this.tableStatus),
        //         qos: 0,
        //         retain: false,
        //     });
        //     console.log(this.tableStatus);
        // }, this.STATUS_TIMEOUT);
    }

    private readonly procMqtt = (p_v: MqttRxObservableInterface) => {
        const topicSegments = Array.isArray(p_v.topic) ? p_v.topic : String(p_v.topic).split("/");

        if (topicSegments[0].toLowerCase() === "sts") {
            switch (topicSegments[1]) {
                case "Hardware":
                    this.updateDeviceStatus("hardware", p_v.payload);
                    break;
                case "SignBoard":
                    this.updateDeviceStatus("signboard", p_v.payload);
                    if (JSON.parse(String(p_v.payload))?.tableNumber) {
                        this.tableStatus.tableNumber = String(JSON.parse(String(p_v.payload)).tableNumber);
                    }

                    break;
                case "wheel":
                    this.updateDeviceStatus("wheel", p_v.payload);
                    break;
            }
        }
    };

    private readonly updateDeviceStatus = (device: "hardware" | "signboard" | "wheel", payload: unknown) => {
        try {
            const now = Date.now();
            const deviceStatus = this.tableStatus[device];
            const last = deviceStatus.lastTime ?? now;
            deviceStatus.deltaTime = now - last;
            deviceStatus.lastTime = now;
            deviceStatus.status = true;

            // Re-evaluate overall statuses after an update
            this.evaluateDeviceStatuses();
        } catch (error) {
            console.warn("Payload no es JSON:", payload, error);
        }
    };

    private readonly evaluateDeviceStatuses = () => {
        const { hardware, signboard, wheel } = this.tableStatus;

        // Si el deltaTime es mayor o igual al timeout, marcar como false
        if (hardware.deltaTime >= this.STATUS_TIMEOUT) hardware.status = false;
        if (signboard.deltaTime >= this.STATUS_TIMEOUT) signboard.status = false;
        if (wheel.deltaTime >= this.STATUS_TIMEOUT) wheel.status = false;

        // Si cualquiera es false, general = false; si todos true, general = true
        this.tableStatus.general = !!(hardware.status && signboard.status && wheel.status);
    };

    // Publicar en MQTT
    private readonly publishMqtt = (p_dataTx: MqttTxObservableInterface) => {
        try {
            this._config.subject.tx$.next(p_dataTx);
        } catch (error) {
            console.error(error);
        }
    };

    public getTableStatus() {
        this.evaluateDeviceStatuses();
        return this.tableStatus;
    }

    public readonly start = () => {
        console.info("Local Publisher Started");
    };
}
