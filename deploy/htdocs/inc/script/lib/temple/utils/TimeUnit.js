define(["require", "exports"], function (require, exports) {
    /**
     * A collection of constants for date and time units.
     *
     * @author Thijs Broerse
     */
    var TimeUnit = (function () {
        function TimeUnit() {
        }
        TimeUnit.YEAR = "year";
        /**
         * A constant representing the month unit in date and time values.
         */
        TimeUnit.MONTH = "month";
        /**
         * A constant representing the day unit in date and time values.
         */
        TimeUnit.DAY = "day";
        /**
         * A constant representing the hours unit in date and time values.
         */
        TimeUnit.HOURS = "hours";
        /**
         * A constant representing the minutes unit in date and time values.
         */
        TimeUnit.MINUTES = "minutes";
        /**
         * A constant representing the seconds unit in date and time values.
         */
        TimeUnit.SECONDS = "seconds";
        /**
         * A constant representing the milliseconds unit in date and time values.
         */
        TimeUnit.MILLISECONDS = "milliseconds";
        return TimeUnit;
    })();
    return TimeUnit;
});
