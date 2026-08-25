import { ConfigClass } from "@slcn-pkg/config-class";
import SerialComClass from "./comm/serialCom.class";
import {
  MqttObservableClass,
  MqttRxObservableInterface,
  MqttSubscribeObservableInterface,
  MqttTxObservableInterface,
} from "@slcn-pkg/mqtt-client-observable-class";
import { StsHardwareMqttRx } from "sts-common";
import { GeneralLoggerClass } from "@slcn-pkg/general-logger-class";

export class HardwareClass {
  private readonly _serial: SerialComClass;
  private readonly _serviceId: string | null = null;
  private readonly _comm: string;

  constructor(
    private readonly _CONFIG: ConfigClass,
    private readonly _mqttSubject: MqttObservableClass,
    private readonly _logger: GeneralLoggerClass
  ) {
    this._comm = this._CONFIG.get(["COMM", "port"]);

    this._serial = new SerialComClass(this.rxCallBack, this._comm, 19200, 8, 1, "none", this._logger);

    this._serviceId = _CONFIG.getServiceId(false);

    const subsTopic: MqttSubscribeObservableInterface = {
      topic: `sts/Hardware/${this.getServiceId()}/tx`,
      qos: 0,
    };
    _mqttSubject.subscribe$.next(subsTopic);

    // The code block processes the received MQTT messages.
    _mqttSubject.rx$.subscribe({
      next: (v: MqttRxObservableInterface) => {
        try {
          const parts: string[] = v.topic;
          if (parts[0] === "sts") {
            this._serial.setValues(JSON.parse(v.payload));
          }
        } catch (error) {
          // empty
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      error: (error: unknown) => {
        /* empty */
      },
    });

    this.publishStateMqtt();
    setInterval(this.publishStateMqtt, 5000);
  }

  private readonly rxCallBack = (p_data: StsHardwareMqttRx) => {
    const srv: string = this.getServiceId();
    const topic: string = `sts/Hardware/${srv}/rx`;
    const dataTx: MqttTxObservableInterface = {
      topic,
      payload: JSON.stringify(p_data),
      qos: 0,
      retain: false,
    };
    this._mqttSubject.tx$.next(dataTx);
  };

  private readonly publishStateMqtt = () => {
    const srv: string = this.getServiceId();
    const topic: string = `sts/Hardware/${srv}/state`;
    const data = {
      state: this._serial.isOpen,
      comm: this._comm,
      date: new Date(),
    };
    const dataTx: MqttTxObservableInterface = {
      topic,
      payload: JSON.stringify(data),
      qos: 0,
      retain: false,
    };
    this._mqttSubject.tx$.next(dataTx);
  };

  private readonly getServiceId = (): string => {
    let srv: string;

    try {
      if (this._serviceId !== null) srv = this._serviceId;
      else srv = "srv-unknown";
    } catch (error) {
      srv = "srv-unknown";
    }

    return srv;
  };
}
