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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiCheckClass = void 0;
const http = __importStar(require("node:http"));
const https = __importStar(require("node:https"));
const node_url_1 = require("node:url");
class ApiCheckClass {
    constructor(cfg) {
        this.intervalId = null;
        this.healthy = false;
        this.cfg = Object.assign({ path: "/" }, cfg);
    }
    start() {
        if (this.intervalId)
            return;
        this.check();
        console.info(`[HealthCheck] iniciado (${this.cfg.baseUrl}${this.cfg.path})`);
    }
    stop() {
        if (!this.intervalId)
            return;
        clearInterval(this.intervalId);
        this.intervalId = null;
        console.info("[HealthCheck] detenido");
    }
    isHealthy() {
        return this.healthy;
    }
    //--> Método para consultar el endpoint y obtener la respuesta pero obtiene todas las jugadas ganadoras, no solo la última ⚠
    queryEndpoint(endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { statusCode, body } = yield this.doRequestWithBody(endpoint);
                console.log(`\x1b[1;36;48;2;129;67;113m Datos de respuesta de la API: ${body} \x1b[0m`);
                return { success: statusCode >= 200 && statusCode < 300, statusCode, data: body, error: null };
            }
            catch (err) {
                console.error(`[Query] ERROR: ${err.message}`);
                return { success: false, error: err.message, statusCode: 400, data: "" };
            }
        });
    }
    check() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const status = yield this.doRequest();
                this.healthy = status >= 200 && status < 300;
                if (this.healthy) {
                    console.log(`\x1b[42m[HealthCheck] OK ${status} \x1b[0m\x1b[32m\x1b[0m`);
                }
                else {
                    console.warn(`[HealthCheck] RESPUESTA ${status}`);
                }
            }
            catch (err) {
                this.healthy = false;
                console.error(`[HealthCheck] ERROR: ${err.message}`);
            }
        });
    }
    doRequest(customPath) {
        return new Promise((resolve, reject) => {
            try {
                const fullUrl = new node_url_1.URL(this.cfg.baseUrl);
                const pathToUse = customPath || this.cfg.path || "/";
                // --- CHANGED: separar path y query para evitar que '?' quede en pathname ---
                const qIdx = pathToUse.indexOf("?");
                const pathPart = qIdx >= 0 ? pathToUse.slice(0, qIdx) : pathToUse;
                const queryPart = qIdx >= 0 ? pathToUse.slice(qIdx) : "";
                fullUrl.pathname = (fullUrl.pathname.replace(/\/$/, "") || "") + pathPart;
                // combinar search si ya existe
                if (queryPart) {
                    fullUrl.search = fullUrl.search ? `${fullUrl.search}&${queryPart.slice(1)}` : queryPart;
                }
                // --- END CHANGED ---
                const isHttps = fullUrl.protocol === "https:";
                const lib = isHttps ? https : http;
                const options = {
                    hostname: fullUrl.hostname,
                    port: fullUrl.port ? Number(fullUrl.port) : undefined,
                    path: fullUrl.pathname + fullUrl.search,
                    method: "GET",
                    timeout: this.cfg.timeout,
                };
                const req = lib.request(options, (res) => {
                    res.on("data", () => {
                        /* noop */
                    });
                    res.on("end", () => { var _a; return resolve((_a = res.statusCode) !== null && _a !== void 0 ? _a : 0); });
                });
                req.on("timeout", () => {
                    req.destroy(new Error("timeout"));
                });
                req.on("error", (err) => reject(err));
                req.end();
            }
            catch (err) {
                reject(err);
            }
        });
    }
    doRequestWithBody(customPath) {
        return new Promise((resolve, reject) => {
            try {
                const fullUrl = new node_url_1.URL(this.cfg.baseUrl);
                const pathToUse = customPath || this.cfg.path || "/";
                // --- CHANGED: separar path y query para evitar que '?' quede en pathname ---
                const qIdx = pathToUse.indexOf("?");
                const pathPart = qIdx >= 0 ? pathToUse.slice(0, qIdx) : pathToUse;
                const queryPart = qIdx >= 0 ? pathToUse.slice(qIdx) : "";
                fullUrl.pathname = (fullUrl.pathname.replace(/\/$/, "") || "") + pathPart;
                if (queryPart) {
                    fullUrl.search = fullUrl.search ? `${fullUrl.search}&${queryPart.slice(1)}` : queryPart;
                }
                // --- END CHANGED ---
                const isHttps = fullUrl.protocol === "https:";
                const lib = isHttps ? https : http;
                const options = {
                    hostname: fullUrl.hostname,
                    port: fullUrl.port ? Number(fullUrl.port) : undefined,
                    path: fullUrl.pathname + fullUrl.search,
                    method: "GET",
                    timeout: this.cfg.timeout,
                };
                const req = lib.request(options, (res) => {
                    let data = "";
                    res.on("data", (chunk) => {
                        data += chunk;
                    });
                    res.on("end", () => {
                        var _a;
                        resolve({ statusCode: (_a = res.statusCode) !== null && _a !== void 0 ? _a : 0, body: data });
                    });
                });
                req.on("timeout", () => {
                    req.destroy(new Error("timeout"));
                });
                req.on("error", (err) => reject(err));
                req.end();
            }
            catch (err) {
                reject(err);
            }
        });
    }
}
exports.ApiCheckClass = ApiCheckClass;
