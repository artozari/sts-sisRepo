
import { GralWheelStateInterface } from 'sts-common';
import { MqttTxObservableInterface } from '@slcn-pkg/mqtt-client-observable-class';
import { SerialPort } from 'serialport'
import { TcsProtocolClass, TxTypeEnum } from '../TcsProtocol/tcs.protocol';
import { TscWheelConfigInterface } from '../interfaces/tsc.wheel.config.interface';

export class TcsWheelClass {

    private _port: SerialPort | undefined = undefined;
    private readonly _tcsProtocol: TcsProtocolClass;

    constructor(private readonly _config: TscWheelConfigInterface) {

        this._tcsProtocol = new TcsProtocolClass(false, this.callBack);

        this._port = new SerialPort({
            path: _config.port,
            baudRate: _config.baudRate,
            dataBits: _config.dataBits,
            stopBits: _config.stopBits,
            parity: _config.parity
        }, (err: Error | null) => {
            if (err) {
                this._port = undefined;
                return console.log('Error: ', err.message)
            }

            console.log('Connected to: ', _config.port);

            // Switches the port into "flowing mode"
            if (this._port !== undefined) {
                this._port.on('data', (data: Uint8Array) => {
                    this._tcsProtocol.rx(data);
                })
            }
        });

        setInterval(this.txPolling, 500);
    }


    private readonly txPolling = (): void => {
        try {
            if (this._port !== undefined) {
                const msgPolling: Uint8Array | false = this._tcsProtocol.tx(TxTypeEnum.POLLING);
                if (msgPolling !== false) {
                    this._port.write(msgPolling);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    private readonly publishStateMqtt = (p_state: GralWheelStateInterface) => {

        try {
            const topic: string = `sts/wheel/${this._config.serviceId}/state`;
            const dataTx: MqttTxObservableInterface = {
                topic,
                payload: JSON.stringify(p_state),
                qos: 0,
                retain: false
            };
            this._config.mqttSubject.tx$.next(dataTx);
        } catch (error) {
            // empty
        }

    }

    private readonly callBack = (p_state: GralWheelStateInterface) => {
        this.publishStateMqtt(p_state);
    }
}