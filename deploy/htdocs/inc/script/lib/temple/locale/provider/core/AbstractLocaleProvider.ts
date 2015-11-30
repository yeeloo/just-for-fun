import refdef = require('lib/ReferenceDefinitions');
import Destructible = require('lib/temple/core/Destructible');
import ILocaleProvider = require('lib/temple/locale/provider/core/interface/ILocaleProvider')
import LocaleManager = require('lib/temple/locale/LocaleManager');

/**
 * @module Temple
 * @namespace temple.locale.provider.core
 * @extend temple.core.Destructible
 * @class AbstractLocaleProvider
 */
class AbstractLocaleProvider extends Destructible implements ILocaleProvider
{
	_debug:boolean = false;
	localeManager:LocaleManager;

	constructor(localeManager:LocaleManager)
	{
		super();

		this.localeManager = localeManager;
		this.localeManager.addLocaleProvider(this);
	}

	/**
	 * @public
	 * @method provider
	 * @param {string} locale
	 */
	public provide(locale:string):void
	{
		console.error('Abstract class, please extend and override this method');
	}

	/**
	 * @public
	 * @method hasProvided
	 * @param {string}locale
	 * @returns {boolean}
	 */
	public hasProvided(locale:string):boolean
	{
		return false;
	}

	/**
	 * @public
	 * @method hasLocale
	 * @param {string} locale
	 * @returns {boolean}
	 */
	public hasLocale(locale:string):boolean
	{
		return false;
	}

	/**
	 * @public
	 * @method getLocales
	 * @returns {any[]}
	 */
	public getLocales():any[]
	{
		return null;
	}

	/**
	 * @public
	 * @method destruct
	 */
	public destruct():void
	{
		this.localeManager = null;

		super.destruct();
	}
}

export = AbstractLocaleProvider;