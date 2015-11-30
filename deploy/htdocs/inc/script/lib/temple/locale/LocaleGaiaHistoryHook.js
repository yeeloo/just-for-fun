define(["require", "exports", 'lib/gaia/events/GaiaEvents', 'lib/gaia/api/Gaia', 'lib/temple/events/CommonEvent', 'lib/temple/locale/LocaleManager'], function (require, exports, gev, Gaia, CommonEvent, LocaleManager) {
    /**
     * @module Temple
     * @namespace temple.locale
     * @class LocaleGaiaHistoryHook
     */
    var LocaleGaiaHistoryHook = (function () {
        function LocaleGaiaHistoryHook() {
            var _this = this;
            Gaia.history.addEventListener(gev.GaiaHistoryEvent.DEEPLINK, function () {
                console.log('GHH > on GaiaHistory change: ', Gaia.history.getLocale());
                _this._internal = true;
                LocaleManager.getInstance().setLocale(Gaia.history.getLocale());
                _this._internal = false;
            });
            LocaleManager.getInstance().setLocale(Gaia.history.getLocale());
            LocaleManager.getInstance().addEventListener(CommonEvent.CHANGE, function () {
                if (!_this._internal) {
                    Gaia.history.setLocale(LocaleManager.getInstance().getLocale());
                }
            });
        }
        return LocaleGaiaHistoryHook;
    })();
    return LocaleGaiaHistoryHook;
});
