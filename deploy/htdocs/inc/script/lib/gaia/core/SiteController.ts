import Gaia = require('lib/gaia/api/Gaia');
import GaiaHQ = require('lib/gaia/core/GaiaHQ');
import BranchTools = require('lib/gaia/core/BranchTools');
import BranchLoader = require('lib/gaia/core/BranchLoader');
import BranchManager = require('lib/gaia/core/BranchManager');
import SiteModel = require('lib/gaia/core/SiteModel');
import SiteView = require('lib/gaia/core/SiteView');
import TransitionController = require('lib/gaia/core/TransitionController');
import FlowManager = require('lib/gaia/flow/FlowManager');
import gEvents = require('lib/gaia/events/GaiaEvents');

import IPageAsset = require('lib/gaia/interface/IPageAsset');

import EventDispatcher = require('lib/temple/events/EventDispatcher');
import BaseEvent = require('lib/temple/events/BaseEvent');
import CommonEvent = require('lib/temple/events/CommonEvent');
import utils = require('lib/temple/utils/Utils');

/**
 * @module Gaia
 * @namespace gaia.core
 * @class BranchManager
 * @extends temple.events.EventDispatcher
 */
class SiteController extends EventDispatcher
{
	//private static preloadController:PreloadController;
	private static currentBranch:string = "";
	private static currentRoute:string = "";

	private static isTransitioning:boolean = false;
	private static isLoading:boolean = false;

	private transitionController:TransitionController = new TransitionController();
	private branchLoader:BranchLoader = new BranchLoader();
	private siteView:SiteView;

	private queuedBranch:string = "";
	private queuedFlow:string = "";

	constructor(sv:SiteView)//, preloader:IPreloader)
	{
		super();
		this.siteView = sv;

		//preloadController = new PreloadController(null, preloader);
		//preloadController.addEventListener(PreloadController.READY, onPreloaderReady, false, 1);
		//preloadController.addEventListener(Event.COMPLETE, onPreloadComplete);

		this.branchLoader.addEventListener(gEvents.BranchLoaderEvent.LOAD_PAGE, this.onLoadPage);
		this.branchLoader.addEventListener(gEvents.BranchLoaderEvent.LOAD_ASSET, this.onLoadAsset);

		//this.branchLoader.addEventListener(BranchLoaderEvent.START, this.preloadController.onStart);
		//this.branchLoader.addEventListener(AssetEvent.ASSET_PROGRESS, preloadController.onProgress);
		//this.branchLoader.addEventListener(Event.COMPLETE, preloadController.onComplete);

		this.branchLoader.addEventListener(
			CommonEvent.COMPLETE,
			<(event:BaseEvent) => any>this.onPreloadComplete.bind(this)
		);

		this.transitionController.addEventListener(
			gEvents.PageEvent.TRANSITION_OUT_COMPLETE,
			this.onTransitionOutComplete
		);

		this.transitionController.addEventListener(
			gEvents.PageEvent.TRANSITION_IN_COMPLETE,
			this.onTransitionInComplete
		);

		this.transitionController.addEventListener(
			gEvents.PageEvent.TRANSITION_COMPLETE,
			this.onTransitionComplete
		);
	}

	public static getCurrentBranch():string
	{
		return SiteController.currentBranch;
	}

	public static getCurrentRoute():string
	{
		return SiteController.currentRoute;
	}

	//public static getPreloader():PreloadController
	//{
	//	return preloadController;
	//}

	public static getBusy():boolean
	{
		return SiteController.isTransitioning || SiteController.isLoading;
	}

	// GAIAHQ RECEIVER
	public onGoto(event:gEvents.GaiaEvent):void
	{
		BranchManager.cleanup();
		var validBranch:string = event.routeResult[0].branch;

		if (!event.external)
		{
			if (validBranch != SiteController.currentBranch)
			{
				if (!SiteController.isTransitioning && !SiteController.isLoading)
				{
					this.queuedBranch = "";
					this.queuedFlow = "";
					var flow:string;
					if (event.flow == null)
					{
						if (!SiteModel.getTree().active && SiteModel.getIndexFirst())
						{
							// first just load the index
							SiteController.currentBranch = SiteModel.getIndexID();
							//flow = SiteModel.getTree().flow;
						}
						else
						{
							// need to get the branch root page that will transition in to determine flow
							var prevArray:IPageAsset[] = BranchTools.getPagesOfBranch(SiteController.currentBranch);
							var newArray:IPageAsset[] = BranchTools.getPagesOfBranch(validBranch);
							var i:number;
							for (i = 0; i < newArray.length; i++)
							{
								if (newArray[i] != prevArray[i])
								{
									break;
								}
							}
							if (newArray[i] == null || newArray[i] == undefined)
							{
								//flow = SiteModel.defaultFlow;
							}
							else
							{
								//flow = PageAsset(newArray[i]).flow;
							}
							SiteController.currentBranch = validBranch;
						}
					}
					else
					{
						flow = event.flow;
						SiteController.currentBranch = validBranch;
					}
					FlowManager.init(flow);
					FlowManager.start();
				}
				else
				{
					this.queuedBranch = event.routeResult[0].branch;
					this.queuedFlow = event.flow;
					if (!SiteController.isLoading)
					{
						this.transitionController.interrupt();
					}
					else
					{
						this.branchLoader.interrupt();
					}
				}
			}
		}
		else
		{
			//this.launchExternalPage(event.src, event.window);
		}
	}

