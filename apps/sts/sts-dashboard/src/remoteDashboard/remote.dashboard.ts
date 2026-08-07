import { MqttObservableClass, MqttRxObservableInterface, MqttSubscribeObservableInterface } from "@slcn-pkg/mqtt-client-observable-class";

export class RemoteDashboardClass {
  constructor(
    private readonly _localMQTT: MqttObservableClass,
    private readonly _remoteMQTT: MqttObservableClass
  ) {
    const subsTopicSignBoard: MqttSubscribeObservableInterface = {
      topic: `sts/dashboard/local/#`,
      qos: 0,
    };
    _localMQTT.subscribe$.next(subsTopicSignBoard);

    // The code block processes the received MQTT messages.
    _localMQTT.rx$.subscribe({
      next: (v: MqttRxObservableInterface) => {
        try {
          const parts: string[] = v.topic;
          if (parts[0] === "sts" && parts[1] === "dashboard" && parts[2] === "local" && parts.length === 5) {

            if (_remoteMQTT !== null) {
              _remoteMQTT.tx$.next({
                topic: `${parts[0]}/${parts[1]}/remote/${parts[3]}/${parts[4]}`,
                payload: v.payload,
                qos: 0,
                retain: false,
              });
            }
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
  }
}
