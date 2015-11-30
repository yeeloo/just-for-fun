/**
 * Some annotations taken from: https://github.com/carhartl/jquery-cookie
 * See GitHub repo for full documentation
 * 
 * Definition file is for version v1.4.1
 */
interface JQueryCookieParams
{
	/**
	 * Define the path where the cookie is valid. By default the path of the cookie is the path of the page where the
	 * cookie was created (standard browser behavior). If you want to make it available for instance across the entire
	 * domain use path: '/'. Default: path of page where the cookie was created.
	 */
	path?:string;

	/**
	 * Define lifetime of the cookie. Value can be a Number which will be interpreted as days from time of creation or
	 * a Date object. If omitted, the cookie becomes a session cookie.
	 */
	expires?:any;

	/**
	 * Define the domain where the cookie is valid. Default: domain of page where the cookie was created.
	 */
	domain?:string;

	/**
	 * If true, the cookie transmission requires a secure protocol (https). Default: false.
	 */
	secure?:boolean;
}

interface CookieStatic
{
	// By default the cookie value is encoded/decoded when writing/reading, using encodeURIComponent/decodeURIComponent.
	// Bypass this by setting raw to true.
	raw:boolean;
	
	// Turn on automatic storage of JSON objects passed as the cookie value. Assumes JSON.stringify and JSON.parse:
	json:boolean;
	
	// key-value pair of all cookies
	():{[cookie:string]:string};
	
	// get specific cookie
	(name:string):string;
	
	// get cookie and pass through converter function (e.g. 
	(name:string, converter:Function):any;
	
	// set session cookie
	(name:string, value:any);
	
	// set a cookie, with parameters
	(name:string, value:any, params:JQueryCookieParams);
}

interface JQueryStatic
{
	cookie:CookieStatic;
	
	// remove a cookie
	removeCookie(cookie:string, params:JQueryCookieParams);
}