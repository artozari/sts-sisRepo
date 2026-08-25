import { MqttObservableClass } from "@slcn-pkg/mqtt-client-observable-class";


export interface TscWheelConfigInterface {
    port: string;
    baudRate: 4800 | 9600 | 19200 | 38400 | 57600 | 115200 | 230400;
    dataBits: 5 | 6 | 7 | 8;
    stopBits: 1 | 1.5 | 2;
    parity: "none" | "even" | "odd" | "mark" | "space";
    timeout: number;
    mqttSubject: MqttObservableClass;
    serviceId: string | null;
}