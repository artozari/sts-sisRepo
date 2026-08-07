"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisStatusEnum = void 0;
var RedisStatusEnum;
(function (RedisStatusEnum) {
    RedisStatusEnum["wait"] = "wait";
    RedisStatusEnum["reconnecting"] = "reconnecting";
    RedisStatusEnum["connecting"] = "connecting";
    RedisStatusEnum["connect"] = "connect";
    RedisStatusEnum["ready"] = "ready";
    RedisStatusEnum["close"] = "close";
    RedisStatusEnum["end"] = "end";
    RedisStatusEnum["error"] = "error";
})(RedisStatusEnum || (exports.RedisStatusEnum = RedisStatusEnum = {}));
