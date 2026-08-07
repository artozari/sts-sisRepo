"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpResponseClass = void 0;
const commons_1 = require("./commons");
class HttpResponseClass {
    constructor() {
        this.get = () => {
            return 'http-response-class v0.0.1';
        };
        this.OK = (res, data) => {
            return res.status(commons_1.HttpStatusConstant.OK).json({
                status: commons_1.HttpStatusConstant.OK,
                statusMsg: 'Success',
                data: data,
            });
        };
        this.Error = (res, p_error) => {
            const data = {};
            if (p_error instanceof Error) {
                data['msg'] = p_error?.message || undefined;
                data['name'] = p_error?.name || undefined;
                data['stack'] = p_error?.stack || undefined;
            }
            return res.status(commons_1.HttpStatusConstant.OK).json({
                status: commons_1.HttpStatusConstant.INTERNAL_SERVER_ERROR,
                statusMsg: 'Error',
                data,
            });
        };
        this.NotFound = (res, p_error) => {
            const data = {};
            if (p_error instanceof Error) {
                data['msg'] = p_error?.message || undefined;
                data['name'] = p_error?.name || undefined;
                data['stack'] = p_error?.stack || undefined;
            }
            return res.status(commons_1.HttpStatusConstant.NOT_FOUND).json({
                status: commons_1.HttpStatusConstant.NOT_FOUND,
                statusMsg: 'Error',
                data,
            });
        };
        this.Forbbiden = (res, data) => {
            return res.status(commons_1.HttpStatusConstant.FORBBIDEN).json({
                status: commons_1.HttpStatusConstant.FORBBIDEN,
                statusMsg: 'Forbbiden',
                data: data,
            });
        };
        this.errorsClassValidator = (res, p_errors) => {
            const data = [];
            try {
                p_errors.forEach((ve) => {
                    const newError = {
                        property: ve.property,
                        constraint: ve.constraints,
                    };
                    data.push(newError);
                });
                if (data.length > 0) {
                    return res.status(commons_1.HttpStatusConstant.BAD_REQUEST).json({
                        status: commons_1.HttpStatusConstant.BAD_REQUEST,
                        statusMsg: 'Validation errors',
                        data: data,
                    });
                }
                else {
                    throw new Error();
                }
            }
            catch (error) {
                return res.status(commons_1.HttpStatusConstant.INTERNAL_SERVER_ERROR).json({
                    status: commons_1.HttpStatusConstant.FORBBIDEN,
                    statusMsg: 'Validation errors',
                    data: 'Errors could not be determined.',
                });
            }
        };
    }
}
exports.HttpResponseClass = HttpResponseClass;
// **************************************************************************************************
// import { db } from "../main";
// import { LogDbInterface } from "../db/modules/log.db.class";
