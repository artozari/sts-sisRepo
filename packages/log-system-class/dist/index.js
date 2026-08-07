"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogSystemClass = void 0;
const datetime_class_1 = require("datetime-class");
class LogSystemClass {
    constructor(_CONFIG) {
        this._CONFIG = _CONFIG;
        this._nameApp = "";
        this._verApp = "";
        this.publishError = (p_err) => {
            let resp;
            if (p_err instanceof Error) {
                // generate data
                const data = {
                    name: p_err.name ?? undefined,
                    stack: p_err.stack ?? undefined,
                };
                // log
                console.log("error", p_err.message, data);
                // output
                resp = true;
            }
            else {
                // output
                resp = false;
            }
            return resp;
        };
        this.publishEvent = (p_name, p_msg, p_metadata) => {
            let resp;
            if (p_name !== null && p_msg !== null) {
                const data = {
                    msg: p_msg || undefined,
                    stack: p_metadata || undefined,
                };
                // log
                console.log("info", p_name, data);
                resp = true;
            }
            else {
                resp = false;
            }
            return resp;
        };
        this.publishWarn = (p_name, p_msg, p_metadata) => {
            let resp;
            if (p_name !== null && p_msg !== null) {
                const data = {
                    msg: p_msg || undefined,
                    stack: p_metadata || undefined,
                };
                // log
                console.log("warn", p_name, data);
                resp = true;
            }
            else {
                resp = false;
            }
            return resp;
        };
        this.publishErrorEvent = (p_name, p_msg, p_metadata) => {
            let resp;
            if (p_name !== null && p_msg !== null) {
                const data = {
                    msg: p_msg || undefined,
                    stack: p_metadata || undefined,
                };
                // log
                console.log("error", p_name, data);
                resp = true;
            }
            else {
                resp = false;
            }
            return resp;
        };
        this.publishLog = (p_name, p_msg, p_metadata) => {
            let resp;
            if (p_name !== null && p_msg !== null) {
                const data = {
                    msg: p_msg || undefined,
                    name: p_name || undefined,
                    stack: JSON.stringify(p_metadata) || undefined,
                };
                // log
                console.log("info", p_name, data);
                resp = true;
            }
            else {
                resp = false;
            }
            return resp;
        };
        this._datetime = new datetime_class_1.DatetimeClass();
        // initial log
        this._nameApp = this._CONFIG.get(["APP", "SRV_NAME"]);
        this._verApp = this._CONFIG.get(["APP", "SRV_VER"]);
        this.publishWarn("INIT", `${this._nameApp} ${this._verApp} init..........`, "");
        this.publishEvent("INIT INFO...", `${this._nameApp} ${this._verApp} init..........`, "");
    }
}
exports.LogSystemClass = LogSystemClass;
