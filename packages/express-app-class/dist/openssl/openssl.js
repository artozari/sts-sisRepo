"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const node_forge_1 = __importDefault(require("node-forge"));
const node_path_1 = require("node:path");
// interface AttributesOpenSSLInterface {
//     type: string;
//     value: string;
//     valueTagClass: number;
//     name: string;
//     shortName: string;
// }
class OpenSslClass {
    constructor() {
        this.getCert = () => {
            return this.certFile;
        };
        this.getKey = () => {
            return this.keyFile;
        };
        this.readCertFile = (p_file) => {
            let sal;
            try {
                // read the file
                let fileName;
                if (p_file === undefined) {
                    fileName = (0, node_path_1.join)(process.cwd(), "NotSign", "openssl", "server.crt");
                }
                else {
                    fileName = p_file;
                }
                console.log("fileName ->", fileName);
                sal = node_fs_1.default.readFileSync(fileName, "utf8").toString();
            }
            catch (error) {
                sal = "";
            }
            return sal;
        };
        this.readKeyFile = (p_file) => {
            let sal;
            try {
                // read the file
                let fileName;
                if (p_file === undefined) {
                    fileName = (0, node_path_1.join)(process.cwd(), "NotSign", "openssl", "server.key");
                }
                else {
                    fileName = p_file;
                }
                console.log("fileName ->", fileName);
                sal = node_fs_1.default.readFileSync(fileName, "utf8").toString();
            }
            catch (error) {
                sal = "";
            }
            return sal;
        };
        this.verify = () => {
            return this.certFile !== "" && this.keyFile !== "";
        };
        this.load = (p_certFile = undefined, p_keyFile = undefined) => {
            try {
                this.certFile = this.readCertFile(p_certFile);
                this.keyFile = this.readKeyFile(p_keyFile);
                this.certificate = node_forge_1.default.pki.certificateFromPem(this.certFile);
            }
            catch (error) {
                // empty
            }
        };
        this.notBefore = () => {
            let sal = null;
            try {
                if (this.certificate !== null) {
                    sal = this.certificate.validity.notBefore;
                }
            }
            catch (error) {
                sal = null;
            }
            return sal;
        };
        this.notAfter = () => {
            let sal = null;
            try {
                if (this.certificate !== null) {
                    sal = this.certificate.validity.notAfter;
                }
            }
            catch (error) {
                sal = null;
            }
            return sal;
        };
        this.attribute = (p_key) => {
            let sal = undefined;
            try {
                if (this.certificate !== null) {
                    this.certificate.issuer.attributes.forEach((attibute) => {
                        if (attibute.name === p_key) {
                            sal = attibute.value;
                        }
                    });
                }
            }
            catch (error) {
                sal = undefined;
            }
            return sal;
        };
        this.daysOfExpiration = () => {
            let sal = null;
            try {
                const now = new Date();
                const notBefore = this.notBefore();
                const notAfter = this.notAfter();
                if (notAfter !== null && notBefore !== null) {
                    if (now > notAfter) {
                        /* empty */
                    }
                    else if (now < notBefore) {
                        /* empty */
                    }
                    else {
                        const nowMilli = Date.parse(now.toString());
                        const notAfterMilli = Date.parse(notAfter.toString());
                        const diff = Math.abs(nowMilli - notAfterMilli);
                        sal = Math.round(diff / (1000 * 60 * 60 * 24));
                    }
                }
            }
            catch (error) {
                sal = null;
            }
            return sal;
        };
        this.keyFile = "";
        this.certFile = "";
        this.certificate = null;
    }
}
exports.default = OpenSslClass;
