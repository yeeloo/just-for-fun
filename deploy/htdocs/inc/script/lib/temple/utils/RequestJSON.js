var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'lib/temple/utils/Request'], function (require, exports, Request) {
    var RequestJSON = (function (_super) {
        __extends(RequestJSON, _super);
        function RequestJSON(options) {
            _super.call(this, options);
            throw 'RequestJSON is still beta';
            this._headers['Accept'] = 'application/json';
            this._headers['X-Request'] = 'JSON';
            if (!options['secure']) {
                this._options['secure'] = true;
            }
        }
        return RequestJSON;
    })(Request);
});
