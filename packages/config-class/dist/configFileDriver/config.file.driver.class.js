"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigFileDriverClass = void 0;
const crypto_class_1 = require("crypto-class");
class ConfigFileDriverClass {
    constructor(p_extraWords) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.getSecretKey = (p_obj) => {
            let resp = true;
            let secretKey;
            try {
                try {
                    secretKey = p_obj["CONFIG_FILE"]["secretKey"];
                }
                catch (error) {
                    secretKey = undefined;
                }
                if (secretKey === undefined) {
                    secretKey = crypto.randomUUID();
                    let configFile = p_obj["CONFIG_FILE"];
                    if (configFile) {
                        configFile["secretKey"] = secretKey;
                    }
                    else {
                        configFile = { secretKey: secretKey };
                    }
                    p_obj["CONFIG_FILE"] = configFile;
                    resp = false;
                }
            }
            catch (error) {
                resp = null;
                secretKey = undefined;
            }
            return { resp, secretKey };
        };
        this.genHash = (p_secretKey) => {
            if (p_secretKey)
                return (p_secretKey + "_slCnXxXxXxXxXxXxXxXxXxXx").substring(0, 32);
            else
                return "_slCnXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx".substring(0, 32);
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.checkEncryption = (p_obj) => {
            let result = true;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let objDecrypt = null;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let objSave = null;
            try {
                const keys = this.getAllKeys(p_obj);
                const { resp, secretKey } = this.getSecretKey(p_obj);
                result = resp;
                objDecrypt = structuredClone(p_obj);
                objSave = structuredClone(p_obj);
                // const hash: string = (secretKey + "_slCnXxXxXxXxXxXxXxXxXxXx").substring(0, 32);
                const hash = this.genHash(secretKey);
                const cryptoObj = new crypto_class_1.CryptoClass(hash, "aes-256-ctr");
                for (const key of keys) {
                    const deepKey = key.split(".");
                    let strCrypto = null;
                    if (deepKey.length <= 1) {
                        // empty
                    }
                    else if (this._keysToEncrypt.includes(deepKey[deepKey.length - 1]) === false) {
                        // empty
                    }
                    else {
                        const strYml = p_obj[deepKey[0]][deepKey[1]];
                        const strDecrypto = cryptoObj.decrypt(strYml);
                        if (strDecrypto === null) {
                            strCrypto = cryptoObj.encrypt(strYml);
                            result = false;
                        }
                        if (objSave !== null && strCrypto !== null)
                            objSave[deepKey[0]][deepKey[1]] = strCrypto;
                        if (objDecrypt !== null && strDecrypto !== null)
                            objDecrypt[deepKey[0]][deepKey[1]] = strDecrypto;
                    }
                }
            }
            catch (error) {
                result = null;
            }
            if (result === null) {
                objDecrypt = null;
                objSave = null;
            }
            else if (result === true) {
                objSave = null;
            }
            const resp = { objDecrypt, objSave };
            return resp;
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.getAllKeys = (obj, prefix = "") => {
            let keys = [];
            for (const key of Object.keys(obj)) {
                const fullKey = prefix ? `${prefix}.${key}` : key;
                keys.push(fullKey);
                if (Array.isArray(obj[key]) === false && typeof obj[key] === "object" && obj[key] !== null) {
                    keys = keys.concat(this.getAllKeys(obj[key], fullKey));
                }
            }
            return keys;
        };
        this._keysToEncrypt = ["user", "pass", "username", "password", "secret", "secrets", "apiKey"];
        if (p_extraWords) {
            this._keysToEncrypt = this._keysToEncrypt.concat(p_extraWords);
        }
    }
    addObjects(obj1, obj2) {
        const result = {};
        for (const key in obj1) {
            result[key] = obj1[key];
        }
        for (const key in obj2) {
            result[key] = obj2[key];
        }
        return result;
    }
}
exports.ConfigFileDriverClass = ConfigFileDriverClass;
