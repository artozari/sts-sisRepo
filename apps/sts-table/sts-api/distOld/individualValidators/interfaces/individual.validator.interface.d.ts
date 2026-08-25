import { ConfigFileValidatorClass, HttpValidatorClass } from '@slcn-pkg/config-class';
export interface IndividualValidatorInterface {
    HTTP: HttpValidatorClass;
    CONFIG_FILE: ConfigFileValidatorClass | undefined;
}
