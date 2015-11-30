define(["require", "exports"], function (require, exports) {
    var Birthdate = (function () {
        function Birthdate(yearValueTimestampOrDate, month, day) {
            if (!isNaN(month) && !isNaN(day)) {
                this.year = yearValueTimestampOrDate;
                this.month = month + 1;
                this.day = day;
            }
            else {
                this.parse(yearValueTimestampOrDate);
            }
        }
        Birthdate.prototype.parse = function (value) {
            this.fromDate(value instanceof Date ? value : new Date(value));
        };
        Birthdate.prototype.toDate = function () {
            return new Date(this.year, this.month - 1, this.day);
        };
        Birthdate.prototype.fromDate = function (date) {
            this.year = date.getFullYear();
            this.month = date.getMonth() + 1;
            this.day = date.getDate();
        };
        Birthdate.prototype.toJSON = function () {
            return this.toString();
        };
        Birthdate.prototype.toString = function () {
            return (this.year < 100 ? "19" : "") + (this.year < 10 ? "0" : "") + this.year + "-" + (this.month < 10 ? "0" : "") + this.month + "-" + (this.day < 10 ? "0" : "") + this.day;
        };
        return Birthdate;
    })();
    return Birthdate;
});
