import AbstractTask = require("lib/temple/control/sequence/tasks/AbstractTask")

import LocaleManager = require('lib/temple/locale/LocaleManager');
import LocaleGaiaHistoryHook = require('lib/temple/locale/LocaleGaiaHistoryHook');
import LocaleKnockoutBinding = require('lib/temple/locale/LocaleKnockoutBinding');

/*
 * Choose your provider
 */
//import JSONLocaleProvider = require('lib/temple/locale/provider/JSONLocaleProvider');
//import JSONPLocaleProvider = require('lib/temple/locale/provider/JSONPLocaleProvider');
//import XMLLocaleProvider = require('lib/temple/locale/provider/XMLLocaleProvider');
//import XMLPLocaleProvider = require('lib/temple/locale/provider/XMLPLocaleProvider');

/**
 * @namespace app.control
 * @class InitLocaleTask
 * @extend temple.control.sequence.tasks.AbstractTask
 */
class InitLocaleTask extends AbstractTask
{
	private _fallbackLocale:string;

	/**
	 * @class InitLocaleTask
	 * @constructor InitLocaleTask
	 * @param {string} fallbackLocale
	 */
	constructor(fallbackLocale:string = 'debug')
	{
		super();

		this._fallbackLocale = fallbackLocale;
	}

	/**
	 * @inheritDoc
	 */
	public executeTaskHook():void
	{
		// localization
		new LocaleKnockoutBinding();
		LocaleManager.getInstance().setFallbackLocale(this._fallbackLocale);

		// optional, add aliases for mapping http://yourwebsite/nl to http://yourwebsite/nl_NL
		LocaleManager.getInstance().addAlias('nl', 'nl_NL');


		// choose your poison!

		//var jsonProvider= new JSONLocaleProvider(LocaleManager.getInstance());
		//jsonProvider.addLocaleFile('en_GB', 'data/locale/en_GB.json', true);
		//jsonProvider.addLocaleFile('nl_NL', 'data/locale/nl_NL.json', true);

		//var xmlProvider = new XMLPLocaleProvider(LocaleManager.getInstance());
		//xmlProvider.addLocaleFile('en_GB', 'data/locale/en_GB.xmlp', true);
		//xmlProvider.addLocaleFile('nl_NL', 'data/locale/nl_NL.xmlp', true);


		this.done();
	}

	/**
	 * @inheritDoc
	 */
	public destruct():void
	{
		this._fallbackLocale = null;

		super.destruct();
	}
}

export = InitLocaleTask
