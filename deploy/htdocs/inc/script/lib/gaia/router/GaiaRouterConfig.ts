import GaiaRouteRequirement = require('lib/gaia/router/GaiaRouteRequirement');
import GaiaRouteConvert = require('lib/gaia/router/GaiaRouteConvert');

/**
 * @namespace gaia.router
 * @class GaiaRouterConfig
 */
class GaiaRouterConfig
{
	private _enabled:boolean = true;
	private _includeQueryString:boolean = false;
	private _useFallback:boolean = false;
	private _removeExtraSlashes:boolean = false;
	private _requirements:GaiaRouteRequirement[] = [];
	private _converts:GaiaRouteConvert[] = [];

	constructor()
	{

	}

	/**
	 * @public
	 * @method disable
	 * @returns {gaia.router.GaiaRouterConfig}
	 */
	public disable():GaiaRouterConfig
	{
		this._enabled = false;

		return this;
	}

	/**
	 * @public
	 * @method enable
	 * @returns {gaia.router.GaiaRouterConfig}
	 */
	public enable():GaiaRouterConfig
	{
		this._enabled = true;

		return this;
	}


	/**
	 * @public
	 * @method useFallback
	 * @param {boolean} value
	 * @returns {gaia.router.GaiaRouterConfig}
	 */
	public useFallback(value:boolean = true):GaiaRouterConfig
	{
		this._useFallback = value;

		return this;
	}

	/**
	 * @public
	 * @method includeQueryString
	 * @param value
	 * @returns {gaia.router.GaiaRouterConfig}
	 */
	public includeQueryString(value:boolean = true):GaiaRouterConfig
	{
		this._includeQueryString = value;

		return this;
	}

	/**
	 * @public
	 * @method isQueryStringIncluded
	 * @returns {boolean}
	 */
	public isQueryStringIncluded():boolean
	{
		return this._includeQueryString;
	}

	/**
	 * @public
	 * @method isUsingFallback
	 * @returns {boolean}
	 */
	public isUsingFallback():boolean
	{
		return this._useFallback;
	}

	/**
	 * @public
	 * @method removeExtraSlashes
	 * @param value
	 * @returns {gaia.router.GaiaRouterConfig}
	 */
	public removeExtraSlashes(value:boolean = true):GaiaRouterConfig
	{
		this._removeExtraSlashes = value;

		return this;
	}

	/**
	 * @public
	 * @method assert
	 * @param name
	 * @param assertion
	 * @returns gaia.router.GaiaRouterConfig
	 */
	public assert(name:string, assertion:string):GaiaRouterConfig;
	public assert(name:string, assertion:RegExp):GaiaRouterConfig;
	public assert(name:string, assertion:(value:string) => boolean):GaiaRouterConfig;
	public assert(name:string, assertion:any):GaiaRouterConfig
	{
		this._requirements.push(new GaiaRouteRequirement(name, assertion));

		return this;
	}

	/**
	 * @public
	 * @method convert
	 * @param name
	 * @param callback
	 * @returns {gaia.router.GaiaRouterConfig}
	 */
	public convert(name:string, callback:(param:string) => any):GaiaRouterConfig
	{
		this._converts.push(new GaiaRouteConvert(name, callback));

		return this;
	}

	/**
	 * @public
	 * @method setLocale
	 * @param locale
	 * @returns {gaia.router.GaiaRouterConfig}
	 */
	public setLocale(locale:string):GaiaRouterConfig
	{
		return this;
	}

	/**
	 * @public
	 * @method setTranslator
	 * @param translator
	 * @param translationPath
	 * @returns {gaia.router.GaiaRouterConfig}
	 */
	public setTranslator(translator:any, translationPath:string):GaiaRouterConfig
	{
		return this;
	}

	/**
	 * @public
	 * @method getRequirements
	 * @returns {gaia.router.GaiaRouteRequirement[]}
	 */
	public getRequirements():GaiaRouteRequirement[]
	{
		return this._requirements;
	}

	/**
	 * @public
	 * @method getConverts
	 * @returns {gaia.router.GaiaRouteConvert[]}
	 */
	public getConverts():GaiaRouteConvert[]
	{
		return this._converts;
	}
}

export = GaiaRouterConfig;