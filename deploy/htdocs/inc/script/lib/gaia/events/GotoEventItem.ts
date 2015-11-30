import IRouteResultItem = require('lib/gaia/router/IRouteResultItem');

class GotoEventItem
{
	public type:string;
	public routeResult:IRouteResultItem;
	public external:boolean;
	public src:string;
	public flow:string = null;
	public window:string = "_self";
	public queryString:string = null;
	public replace:boolean = false;

	constructor()
	{

	}
}

export = GotoEventItem