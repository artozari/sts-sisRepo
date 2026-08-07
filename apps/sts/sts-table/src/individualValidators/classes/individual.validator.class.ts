import { Type } from "class-transformer";
import "reflect-metadata";
import { IsOptional, IsDefined, ValidateNested } from "class-validator";
import { IndividualValidatorInterface } from "../interfaces/individual.validator.interface";
import { ApiValidatorClass, ConfigFileValidatorClass, GeneralLoggerValidatorClass, HttpValidatorClass } from "@slcn-pkg/config-class";
import { HardwareValidatorClass } from "./hardware.validator.class";
import { WheelValidatorClass } from "./wheel.validator.class";
import { SignboardValidatorClass } from "./signboard.validator.class";

export class IndividualValidatorClass implements IndividualValidatorInterface {
  @IsOptional()
  @ValidateNested()
  @Type(() => ConfigFileValidatorClass)
  CONFIG_FILE: ConfigFileValidatorClass | undefined;

  @IsDefined()
  @ValidateNested()
  @Type(() => IndividualValidatorClass)
  HARDWARE: HardwareValidatorClass;

  @IsDefined()
  @ValidateNested()
  @Type(() => HttpValidatorClass)
  HTTP: HttpValidatorClass;

  @IsDefined()
  @ValidateNested()
  @Type(() => WheelValidatorClass)
  WHEEL: WheelValidatorClass;

  @IsDefined()
  @ValidateNested()
  @Type(() => SignboardValidatorClass)
  SIGNBOARD: SignboardValidatorClass;

  @IsDefined()
  @ValidateNested()
  @Type(() => ApiValidatorClass)
  API: ApiValidatorClass;

  @IsDefined()
  @ValidateNested()
  @Type(() => GeneralLoggerValidatorClass)
  LOGGER: GeneralLoggerValidatorClass;

  constructor(p_data: IndividualValidatorInterface) {
    this.CONFIG_FILE = new ConfigFileValidatorClass(p_data.CONFIG_FILE);
    this.HARDWARE = new HardwareValidatorClass(p_data.HARDWARE);
    this.HTTP = new HttpValidatorClass(p_data.HTTP);
    this.WHEEL = new WheelValidatorClass(p_data.WHEEL);
    this.SIGNBOARD = new SignboardValidatorClass(p_data.SIGNBOARD);
    this.API= new ApiValidatorClass(p_data.API);
    this.LOGGER = new GeneralLoggerValidatorClass(p_data.LOGGER);
  }
}
