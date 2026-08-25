import { ColorsLightsEnum } from "../../interfaces/enums/colors.lights.enum";

export interface HardwareValidatorInterface {
  id: string;
  colorOfLights: ColorsLightsEnum;
  lightsIntensity: number;
  semaphoreIntensity: number;
  tableNumber: number;
}
