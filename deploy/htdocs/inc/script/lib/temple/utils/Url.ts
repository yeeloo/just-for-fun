/**
 * Class for easy creating and manipulating Urls.
 *
 * Syntax:
 *
 * <code>protocol:(//)domain(|port)/path?query#hash</code>
 *
 * or
 *
 * <code>protocol:username:password(at)domain(|port)/path?query#hash</code>
 *
 * @see http://en.wikipedia.org/wiki/Uniform_resource_locator
 *
 * @author Thijs Broerse
 */

class Url
{
	/**
	 * Hypertext Transfer Protocol
	 */
	public static HTTP:string = "http";

	/**
	 * HTTP Secure
	 */
	public static HTTPS:string = "https";

	/**
	 * File Transfer Protocol
	 */
	public static FTP:string = "ftp";

	/**
	 * Secure File Transfer Protocol
	 */
	public static SFTP:string = "sftp";

	/**
	 * Local file
	 */
	public static FILE:string = "file";

	/**
	 * Urls of this form are intended to be used to open the new message window of the user's email client when the
	 * Url is activated, with the address as defined by the Url in the "To:" field.
	 */
	public static MAILTO:string = "mailto";

	private _protocol:string;
	private _domain:string;
	private _port:number;
	private _path:string;
	private _variables:any;
	private _hashList:string[];
	private _username:string;
	private _password:string;

	constructor(href:string = null)
	{
		if(href)
		{
			this.setHref(href);
		}
	}

	/**
	 * The full string of the Url
	 */
	public getHref():string
	{
		if(this._protocol == Url.MAILTO)
		{
			return this.getScheme() + this.getEmail();
		}

		var href:string = this.getScheme() || "";
		var auth:string = this.getAuthentication();
		if(auth)
		{
			href += auth + "@";
		}
		if(this._domain)
		{
			href += this._domain;
		}
		if(this._port)
		{
			href += ":" + this._port;
		}
		if(this._path)
		{
			href += this._path;
		}

		var query:string = this.getQuery();
		if(query)
		{
			href += "?" + query;
		}
		if(this._hashList)
		{
			href += "#" + this.getHash();
		}

		return href;
	}

	/**
	 * @private
	 */
	public setHref(value:string):void
	{
		this._protocol = null;
		this._domain = null;
		this._port = 0;
		this._path = null;
		this._variables = null;
		this._hashList = null;
		this._username = null;
		this._password = null;

		if(value)
		{
			var temp:any[] = value.split('#');
			this.setHash(temp[1]);

			temp = temp[0].toString().split('?');
			this.setQuery(temp[1]);

			var href:string = temp[0];

			if(href.indexOf(":") != -1)
			{
				this._protocol = href.split(":")[0];
			}

			if(this._protocol)
			{
				href = href.substr(this._protocol.length + 1);
				if(href.substr(0, 2) == "//")
				{
					href = href.substr(2);
				}
			}

			if(this._protocol == Url.MAILTO)
			{
				this.setEmail(href);
			}
			else if(this._protocol)
			{
				var slash:number = href.indexOf("/");
				if(slash != -1)
				{
					this._domain = href.substr(0, slash);
					this._path = href.substr(slash);
				}
				else
				{
					this._domain = href;
					this._path = null;
				}
				if(this._domain.indexOf("@") != -1)
				{
					temp = this._domain.split("@");
					this.setAuthentication(temp[0]);
					this._domain = temp[1];
				}
				if(this._domain.indexOf(":") != -1)
				{
					temp = this._domain.split(":");
					this._domain = temp[0];
					this._port = temp[1];
				}
			}
			else
			{
				this._domain = null;
				this._path = href || null;
				this._port = 0;
			}
		}
	}

	/**
	 * The protocol of the Url
	 *
	 * @example
	 * <listing version="3.0">
	 * http
	 * ftp
	 * https
	 * mailto
	 * </listing>
	 */
	public getProtocol():string
	{
		return this._protocol;
	}

	/**
	 * @private
	 */
	public setProtocol(value:string):Url
	{
		this._protocol = value;
		return this;
	}

	/**
	 * Domain of the Url
	 */
	public getDomain():string
	{
		return this._domain;
	}

	/**
	 * Set the domain of the Url
	 */
	public setDomain(value:string):Url
	{
		this._domain = value;
		return this;
	}

	/**
	 * The port of the Url.
	 *
	 * 0 means no port.
	 */
	public getPort():number
	{
		return this._port;
	}

	/**
	 * @private
	 */
	public setPort(value:number):Url
	{
		this._port = value;
		return this;
	}

	/**
	 * The path of the Url
	 */
	public getPath():string
	{
		return this._path;
	}

	/**
	 * @private
	 */
	public setPath(value:string):void
	{
		this._path = value;
	}

	/**
	 * The variables of the Url.
	 */
	public getVariables():any
	{
		return this._variables;
	}

	/**
	 * @private
	 */
	public setVariables(value:any):void
	{
		this._variables = value;
	}

	/**
	 * Checks if the Url has a variable
	 */
	public hasVariable(name:string):boolean
	{
		return this._variables && this._variables.hasOwnProperty(name);
	}

	/**
	 * Get a variable of the Url.
	 */
	public getVariable(name:string):any
	{
		return this._variables ? this._variables[name] : null;
	}

	/**
	 * Set a variable on the Url.
	 */
	public setVariable(name:string, value:any):Url
	{
		if(!this._variables)
		{
			this._variables = {};
		}
		this._variables[name] = value;

		return this;
	}

	/**
	 * Removes a variable from the Url
	 */
	public deleteVariable(name:string):void
	{
		delete this._variables[name];
	}

