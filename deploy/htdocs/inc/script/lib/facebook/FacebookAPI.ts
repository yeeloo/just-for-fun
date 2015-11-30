import refdef = require('lib/ReferenceDefinitions');

import EventDispatcher = require("lib/temple/events/EventDispatcher");
import IDebuggable = require("lib/temple/core/IDebuggable");
import FacebookResult = require("lib/facebook/FacebookResult");
import CommonEvent = require("lib/temple/events/CommonEvent");
import FacebookEvent = require("lib/facebook/FacebookEvent");

class FacebookAPI extends EventDispatcher implements IDebuggable
{
	public status:string;
	public isInitialized:boolean;
	public isLoggedIn:boolean;
	public applicationId:string;
	public permissions:Array<string>;
	public optionalPermissions:Array<string>;
	public authResponse:FacebookAuthResponse;
	public me:FacebookUser;

	private _initCallback:(result:FacebookResult<FacebookAuthResponse>) => any;
	private _allowed:{[permission:string]:boolean};

	constructor(public debug:boolean = false)
	{
		super();
	}

	public init(applicationId:string, callback:(result:FacebookResult<FacebookAuthResponse>) => any = null, version:string = "v2.1"):void
	{
		this.applicationId = applicationId;
		this._initCallback = callback;

		if (this.debug) console.log("Init, applicationId: " + applicationId);

		if (typeof window.fbAsyncInit !== "undefined")
		{
			throw "FacebookAPI already initialized, you can call this only once";
		}

		window.fbAsyncInit = () =>
		{
			FB.Event.subscribe('auth.authResponseChange', <any>this.handleAuthResponseChange.bind(this));

			FB.init({
				appId: applicationId,
				status: false,
				xfbml: true,
				version: version
			});

			FB.getLoginStatus(<any>this.handleAuthResponseChange.bind(this));
		};

		(function (d, s, id)
		{
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id))
			{
				return;
			}
			js = d.createElement(s);
			js.id = id;
			js.src = "//connect.facebook.net/en_US/all.js";
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));
	}

	public login(callback:(result:FacebookResult<any>) => any = null, permissions:Array<string> = null):void
	{
		if (this.debug) console.log("login:", permissions);

		if (!permissions) permissions = [];

		// Add default permissions
		if (this.permissions)
		{
			for (var i = 0; i < this.permissions.length; i++)
			{
				if (permissions.indexOf(this.permissions[i]) == -1) permissions.push(this.permissions[i]);
			}
		}

		// check if permissions are already allowed
		var login:boolean;
		if (this.isLoggedIn)
		{
			loop: for (var i = 0; i < permissions.length; i++)
			{
				if (!this.isAllowed(permissions[i]))
				{
					login = true;
					break loop;
				}
			}

		}

		if (!this.isLoggedIn || login)
		{
			// Add optional permissions
			if (this.optionalPermissions)
			{
				for (var i = 0; i < this.optionalPermissions.length; i++)
				{
					if (permissions.indexOf(this.optionalPermissions[i]) == -1) permissions.push(this.optionalPermissions[i]);
				}
			}

			FB.login((response:FacebookUserAuthenticate) =>
			{
				// TODO: check permissions
				if (callback) callback(new FacebookResult(true));

			}, {scope: permissions.join(",")});
		}
		else
		{
			if (this.debug) console.log("login: all required permissions are already allowed, continue");
			if (callback) callback(new FacebookResult(true));
		}
	}

	public logout():void
	{
		if (FB)	FB.logout();

		this.isLoggedIn = false;
		this.authResponse = null;

		for (var permission in this._allowed)
		{
			delete this._allowed[permission];
		}

		if (this.hasEventListener(FacebookEvent.LOGOUT)) this.dispatchEvent(new FacebookEvent(FacebookEvent.LOGOUT));
	}

	public isAllowed(permission:string):boolean
	{
		return this._allowed && (permission in this._allowed) && this._allowed[permission];
	}

	public get(path:string = null, callback:(result:FacebookResult<any>) => any = null, params:Object = null):void
	{
		FB.api(path, 'get', params, (response) =>
		{
			if (this.debug) console.log(path, response);
			var data:any = response;
			if ("data" in data)
			{
				data = response.data;

				if (data instanceof Array && data.length == 1)
				{
					data = data[0]
				}
			}
			if (callback) callback(new FacebookResult(true, data));
		});
	}

	public deleteObject(path:string, callback:(result:FacebookResult<any>) => any = null):void
	{
		FB.api(path, "delete", (response) =>
		{
			if (this.debug) console.log("delete", path, response);

			callback(new FacebookResult(response, response));
		})
	}

	public ui(method:string, data:Object, callback:(response:any) => any = null, display:string = 'popup')
	{
		data['method'] = method;
		data['display'] = display;

		FB.ui(data, callback);
	}

	private handleAuthResponseChange(response:FacebookUserAuthenticate):void
	{
		if (this.debug) console.log("authResponseChange:", response.status, response.authResponse);

		if (response && response.authResponse && this.authResponse && response.authResponse.accessToken == this.authResponse.accessToken)
		{
			// accessToken didn't change, so ignore this
			if (this.debug) console.log("Same token, ignore");
			return;
		}

		this.status = response.status;
		this.authResponse = response.authResponse;

		this.isLoggedIn = this.authResponse && this.authResponse.userID != null;

		if (this.isLoggedIn)
		{
			// Check permissions
			FB.api("me/permissions", (response) =>
			{
				if (response && response.data && response.data instanceof Array)
				{
					if (!this._allowed) this._allowed = {};
					var permissions:Array<string> = [];
					var allowed:Object = response.data[0];
					for (var permission in allowed)
					{
						this._allowed[permission] = allowed[permission];
						permissions.push(permission);
					}
					if (this.debug) console.log("allowed: " + permissions);
					if (!this.isInitialized)
					{
						this.isInitialized = true;
						if (this.debug) console.log("initialized");
						this.dispatchEvent(new CommonEvent(CommonEvent.INIT));
						if (this._initCallback)
						{
							this._initCallback(new FacebookResult(true, this.authResponse));
							this._initCallback = null;
						}
					}
				}
			});
			if (this.hasEventListener(FacebookEvent.LOGIN)) this.dispatchEvent(new FacebookEvent(FacebookEvent.LOGIN));
		}
		else if (!this.isInitialized)
		{
			this.isInitialized = true;
			if (this.debug) console.log("initialized");
			if (this.hasEventListener(CommonEvent.INIT)) this.dispatchEvent(new CommonEvent(CommonEvent.INIT));

			if (this._initCallback)
			{
				this._initCallback(new FacebookResult(true, this.authResponse));
				this._initCallback = null;
			}
		}

	}


}

export = FacebookAPI;
