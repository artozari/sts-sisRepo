"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageJsonClass = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = require("node:path");
class PackageJsonClass {
    constructor(p_dirname, _name, _version) {
        this._name = _name;
        this._version = _version;
        this._dataPackageJson = undefined;
        try {
            const dirname = (0, node_path_1.join)(p_dirname, "..", "package.json");
            this._dataPackageJson = JSON.parse(node_fs_1.default.readFileSync(dirname, {
                encoding: "utf8",
                flag: "r",
            }));
        }
        catch (error) {
            console.error(error);
        }
    }
    getData() {
        const resp = {};
        resp.name = this._dataPackageJson?.name ?? this._name ?? "undefined-service";
        resp.version = this._dataPackageJson?.version ?? this._version ?? "0.0.0";
        resp.description = this._dataPackageJson?.description;
        resp.main = this._dataPackageJson?.main;
        resp.keywords = this._dataPackageJson?.keywords;
        resp.author = this._dataPackageJson?.author;
        resp.license = this._dataPackageJson?.license;
        return resp;
    }
}
exports.PackageJsonClass = PackageJsonClass;
