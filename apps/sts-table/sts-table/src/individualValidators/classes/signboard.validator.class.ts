import { IsDefined, IsEnum, IsString } from "class-validator";
import { SignBoardValidatorInterface } from "../interfaces/signboard.validator.interface";
import { TypesOfGameEnum } from "../../interfaces/enums/types.of.game.enum";

export class SignboardValidatorClass implements SignBoardValidatorInterface {
  @IsDefined()
  @IsEnum(TypesOfGameEnum)
  type: TypesOfGameEnum;

  @IsDefined()
  @IsString({ each: true })
  id: string[];

  // constructor(p_mqtt: MqttValidatorClass) {
  constructor(p_data: SignBoardValidatorInterface) {
    this.id = p_data.id;
    this.type = p_data.type;
  }
}
