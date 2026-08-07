"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisClass = void 0;
const ioredis_1 = require("ioredis");
const enums_1 = require("../enums");
class RedisClass {
    /**
     * Constructor for RedisClass
     *
     * This is the default constructor for RedisClass. It sets _redis to null
     * and logs a message to console.
     */
    constructor() {
        this._redis = null;
        this._redisSub = null;
        this._config = null;
        this._isPublisher = false;
        this._isSubscriber = false;
        /**
         * Sets the publisher property
         *
         * @param {PublisherSubscriberTypeEnum} p_pubSubType - The type of publisher/subscriber
         * @returns {boolean} - True if the publisher property was set, false otherwise
         */
        this.setPublisher = (p_pubSubType) => {
            let resp;
            try {
                resp = p_pubSubType === enums_1.PublisherSubscriberTypeEnum.PUBLISHER || p_pubSubType === enums_1.PublisherSubscriberTypeEnum.PUB_SUB;
            }
            catch (error) {
                resp = false;
            }
            return resp;
        };
        /**
         * Sets the subscriber property
         *
         * @param {PublisherSubscriberTypeEnum} p_pubSubType - The type of publisher/subscriber
         * @returns {boolean} - True if the subscriber property was set, false otherwise
         */
        this.setSubscriber = (p_pubSubType) => {
            let resp;
            try {
                resp = p_pubSubType === enums_1.PublisherSubscriberTypeEnum.SUBCRIBER || p_pubSubType === enums_1.PublisherSubscriberTypeEnum.PUB_SUB;
            }
            catch (error) {
                resp = false;
            }
            return resp;
        };
        /**
         * Connects to Redis and returns the connection object.
         * If p_redis is not null, it disconnects from Redis first.
         * If an error occurs, it returns null.
         * @param {Redis | null} p_redis - The Redis connection object
         * @param {RedisConfigInterface} p_config - The configuration object for Redis
         * @returns {Redis | null} - The Redis connection object or null if an error occurs
         */
        this.connectRedis = (p_redis, p_config) => {
            let resp = null;
            try {
                if (p_redis !== null) {
                    p_redis.disconnect();
                    p_redis = null;
                }
                resp = new ioredis_1.Redis(p_config);
            }
            catch (error) {
                resp = null;
            }
            return resp;
        };
        /**
         * Enables the publisher feature.
         * If the publisher feature is enabled, the MQTT messages are published to Redis.
         * @returns {void}
         */
        this.activatePublisher = () => {
            try {
                if (this._config) {
                    if (this._config.pubSub && this._isPublisher) {
                        // The code block processes the received MQTT messages.
                        this._config.pubSub.tx$.subscribe({
                            next: (v) => {
                                this.publish(v.topic, v.payload);
                            },
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            error: (error) => {
                                /* empty */
                            },
                            // _LOGS.publishError(<Error>e);
                        });
                    }
                }
            }
            catch (error) {
                // empty
            }
        };
        /**
         * Enables the reception feature.
         * If the reception feature is enabled, the MQTT messages are received from Redis.
         * @returns {void}
         */
        this.activateReception = () => {
            try {
                if (this._redisSub instanceof ioredis_1.Redis) {
                    this._redisSub.on("pmessage", (pattern, channel, message) => {
                        const topicSplited = channel.split(":");
                        topicSplited.push(pattern);
                        //observable -> publish
                        this._config?.pubSub?.rx$.next({
                            topic: topicSplited,
                            payload: message.toString(),
                        });
                    });
                }
            }
            catch (error) {
                // empty
            }
        };
        /**
         * Enables the subscriber feature.
         * If the subscriber feature is enabled, the MQTT messages are received from Redis and
         * processed by the MQTT subscriber.
         * @returns {void}
         */
        this.activateSubscribers = () => {
            try {
                if (this._redisSub instanceof ioredis_1.Redis && this._config) {
                    if (this._config.pubSub && this._isSubscriber) {
                        // The code block processes the received MQTT messages.
                        this._config.pubSub.subscribe$.subscribe({
                            next: (v) => {
                                this.subscribe(v.topic);
                                console.log("Subscribe: ", v.topic);
                            },
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            error: (error) => {
                                /* empty */
                            },
                            // _LOGS.publishError(<Error>e);
                        });
                    }
                }
            }
            catch (error) {
                // empty
            }
        };
        /**
         * Connects to Redis using the provided configuration.
         * It disconnects from the previous connection if it exists.
         * If an error occurs, it returns false.
         * @param {RedisConfigInterface} p_config - The configuration object for Redis
         * @returns {Promise<boolean>} - True if the connection was successful, false otherwise
         */
        this.connect = async (p_config) => {
            let resp;
            try {
                this._config = p_config;
                this._isPublisher = this.setPublisher(this._config.pubSubType);
                this._isSubscriber = this.setSubscriber(this._config.pubSubType);
                this._redis = this.connectRedis(this._redis, this._config);
                if (this._isSubscriber)
                    this._redisSub = this.connectRedis(this._redisSub, this._config);
                if (this._redis instanceof ioredis_1.Redis) {
                    this._redis.on("error", (err) => {
                        console.log("Redis error: ", err);
                    });
                    if (this._config !== null) {
                        if (this._isSubscriber && this._redisSub instanceof ioredis_1.Redis) {
                            this._redisSub.on("error", (err) => {
                                console.log("Redis error: ", err);
                            });
                            // reception
                            this.activateReception();
                        }
                        // publish
                        this.activatePublisher();
                        // subscribe
                        this.activateSubscribers();
                    }
                    resp = true;
                }
                else {
                    resp = false;
                }
            }
            catch (error) {
                resp = false;
            }
            return resp;
        };
        /**
         * Set a hash field to a string value.
         * @param {string} p_key - The key of the hash.
         * @param {string} p_field - The field of the hash.
         * @param {string | number | Buffer} p_value - The value of the field.
         * @returns {Promise<number | undefined>} - The number of fields that were changed.
         */
        this.hset = (p_key, p_field, p_value) => {
            return new Promise((resolve, reject) => {
                if (this._redis !== null) {
                    this._redis
                        .hset(p_key, p_field, p_value)
                        .then((p_result) => {
                        resolve(p_result);
                    })
                        .catch((p_error) => {
                        reject(p_error);
                    });
                }
                else {
                    const err = new Error("Redis not connected");
                    reject(err);
                }
            });
        };
        /**
         * Get the value of a hash field.
         * @param {string} p_key - The key of the hash.
         * @param {string} p_field - The field of the hash.
         * @returns {Promise<string | null>} - The value of the field.
         */
        this.hget = (p_key, p_field) => {
            return new Promise((resolve, reject) => {
                if (this._redis !== null) {
                    this._redis
                        .hget(p_key, p_field)
                        .then((p_result) => {
                        resolve(p_result);
                    })
                        .catch((p_error) => {
                        reject(p_error);
                    });
                }
                else {
                    const err = new Error("Redis not connected");
                    reject(err);
                }
            });
        };
        /**
         * Get the value of a hash field as a Buffer.
         * @param {string} p_key - The key of the hash.
         * @param {string} p_field - The field of the hash.
         * @returns {Promise<Buffer | null>} - The value of the field as a Buffer.
         */
        this.hgetBuffer = (p_key, p_field) => {
            return new Promise((resolve, reject) => {
                if (this._redis !== null) {
                    this._redis
                        .hgetBuffer(p_key, p_field)
                        .then((p_result) => {
                        resolve(p_result);
                    })
                        .catch((p_error) => {
                        reject(p_error);
                    });
                }
                else {
                    const err = new Error("Redis not connected");
                    reject(err);
                }
            });
        };
        /**
         * Get all the fields and values in a hash.
         * @param {string} p_key - The key of the hash.
         * @returns {Promise<Record<string, string> | null>} - The fields and values of the hash.
         */
        this.hgetall = (p_key) => {
            return new Promise((resolve, reject) => {
                if (this._redis !== null) {
                    this._redis
                        .hgetall(p_key)
                        .then((p_result) => {
                        resolve(p_result);
                    })
                        .catch((p_error) => {
                        reject(p_error);
                    });
                }
                else {
                    const err = new Error("Redis not connected");
                    reject(err);
                }
            });
        };
        /**
         * Get all the fields and values in a hash as a Buffer.
         * @param {string} p_key - The key of the hash.
         * @returns {Promise<Record<string, Buffer> | null>} - The fields and values of the hash as a Buffer.
         */
        this.hgetallBuffer = (p_key) => {
            return new Promise((resolve, reject) => {
                if (this._redis !== null) {
                    this._redis
                        .hgetallBuffer(p_key)
                        .then((p_result) => {
                        resolve(p_result);
                    })
                        .catch((p_error) => {
                        reject(p_error);
                    });
                }
                else {
                    const err = new Error("Redis not connected");
                    reject(err);
                }
            });
        };
        /**
         * Subscribe to a channel.
         * @param {string} p_key - The channel to subscribe to.
         * @returns {Promise<number>} - The number of channels subscribed to.
         */
        this.subscribe = (p_keys) => {
            return new Promise((resolve, reject) => {
                if (this._redisSub !== null) {
                    const keys = Array.isArray(p_keys) ? p_keys : new Array(p_keys);
                    this._redisSub.psubscribe(...keys, (err, count) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(count);
                        }
                    });
                }
                else {
                    const err = new Error("Redis not connected");
                    reject(err);
                }
            });
        };
        /**
         * Set multiple hash fields to multiple values.
         * @param {string} p_key - The key of the hash.
         * @param {string[]} p_array - The array of fields and values to set.
         * @returns {Promise<boolean>} - The result of the command.
         */
        this.hmset = (p_key, p_array) => {
            return new Promise((resolve, reject) => {
                if (this._redis !== null) {
                    this._redis
                        .hmset(p_key, p_array)
                        .then((p_result) => {
                        resolve(p_result === "OK");
                    })
                        .catch((p_error) => {
                        reject(p_error);
                    });
                }
                else {
                    const err = new Error("Redis not connected");
                    reject(err);
                }
            });
        };
        /**
         * Delete multiple hash fields.
         * @param {string} p_key - The key of the hash.
         * @param {string[]} p_array - The array of fields to delete.
         * @returns {Promise<number>} - Returns the number of fields that were removed from the hash, excluding any specified but non-existing fields..
         */
        this.hdel = (p_key, p_array) => {
            return new Promise((resolve, reject) => {
                if (this._redis !== null) {
                    this._redis
                        .hdel(p_key, ...p_array)
                        .then((p_result) => {
                        resolve(p_result);
                    })
                        .catch((p_error) => {
                        reject(p_error);
                    });
                }
                else {
                    const err = new Error("Redis not connected");
                    reject(err);
                }
            });
        };
        /**
         * Get the values of all the given fields in a hash.
         * @param {string} p_key - The key of the hash.
         * @param {string[]} p_array - The array of fields to get.
         * @returns {Promise<(string | null)[]>} - The values of the given fields.
         */
        this.hmget = (p_key, p_array) => {
            return new Promise((resolve, reject) => {
                if (this._redis !== null) {
                    this._redis
                        .hmget(p_key, ...p_array)
                        .then((p_result) => {
                        resolve(p_result);
                    })
                        .catch((p_error) => {
                        reject(p_error);
                    });
                }
                else {
                    const err = new Error("Redis not connected");
                    reject(err);
                }
            });
        };
        /**
         * Set a key to hold a string value.
         * @param {string} p_key - The key to set.
         * @param {string | number | Buffer} p_value - The value to set.
         * @returns {Promise<boolean>} - The result of the command.
         */
        this.set = (p_key, p_value) => {
            return new Promise((resolve, reject) => {
                if (this._redis !== null) {
                    this._redis
                        .set(p_key, p_value)
                        .then((p_result) => {
                        resolve(p_result === "OK");
                    })
                        .catch((p_error) => {
                        reject(p_error);
                    });
                }
                else {
                    const err = new Error("Redis not connected");
                    reject(err);
                }
            });
        };
        /**
         * Get the value of a key.
         * @param {string} p_key - The key to get.
         * @returns {Promise<string | null>} - The value of the key.
         */
        this.get = (p_key) => {
            return new Promise((resolve, reject) => {
                if (this._redis !== null) {
                    this._redis
                        .get(p_key)
                        .then((p_result) => {
                        resolve(p_result);
                    })
                        .catch((p_error) => {
                        reject(p_error);
                    });
                }
                else {
                    const err = new Error("Redis not connected");
                    reject(err);
                }
            });
        };
        this.hkeys = (p_pattern) => {
            return new Promise((resolve, reject) => {
                if (this._redis !== null) {
                    this._redis
                        .hkeys(p_pattern)
                        .then((p_result) => {
                        resolve(p_result);
                    })
                        .catch((p_error) => {
                        reject(p_error);
                    });
                }
                else {
                    const err = new Error("Redis not connected");
                    reject(err);
                }
            });
        };
        /**
         * Publish a message to a channel.
         * @param {string} p_key - The channel to publish to.
         * @param {string} p_msg - The message to publish.
         * @returns {Promise<boolean>} - The result of the command.
         */
        this.publish = (p_key, p_msg) => {
            return new Promise((resolve, reject) => {
                if (this._redis instanceof ioredis_1.Redis) {
                    this._redis
                        .publish(p_key, p_msg)
                        .then(() => {
                        resolve(true);
                    })
                        .catch((p_error) => {
                        reject(p_error);
                    });
                }
                else {
                    const err = new Error("Redis not connected");
                    reject(err);
                }
            });
        };
        /**
         * Delete multiple hash fields.
         * @param {string} p_key - The key of the hash.
         * @param {string[]} p_array - The array of fields to delete.
         * @returns {Promise<number>} - Returns the number of fields that were removed from the hash, excluding any specified but non-existing fields..
         */
        this.status = () => {
            let resp;
            try {
                if (this._redis === null)
                    resp = enums_1.RedisStatusEnum.error;
                else
                    resp = this._redis.status;
            }
            catch (error) {
                resp = enums_1.RedisStatusEnum.error;
            }
            return resp;
        };
        this._redis = null;
        console.log("RedisClass");
    }
}
exports.RedisClass = RedisClass;
