"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processExitFunction = void 0;
const processExitFunction = (p_code) => {
    let codeNum = Number(p_code);
    if (isNaN(codeNum)) {
        codeNum = 1;
        console.log("Process Exit message.....: " + p_code);
    }
    process.exit(codeNum);
};
exports.processExitFunction = processExitFunction;
