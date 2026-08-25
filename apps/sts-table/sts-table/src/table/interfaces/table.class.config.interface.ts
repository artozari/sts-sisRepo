import { GeneralLoggerClass } from "@slcn-pkg/general-logger-class";
import { MqttObservableClass } from "@slcn-pkg/mqtt-client-observable-class";

/**
 * @typedef {Object} TableClassConfigInterface
 * @property {string} serviceId - The service ID.
 * @property {string} hardwareId - The hardware ID.
 * @property {string} wheelId - The wheel ID.
 * @property {MqttObservableClass} mqttSubject - The MQTT observable class.
 * @property {string} colorOfLights - The color of lights.
 * @property {number} semaphoreIntensity - The intensity of the semaphore.
 * @property {number} tableNumber - The table number.
 * @property {string[]} tableId - The table ID.
 * @property {string} tableType - The table type.
 */
export interface TableClassConfigInterface {
  serviceId: string;
  hardwareId: string;
  wheelId: string;
  mqttSubject: MqttObservableClass;
  colorOfLights: string;
  lightsIntensity: number;
  semaphoreIntensity: number;
  tableNumber: number;
  tableId: string[];
  tableType: string;
  serverName: string;
  ip: string;
  portHttp: string;
  portHttps: string;
  urlApi: string;
  portApi: string;
  sslApi: boolean;
  logger: GeneralLoggerClass | null;
}
