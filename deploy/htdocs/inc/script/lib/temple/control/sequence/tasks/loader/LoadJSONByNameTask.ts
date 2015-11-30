import ConfigManager = require('lib/temple/config/ConfigManager');
import LoadJSONTask = require("LoadJSONTask");

class LoadJSONByNameTask extends LoadJSONTask
{
	private _name:string;

	/**
	 * @param name {string}
	 * @param completeCallback {Function}
	 * @param jsonpCallback {string}
	 */
	constructor(name:string, completeCallback: (data:any) => any = null, jsonpCallback:string = null)
	{
		super(null, completeCallback, jsonpCallback);

		this._name = name;
	}

	public executeTaskHook():void
	{
		this._url = ConfigManager.getInstance().getUrl(this._name);

		super.executeTaskHook();
	}
	/**
	 * @inheritDoc
	 */
	public destruct():void
	{
		this._name = null;

		super.destruct();
	}
}
	
export = LoadJSONByNameTask;