"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPubSubOnline = void 0;
const isPubSubOnline = (p_event) => {
    let resp;
    try {
        switch (p_event) {
            case "connect":
                resp = true;
                break;
            case "connected":
                resp = true;
                break;
            case "disconnected":
                resp = false;
                break;
            case "message":
                resp = true;
                break;
            case "reconnect":
                resp = false;
                break;
            case "error":
                resp = false;
                break;
            default:
                resp = false;
                break;
        }
    }
    catch (error) {
        resp = false;
    }
    return resp;
};
exports.isPubSubOnline = isPubSubOnline;