	/**
	 * Name/value paired string, which comes after the question sign ('?').
	 *
	 * @example
	 * <listing version="3.0">
	 * http://www.domain.com/index.html?lorem=ipsum&amp;dolor=sit&amp;amet=consectetur
	 * </listing>
	 */
	public getQuery():string
	{
		if(this._variables)
		{
			var query:string = '';

			for(var i in this._variables)
			{
				if(this._variables.hasOwnProperty(i))
				{
					if(query.length > 0)
					{
						query += '&';
					}

					query += i + '=' + this._variables[i];
				}
			}
			return query;
		}

		return null;
	}

	/**
	 * @private
	 */
	public setQuery(value:string):void
	{
		if(!value)
		{
			this._variables = null;
		}
		else
		{
			try
			{
				this._variables = {};

				var variables:string[] = value.split('&');
				var variable:string[];
				for(var i:number = 0; i < variables.length; i++)
				{
					variable = variables[i].split('=');

					if(variable.length > 1)
					{
						this._variables[variable[0]] = variable[1];
					}
					else
					{
						this._variables[variable[0]] = ''
					}
				}

				console.log(this._variables);
			}
			catch(error)
			{
				// ignore
			}
		}
	}

	/**
	 * The value after the hash (#)
	 *
	 * @example
	 * <listing version="3.0">
	 * #hash
	 * </listing>
	 */
	public getHash():String
	{
		var length:number = this._hashList ? this._hashList.length : 0;

		if(!length)
		{
			return null;
		}
		else if(length == 1)
		{
			return this._hashList[0];
		}
		else
		{
			var hash:string = '';
			for(var i:number = 0; i < length; i++)
			{
				hash += '/' + (this._hashList[i] || '-');
			}
			return hash;
		}
	}

	/**
	 * Set the hash of the Url
	 */
	public setHash(value:string):Url
	{
		if(value)
		{
			if(value.charAt(0) == "/")
			{
				value = value.substr(1);
			}
			this._hashList = value.split("/");
		}
		else
		{
			this._hashList = null;
		}

		return this;
	}

	/**
	 * List of the elements of the hash (splitted by '/')
	 */
	public getHashList():any[]
	{
		return this._hashList;
	}

	/**
	 * Returns a part of the hash
	 */
	public getHashPart(index:number):string
	{
		return index < this._hashList.length ? this._hashList[index] : null;
	}

	/**
	 * Set one part of the hash
	 */
	public setHashPart(index:number, value:string):Url
	{
		this._hashList = this._hashList ? this._hashList : new Array(index + 1);

		if(index >= this._hashList.length)
		{
			this._hashList.length = index + 1;
		}
		this._hashList[index] = value;

		return this;
	}

	/**
	 * A Boolean which indicates if this is an absolute Url
	 *
	 * @example
	 * <listing version="3.0">
	 * http://www.domain.com/index.html
	 * </listing>
	 */
	public isAbsolute():boolean
	{
		return this._protocol != null;
	}

	/**
	 * A Boolean which indicates if this is a relative Url
	 *
	 * @example
	 * <listing version="3.0">
	 * /index.html#value/1
	 * </listing>
	 */
	public isRelative():boolean
	{
		return this._protocol == null;
	}

	/**
	 * A Boolean which indicates if this is a secure Url.
	 *
	 * Only https and sftp are secure.
	 */
	public isSecure():boolean
	{
		return this._protocol == Url.HTTPS || this._protocol == Url.SFTP;
	}

	/**
	 * The postfix for a Url, including protocol, : and (if needed) slashes.
	 *
	 * @example
	 * <listing version="3.0">
	 * http://
	 * ftp://
	 * mailto:
	 * </listing>
	 */
	public getScheme():string
	{
		switch(this._protocol)
		{
			case null:
				return null;

			case Url.HTTP:
			case Url.HTTPS:
			case Url.FTP:
			case Url.SFTP:
			case Url.FILE:
				return this._protocol + '://';

			case Url.MAILTO:
			default:
				return this._protocol + ':';
		}
	}

	/**
	 * @private
	 */
	public setScheme(value:string):void
	{
		this._protocol = value ? value.split(":")[0] : null;
	}

	public getUsername():string
	{
		return this._username;
	}

	/**
	 * @private
	 */
	public setUsername(value:string):void
	{
		this._username = value;
	}

	public getPassword():string
	{
		return this._password;
	}

	/**
	 * @private
	 */
	public setPassword(value:string):void
	{
		this._password = value;
	}

	/**
	 * Authentication for FTP as {username}:{password}
	 *
	 * @example
	 * <listing version="3.0">
	 * thijs:AbCdE
	 * </listing>
	 */
	public getAuthentication():string
	{
		if(this._protocol != Url.MAILTO && this._username)
		{
			if(this._password)
			{
				return this._username + ":" + this._password;
			}
			else
			{
				return this._username;
			}
		}
		return null;
	}

	/**
	 * @private
	 */
	public setAuthentication(value:string):void
	{
		if(value)
		{
			var a:string[] = value.split(':');
			this._username = a[0];
			this._password = a[1];
		}
		else
		{
			this._username = null;
			this._password = null;
		}
	}

	/**
	 * The email address of a mailto link.
	 *
	 * @example
	 * <listing version="3.0">
	 * mailto:thijs[at]mediamonks.com
	 * </listing>
	 */
	public getEmail():string
	{
		return this._protocol == Url.MAILTO && this._username && this._domain ? this._username + "@" + this._domain : null;
	}

	/**
	 * @private
	 */
	public setEmail(value:string):void
	{
		this._protocol = Url.MAILTO;
		if(value)
		{
			var temp:any[] = value.split("@");
			this._username = temp[0];
			this._domain = temp[1];
		}
	}

}

export = Url;