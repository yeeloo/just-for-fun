import DataManager = require('app/data/DataManager');
import ko = require('knockout');
import ConfigManager = require('lib/temple/config/ConfigManager');
import config = require('app/config/config');

import Sequence = require("lib/temple/control/sequence/Sequence");
import MethodTask = require("lib/temple/control/sequence/tasks/MethodTask");
import ITask = require("lib/temple/control/sequence/tasks/ITask");
import dbt = require("app/control/DevBarTask");

// localization
//import ilt = require("app/control/InitLocaleTask");
//import LocaleManager = require('lib/temple/locale/LocaleManager');
//import lg = require('lib/temple/locale/LocaleGaiaHistoryHook');

/**
 * @namespace app.control
 * @class StartUp
 */
class StartUp
{
	private _sequence:Sequence;
	private _callback:() => any;

	/**
	 * Initializes knockout allowBindings
	 *
	 * @class StartUp
	 * @constructor
	 */
	constructor()
	{
	}

	execute(callback: () => any = null)
	{
		this._callback = callback;

		ConfigManager.getInstance().init(config);

		this._sequence = new Sequence();

		if (DEBUG && ConfigManager.getInstance().getEnvironment() != 'live'
			&& ConfigManager.getInstance().getEnvironment() != 'prod'
			&& ConfigManager.getInstance().getEnvironment() != 'production')
		{
			this._sequence.add(new dbt.DevBarTask());
		}

		// add your own tasks
		//this._sequence.add(new ilt.InitLocaleTask());

		this._sequence.add( <ITask> new MethodTask( <any> this.onSequenceDone.bind(this)));
		this._sequence.execute();
	}

	private onSequenceDone()
	{
		if (this._callback)
		{
			this._callback();
		}
	}

	afterGaia()
	{
		this.finishLocale();
	}

	private finishLocale():void
	{
		// localization
		//new LocaleGaiaHistoryHook();
		//
		//if (LocaleManager.getInstance().getLocale() == undefined)
		//{
		//	LocaleManager.getInstance().setLocale(ConfigManager.getInstance().getProperty('defaultLocale'));
		//}
		//
		//ConfigManager.getInstance().setVar('locale', LocaleManager.getInstance().getLocale());
	}
}

export = StartUp;