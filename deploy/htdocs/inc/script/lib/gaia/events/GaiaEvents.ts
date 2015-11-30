import BaseEvent = require('lib/temple/events/BaseEvent');
import IPageAsset = require('lib/gaia/interface/IPageAsset');
import IRouteResultItem = require('lib/gaia/router/IRouteResultItem');

export class BranchLoaderEvent extends BaseEvent
{
	static LOAD_PAGE:string = "BranchLoaderEvent.loadPage";
	static LOAD_ASSET:string = "BranchLoaderEvent.loadAsset";
	static START:string = "BranchLoaderEvent.start";
	static COMPLETE:string = "BranchLoaderEvent.complete";

	asset:IPageAsset;

	constructor(type:string, asset:IPageAsset = null)
	{
		super(type);
		this.asset = asset;
	}
}

export class PageEvent extends BaseEvent
{
	static TRANSITION_OUT:string = "PageEvent.transitionOut";
	static TRANSITION_OUT_COMPLETE:string = "PageEvent.transitionOutComplete";
	static TRANSITION_IN:string = "PageEvent.transitionIn";
	static TRANSITION_IN_COMPLETE:string = "PageEvent.transitionInComplete";
	static TRANSITION:string = "PageEvent.transition";
	static TRANSITION_COMPLETE:string = "PageEvent.transitionComplete";
	static LEVEL_CHANGE:string = "PageEvent.levelChange";

	constructor(type:string)
	{
		super(type);
	}
}

export class AssetEvent extends BaseEvent
{
	public static ASSET_COMPLETE:string = "assetComplete";
	public static ASSET_PROGRESS:string = "assetProgress";
	public static ASSET_ERROR:string = "assetError";

	public asset:IPageAsset;
	public loaded:number;
	public total:number;
	public perc:number;
	public bytes:boolean;

	constructor(type:string, asset:IPageAsset = null, loaded:number = 0, total:number = 0, perc:number = 0, bytes:boolean = false)
	{
		super(type);

		this.asset = asset;
		this.loaded = loaded;
		this.total = total;
		this.perc = perc;
		this.bytes = bytes;
	}
}

export class GaiaEvent extends BaseEvent
{
	public static GOTO:string = "goto";
	public static BEFORE_GOTO:string = "beforeGoto";
	public static AFTER_GOTO:string = "afterGoto";
	public static BEFORE_TRANSITION_OUT:string = "beforeTransitionOut";
	public static AFTER_TRANSITION_OUT:string = "afterTransitionOut";
	public static BEFORE_PRELOAD:string = "beforePreload";
	public static AFTER_PRELOAD:string = "afterPreload";
	public static BEFORE_TRANSITION:string = "beforeTransition";
	public static AFTER_TRANSITION:string = "afterTransition";
	public static BEFORE_TRANSITION_IN:string = "beforeTransitionIn";
	public static AFTER_TRANSITION_IN:string = "afterTransitionIn";
	public static AFTER_COMPLETE:string = "afterComplete";

	constructor(type:string,
		public routeResult:IRouteResultItem,
		public external:boolean,
		public src:string,
		public flow:string = null,
		public window:string = "_self",
		public queryString:string = null,
		public replace:boolean = false)
	{
		super(type);
	}
}

export class GaiaHistoryEvent extends BaseEvent
{
	public static DEEPLINK:string = "deeplink";
	public static GOTO:string = "goto";

	public routeResult:IRouteResultItem;

	constructor(type:string, routeResult:IRouteResultItem)
	{
		super(type);

		this.routeResult = routeResult;
	}
}