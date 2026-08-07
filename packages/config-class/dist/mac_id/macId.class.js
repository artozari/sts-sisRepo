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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const os = __importStar(require("node:os"));
const utility_libraries_1 = require("utility-libraries");
/**
 * The `MacIdClass` is a TypeScript class that provides methods to check if a given MAC address exists in the network interfaces of the current machine.
 */
class MacIdClass {
    constructor() {
        /**
         * The method `findMac` checks if a given MAC address exists in the network interfaces of the current machine.
         * NOTE: If the "Mac_ID:mac" field is not defined or incorrect, the application stops.
         *
         * @param p_mac The parameter `p_mac` is a string representing the MAC address that we want to find in the network interfaces.
         * @return The function `findMac` returns a boolean value.
         */
        this.getListMac = () => {
            let sal = [];
            try {
                const netInterfaces = os.networkInterfaces();
                const keysNetInterface = Object.keys(netInterfaces);
                keysNetInterface.forEach((key) => {
                    const arrNet = netInterfaces[key];
                    if (arrNet !== undefined) {
                        arrNet.forEach((netInterface) => {
                            if (netInterface.mac !== "00:00:00:00:00:00") {
                                if (sal.includes(netInterface.mac) === false)
                                    sal.push(netInterface.mac);
                            }
                            // switch (netInterface.mac) {
                            //   case "00:00:00:00:00:00":
                            //     break;
                            //   default:
                            //     if (sal.includes(netInterface.mac) === false) sal.push(netInterface.mac);
                            //     break;
                            // }
                        });
                    }
                });
            }
            catch (error) {
                sal = [];
            }
            return sal;
        };
        /**
         * The method `findMac` checks if a given MAC address exists in the network interfaces of the current machine.
         *
         * @param p_mac The parameter `p_mac` is a string representing the MAC address that we want to find in the network interfaces.
         * @return The function `findMac` returns a boolean value.
         */
        this.findMac = (p_findMac, p_listMacs) => {
            let sal = false;
            try {
                if (p_findMac !== "00:00:00:00:00:00") {
                    sal = p_listMacs.includes(p_findMac);
                }
            }
            catch (error) {
                sal = false;
            }
            return sal;
        };
        /**
         * The method "verify" takes a string parameter "p_findMac" and returns the result of calling the "findMac" function with "p_findMac"
         * and the result of calling the "getListMac" function.
         *
         * @param p_findMac A string representing the MAC address that needs to be verified.
         * @return The function `verify` is returning the result of calling the `findMac` function with the `p_findMac` parameter
         * and the result of calling the `getListMac` function.
         */
        this.verify = (p_findMac) => {
            return this.findMac(p_findMac, this.getListMac());
        };
        /**
         * The method `checkMac` checks if a given MAC address exists in a list and waits until it is found.
         *
         * @param p_findMac A string representing the MAC address to be checked.
         */
        this.checkMac = (p_findMac) => {
            if (p_findMac === undefined) {
                for (;;) {
                    let ms = 5000;
                    let curr = new Date().getTime();
                    ms += curr;
                    while (curr < ms) {
                        curr = new Date().getTime();
                    }
                    console.log("***************************************************************");
                    console.log('The "MAC_ID:mac" field is not defined in the "config.yml" file.');
                    console.log("The mac list is:", this.getListMac());
                    console.log("***************************************************************");
                    (0, utility_libraries_1.processExitFunction)(2);
                }
            }
            else if (this.verify(p_findMac) === false) {
                let thereIsMac = false;
                while (thereIsMac === false) {
                    let ms = 5000;
                    let curr = new Date().getTime();
                    ms += curr;
                    while (curr < ms) {
                        curr = new Date().getTime();
                    }
                    thereIsMac = this.verify(p_findMac);
                    console.log("*************************************************************");
                    console.log('The "MAC_ID:mac" field is incorrect in the "config.yml" file.');
                    console.log("The mac list is:", this.getListMac());
                    (0, utility_libraries_1.processExitFunction)(2);
                    console.log("***************************************************************");
                }
            }
        };
    }
}
exports.default = MacIdClass;
