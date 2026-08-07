import { IsDefined, IsEnum, IsNumber, IsString, Min, Max } from "class-validator";
import { HardwareValidatorInterface } from "../interfaces/hardware.validator.interface";
import { ColorsLightsEnum } from "../../interfaces/enums/colors.lights.enum";

export class HardwareValidatorClass implements HardwareValidatorInterface {
  @IsDefined()
  @IsString()
  id: string;

  @IsEnum(ColorsLightsEnum)
  colorOfLights: ColorsLightsEnum;

  @IsNumber()
  @Min(1)
  @Max(10)
  lightsIntensity: number;

  @IsNumber()
  @Min(1)
  @Max(10)
  semaphoreIntensity: number;

  @IsNumber()
  @Min(1)
  @Max(100)
  tableNumber: number;

  // constructor(p_mqtt: MqttValidatorClass) {
  constructor(p_data: HardwareValidatorInterface) {
    this.id = p_data.id;
    this.colorOfLights = p_data.colorOfLights;
    this.lightsIntensity = p_data.lightsIntensity;
    this.semaphoreIntensity = p_data.semaphoreIntensity;
    this.tableNumber = p_data.tableNumber;
  }
}
