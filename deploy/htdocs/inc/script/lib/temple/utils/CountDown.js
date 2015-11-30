var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "lib/temple/core/Destructible"], function (require, exports, Destructible) {
    /**
     * Class for calculating the remaining time till a specific Date and time.
     *
     * @class CountDown
     * @author Arjan van Wijk
     */
    var CountDown = (function (_super) {
        __extends(CountDown, _super);
        function CountDown(endDate, allowNegative) {
            if (endDate === void 0) { endDate = null; }
            if (allowNegative === void 0) { allowNegative = false; }
            _super.call(this);
            this._startDate = new Date();
            this.setEndDate(endDate);
            this._allowNegative = allowNegative;
        }
        /**
         * Date when the CountDown is ended
         */
        CountDown.prototype.getEndDate = function () {
            return this._endDate;
        };
        /**
         * @method setEndDate
         * @param {Date} value
         * @return void
         */
        CountDown.prototype.setEndDate = function (value) {
            this._endDate = value;
        };
        /**
         * @private
         * Set the time difference in miliseconds to work with (instead of an end-date)
         * Use 2 constant times (endtime - now) and substract the getTimer
         */
        CountDown.prototype.setTimeDiff = function (value) {
            this._timeDiff = value;
        };
        /**
         * Date when the CountDown is started
         *
         * @method getStartDate
         * @return Date
         */
        CountDown.prototype.getStartDate = function () {
            return this._startDate;
        };
        /**
         * @public
         * @method setStartDate
         * @param {Date} value
         * @return void
         */
        CountDown.prototype.setStartDate = function (value) {
            this._startDate = value;
        };
        /**
         * Duration in milliseconds
         *
         * @method getDuration
         * @return number
         * @public
         */
        CountDown.prototype.getDuration = function () {
            return this._duration;
        };
        /**
         * Duration in milliseconds
         *
         * @method setDuration
         * @param {number} value
         * @return number
         * @public
         */
        CountDown.prototype.setDuration = function (value) {
            this._duration = value;
        };
        /**
         * Use only when set duration, functions as restart when called twice
         *
         * @method start
         * @param {number} duration duration in milliseconds
         * @return void
         */
        CountDown.prototype.start = function (duration) {
            if (duration === void 0) { duration = NaN; }
            if (!isNaN(duration)) {
                this._duration = duration;
            }
            if (isNaN(this._duration)) {
                throw 'duration not set';
            }
            this._startDate = new Date();
            this._endDate = new Date();
            this._endDate.setMilliseconds(this._endDate.getMilliseconds() + this._duration);
            this._isPaused = false;
        };
        /**
         * Stop the CountDown
         *
         * @method stop
         * @return void
         */
        CountDown.prototype.stop = function () {
            this._endDate = null;
            this._pauseTime = NaN;
            this._pauseEndTime = null;
            this._isPaused = false;
        };
        /**
         * @method pause
         * @return void
         */
        CountDown.prototype.pause = function () {
            this._pauseTime = new Date().getTime();
            this._pauseEndTime = this.getTime();
            this._isPaused = true;
        };
        /**
         * @method resume
         * @return void
         */
        CountDown.prototype.resume = function () {
            if (this._isPaused) {
                this._endDate.setMilliseconds(this._endDate.getMilliseconds() - (new Date().getTime() - this._pauseTime));
                this._isPaused = false;
            }
        };
        /**
         * @method isPaused
         * @return boolean
         */
        CountDown.prototype.isPaused = function () {
            return this._isPaused;
        };
        /**
         * Get the time till end as date
         *
         * @method getTime
         * @return Date
         */
        CountDown.prototype.getTime = function () {
            if (this._isPaused) {
                return this._pauseEndTime;
            }
            else if (this._endDate) {
                var diff = this._endDate.getTime() - new Date().getTime();
                if (diff < 0 && !this._allowNegative) {
                    diff = 0;
                }
                return new Date(1970, 0, 1, 0, 0, 0, diff);
            }
            else {
                return null;
            }
        };
        /**
         * Get the time till end as date
         *
         * @method getYears
         * @return number
         */
        CountDown.prototype.getYears = function () {
            return this.getTime().getFullYear() - 1970;
        };
        /**
         * Get the total amount of months till end.
         *
         * @method getTotalMonths
         * @return number
         */
        CountDown.prototype.getTotalMonths = function () {
            return this.getTime().getMonth() + 1 - 1 + (this.getYears() * 12);
        };
        /**
         * Get the total amount of months till end minus the years.
         *
         * @method getMonths
         * @return number
         */
        CountDown.prototype.getMonths = function () {
            return this.getTime().getMonth() + 1 - 1;
        };
        /**
         * Get the total amount of weeks till end
         *
         * @method getTotalWeeks
         * @return number
         */
        CountDown.prototype.getTotalWeeks = function () {
            return Math.floor(this.getTotalTime() / 1000 / 60 / 60 / 24 / 7);
        };
        /**
         * Get the total amount of weeks till end minus the years.
         *
         * @method getWeeks
         * @return number
         */
        CountDown.prototype.getWeeks = function () {
            if (this._endDate) {
                return Math.floor(this.getDays() / 7);
            }
            else {
                return this.getTotalWeeks();
            }
        };
        /**
         * Get the total amount of days till end.
         *
         * @method getTotalDays
         * @return number
         */
        CountDown.prototype.getTotalDays = function () {
            return this.getTotalTime() / 1000 / 60 / 60 / 24;
        };
        /**
         * Get the total amount of days till end minus the years.
         *
         * @method getDays
         * @return number
         */
        CountDown.prototype.getDays = function () {
            if (this._endDate) {
                return this.getTime().getDate() - 1;
            }
            else {
                return Math.floor(this.getTotalDays());
            }
        };
        /**
         * @method getTotalHours
         * @return {number}
         */
        CountDown.prototype.getTotalHours = function () {
            return this.getTotalTime() / 1000 / 60 / 60;
        };
        /**
         * @method getHours
         * @return {number}
         */
        CountDown.prototype.getHours = function () {
            if (this._endDate) {
                return this.getTime().getHours();
            }
            else {
                return Math.floor(this.getTotalHours() % 24);
            }
        };
        /**
         * @method getTotalMinutes
         * @return {number}
         */
        CountDown.prototype.getTotalMinutes = function () {
            return this.getTotalTime() / 1000 / 60;
        };
        /**
         * @method getMinutes
         * @return {number}
         */
        CountDown.prototype.getMinutes = function () {
            if (this._endDate) {
                return this.getTime().getMinutes();
            }
            else {
                return Math.floor(this.getTotalMinutes() % 60);
            }
        };
        /**
         * @method getTotalSeconds
         * @return {number}
         */
        CountDown.prototype.getTotalSeconds = function () {
            return this.getTotalTime() / 1000;
        };
        /**
         * @method getSeconds
         * @return {number}
         */
        CountDown.prototype.getSeconds = function () {
            if (this._endDate) {
                return this.getTime().getSeconds();
            }
            else {
                return Math.floor(this.getTotalSeconds() % 60);
            }
        };
        /**
         * @method getTotalMilliseconds
         * @return {number}
         */
        CountDown.prototype.getTotalMilliseconds = function () {
            return this.getTotalTime();
        };
        /**
         * @method getMilliseconds
         * @return {number}
         */
        CountDown.prototype.getMilliseconds = function () {
            if (this._endDate) {
                return this.getTime().getMilliseconds();
            }
            else {
                return Math.floor(this.getMilliseconds());
            }
        };
        /**
         * @method getTotalTime
         * @return {number}
         */
        CountDown.prototype.getTotalTime = function () {
            var time = this.getTime();
            return time ? time.getTime() - (time.getTimezoneOffset() * 60 * 1000) : (this._allowNegative ? this._timeDiff : Math.max(this._timeDiff, 0));
        };
        /**
         * Get the relative time left till end, where 1 means that we are on the start and 0 means we are at the end.
         *
         * @method getRatio
         * @return {number}
         */
        CountDown.prototype.getRatio = function () {
            if (!this._startDate || !this._endDate) {
                return NaN;
            }
            return this.getTotalTime() / (this._endDate.getTime() - this._startDate.getTime());
        };
        /**
         * A Boolean which indicates if a negative value is allowed. If not all values will return 0 if endDate is in the past.
         *
         * @method getAllowNegative
         * @return {number}
         */
        CountDown.prototype.getAllowNegative = function () {
            return this._allowNegative;
        };
        /**
         * @method setAllowNegative
         * @return {number}
         * @public
         */
        CountDown.prototype.setAllowNegative = function (value) {
            this._allowNegative = value;
        };
        /**
         * @inheritDoc
         */
        CountDown.prototype.destruct = function () {
            this._endDate = null;
            this._startDate = null;
            this._pauseEndTime = null;
            _super.prototype.destruct.call(this);
        };
        return CountDown;
    })(Destructible);
    return CountDown;
});
