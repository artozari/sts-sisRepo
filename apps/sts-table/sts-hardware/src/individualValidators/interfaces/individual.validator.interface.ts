import { ComValidatorClass, ConfigFileValidatorClass, GeneralLoggerValidatorInterface, HttpValidatorClass } from "@slcn-pkg/config-class";

export interface IndividualValidatorInterface {
  HTTP: HttpValidatorClass;
  CONFIG_FILE: ConfigFileValidatorClass | undefined;
  COMM: ComValidatorClass;
  LOGGER: GeneralLoggerValidatorInterface;
}
