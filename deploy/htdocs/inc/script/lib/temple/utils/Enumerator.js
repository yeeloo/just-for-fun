define(["require", "exports"], function (require, exports) {
    /**
     * @module Temple
     * @namespace temple.utils
     * @class Enumerator
     */
    var Enumerator = (function () {
        /**
         *
         * @class Enumerator
         * @constructor
         * @param {string} id
         * @param {string} label
         */
        function Enumerator(id, label) {
            if (label === void 0) { label = null; }
            this.id = id;
            this.label = label;
            // Get the name of the class, or set to a random name when the name is undefined
            var className = this['constructor'][Enumerator._KEY] || (this['constructor'][Enumerator._KEY] = "Enum" + Math.round(Math.random() * 10e10));
            if (typeof className == 'undefined') {
                throw new Error('Class extending Enumerator must have static variable \'name\'.');
            }
            if (!(className in Enumerator._hash)) {
                Enumerator._hash[className] = {};
                Enumerator._all[className] = [];
            }
            if (id in Enumerator._hash[className]) {
                throw new Error("Enumerator with id '" + id + "' already exists");
            }
            Enumerator._all[className].push(Enumerator._hash[className][id] = this);
        }
        /**
         * Get a specific Enumerator by its id
         *
         * @method get
         * @param id
         * @returns {Enumerator}
         *
         * @static
         */
        Enumerator.get = function (id) {
            return Enumerator._hash[this[Enumerator._KEY]][id];
        };
        /**
         * Get all Enumerators of this type
         *
         * @static
         * @method getAll
         * @returns {Array<Enumerator>}
         */
        Enumerator.getAll = function () {
            return Enumerator._all[this[Enumerator._KEY]];
        };
        /**
         * @method toJSON
         * @returns {any}
         */
        Enumerator.prototype.toJSON = function () {
            return this.id;
        };
        /**
         * @method toString
         * @returns {any}
         */
        Enumerator.prototype.toString = function () {
            return this.label || this.id;
        };
        //private static _hash:{[id:string]:Enumerator} = {};
        Enumerator._hash = {};
        Enumerator._all = {};
        Enumerator._KEY = 'EnumeratorClassName';
        return Enumerator;
    })();
    return Enumerator;
});
