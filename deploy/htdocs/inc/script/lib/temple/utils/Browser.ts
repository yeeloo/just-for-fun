/**
 * @name Browser
 * @author Mient-jan Stelling
 * @description a replacement of the mootools Browser static class, gives you crossplatform Xhr request. Browser name, version, platform
 * @todo add type of device like iphone, tablet, andriod phone, tablet
 */
class Browser {

	private static ua = navigator.userAgent.toLowerCase();
	private static platform = navigator.platform.toLowerCase();
	private static UA:any[] = Browser.ua.match(/(opera|ie|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/) || [null, 'unknown', 0];
	private static mode = Browser.UA[1] == 'ie' && document.documentMode;

//	public static extend = Function.prototype.extend;
	public static name:string = <string> ( Browser.UA[1] == 'version' ? Browser.UA[3] : Browser.UA[1] );
	public static version:any = Browser.mode || parseFloat((Browser.UA[1] == 'opera' && Browser.UA[4]) ? Browser.UA[4] : Browser.UA[2]);
	public static versionNumber:number = parseInt(Browser.version, 10);

	public static Platform = {
		name: Browser.ua.match(/ip(?:ad|od|hone)/) ? 'ios' : (Browser.ua.match(/(?:webos|android)/) || Browser.platform.match(/mac|win|linux/) || ['other'])[0]
	};

	public static Plugins = {};

	private static empty(){}

	private static _xhr:() => XMLHttpRequest;
	public static getXhr():XMLHttpRequest
	{
		if(!Browser._xhr)
		{
			var XMLHTTP = function()
			{
				return new XMLHttpRequest();
			};

			var MSXML2 = function()
			{
				return new ActiveXObject('MSXML2.XMLHTTP');
			};

			var MSXML = function()
			{
				return new ActiveXObject('Microsoft.XMLHTTP');
			};

			try
			{
				XMLHTTP();
				this._xhr = XMLHTTP;
			} catch(e) {
				try
				{
					MSXML2();
					this._xhr = MSXML2;
				} catch(e) {
					try
					{
						MSXML();
						this._xhr = MSXML;
					} catch(e) {
						throw 'XMLHttpRequest not available'
					}
				}
			}
		}

		return Browser._xhr();
	}

	public static Features = {
		xpath: !!(document['evaluate']),
		air: !!(window['runtime']),
		query: !!(document.querySelector),
		json: !!(window['JSON']),
		xhr: !!(Browser.getXhr())
	};

//	// Flash detection
//
//	var version = (Function.attempt(function(){
//		return navigator.plugins['Shockwave Flash'].description;
//	}, function(){
//		return new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version');
//	}) || '0 r0').match(/\d+/g);
//
//	Browser.Plugins.Flash = {
//		version: Number(version[0] || '0.' + version[1]) || 0,
//		build: Number(version[2]) || 0
//	};

	// String scripts

	public static exec(text:string){
		if (!text) return text;
		if (window.execScript){
			window.execScript(text);
		} else {
			var script = document.createElement('script');
			script.setAttribute('type', 'text/javascript');
			script.text = text;
			document.head.appendChild(script);
			document.head.removeChild(script);
		}
		return text;
	}
}

export = Browser;