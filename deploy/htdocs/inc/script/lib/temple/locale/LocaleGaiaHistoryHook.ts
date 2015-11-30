import gev = require('lib/gaia/events/GaiaEvents');
import Gaia = require('lib/gaia/api/Gaia');
import CommonEvent = require('lib/temple/events/CommonEvent');
import LocaleManager = require('lib/temple/locale/LocaleManager')

/**
 * @module Temple
 * @namespace temple.locale
 * @class LocaleGaiaHistoryHook
 */
class LocaleGaiaHistoryHook
{
	_internal:boolean;

	constructor()
	{
		Gaia.history.addEventListener(gev.GaiaHistoryEvent.DEEPLINK, () =>
		{
			console.log('GHH > on GaiaHistory change: ', Gaia.history.getLocale());
			this._internal = true;
			LocaleManager.getInstance().setLocale(Gaia.history.getLocale());
			this._internal = false;
		});

		LocaleManager.getInstance().setLocale(Gaia.history.getLocale());

		LocaleManager.getInstance().addEventListener(CommonEvent.CHANGE, () =>
		{
			if(!this._internal)
			{
				Gaia.history.setLocale(LocaleManager.getInstance().getLocale());
			}
		});
	}
}

export = LocaleGaiaHistoryHook;