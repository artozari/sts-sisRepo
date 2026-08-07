"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyboardDriverClass = void 0;
/**
 * @class KeyboardDriverClass
 * @description Class to manage keyboard driver
 * @param {_keyQ} number - number of keys
 */
class KeyboardDriverClass {
    /**
     * @constructor
     * @param {_keyQ} number - number of keys
     */
    constructor(_keyQ) {
        this._keyQ = _keyQ;
        this.arrayKeys = [];
        // fill the array with the initial state
        this.initialState();
    }
    /**
     * @function procKeys
     * @description Process the keys
     * @param {p_key} boolean[] - array of boolean input keys
     */
    procKeys(p_key) {
        const resp = [];
        try {
            // make the length of the array of keys equal to the length of the array stored in the class
            if (p_key.length > this.arrayKeys.length) {
                p_key.length = this._keyQ;
            }
            else if (p_key.length < this.arrayKeys.length) {
                // create an array of the missing keys and fill it with false
                const arrayReFill = new Array(this.arrayKeys.length - p_key.length).fill(false);
                // concatenate the two arrays
                p_key = p_key.concat(arrayReFill);
                // set the length of the array to the number of keys
                p_key.length = this._keyQ;
            }
            // get the current time
            const now = Date.now();
            // create an array of the keys that have changed
            for (let i = 0; i < this._keyQ; i++) {
                if (this.arrayKeys[i].state !== p_key[i]) {
                    // calculate the time interval
                    const deltaT = now - this.arrayKeys[i].time;
                    // fill the response array with the keys that have changed
                    resp.push({ key: i, action: p_key[i], time: deltaT <= 20000 ? deltaT : 20000 });
                    // update the state and time of the key
                    this.arrayKeys[i].state = p_key[i];
                    this.arrayKeys[i].time = now;
                }
            }
            // if there are keys that have changed, log them
            if (resp.length > 0) {
                console.log(resp);
            }
        }
        catch (error) {
            // if there is an error, fill the array with the initial state
            this.initialState();
            resp.length = 0;
        }
        return resp;
    }
    /**
     * Initializes the state of the `arrayKeys` property.
     *
     * This function iterates over the range of `this._keyQ` and pushes a new object
     * to the `arrayKeys` array. The object has two properties: `state` set to
     * `false` and `time` set to the current timestamp.
     *
     * @return {void} This function does not return a value.
     */
    initialState() {
        this.arrayKeys.length = 0;
        for (let i = 0; i < this._keyQ; i++) {
            this.arrayKeys.push({ state: false, time: Date.now() });
        }
    }
}
exports.KeyboardDriverClass = KeyboardDriverClass;
