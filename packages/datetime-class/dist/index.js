"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatetimeClass = void 0;
const luxon_1 = require("luxon");
/**
 * The `DatetimeClass` is a TypeScript class that provides various methods for working with dates and times,
 * including converting between different formats and calculating working days.
 */
class DatetimeClass {
    constructor() {
        /**
         * TODO: This method was not verified.
         * The `string2date` method is a TypeScript arrow function that takes a string representing a datetime value as input and
         * returns a JavaScript `Date` object.
         *
         * @param {string} p_datetime Date in string format.
         * @return Returns a date from the p_datetime parameter.
         */
        this.string2date = (p_datetime) => {
            const resp = luxon_1.DateTime.fromFormat(p_datetime, 'yyyy-MM-ddTHH:mm:ss.SSSZ');
            return resp.toJSDate();
        };
    }
    start() { }
    /**
     * The function `utc()` returns the current UTC time in milliseconds, or 0 if an error occurs.
     *
     * @return The function `utc()` returns a number representing the current date and time in UTC format, converted to milliseconds.
     */
    utc() {
        let sal;
        try {
            // generate date and time
            sal = luxon_1.DateTime.utc().toMillis();
        }
        catch (error) {
            sal = 0;
        }
        // output
        return sal;
    }
    /**
     * The function `utc_toISO` generates the current UTC date and time in ISO format and returns it as a string.
     *
     * @return The function `utc_toISO` returns a string representing the current date and time in UTC format, formatted according to the ISO 8601 standard.
     */
    utc_toISO() {
        let sal;
        try {
            // generate date and time
            sal = luxon_1.DateTime.utc().toISO();
        }
        catch (error) {
            sal = '';
        }
        // output
        return sal !== null ? sal : '';
    }
    /**
     * The function `strUtc_toMillis` takes a string representing a UTC date and time in the format 'yyyy-MM-dd HH:mm:ss.SSS' and
     * returns the corresponding number of milliseconds since the Unix epoch, or null if the input is invalid.
     *
     * @param p_date The parameter `p_date` is a string representing a date and time in the format 'yyyy-MM-dd HH:mm:ss.SSS'.
     * @return a number representing the milliseconds since the Unix epoch (January 1, 1970 00:00:00 UTC) if the input date string is valid.
     * If the input date string is invalid or an error occurs during the conversion, the function returns null.
     */
    strUtc_toMillis(p_date) {
        let sal;
        try {
            // generate date and time
            let d = luxon_1.DateTime.fromFormat(p_date, 'yyyy-MM-dd HH:mm:ss.SSS');
            sal = d.toMillis();
            if (isNaN(d.toMillis())) {
                // generate date and time
                d = luxon_1.DateTime.fromFormat(p_date, 'yyyy-MM-ddTHH:mm:ss.SSSZ');
                sal = d.toMillis();
            }
        }
        catch (error) {
            sal = null;
        }
        // output
        return sal;
    }
    /**
     * The function `millis_toISODate` takes a number representing milliseconds and returns a string representing the corresponding date in ISO format.
     *
     * @param p_millis The parameter `p_millis` is a number representing the number of milliseconds since January 1, 1970, 00:00:00 UTC.
     * @return a string representation of the date in ISO format.
     */
    millis_toISODate(p_millis) {
        let sal;
        try {
            // generate date and time
            sal = luxon_1.DateTime.fromMillis(p_millis).toISODate();
        }
        catch (error) {
            sal = '';
        }
        // output
        return sal !== null ? sal : '';
    }
    /**
     * The function `millis_toWorkingDay` takes a millisecond value and an end-of-day hour as input, and returns the date of the previous working day.
     *
     * @param p_millis The parameter `p_millis` represents the number of milliseconds since the Unix epoch (January 1, 1970 00:00:00 UTC).
     * @param p_eof The parameter `p_eof` represents the end of the working day in hours.
     * It is used to calculate the number of days to subtract from the given milliseconds to get the working day.
     * @return a string representing the date in ISO format (YYYY-MM-DD) that is a working day based on the given milliseconds and end of day hour.
     */
    millis_toWorkingDay(p_millis, p_eof) {
        let sal;
        try {
            // generate EOF
            const hourEof = 60 * p_eof;
            const hour = luxon_1.DateTime.fromMillis(p_millis).toLocal().hour;
            const min = luxon_1.DateTime.fromMillis(p_millis).toLocal().minute;
            const hourMin = 60 * hour + min;
            let dayMinus;
            if (hourMin <= hourEof)
                dayMinus = 1;
            else
                dayMinus = 0;
            sal = luxon_1.DateTime.fromMillis(p_millis)
                .minus({ days: dayMinus })
                .toISODate();
        }
        catch (error) {
            sal = '';
        }
        // output
        return sal !== null ? sal : '';
    }
    /**
     * The function `millis_toISO` takes a number representing milliseconds and returns a string representing the corresponding date and time in ISO format.
     *
     * @param p_millis The parameter `p_millis` is a number representing the number of milliseconds since the Unix epoch (January 1, 1970 00:00:00 UTC).
     * @return a string representation of the given millisecond value in ISO 8601 format.
     */
    millis_toISO(p_millis) {
        let sal;
        try {
            // generate date and time
            sal = luxon_1.DateTime.fromMillis(p_millis).toISO();
        }
        catch (error) {
            sal = '';
        }
        // output
        return sal !== null ? sal : '';
    }
    /**
     * The `millis_toStr` function converts a given number of milliseconds into a formatted string representing the equivalent time in days, hours, minutes, and seconds.
     *
     * @param p_millis The parameter `p_millis` represents the number of milliseconds.
     * @return a string value.
     */
    millis_toStr(p_millis) {
        let sal;
        try {
            const SECSxDAY = 24 * 3600;
            const secs = Math.floor(p_millis / 1000);
            const totalSecsDay = secs % SECSxDAY;
            const hoursDay = Math.floor(totalSecsDay / 3600);
            const strHour = hoursDay.toFixed().padStart(2, '0');
            const aux = totalSecsDay % 3600;
            const minsDay = Math.floor(aux / 60);
            const strMin = (minsDay % 60).toFixed().padStart(2, '0');
            const secsDay = aux % 60;
            const strSec = (secsDay % 60).toFixed().padStart(2, '0');
            const days = secs / SECSxDAY;
            const strTime = `${strHour}:${strMin}:${strSec}`;
            if (days < 1) {
                sal = strTime;
            }
            else {
                const strDays = days.toFixed().padStart(2, '0');
                sal = `${strDays}d ${strTime}`;
            }
        }
        catch (error) {
            sal = '#err_';
        }
        return sal;
    }
}
exports.DatetimeClass = DatetimeClass;
