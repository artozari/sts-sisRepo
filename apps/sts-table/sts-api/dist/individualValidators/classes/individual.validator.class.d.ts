import 'reflect-metadata';
import { IndividualValidatorInterface } from '../interfaces/individual.validator.interface';
import { ConfigFileValidatorClass, HttpValidatorClass } from '@slcn-pkg/config-class';
export declare class IndividualValidatorClass implements IndividualValidatorInterface {
    CONFIG_FILE: ConfigFileValidatorClass | undefined;
    HTTP: HttpValidatorClass;
    constructor(p_data: IndividualValidatorInterface);
}
