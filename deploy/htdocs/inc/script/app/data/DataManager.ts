import gw = require("app/net/Gateway");
import ConfigManager = require('lib/temple/config/ConfigManager');

/**
 * @namespace app.data
 * @class DataManager
 */
class DataManager
{
	private static _instance:DataManager;

	/**
	 * @property gateway
	 * @type Gateway
	 */
	public gateway:gw.IGateway;

	/**
	 * Returns a instance of the datamanager
	 *
	 * @method getInstance
	 * @returns {DataManager}
	 */
	public static getInstance():DataManager
	{
		if (!DataManager._instance)
		{
			DataManager._instance = new DataManager();
			window['dataManager'] = DataManager._instance;
		}

		return DataManager._instance;
	}

	/**
	 * @class DataManager
	 * @constructor
	 */
	constructor()
	{
		this.gateway = new gw.Gateway(ConfigManager.getInstance().getUrl('api'));
	}
}

export = DataManager;