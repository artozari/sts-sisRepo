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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoClass = void 0;
const node_crypto_1 = __importDefault(require("node:crypto"));
__exportStar(require("./interfaces/crypto.class.interface"), exports);
class CryptoClass {
    // private _algorithm: string = 'aes-256-ctr'
    // private _secretKey: string = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3'
    constructor(_secretKey, _algorithm = "aes-256-ctr") {
        this._secretKey = _secretKey;
        this._algorithm = _algorithm;
        this.encrypt = (text) => {
            try {
                const iv = node_crypto_1.default.randomBytes(16);
                const cipher = node_crypto_1.default.createCipheriv(this._algorithm, this._secretKey, iv);
                const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
                const resp = `${iv.toString("hex")}|${encrypted.toString("hex")}`;
                return resp;
            }
            catch (error) {
                return null;
            }
        };
        this.decrypt = (p_hash) => {
            try {
                if (p_hash === null)
                    return null;
                const [iv, content] = p_hash.split("|");
                const data = {
                    iv,
                    content,
                };
                return this.decryptObj(data);
            }
            catch (error) {
                return null;
            }
        };
        this.decryptObj = (hash) => {
            try {
                const decipher = node_crypto_1.default.createDecipheriv(this._algorithm, this._secretKey, Buffer.from(hash.iv, "hex"));
                const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, "hex")), decipher.final()]);
                return decrpyted.toString();
            }
            catch (error) {
                return null;
            }
        };
    }
}
exports.CryptoClass = CryptoClass;
