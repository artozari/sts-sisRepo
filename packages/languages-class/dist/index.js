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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LANGSCODES_OFF = exports.LANGSCODES = void 0;
const languages_class_1 = require("./languages/languages.class");
__exportStar(require("./languages/interfaces"), exports);
__exportStar(require("./languages/languages.class"), exports);
const LANGS = new languages_class_1.LanguagesClass();
exports.LANGSCODES = LANGS.getAllLanguageCode();
exports.LANGSCODES_OFF = structuredClone(exports.LANGSCODES);
exports.LANGSCODES_OFF.push("OFF");
// console.log("LANGSCODES =", LANGSCODES);
// console.log("LANGSCODES_OFF =", LANGSCODES_OFF);
// console.log("Package: languages-class");
// import { LanguagesClass } from "./languages/languages.class";
// // From node the module is accesible with a simple require
// const LANGS: LanguagesClass = new LanguagesClass();
// // languages.getAllLanguageCode() return an array of all ISO 639-1 language code supported
// const langscodes: string[] = LANGS.getAllLanguageName();
// console.log(langscodes);
// // iterate this array
// let num_languages;
// for (num_languages = 0; num_languages < langscodes.length; num_languages++) {
//   // show a string representation of the object return by languages.getLanguageInfo(langcode)
//   console.log(langscodes[num_languages]);
// }
// // show the number of languages supported
// console.log("Languages supported: " + num_languages);
// // test languages.isValid(langcode) function
// console.log("¿isValid 'kaka' language code? " + LANGS.isValid("kaka"));
// console.log("¿isValid 'es' language code? " + LANGS.isValid("es"));
