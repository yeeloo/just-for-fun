/**
 * @namespace gaia.router
 * @class GaiaRouteConvert
 */
class GaiaRouteConvert
{
	/**
	 * @class GaiaRouteConvert
	 * @constructor
	 * @param {string} name
	 * @param {Function} callback
	 */
	constructor(public name:string, public callback:(param:string) => any)
	{

	}
}

export = GaiaRouteConvert;