import { ApiValidatorClass, ConfigFileValidatorClass, GeneralLoggerValidatorInterface, HttpValidatorClass } from "@slcn-pkg/config-class";
import { HardwareValidatorClass } from "../classes/hardware.validator.class";
import { WheelValidatorClass } from "../classes/wheel.validator.class";
import { SignboardValidatorClass } from "../classes/signboard.validator.class";

export interface IndividualValidatorInterface {
  HTTP: HttpValidatorClass;
  CONFIG_FILE: ConfigFileValidatorClass | undefined;
  HARDWARE: HardwareValidatorClass;
  WHEEL: WheelValidatorClass;
  SIGNBOARD: SignboardValidatorClass;
  API: ApiValidatorClass;
  LOGGER: GeneralLoggerValidatorInterface;
}
