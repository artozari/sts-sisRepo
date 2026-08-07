import { Type } from "class-transformer";
import "reflect-metadata";
import { IsOptional, IsDefined, ValidateNested } from "class-validator";
import { IndividualValidatorInterface } from "../interfaces/individual.validator.interface";
import { ComValidatorClass, ConfigFileValidatorClass, GeneralLoggerValidatorClass, HttpValidatorClass } from "@slcn-pkg/config-class";

export class IndividualValidatorClass implements IndividualValidatorInterface {
  @IsOptional()
  @ValidateNested()
  @Type(() => ConfigFileValidatorClass)
  CONFIG_FILE: ConfigFileValidatorClass | undefined;

  @IsDefined()
  @ValidateNested()
  @Type(() => HttpValidatorClass)
  HTTP: HttpValidatorClass;

  @IsDefined()
  @ValidateNested()
  @Type(() => IndividualValidatorClass)
  COMM: ComValidatorClass;

  @IsDefined()
  @ValidateNested()
  @Type(() => GeneralLoggerValidatorClass)
  LOGGER: GeneralLoggerValidatorClass;

  constructor(p_data: IndividualValidatorInterface) {
    this.CONFIG_FILE = new ConfigFileValidatorClass(p_data.CONFIG_FILE);
    this.COMM = new ComValidatorClass(p_data.COMM);
    this.HTTP = new HttpValidatorClass(p_data.HTTP);
    this.LOGGER = new GeneralLoggerValidatorClass(p_data.LOGGER);
  }
}
