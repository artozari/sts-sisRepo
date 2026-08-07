"use strict";
/* v8 ignore next 26 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const class_validator_1 = require("class-validator");
const config_class_1 = require("config-class");
const secure_server_class_1 = __importDefault(require("./secureServer/secure.server.class"));
const log_system_class_1 = require("log-system-class");
const express_app_class_1 = require("express-app-class");
const individual_validator_class_1 = require("./individualValidators/classes/individual.validator.class");
const APP_VERSION = "1.0.0";
const APP_NAME = "mqtts-broker";
// *********************
// *** CONFIGURATION ***
// *********************
const callBackIndividualConfig = (p_obj) => {
    let resp;
    try {
        if (p_obj === null || p_obj === undefined) {
            throw new Error("Object is null or undefined");
        }
        const dataCheck = new individual_validator_class_1.IndividualValidatorClass(p_obj);
        resp = (0, class_validator_1.validateSync)(dataCheck, { whitelist: true });
        if (resp instanceof Array && resp.length === 0) {
            resp = dataCheck;
        }
    }
    catch (error) {
        resp = error;
    }
    return resp;
};
const CONFIG = new config_class_1.ConfigClass(APP_NAME, APP_VERSION, __dirname, undefined, callBackIndividualConfig, true);
// ******************
// *** LOG SYSTEM ***
// ******************
const LOGS = new log_system_class_1.LogSystemClass(CONFIG);
// *******************
// *** SERVER HTTP ***
// *******************
const APP = new express_app_class_1.ExpressAppClass(CONFIG, null);
//set routes
// APP.setRouter(EMAIL.getRouterMailingList());
APP.listen();
// ********************
// *** BROKER MQTTS ***
// ********************
const AEDES = new secure_server_class_1.default(CONFIG, LOGS);
AEDES.start();
