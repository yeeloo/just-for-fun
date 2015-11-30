import StringUtils = require('lib/temple/utils/types/StringUtils');

/**
 * This class contains some functions for URLs.
 *
 * @author Thijs Broerse
 */
class URLUtils
{
	/**
	 * Provides the value of a specific query parameter.
	 * @param param Parameter name.
	 */
	public static getParameter(url:string, param:string):string
	{
		var index:number = url.indexOf('?');
		if(index != -1)
		{
			url = url.substr(index + 1);
			var params:string[] = url.split('&');
			var p:string[];
			var i:number = params.length;
			while(i--)
			{
				p = params[i].split('=');
				if(p[0] == param)
				{
					return p[1];
				}
			}
		}
		return '';
	}

	/**
	 * Checks if the URL contains a specific parameter
	 */
	public static hasParameter(url:string, param:string):boolean
	{
		return url.indexOf(param + '=') != -1;
	}

	/**
	 * Add a parameter to the url
	 */
	public static addParameter(url:string, param:string, value:string):string
	{
		return url + (url.indexOf('?') == -1 ? '?' : '&') + param + '=' + value;
	}

	/**
	 * Set a parameter in the URL
	 */
	public static setParameter(url:string, param:string, value:string):string
	{
		if(URLUtils.hasParameter(url, param))
		{

			return url.replace(new RegExp('(' + param + '=)([^&]+)', 'g'), '$1' + value);
		}
		else
		{
			return URLUtils.addParameter(url, param, value);
		}
	}

	/**
	 * Get the file extension of an URL
	 */
	public static getFileExtension(url:string):string
	{
		if(url == null)
		{
			return null;
		}
		if(url.indexOf('?') != -1)
		{
			url = StringUtils.beforeFirst(url, '?');
		}
		return StringUtils.afterLast(url, '.');
	}

	/**
	 * Checks if a url is absolute (<code>true</code>) or relative (<code>false</code>)
	 */
	public static isAbsolute(url:string):boolean
	{
		return /^[\w-\.]*:/.test(url);
	}
}

export = URLUtils;