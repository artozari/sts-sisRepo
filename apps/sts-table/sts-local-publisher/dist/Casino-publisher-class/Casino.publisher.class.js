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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CasinoPublisherClass = void 0;
const dotenv = __importStar(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const envCandidates = [path_1.default.resolve(process.cwd(), ".env"), path_1.default.resolve(__dirname, "..", ".env"), path_1.default.resolve(__dirname, ".env")];
for (const envPath of envCandidates) {
    if (fs_1.default.existsSync(envPath)) {
        dotenv.config({ path: envPath });
        break;
    }
}
class CasinoPublisherClass {
    constructor(_config) {
        this._config = _config;
        this.requestSync = 0;
        this.publishMqtt = (p_dataTx) => {
            try {
                this._config.subject.tx$.next(p_dataTx);
            }
            catch (error) {
                console.error(error);
            }
        };
        this.start = () => {
            console.info("Casino Publisher Started");
        };
        const subsTopic = {
            topic: `STS-MESAS/STS-Casino/GameSync/` + process.env.NUMERO_MAQUINA,
            qos: 0,
        };
        _config.subject.subscribe$.next(subsTopic);
        _config.subject.rx$.subscribe({
            next: (v) => {
                try {
                    const topicString = Array.isArray(v.topic) ? v.topic.join("/") : v.topic;
                    const parts = topicString.split("/");
                    const last = parts[parts.length - 1];
                    console.log(last);
                    if (/^\d+$/.test(last)) {
                        this.requestSync = 1;
                    }
                }
                catch (error) {
                    console.error(error);
                }
            },
            error: (error) => {
                console.error(error);
            },
        });
    }
    pushGamesToCasino(payload) {
        try {
            console.log("\x1b[36;47;1m Envio de pyload \x1b[0m");
        }
        catch (error) {
            console.error("Error pushing games to casino:", error);
        }
    }
}
exports.CasinoPublisherClass = CasinoPublisherClass;
