
export interface StsHardwareMqttRx {
    time: number;
    keyType: number;    // Dallas
    key: string;
    keyCrc: number;
    device: string;
    state: number;
    k0: boolean;
    k1: boolean;
    k2: boolean;
    k3: boolean;
    accX: number;
    accY: number;
    accZ: number;
    error: number;
}

