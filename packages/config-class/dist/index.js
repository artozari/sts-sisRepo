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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigClass = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
__exportStar(require("./configFileDriver/config.file.driver.interface"), exports);
__exportStar(require("./common"), exports);
const fs = __importStar(require("node:fs"));
const ip = __importStar(require("ip"));
const YAML = __importStar(require("yaml"));
const node_path_1 = __importStar(require("node:path"));
const macId_class_1 = __importDefault(require("./mac_id/macId.class"));
const package_json_1 = require("package-json");
const config_file_driver_class_1 = require("./configFileDriver/config.file.driver.class");
/**
 * The ConfigClass is a TypeScript class that provides methods to retrieve configuration data
 * from a YAML file and environment variables.
 */
class ConfigClass {
    /**
     * This TypeScript constructor function initializes the properties of an application and reads a YAML
     * configuration file.
     *
     * @param p_appName The name of the application. It is a string that represents the name of the
     * application being initialized.
     * @param p_version The `p_version` parameter is a string that represents the version of the
     * application. It is used to set the version property of the `_appProperties` object.
     */
    constructor(p_appName, p_version, p_dirname, p_callbackCfgGral, p_callBackIndividualCfg, p_noCheckMac, p_prtConfig) {
        this._yamlDoc = null;
        this._ip = "XX.XX.XX.XX";
        this._appProperties = {};
        this.getConfigFile = () => {
            let resp;
            try {
                let cwd = process.cwd();
                if (cwd === undefined)
                    cwd = "";
                let fileName;
                const fileNameAux = process.env["configFile"];
                if (fileNameAux !== undefined)
                    fileName = fileNameAux.trim();
                else
                    fileName = "NotSign/config/config.yml";
                resp = (0, node_path_1.join)(cwd, fileName);
            }
            catch (error) {
                resp = "";
            }
            return resp;
        };
        this.getPortHttp = () => {
            let sal = "";
            try {
                let portS;
                const portN = this.getNumber(["HTTP", "PORT"]);
                if (portN !== undefined)
                    portS = portN.toString();
                sal = process.env["PORT"] ? process.env["PORT"].trim() : (portS ?? "5000");
            }
            catch (error) {
                sal = "5000";
            }
            return sal;
        };
        this.getPortSecHttp = () => {
            let sal = "";
            try {
                let portsS;
                const portN = this.getNumber(["HTTP", "PORTS"]);
                if (portN !== undefined)
                    portsS = portN.toString();
                sal = process.env["PORTS"] ? process.env["PORTS"].trim() : (portsS ?? "5001");
            }
            catch (error) {
                sal = "5001";
            }
            return sal;
        };
        this.getDataObj = (p_find0, p_find1) => {
            let sal = "";
            let obj = null;
            try {
                if (this._yamlDoc !== null) {
                    obj = this._yamlDoc;
                    if (obj !== null) {
                        const data = obj[p_find0];
                        if (data !== undefined && data !== null)
                            sal = data[p_find1];
                    }
                }
            }
            catch {
                sal = "";
            }
            return sal;
        };
        this.checkPortEnv = (p_param) => {
            let sal = undefined;
            try {
                if (p_param[0] === "HTTP" && p_param[1] === "PORT") {
                    try {
                        sal = process.env["PORT"] ? Number(process.env["PORT"]) : undefined;
                    }
                    catch (error) {
                        sal = undefined;
                    }
                }
            }
            catch (error) {
                sal = undefined;
            }
            return sal;
        };
        this.printErrors = (p_record, p_errors) => {
            console.log("\n\n**************************************** VALIDATION ERRORS START ****************************************");
            console.log("Record:", p_record, "\n");
            if (p_errors instanceof Error) {
                console.log(`${p_errors.name}: ${p_errors.message}`);
            }
            else if (p_errors instanceof Array && p_errors.length > 0) {
                p_errors.forEach((error) => {
                    console.log(`Property ${error.property}`);
                    if (error.children) {
                        error.children.forEach((child) => {
                            console.log(`-- Property ${child.property} has error`, child.constraints);
                        });
                    }
                });
            }
            console.log("**************************************** VALIDATION ERRORS END *****************************************\n\n");
        };
        this.procFile = (p_title, p_file, p_callbackCfg, p_prtConfig) => {
            try {
                const configFileDriver = new config_file_driver_class_1.ConfigFileDriverClass();
                const dataFile = fs.readFileSync(p_file, "utf8");
                const yamlDoc = YAML.parse(dataFile);
                const respChk = configFileDriver.checkEncryption(yamlDoc);
                let objDecrypt = respChk.objDecrypt;
                const objSave = respChk.objSave;
                if (typeof p_callbackCfg === "function") {
                    const resp = p_callbackCfg(objDecrypt);
                    if (resp instanceof Error || (resp instanceof Array && resp.length > 0)) {
                        this.printErrors(p_title, resp);
                        process.exit(1);
                    }
                    else {
                        objDecrypt = resp;
                        if (this.canPrint(p_prtConfig))
                            console.log("validation ok:", objDecrypt);
                    }
                }
                if (objSave !== null) {
                    const newYaml = YAML.stringify(objSave);
                    fs.writeFileSync(p_file, newYaml);
                }
                console.log("File CONFIG - OK:", p_title, "->", p_file);
                return objDecrypt;
            }
            catch (error) {
                console.log("File CONFIG - ERROR:", p_title, "->", p_file);
                console.log(error);
                return undefined;
            }
        };
        this.canPrint = (p_prtConfig) => {
            let resp;
            try {
                const developmentMode = process.env.NODE_ENV === "development" || false;
                if (p_prtConfig === undefined)
                    resp = false;
                else if (developmentMode === false)
                    resp = false;
                else
                    resp = true;
            }
            catch (error) {
                resp = false;
            }
            return resp;
        };
        const getResult = (p_yamlCheckIndividual, p_yamlCheckGral) => {
            let resp;
            try {
                const configFileDriver = new config_file_driver_class_1.ConfigFileDriverClass();
                if (p_yamlCheckGral !== undefined &&
                    p_yamlCheckGral !== null &&
                    p_yamlCheckIndividual !== null &&
                    p_yamlCheckIndividual !== undefined) {
                    resp = configFileDriver.addObjects(p_yamlCheckGral, p_yamlCheckIndividual);
                    if (this.canPrint(p_prtConfig))
                        console.log(resp);
                }
                else if (p_yamlCheckIndividual !== null && p_yamlCheckIndividual !== undefined) {
                    resp = p_yamlCheckIndividual;
                    if (this.canPrint(p_prtConfig))
                        console.log(resp);
                }
                else {
                    resp = null;
                    console.log("ERROR: yamlCheckLocal and yamlCheckGral are null");
                }
            }
            catch (error) {
                resp = null;
            }
            return resp;
        };
        const macId = new macId_class_1.default();
        try {
            let yamlCheckIndividual = null;
            let yamlCheckGral = null;
            const pj = new package_json_1.PackageJsonClass(p_dirname ?? "", p_appName, p_version);
            this._appProperties = pj.getData();
            // gets the configuration individual file
            const localFile = this.getConfigFile();
            yamlCheckIndividual = this.procFile("Individual", localFile, p_callBackIndividualCfg, p_prtConfig);
            // file general
            if (yamlCheckIndividual !== null && yamlCheckIndividual !== undefined) {
                let gralFile = yamlCheckIndividual["CONFIG_FILE"]["general"];
                if (gralFile !== undefined) {
                    if (node_path_1.default.isAbsolute(gralFile) === false) {
                        const projectPath = node_path_1.default.resolve(process.cwd());
                        gralFile = node_path_1.default.join(projectPath, gralFile);
                        // console.log("Path del proyecto:", projectPath, "--->", gralFile);
                    }
                    yamlCheckGral = this.procFile("General", gralFile, p_callbackCfgGral, p_prtConfig);
                }
            }
            this._yamlDoc = getResult(yamlCheckIndividual, yamlCheckGral);
            // gets the IP address
            this._ip = ip.address();
            // The code is retrieving the value of the 'MAC_ID' property from the YAML configuration file or environment variables using the `get` method of the `ConfigClass`.
            // The value is then passed to the `checkMac` method of the `macId` object, which performs some validation or processing on the MAC ID.
            const strMacId = this.get(["MAC_ID", "mac"]);
            if (p_noCheckMac !== true)
                macId.checkMac(strMacId);
        }
        catch (err) {
            console.log("ERROR YAML:", err.message);
            macId.checkMac("00:00:00:00:00:00");
        }
    }
    /**
     * The start function is a void function in TypeScript.
     */
    start() {
        // empty
    }
    /**
     * The function `get` retrieves specific values based on the provided parameters from various sources
     * such as environment variables and YAML configuration.
     *
     * @param p_param .The `p_param` parameter is an array of strings where the search parameters are
     * @return a string value with the searched parameter. If you cannot find the parameter, return an empty string.
     */
    get(p_param) {
        let sal = "";
        try {
            if (p_param[0] === "APP" && p_param[1] === "SRV_NAME")
                sal = this._appProperties.name;
            else if (p_param[0] === "APP" && p_param[1] === "SRV_VER")
                sal = this._appProperties.version;
            else if (p_param[0] === "APP" && p_param[1] === "PORT_HTTP")
                sal = this.getPortHttp();
            else if (p_param[0] === "APP" && p_param[1] === "PORT_HTTPS")
                sal = this.getPortSecHttp();
            else if (p_param[0] === "APP" && p_param[1] === "CWD")
                sal = process.cwd();
            else if (p_param[0] === "APP" && p_param[1] === "IP")
                sal = this._ip;
            else
                sal = this.getDataObj(p_param[0], p_param[1]);
        }
        catch {
            sal = "";
        }
        return sal;
    }
    /**
     * The function `getArray` returns an array of strings based on a parameter passed in, using a YAML
     * document.
     *
     * @param p_param The `p_param` parameter is an array of strings where the search parameters are
     * @return an array of strings with the searched parameter. If you cannot find the parameter, return an empty array the string.
     */
    getArray(p_param) {
        let sal = [];
        let obj = null;
        try {
            if (this._yamlDoc !== null) {
                obj = this._yamlDoc;
                if (obj !== null) {
                    sal = this.getArrayFromObject(obj, p_param[0], p_param[1]);
                }
            }
        }
        catch {
            sal = [];
        }
        return sal;
    }
    getArrayFromObject(obj, key1, key2) {
        let arr;
        try {
            const obj1 = obj[key1];
            if (obj1 !== undefined && obj1 !== null) {
                const obj2 = obj1[key2];
                if (obj2 !== undefined && obj2 !== null) {
                    arr = obj2;
                }
                else {
                    arr = obj1;
                }
            }
            else
                arr = [];
        }
        catch (error) {
            arr = [];
        }
        return arr;
    }
    /**
     * The `getNumber` method is a function in the `ConfigClass` class that retrieves a specific value
     * from a YAML document based on the provided parameters
     *
     * @param p_param The `p_param` parameter is an array of strings where the search parameters are
     * @return an array of strings with the searched parameter. If you cannot find the parameter, return an empty array the string.
     */
    getNumber(p_param) {
        let sal = undefined;
        let obj = null;
        try {
            sal = this.checkPortEnv(p_param);
            if (sal === undefined && this._yamlDoc !== null) {
                obj = this._yamlDoc;
                if (obj !== null) {
                    const value = obj[p_param[0]];
                    if (value !== undefined && value !== null) {
                        const p = value[p_param[1]];
                        if (typeof p !== "number")
                            sal = Number(p);
                        else
                            sal = p;
                    }
                    else
                        sal = undefined;
                }
            }
        }
        catch {
            sal = undefined;
        }
        return sal;
    }
    /**
     * The function `getBoolean` retrieves a boolean value from a YAML document based on the provided parameters.
     *
     * @param p_param The parameter `p_param` is an array of strings. It is expected to have two elements:
     * `p_param[0]` and `p_param[1]` with the searched parameter.
     * @return a boolean value or undefined.
     */
    getBoolean(p_param) {
        let sal = undefined;
        let obj = null;
        try {
            if (this._yamlDoc !== null) {
                obj = this._yamlDoc;
                if (obj !== null) {
                    const pepe = obj[p_param[0]];
                    if (pepe !== undefined && pepe !== null) {
                        const p = pepe[p_param[1]];
                        if (typeof p !== "boolean")
                            sal = Boolean(p);
                        else
                            sal = p;
                    }
                    else
                        sal = undefined;
                }
            }
        }
        catch {
            sal = undefined;
        }
        return sal;
    }
    /**
     * The function `getServiceId` generates the Service ID.
     * The Service ID is made up of SRV_NAME, MAC_ID, HTTP and HTTPS.
     *
     * @return Return the Service ID.
     */
    getServiceId(p_full) {
        let sal = null;
        try {
            // generate mac
            const mac = this.get(["MAC_ID", "mac"]);
            const macArray = mac.split(":");
            const macJoin = macArray.join("");
            // generate ip
            const ipCfg = this.get(["APP", "IP"]);
            const ipArray = ipCfg.split(".");
            let ipJoin;
            if (ipArray.length === 4) {
                ipJoin = ipArray[0].padStart(3, "0") + ipArray[1].padStart(3, "0") + ipArray[2].padStart(3, "0") + ipArray[3].padStart(3, "0");
            }
            else {
                ipJoin = "000000000000";
            }
            let name = this.get(["APP", "SRV_NAME"]);
            if (name !== "")
                name = name + "__";
            const macId = macJoin;
            let ip = p_full ? ipJoin : "";
            if (ip !== "")
                ip = "__" + ip;
            let http = this.get(["APP", "PORT_HTTP"]);
            if (http !== "")
                http = "__" + http;
            let https = this.get(["APP", "PORT_HTTPS"]);
            if (https !== "")
                https = "__" + https;
            sal = name + macId + ip + http + https;
            if (sal === "")
                sal = null;
        }
        catch (error) {
            sal = null;
        }
        return sal;
    }
}
exports.ConfigClass = ConfigClass;
