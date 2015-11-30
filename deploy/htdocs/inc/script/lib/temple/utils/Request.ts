import ref = require('lib/ReferenceDefinitions');
import EventDispatcher = require('lib/createjs/easeljs/component/EventDispatcher');
import Browser = require('lib/temple/utils/Browser');
import StringUtils = require('lib/temple/utils/types/StringUtils');

class Request extends EventDispatcher
{
	private static empty(){}

	private static defaultOptions = {
		url: '',
		data: '',
		headers: {
			'X-Requested-With': 'XMLHttpRequest',
			'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
		},
		async: true,
		format: false,
		method: 'post',
		link: 'ignore',
		isSuccess: null,
		emulation: true,
		urlEncoded: true,
		encoding: 'utf-8',
		evalScripts: false,
		evalResponse: false,
		timeout: 0,
		noCache: false,
		onComplete:Request.empty,
		onSuccess:Request.empty,
		onCancel:Request.empty,
		onProgress:Request.empty,
		onFailure:Request.empty,
		onException:Request.empty,
		onTimeout:Request.empty
	};


	private static _xhr:() => XMLHttpRequest;
	private static stripScripts(exec){
		var scripts = '';
		var text = exec.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function(all, code)
		{
			scripts += code + '\n';
			return '';
		});

		if(exec === true)
		{
			Browser.exec(scripts);
		}
		else if(typeOf(exec) == 'function')
		{
			exec(scripts, text);
		}
		return text;
	}


	public static progressSupport = ('onprogress' in Browser.getXhr() );

	public _xhr:XMLHttpRequest = Browser.getXhr();
	public _headers = $.extend({}, Request.defaultOptions.headers);
	public _options:any = {};

	public running:boolean = false;
	public status:number;
	public timer:number;
	public response:any;

	constructor(options:any)
	{
		super();
		this.setOptions(options);
	}

	public setOptions(options:{[index: string]: any;})
	{
		for(var name in Request.defaultOptions)
		{
			if(Request.defaultOptions.hasOwnProperty(name))
			{
				switch(name){
					case 'onComplete':
					case 'onSuccess':
					case 'onCancel':
					case 'onProgress':
					case 'onFailure':
					case 'onException':
					case 'onTimeout':{
						if(options[name]){
							this.addEventListener(name.substr(2).toLowerCase(), options[name] );
						}
						break;
					}

					default:{
						this._options[name] = options[name] || Request.defaultOptions[name];
						break;
					}
				}

			}
		}
	}


	public onStateChange()
	{
		var xhr = this._xhr;
		if(xhr.readyState != 4 || !this.running)
		{
			return;
		}

		this.running = false;
		this.status = 0;

		try {
			var status = xhr.status;
			this.status = (status == 1223) ? 204 : status;
		} catch (e){}

		xhr.onreadystatechange = Request.empty;
		if(Request.progressSupport)
		{
			xhr.onprogress = xhr.onloadstart = Request.empty;
		}
		clearTimeout(this.timer);

		this.response = {text: this._xhr.responseText || '', xml: this._xhr.responseXML};
		if(this._isSuccess())
		{
			this.success(this.response.text, this.response.xml);
		}
		else
		{
			this.failure();
		}
	}

	public _isSuccess()
	{
		var status = this.status;
		return (status >= 200 && status < 300);
	}

	isRunning()
	{
		return !!this.running;
	}

	processScripts(text)
	{
		if(this._options.evalResponse || (/(ecma|java)script/).test(this.getHeader('Content-type')))
		{
			return Browser.exec(text);
		}
		return text.stripScripts(this._options.evalScripts);
	}

	success(text, xml)
	{
		this.dispatchEvent('success', this.processScripts(text), xml );
	}

	onSuccess(...args:any[])
	{
		this.dispatchEvent.apply(this, args.slice(0).unshift('complete') );
		this.dispatchEvent.apply(this,  args.slice(0).unshift('success'));
	}

	failure()
	{
		this.onFailure();
	}

	onFailure()
	{
		this.dispatchEvent('complete');
		this.dispatchEvent('failure', this._xhr);
	}

	loadstart(event)
	{
		this.dispatchEvent('loadstart', event, this._xhr);
	}

	progress(event)
	{
		this.dispatchEvent('progress', event, this._xhr);
	}

	timeout()
	{
		this.dispatchEvent('timeout', this._xhr);
	}

	setHeader(name, value)
	{
		this._headers[name] = value;
		return this;
	}

	getHeader(name)
	{
		try {
			return this._xhr.getResponseHeader(name);
		} catch(e){
			return null;
		}
	}

	check(options?:any)
	{
		if(!this.running)
		{
			return true;
		}
		//		switch(this._options.link)
		//		{
		//			case 'cancel':
		//				this.cancel();
		//				return true;
		//			case 'chain':
		//				this.chain(this.caller.pass(arguments, this));
		//				return false;
		//		}
		return false;
	}

	send(options:any = {})
	{
		//		if(!this.check(options))
		//		{
		//			return this;
		//		}

		//		this._options.isSuccess = this._options.isSuccess || this.isSuccess;
		this.running = true;

		//		var type = typeOf(options);
		//		if(type == 'string' || type == 'element')
		//		{
		//			options = {data: options};
		//		}

		var old = this._options;
		options = $.extend({data: old.data, url: old.url, method: old.method}, options);
		var data = options.data, url = String(options.url), method = options.method.toLowerCase();

		switch(typeOf(data))
		{
			//			case 'element':
			//				data = document.id(data).toQueryString();
			//				break;
			case 'object':
			case 'hash':
				data = Object.toQueryString(data);
		}

		if(this._options.format)
		{
			var format = 'format=' + this._options.format;
			data = (data) ? format + '&' + data : format;
		}

		if(this._options.emulation && !(['get', 'post'].indexOf(method)>-1))
		{
			var _method = '_method=' + method;
			data = (data) ? _method + '&' + data : _method;
			method = 'post';
		}

		if(this._options.urlEncoded && ['post', 'put'].contains(method))
		{
			var encoding = (this._options.encoding) ? '; charset=' + this._options.encoding : '';
			this._headers['Content-type'] = 'application/x-www-form-urlencoded' + encoding;
		}

		if(!url)
		{
			url = document.location.pathname;
		}

		var trimPosition = url.lastIndexOf('/');
		if(trimPosition > -1 && (trimPosition = url.indexOf('#')) > -1)
		{
			url = url.substr(0, trimPosition);
		}

		if(this._options.noCache)
		{
			url += (url.indexOf('?')>-1 ? '&' : '?') + StringUtils.uniqueID();
		}

		if(data && method == 'get')
		{
			url += (url.indexOf('?')>-1 ? '&' : '?') + data;
			data = null;
		}

		var xhr = this._xhr;
		if(Request.progressSupport)
		{
			xhr.onloadstart = <(ev: any) => any> this.dispatchEvent.bind(this, 'loadstart');
			xhr.onprogress = <(ev: ProgressEvent) => any> this.dispatchEvent.bind(this, 'progress');
		}

		xhr.open(method.toUpperCase(), url, this._options.async, this._options.user, this._options.password);
		if(this._options.user && 'withCredentials' in xhr)
		{
			xhr.withCredentials = true;
		}

		xhr.onreadystatechange = <(ev: Event) => any> this.onStateChange.bind(this);

		for(var o in this._headers)
		{
			if( this._headers.hasOwnProperty(o)){
				try
				{
					xhr.setRequestHeader(o, this._headers[o]);
				} catch(e)
				{
					this.dispatchEvent('exception', [o, this._headers[o]]);
				}
			}
		}

		this.dispatchEvent('request');
		xhr.send(data);
		if(!this._options.async)
		{
			this.onStateChange();
		}
		else if(this._options.timeout)
		{
			this.timer = setTimeout(() => this.timeout(), this._options.timeout );
		}
		return this;
	}

	cancel()
	{
		if(!this.running)
		{
			return this;
		}
		this.running = false;
		var xhr = this._xhr;
		xhr.abort();
		clearTimeout(this.timer);
		xhr.onreadystatechange = Request.empty;
		if(Request.progressSupport)
		{
			xhr.onprogress = xhr.onloadstart = Request.empty;
		}
		this._xhr = Browser.getXhr();
		this.dispatchEvent('cancel');
		return this;
	}

}

export = Request;

