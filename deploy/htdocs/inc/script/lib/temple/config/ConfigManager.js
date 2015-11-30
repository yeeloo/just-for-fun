define(["require", "exports"], function (require, exports) {
    /**
     * @namespace app.config
     * @class ConfigManager
     */
    var ConfigManager = (function () {
        /**
         * @class ConfigManager
         * @constructor
         */
        function ConfigManager() {
            this._varRegExp = /\{([^}]+)\}/gi;
        }
        /**
         * @public
         * @static
         * @method getInstance
         * @returns {ConfigManager}
         */
        ConfigManager.getInstance = function () {
            if (typeof ConfigManager._instance === 'undefined') {
                ConfigManager._instance = new ConfigManager();
            }
            window['configManager'] = ConfigManager._instance;
            return ConfigManager._instance;
        };
        /**
         *
         * @todo define config
         * @method init
         * @param {any} config
         */
        ConfigManager.prototype.init = function (config) {
            this._config = config.config;
            // set default groups on base object, so the functions below will never fail
            this._config.vars = this._config.vars || {};
            this._config.urls = this._config.urls || {};
            this._config.properties = this._config.properties || {};
            // sets the detected environment
            this.setEnvironment(config.environment);
        };
        /**
         * Gets the current environment
         *
         * @method getEnvironment
         * @returns {string}
         */
        ConfigManager.prototype.getEnvironment = function () {
            return this._environment;
        };
        /**
         * Sets the new environment, causes a re-render of the config
         *
         * @method setEnvironment
         * @param {string} environment
         * @return {void}
         */
        ConfigManager.prototype.setEnvironment = function (environment) {
            if (this.hasEnvironment(environment)) {
                this._environment = environment;
            }
            this.render();
        };
        /**
         * Checks if we have a certain environment
         *
         * @method hasEnvironment
         * @param {string} environment
         * @returns {boolean}
         */
        ConfigManager.prototype.hasEnvironment = function (environment) {
            return this._config.environments.hasOwnProperty(environment);
        };
        /**
         *
         * @method getUrl
         * @param {string} name
         * @param {any} variables
         * @returns {string}
         */
        ConfigManager.prototype.getUrl = function (name, variables) {
            if (!this.hasUrl(name)) {
                throw new Error('Url "' + name + '" does not exist');
            }
            var url = this._parsedConfig.urls[name].url;
            if (variables) {
                url = this.replaceVars(url, variables);
            }
            return url;
        };
        /**
         * Gets a certain url
         *
         * @method getUrlConfig
         * @param {string} name
         * @returns {app.config.IConfigUrl}
         */
        ConfigManager.prototype.getUrlConfig = function (name) {
            if (!this.hasUrl(name)) {
                throw new Error('Url "' + name + '" does not exist');
            }
            return this._parsedConfig.urls[name];
        };
        ConfigManager.prototype.openUrl = function (name, variables) {
            if (!this.hasUrl(name)) {
                throw new Error('Url "' + name + '" does not exist');
            }
            var configUrl = this._parsedConfig.urls[name];
            var url = configUrl.url;
            if (variables) {
                if (typeof variables == "function") {
                    url = variables(url);
                }
                else {
                    url = this.replaceVars(url, variables);
                }
            }
            window.open(url, configUrl.target, configUrl.features);
        };
        /**
         * Checks if a certain url exists
         *
         * @method hasUrl
         * @param {string} name
         * @returns {boolean}
         */
        ConfigManager.prototype.hasUrl = function (name) {
            return this._parsedConfig.urls.hasOwnProperty(name);
        };
        // VAR
        /**
         * Gets a certain var
         *
         * @method getVar
         * @param {string} name
         * @returns {any}
         */
        ConfigManager.prototype.getVar = function (name) {
            return this.hasVar(name) ? this._parsedConfig.vars[name] : null;
        };
        /**
         * Sets a variable to a new value, causes re-render of the config for all urls
         *
         * @method setVar
         * @param {string} name
         * @param {string} value
         */
        ConfigManager.prototype.setVar = function (name, value) {
            if (!this._config.environments[this._environment].vars) {
                this._config.environments[this._environment].vars = {};
            }
            this._config.environments[this._environment].vars[name] = value;
            this.render();
        };
        /**
         * Checks if a certain variable exists
         *
         * @method hasVar
         * @param {string} name
         * @returns {boolean}
         */
        ConfigManager.prototype.hasVar = function (name) {
            return this._parsedConfig.vars.hasOwnProperty(name);
        };
        // PROPERTY
        /**
         * Gets a certain property
         *
         * @method getProperty
         * @param {string} name
         * @returns {any}
         */
        ConfigManager.prototype.getProperty = function (name) {
            return this.hasProperty(name) ? this._parsedConfig.properties[name] : null;
        };
        /**
         * Gets the properties object
         *
         * @method getProperties
         * @returns {any}
         */
        ConfigManager.prototype.getProperties = function () {
            return this._parsedConfig.properties;
        };
        /**
         * Checks if a property exists
         *
         * @method hasProperty
         * @param {string} name
         * @returns {boolean}
         */
        ConfigManager.prototype.hasProperty = function (name) {
            return this._parsedConfig.properties.hasOwnProperty(name);
        };
        // CONFIG
        /**
         * Gets the parsed config based on the current environment
         * @method getConfig
         * @returns {app.config.IConfig}
         */
        ConfigManager.prototype.getConfig = function () {
            return this._parsedConfig;
        };
        /**
         * Gets the raw config, including all environments
         *
         * @method getRawConfig
         * @returns {app.config.IConfig}
         */
        ConfigManager.prototype.getRawConfig = function () {
            return this._config;
        };
        /**
         * Re-renders the config based on the current environment
         *
         * @method render
         * @return void
         */
        ConfigManager.prototype.render = function () {
            var _this = this;
            // current environment
            var env = this._config.environments[this._environment];
            // find and merge all extended properties
            var envs = [env];
            while (env.hasOwnProperty('extends') && this.hasEnvironment(env['extends'])) {
                env = this._config.environments[env['extends']];
                envs.unshift(env);
            }
            envs.unshift({
                properties: this._config.properties,
                vars: this._config.vars,
                urls: this._config.urls
            });
            envs.unshift({});
            // deep copy (add true as first parameter will do a deep copy when calling $.extend)
            envs.unshift(true);
            this._parsedConfig = $.extend.apply(null, envs);
            // pars recursive vars
            var getVar = function (varName) {
                var type = 'var', variable = '', varParts = varName.split(':'), types = ['url', 'prop', 'property', 'var', 'variable'];
                if (varParts.length > 1 && types.contains(varParts[0])) {
                    type = varParts.shift();
                    varName = varParts.join(':');
                }
                switch (type) {
                    case 'url':
                        {
                            variable = typeof _this._parsedConfig.urls[varName] === 'string' ? _this._parsedConfig.urls[varName] : _this._parsedConfig.urls[varName].url;
                            break;
                        }
                    case 'prop':
                    case 'property':
                        {
                            variable = _this._parsedConfig.properties[varName];
                            break;
                        }
                    case 'var':
                    case 'variable':
                    default:
                        {
                            variable = _this._parsedConfig.vars[varName];
                            break;
                        }
                }
                if (typeof variable === 'undefined') {
                    return "{" + varName + "}";
                }
                // only replace strings
                if (typeof variable === 'string') {
                    return variable['replace'](_this._varRegExp, function (result, match) {
                        // recursion
                        return getVar(match);
                    });
                }
                else {
                    return variable;
                }
            };
            // copy and parse all types
            var types = ['properties', 'urls', 'vars'];
            for (var x = 0; x < types.length; x++) {
                var type = types[x];
                var vars = this._parsedConfig[type] || {};
                for (var i in vars) {
                    if (!vars.hasOwnProperty(i)) {
                        continue;
                    }
                    if (typeof vars[i] == 'number') {
                        continue;
                    }
                    var config;
                    var currentVar = vars[i];
                    if (type == 'urls') {
                        if (typeof currentVar === 'string') {
                            currentVar = vars[i] = {
                                url: currentVar
                            };
                        }
                        config = {
                            features: currentVar.features,
                            target: currentVar.target,
                            url: currentVar.url.replace(this._varRegExp, function (result, match) {
                                return getVar(match);
                            })
                        };
                    }
                    else if (typeof currentVar === 'string') {
                        config = currentVar.replace(this._varRegExp, function (result, match) {
                            return getVar(match);
                        });
                    }
                    else {
                        config = JSON.parse(JSON.stringify(currentVar));
                    }
                    this._parsedConfig[type][i] = config;
                }
            }
            window['config'] = this._parsedConfig;
        };
        ConfigManager.prototype.replaceVars = function (subject, variables) {
            return subject['replace'](this._varRegExp, function (result, match) {
                var variable = variables[match];
                if (typeof variable === 'undefined') {
                    return "{" + match + "}";
                }
                else {
                    return variable;
                }
            });
        };
        return ConfigManager;
    })();
    return ConfigManager;
});
