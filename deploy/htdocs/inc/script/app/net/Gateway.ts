import refdef = require('lib/ReferenceDefinitions');
import IDebuggable = require('lib/temple/core/IDebuggable');
import IResult = require('lib/temple/core/IResult');

declare var Request:any;

/**
 * The Gateway class
 *
 * @class Gateway
 */
export class Gateway
{

	/**
	 * The Gateway class
	 *
	 * @class Gateway
	 */

	/**
	 * @class Gateway
	 * @constructor
	 * @param {string} url
	 * @param {boolean} debug
	 */
	constructor(public url?:string, public debug:boolean = false)
	{

	}

	/**
	 * @method get
	 * @param {string} action
	 * @param {any} data
	 * @param {Function} callback
	 * @param {any} codeType
	 */
	public get(action:string, data:any = null, callback:(result:IResult<any, string>) => void = null, codeType?:any):void
	{
		this.execute(Method.GET, action, data, callback, codeType);
	}

	/**
	 * @method post
	 * @param {string} action
	 * @param {any} data
	 * @param {Function} callback
	 * @param {any} codeType
	 */
	public post(action:string, data:any = null, callback:(result:IResult<any, string>) => void = null, codeType?:any):void
	{
		this.execute(Method.POST, action, data, callback, codeType);
	}

	/**
	 * @method execute
	 * @param {string} method
	 * @param {string} action
	 * @param {any} data
	 * @param {Function} callback
	 * @param {any} codeType
	 */
	public execute(method:string, action:string, data:any = null, callback:(result:IResult<any, string>) => void = null, codeType?:any):void
	{
		if (this.debug) console.log('execute', method, action, data);

		if (data == null) data = {};

		for (var key in data)
		{
			if (data.hasOwnProperty(key) && (typeof data[key] === 'object' || typeof data[key] === 'array'))
			{
				data[key] = JSON.stringify(data[key]);
			}
		}

		var request = new Request({
			url: this.url + action,
			method: method.toLowerCase(),
			data: data,
			onSuccess: function (responseText)
			{
				if (callback)
				{
					try
					{
						var response:IResult<any, string> = JSON.parse(responseText);

						if (codeType && response.code && codeType.hasOwnProperty("get"))
						{
							var code:any = codeType.get(response.code);
							if (code)
							{
								response.code = code;
							}
							else
							{
								console.warn("Unable to convert '" + response.code + "' to " + codeType)
							}
						}
					}
					catch (error)
					{
						console.error('GATEWAY ERROR: ', responseText);
						var response:IResult<any, string> = {
							success: false,
							data: responseText
						};
					}

					callback(response);
				}
			},
			onFailure: function ()
			{
				if (callback)
				{
					callback({
						'success': false,
						'data': 'unkown error'
					});
				}
			}
		});

		request.send();
	}
}

export interface IGateway extends IDebuggable
{
	url:string;

	execute(method:string, action:string, data?:any, callback?:(result:IResult<any, string>) => void, codeType?:any): void;

	get(action:string, data?:any, callback?:(result:IResult<any, string>) => void, codeType?:any): void;

	post(action:string, data?:any, callback?:(result:IResult<any, string>) => void, codeType?:any): void;
}

export class Method
{
	static GET:string = "get";
	static POST:string = "post";
}