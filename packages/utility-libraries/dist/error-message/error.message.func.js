"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorMessageFunc = (p_err) => {
    let errMsg;
    if (p_err instanceof Error)
        errMsg = p_err.message;
    else
        errMsg = "Internal error in the method.";
    return errMsg;
};
exports.default = ErrorMessageFunc;
