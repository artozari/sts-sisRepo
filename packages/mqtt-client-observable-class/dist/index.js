"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MqttObservableClass = void 0;
const rxjs_1 = require("rxjs");
__exportStar(require("./functions"), exports);
__exportStar(require("./interfaces"), exports);
__exportStar(require("./types"), exports);
/**
 * The `MqttObservableClass` is a TypeScript class that creates instances of `Subject` from the `rxjs` library
 * to publish and receive messages from an MQTT broker.
 */
class MqttObservableClass {
    constructor() {
        /**
         * The above code snippet is a constructor function in TypeScript.
         */
        /**
         *The rx$ is creating a new instance of the `Subject` class from the `rxjs` library. This subject is used to publish messages received from an MQTT broker.
         */
        this.rx$ = new rxjs_1.Subject();
        /**
         * The tx$ is creating a new instance of the `Subject` class from the `rxjs` library. This subject is used to publish messages to be sent to an MQTT broker
         */
        this.tx$ = new rxjs_1.Subject();
        /**
         * subscribe$ is creating a new instance of the `Subject` class from the `rxjs` library.
         * This subject is used to subscribe to MQTT topics.
         * The `subscribe$` subject can emit values of type `MqttSubscribeObservableInterface`, indicating the MQTT topics and QoS to subscribe to.
         */
        this.subscribe$ = new rxjs_1.Subject();
        /**
         * subscribe$ is creating a new instance of the `Subject` class from the `rxjs` library.
         * This subject is used to subscribe to MQTT topics.
         * The `subscribe$` subject can emit values of type `MqttSubscribeObservableInterface`, indicating the MQTT topics and QoS to subscribe to.
         */
        this.events$ = new rxjs_1.Subject();
    }
}
exports.MqttObservableClass = MqttObservableClass;
