import { IsDefined, IsString } from "class-validator";
import { WheelValidatorInterface } from "../interfaces/wheel.validator.interface";

export class WheelValidatorClass implements WheelValidatorInterface {
  @IsDefined()
  @IsString()
  id: string;


  // constructor(p_mqtt: MqttValidatorClass) {
  constructor(p_data: WheelValidatorInterface) {
    this.id = p_data.id;
  }
}
