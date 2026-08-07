import { EffectsLedLightsEnum } from "../enums";
import { StsSemaphoreEnum } from "../enums/sts.semaphore.enum";
export interface StsHardwareMqttTx {
    time: number;
    keyType: number;
    key: string;
    semaphore: StsSemaphoreEnum;
    semaphoreIntensity: number;
    semaphoreLights: number;
    colorOfLights: EffectsLedLightsEnum;
    lightsIntensity: number;
    SevenSegmentDisplay: number;
}
//# sourceMappingURL=sts.hardware.mqtt.tx.d.ts.map