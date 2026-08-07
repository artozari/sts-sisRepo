import { Type } from 'class-transformer';
import 'reflect-metadata';
import { IsOptional, IsDefined, ValidateNested } from 'class-validator';
import { IndividualValidatorInterface } from '../interfaces/individual.validator.interface';
import { ConfigFileValidatorClass, HttpValidatorClass } from '@slcn-pkg/config-class';

export class IndividualValidatorClass implements IndividualValidatorInterface {
  @IsOptional()
  @ValidateNested()
  @Type(() => ConfigFileValidatorClass)
  CONFIG_FILE: ConfigFileValidatorClass | undefined;

  @IsDefined()
  @ValidateNested()
  @Type(() => HttpValidatorClass)
  HTTP: HttpValidatorClass;

  constructor(p_data: IndividualValidatorInterface) {
    this.CONFIG_FILE = new ConfigFileValidatorClass(p_data.CONFIG_FILE);
    this.HTTP = new HttpValidatorClass(p_data.HTTP);
  }
}
