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
__exportStar(require("./enums"), exports);
__exportStar(require("./interfaces"), exports);
__exportStar(require("./redisClass"), exports);
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
/*
import { MqttObservableClass, MqttRxObservableInterface, MqttSubscribeObservableInterface, MqttTxObservableInterface } from "mqtt-client-observable-class";
import { RedisConfigInterface } from "./interfaces";
import { PublisherSubscriberTypeEnum } from "./enums";
import { RedisClass } from "./redisClass";

// *************
// *** REDIS ***
// *************
const main = async () => {
  const redis$: MqttObservableClass = new MqttObservableClass();
  const redisConfig: RedisConfigInterface = {
    host: "192.168.21.64",
    port: 6379,
    password: undefined,
    username: undefined,
    db: 0,
    pubSub: redis$,
    pubSubType: PublisherSubscriberTypeEnum.PUB_SUB,
  };
  const REDIS: RedisClass = new RedisClass();
  const redisOk: boolean = await REDIS.connect(redisConfig);
  console.log("REDIS OK: ", redisOk);

  // *********************
  // *** REDIS PUB/SUB ***
  // *********************

  const dataSubs: MqttSubscribeObservableInterface = {
    // topic: "accSrv??????",
    topic: ["accSrv:*", "pepe"],
    qos: 0,
  };
  redis$.subscribe$.next(dataSubs);

  redis$.rx$.subscribe({
    next: (v: MqttRxObservableInterface) => {
      console.timeEnd("PUB");
      try {
        const parts: string[] = v.topic;
        console.log("------------------------------------");
        console.log(parts);
        console.log(v.payload);
      } catch (error) {
        // empty
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error: (error: unknown) => {
      // empty
    },
  });

  let topicId: number = 0;
  const pub = () => {
    let topic: string;
    switch (topicId) {
      case 0:
        topic = "accSrv:Meters";
        topicId = 1;
        break;
      case 1:
        topic = "accSrv:Alive";
        topicId = 2;
        break;
      case 2:
        topic = "popo";
        topicId = 3;
        break;
      default:
        topic = "pepe";
        topicId = 0;
        break;
    }

    const data: MqttTxObservableInterface = {
      topic,
      payload:
        '{"ts": 123456789012345, "uid": ["Term1","Term2","Term3","Term4","Term5","Term6","Term7","Term8","Term9","Term10","Term11","Term12","Term13","Term14","Term15","Term16","Term17","Term18","Term19","Term20"]}',
      qos: 0,
      retain: false,
    };
    console.time("PUB");

    redis$.tx$.next(data);
  };

  setInterval(pub, 1000);

  console.time("SET REDIS 0");
  const respSet0: boolean = await REDIS.set("keyTest0", "value test 0!!!");
  console.timeEnd("SET REDIS 0");
  console.log("SET OK 0: ", respSet0);

  console.time("SET REDIS 1");
  const respSet1: boolean = await REDIS.set("keyTest1", "value test 1!!!");
  console.timeEnd("SET REDIS 1");
  console.log("SET OK 1: ", respSet1);

  console.time("GET REDIS 0");
  const respGet0: string | null = await REDIS.get("keyTest0");
  console.timeEnd("GET REDIS 0");
  console.log("GET 0: ", respGet0);

  console.time("GET REDIS 1");
  const respGet1: string | null = await REDIS.get("keyTest1");
  console.timeEnd("GET REDIS 1");
  console.log("GET 1: ", respGet1);
};

main();
*/ 