	// BRANCH LOADER EVENT LISTENERS
	public onLoadPage(event:gEvents.BranchLoaderEvent):void
	{
		SiteController.isLoading = true;
		var page:IPageAsset = event.asset;
		BranchManager.addPage(page);
		//siteView.addPage(page);
		page.preload();
	}

	public onLoadAsset(event:gEvents.BranchLoaderEvent):void
	{
		SiteController.isLoading = true;
		//if (event.asset is DisplayObjectAsset) siteView.addAsset(event.asset as DisplayObjectAsset);
		//if (event.asset.preloadAsset) event.asset.preload();
	}

	// GAIAHQ EVENT LISTENERS
	public onTransitionOut(event:BaseEvent):void
	{
		if (!this.checkQueuedBranch())
		{
			SiteController.isTransitioning = true;
			this.transitionController.transitionOut(BranchManager.getTransitionOutArray(SiteController.currentBranch));
		}
	}

	public onTransitionIn(event:BaseEvent):void
	{
		if (!this.checkQueuedBranch())
		{
			SiteController.isTransitioning = true;
			this.transitionController.transitionIn(BranchTools.getPagesOfBranch(SiteController.currentBranch));
		}
	}

	public onTransition(event:BaseEvent):void
	{
		if (!this.checkQueuedBranch())
		{
			SiteController.isTransitioning = true;
			this.transitionController.transition(BranchManager.getTransitionOutArray(SiteController.currentBranch),
				BranchTools.getPagesOfBranch(SiteController.currentBranch));
		}
	}

	public onPreload(event:BaseEvent):void
	{
		if (!this.checkQueuedBranch())
		{
			SiteController.isLoading = true;
			this.branchLoader.loadBranch(SiteController.currentBranch);
		}
	}

	public onComplete(event:BaseEvent):void
	{
		this.checkQueuedBranch();
	}

	public onPreloadComplete(event:BaseEvent):void
	{
		SiteController.isLoading = false;
		FlowManager.preloadComplete();
		//this.siteView.preloader.addEventListener(Event.ENTER_FRAME, preloaderEnterFrame);
	}

	// TRANSITION CONTROLLER EVENT LISTENERS
	private onTransitionOutComplete(event:gEvents.PageEvent):void
	{
		BranchManager.cleanup();
		FlowManager.transitionOutComplete();
	}

	private onTransitionInComplete(event:gEvents.PageEvent):void
	{
		BranchManager.cleanup();
		FlowManager.transitionInComplete();
	}

	private onTransitionComplete(event:gEvents.PageEvent):void
	{
		BranchManager.cleanup();
		FlowManager.transitionComplete();
	}

	// UTILITY FUNCTIONS
	private checkQueuedBranch():boolean
	{
		SiteController.isLoading = SiteController.isTransitioning = false;
		if (this.queuedBranch.length > 0)
		{
			this.redirect();
			return true;
		}
		return false;
	}

	private redirect():void
	{
		// Waiting one frame makes this more stable when spamming goto events
		//this.siteView.addEventListener(Event.ENTER_FRAME, siteViewEnterFrame);
		GaiaHQ.getInstance().goto(this.queuedBranch, {}, this.queuedFlow);
	}

	private onPreloaderReady(event:Event):void
	{
		//this.preloadController.removeEventListener(Event.COMPLETE, onPreloaderReady);
		//if (this.PreloadController(event.target).asset) this.siteView.preloader.addChild(PreloadController(event.target).asset.loader);
		////siteView.preloader.addChild(DisplayObject(preloadController.clip));
	}

	// EnterFrame functions
	private preloaderEnterFrame(event:Event):void
	{
		FlowManager.preloadComplete();
		//this.siteView.preloader.removeEventListener(Event.ENTER_FRAME, preloaderEnterFrame);
	}

	private siteViewEnterFrame(event:Event):void
	{
		GaiaHQ.getInstance().goto(this.queuedBranch, {}, this.queuedFlow);
		//this.siteView.removeEventListener(Event.ENTER_FRAME, siteViewEnterFrame);
	}
}


export = SiteController;