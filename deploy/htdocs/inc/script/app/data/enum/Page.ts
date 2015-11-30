
/**
 * @namespace app.data.enum
 * @class Page
 */
class Page
{
	public static INDEX:string = 'index';
	public static HOME:string = 'index/home';
	public static KNOCKOUT:string = 'index/knockout';
	public static SUBMIT:string = 'index/submit';
	public static CANVAS:string = 'index/canvas';
	public static DETAIL:string = 'index/detail';
	public static VIDEO:string = 'index/video';
	public static INFO:string = 'index/info';
	
	public static POPUP_POPUP1:string = 'popup1';
	public static POPUP_POPUP2:string = 'popup2';
	public static POPUP_TAKEOVER:string = 'takeover';
	public static POPUP_ABOUT:string = 'takeover/about';
	public static POPUP_PRIVACY:string = 'takeover/privacy';
}

// use in templates
window['Page'] = Page;

// use in classes
export = Page;