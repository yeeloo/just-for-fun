import refdef = require('lib/ReferenceDefinitions');
import StringUtils = require('lib/temple/utils/types/StringUtils');
import IConfig = require('./IConfig');
import IConfigUrl = require('./IConfigUrl');

/**
 * @namespace app.config
 * @class ConfigManager
 */
class ConfigManager
{
	private static _instance:ConfigManager;

	private _config:IConfig;
	private _parsedConfig:IConfig;
	private _environment:string;
	private _varRegExp:any = /\{([^}]+)\}/gi;

	/**
	 * @public
	 * @static
	 * @method getInstance
	 * @returns {ConfigManager}
	 */
	public static getInstance()
	{
		if (typeof ConfigManager._instance === 'undefined')
		{
			ConfigManager._instance = new ConfigManager();
		}

		window['configManager'] = ConfigManager._instance;

		return ConfigManager._instance;
	}

	/**
	 * @class ConfigManager
	 * @constructor
	 */
	constructor()
	{
	}

	/**
	 *
	 * @todo define config
	 * @method init
	 * @param {any} config
	 */
	public init(config:any):void
	{
		this._config = <IConfig>config.config;

		// set default groups on base object, so the functions below will never fail
		this._config.vars = this._config.vars || {};
		this._config.urls = this._config.urls || {};
		this._config.properties = this._config.properties || {};

		// sets the detected environment
		this.setEnvironment(config.environment);
	}

	/**
	 * Gets the current environment
	 *
	 * @method getEnvironment
	 * @returns {string}
	 */
	public getEnvironment():string
	{
		return this._environment;
	}

	/**
	 * Sets the new environment, causes a re-render of the config
	 *
	 * @method setEnvironment
	 * @param {string} environment
	 * @return {void}
	 */
	public setEnvironment(environment:string):void
	{
		if (this.hasEnvironment(environment))
		{
			this._environment = environment;
		}

		this.render();
	}

	/**
	 * Checks if we have a certain environment
	 *
	 * @method hasEnvironment
	 * @param {string} environment
	 * @returns {boolean}
	 */
	public hasEnvironment(environment:string):boolean
	{
		return this._config.environments.hasOwnProperty(environment);
	}

	/**
	 *
	 * @method getUrl
	 * @param {string} name
	 * @param {any} variables
	 * @returns {string}
	 */
	public getUrl(name:string, variables?:{[key:string]:any}):string
	{
		if (!this.hasUrl(name))
		{
			throw new Error('Url "' + name + '" does not exist');
		}

		var url:string = this._parsedConfig.urls[name].url;

		if (variables)
		{
			url = this.replaceVars(url, variables);
		}

		return url;
	}

	/**
	 * Gets a certain url
	 *
	 * @method getUrlConfig
	 * @param {string} name
	 * @returns {app.config.IConfigUrl}
	 */
	public getUrlConfig(name:string):IConfigUrl
	{
		if (!this.hasUrl(name))
		{
			throw new Error('Url "' + name + '" does not exist');
		}

		return this._parsedConfig.urls[name];
	}

	/**
	 * Opens a popup url
	 *
	 * @method openUrl
	 * @param {string} name
	 * @param {any} variables When an object, it will be used to replace variables. when a function, it will call that function before opening the url so you can change the url yourself to have more control.
	 * @return void
	 */
	public openUrl(name:string, variables?:{[key:string]:any}):void;
	public openUrl(name:string, variables?:(url:string) => string):void;
	public openUrl(name:string, variables?:any):void
	{
		if (!this.hasUrl(name))
		{
			throw new Error('Url "' + name + '" does not exist');
		}

		var configUrl:IConfigUrl = this._parsedConfig.urls[name];
		var url:string = configUrl.url;

		if (variables)
		{
			if (typeof variables == "function")
			{
				url = variables(url);
			}
			else
			{
				url = this.replaceVars(url, variables);
			}
		}

		window.open(url, configUrl.target, configUrl.features);
	}

	/**
	 * Checks if a certain url exists
	 *
	 * @method hasUrl
	 * @param {string} name
	 * @returns {boolean}
	 */
	public hasUrl(name:string):boolean
	{
		return this._parsedConfig.urls.hasOwnProperty(name);
	}

	// VAR

	/**
	 * Gets a certain var
	 *
	 * @method getVar
	 * @param {string} name
	 * @returns {any}
	 */
	public getVar(name:string):any
	{
		return this.hasVar(name) ? this._parsedConfig.vars[name] : null;
	}

	/**
	 * Sets a variable to a new value, causes re-render of the config for all urls
	 *
	 * @method setVar
	 * @param {string} name
	 * @param {string} value
	 */
	public setVar(name:string, value:any):void
	{
		if (!this._config.environments[this._environment].vars)
		{
			this._config.environments[this._environment].vars = {};
		}

		this._config.environments[this._environment].vars[name] = value;

		this.render();
	}

	/**
	 * Checks if a certain variable exists
	 *
	 * @method hasVar
	 * @param {string} name
	 * @returns {boolean}
	 */
	public hasVar(name:string):boolean
	{
		return this._parsedConfig.vars.hasOwnProperty(name);
	}

	// PROPERTY

	/**
	 * Gets a certain property
	 *
	 * @method getProperty
	 * @param {string} name
	 * @returns {any}
	 */
	public getProperty(name:string):any
	{
		return this.hasProperty(name) ? this._parsedConfig.properties[name] : null;
	}

	/**
	 * Gets the properties object
	 *
	 * @method getProperties
	 * @returns {any}
	 */
	public getProperties():any
	{
		return this._parsedConfig.properties;
	}

	/**
	 * Checks if a property exists
	 *
	 * @method hasProperty
	 * @param {string} name
	 * @returns {boolean}
	 */
	public hasProperty(name:string):boolean
	{
		return this._parsedConfig.properties.hasOwnProperty(name);
	}

	// CONFIG

	/**
	 * Gets the parsed config based on the current environment
	 * @method getConfig
	 * @returns {app.config.IConfig}
	 */
	public getConfig():IConfig
	{
		return this._parsedConfig;
	}

	/**
	 * Gets the raw config, including all environments
	 *
	 * @method getRawConfig
	 * @returns {app.config.IConfig}
	 */
	public getRawConfig():IConfig
	{
		return this._config;
	}

	/**
	 * Re-renders the config based on the current environment
	 *
	 * @method render
	 * @return void
	 */
	public render():void
	{
		// current environment
		var env:IConfig = this._config.environments[this._environment];

		// find and merge all extended properties
		var envs:Array<IConfig> = [env];

		while (env.hasOwnProperty('extends') && this.hasEnvironment(env['extends']))
		{
			env = this._config.environments[env['extends']];
			envs.unshift(env);
		}

		envs.unshift({
			properties: this._config.properties,
			vars: this._config.vars,
			urls: this._config.urls
		});
		envs.unshift(<any>{});

		// deep copy (add true as first parameter will do a deep copy when calling $.extend)
		envs.unshift(<any>true);
		this._parsedConfig = <IConfig>$.extend.apply(null, envs);

		// pars recursive vars
		var getVar = (varName) =>
		{
			var type = 'var',
				variable:string = '',

				varParts = varName.split(':'),
				types = ['url', 'prop', 'property', 'var', 'variable'];

			if (varParts.length > 1 && types.contains(varParts[0]))
			{
				type = varParts.shift();
				varName = varParts.join(':');
			}

			switch (type)
			{
				case 'url':
				{
					variable = typeof this._parsedConfig.urls[varName] === 'string' ? <string>this._parsedConfig.urls[varName] : this._parsedConfig.urls[varName].url;
					break;
				}

				case 'prop':
				//noinspection FallthroughInSwitchStatementJS
				case 'property':
				{

					variable = this._parsedConfig.properties[varName];
					break;
				}

				case 'var':
				//noinspection FallthroughInSwitchStatementJS
				case 'variable':
				//noinspection FallthroughInSwitchStatementJS
				default:
				{
					variable = this._parsedConfig.vars[varName];
					break;
				}
			}
			if (typeof variable === 'undefined')
			{
				return "{" + varName + "}";
			}

			// only replace strings
			if (typeof variable === 'string')
			{
				return variable['replace'](this._varRegExp, (result, match) =>
				{
					// recursion
					return getVar(match);
				});
			}
			else
			{
				return variable;
			}
		};

		// copy and parse all types
		var types = ['properties', 'urls', 'vars'];

		for (var x = 0; x < types.length; x++)
		{
			var type = types[x];
			var vars = this._parsedConfig[type] || {};

			for (var i in vars)
			{
				if (!vars.hasOwnProperty(i))
				{
					continue;
				}

				if (typeof vars[i] == 'number')
				{
					continue; // skip parsing of numbers
				}

				var config;
				var currentVar = vars[i];

				if (type == 'urls')
				{
					if (typeof currentVar === 'string')
					{
						currentVar = vars[i] = {
							url: currentVar
						}
					}

					config = <IConfigUrl>{
						features: currentVar.features,
						target: currentVar.target,
						url: currentVar.url.replace(this._varRegExp, (result, match) =>
						{
							return getVar(match);
						})
					};
				}
				// only replace strings
				else if (typeof currentVar === 'string')
				{
					config = currentVar.replace(this._varRegExp, (result, match) =>
					{
						return getVar(match);
					});
				}
				// clone objects
				else
				{
					config = JSON.parse(JSON.stringify(currentVar));
				}

				this._parsedConfig[type][i] = config;
			}
		}

		window['config'] = this._parsedConfig;
	}

	private replaceVars(subject:string, variables?:{[key:string]:any}):string
	{
		return subject['replace'](this._varRegExp, (result, match) =>
		{
			var variable = variables[match];
			if (typeof variable === 'undefined')
			{
				return "{" + match + "}";
			}
			else
			{
				return variable;
			}
		});
	}
}

export = ConfigManager;