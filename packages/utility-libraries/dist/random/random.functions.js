"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomInt = void 0;
const getRandomInt = (p_max, p_min) => {
    if (p_min === undefined)
        p_min = 0;
    const min = Math.ceil(p_min);
    const max = Math.floor(p_max);
    return Math.floor(Math.random() * (max - min) + min);
};
exports.getRandomInt = getRandomInt;
