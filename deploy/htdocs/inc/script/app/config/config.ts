
/**
 * Global config file used by the {{#crossLink "app.config.ConfigManager"}}ConfigManager{{/crossLink}}
 *
 *	{
 *		"environments": {
 *			"live": {
 *				"vars": {
 *					"base": "{protocol}//clients.vellance.net/"
 *				},
 *				"urls": {
 *					"api_url": { "url": "{base}api/flapi.php" }
 *				},
 *				"properties": {
 *					"facebook_appid": "0123456789",
 *					"linkedin_apikey": ""
 *				}
 *			},
 *			"staging": {
 *				"extends": "live",
 *				"vars": {
 *					"base": "{protocol}//staging.vellance.net/"
 *				}
 *			},
 *			"development": {
 *				"extends": "staging",
 *				"vars": {
 *					"base": "{protocol}//devmonks.vellance.net/"
 *				}
 *			},
 *			"local": {
 *				"extends": "development",
 *				"vars": {
 *					"base": ""
 *				}
 *			}
 *		},
 *		"vars": {
 *			"protocol": document.location.protocol
 *		},
 *		"urls": {
 *			"api_url": { "url": "{base}api/flapi.php" },
 *			"facebook_channelurl": { "url": "{base}channel.html" }
 *		},
 *		"properties": {
 *			"defaultLocale": "en_GB"
 *		}
 *	}
 *
 * @namespace app.config
 * @class config
 */
if(typeof window['DEBUG'] === 'undefined')
{
	window['DEBUG'] = true;
}
if(typeof window['RELEASE'] === 'undefined')
{
	window['RELEASE'] = false;
}

/**
 * @todo define
 * @attribute config
 */
var config = {
	"environments": {
		"live": {
			"vars": {
				"base": "{protocol}//clients.vellance.net/"
			},
			"urls": {
				"api": { "url": "{base}api/flapi.php" }
			},
			"properties": {
				"facebook_appid": "0123456789",
				"linkedin_apikey": ""
			}
		},
		"staging": {
			"extends": "live",
			"vars": {
				"base": "{protocol}//staging.vellance.net/"
			}
		},
		"development": {
			"extends": "staging",
			"vars": {
				"base": "{protocol}//devmonks.vellance.net/"
			}
		},
		"local": {
			"extends": "development",
			"vars": {
				"base": ""
			}
		}
	},
	"vars": {
		"protocol": document.location.protocol
	},
	"urls": {
		"api_url": { "url": "{base}api/flapi.php" },
		"facebook_channelurl": { "url": "{base}channel.html" }
	},
	"properties": {
		"defaultLocale": "en_GB"
	}
};


/**
 *
 *
 * @attribute environment
 * @type string
 */

var environment = 'live';
var host = document.location.host;
if(host.indexOf('mediamonks.local') != -1)
{
	host = 'localhost';
}

switch(host.split(':').shift())
{
	case 'localhost':
	{
		environment = 'local';
		break;
	}

	case 'devmonks.vellance.net':
	{
		environment = 'development';
		break;
	}

	case 'staging.vellance.net':
	{
		environment = 'staging';
		break;
	}

	default:
	case 'clients.vellance.net':
	{
		environment = 'live';
		break;
	}
}


var configMethod = {
	config: config,
	environment: environment
};

export = configMethod;