"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareUint8Arrays = compareUint8Arrays;
function compareUint8Arrays(p_arr1, p_arr2) {
    if (p_arr1.length !== p_arr2.length) {
        return false;
    }
    for (let i = 0; i < p_arr1.length; i++) {
        if (p_arr1[i] !== p_arr2[i]) {
            return false;
        }
    }
    return true;
}
