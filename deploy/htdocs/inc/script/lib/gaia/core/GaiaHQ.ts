import Gaia = require('lib/gaia/api/Gaia');
import IPageAsset = require('lib/gaia/interface/IPageAsset');
import BranchIterator = require('lib/gaia/core/BranchIterator');
import BranchTools = require('lib/gaia/core/BranchTools');
import SiteModel = require('lib/gaia/core/SiteModel');
import FlowManager = require('lib/gaia/flow/FlowManager');
import gEvents = require('lib/gaia/events/GaiaEvents');
import RouteResultItem = require('lib/gaia/router/RouteResultItem');
import IRouteResultItem = require('lib/gaia/router/IRouteResultItem');
import GaiaGotoEventItem = require('../events/GotoEventItem');

import EventDispatcher = require('lib/temple/events/EventDispatcher');
import CommonEvent = require('lib/temple/events/CommonEvent');
import BaseEvent = require('lib/temple/events/BaseEvent');
import utils = require('lib/temple/utils/Utils');


/**
 * @module Gaia
 * @namespace gaia.core
 * @class GaiaHQ
 * @extends temple.events.EventDispatcher
 */
class GaiaHQ extends EventDispatcher
{
	public static TRANSITION_OUT:string = "transitionOut";
	public static TRANSITION_IN:string = "transitionIn";
	public static TRANSITION:string = "transition";
	public static PRELOAD:string = "preload";
	public static COMPLETE:string = "complete";

	private listeners: {
		[index:string]: {
			[key:string]: GaiaHQListener;
		}[];
	}[];

	private uniqueID:number = 0;
	private gotoEventObj:GaiaGotoEventItem;

	private static _instance:GaiaHQ;

	constructor()
	{
		super();

		this.listeners = [];
		this.listeners['beforeGoto'] = {};
		this.listeners['afterGoto'] = {};
		this.listeners['beforeTransitionOut'] = {};
		this.listeners['afterTransitionOut'] = {};
		this.listeners['beforePreload'] = {};
		this.listeners['afterPreload'] = {};
		this.listeners['beforeTransition'] = {};
		this.listeners['afterTransition'] = {};
		this.listeners['beforeTransitionIn'] = {};
		this.listeners['afterTransitionIn'] = {};
		this.listeners['afterComplete'] = {};
	}

	public static birth():void
	{
	}

	/**
	 *
	 * @returns {GaiaHQ}
	 */
	public static getInstance():GaiaHQ
	{
		if (GaiaHQ._instance == null)
		{
			GaiaHQ._instance = new GaiaHQ();
		}

		return GaiaHQ._instance;
	}

	// Called by GaiaImpl
	public addListener(eventName:string, target:(event:gEvents.GaiaEvent) => any, hijack:boolean, onlyOnce:boolean):(removeHijack?:boolean) => void
	{
		if (this.listeners[eventName] != null)
		{
			var listener:GaiaHQListener = this.generateListener(eventName, target);
			if (!listener.hijack && hijack)
			{
				listener._onHijackCompleteDelegate = <(event:BaseEvent) => any>this.onHijackComplete.bind(this);
				listener.addEventListener(CommonEvent.COMPLETE, listener._onHijackCompleteDelegate);
			}
			else if (listener.hijack && !hijack)
			{
				listener.removeEventListener(CommonEvent.COMPLETE, listener._onHijackCompleteDelegate);
			}
			listener.hijack = hijack;
			listener.completed = !hijack;
			listener.onlyOnce = onlyOnce;
			this.addEventListener(eventName, listener.target);
			return (hijack) ? <(removeHijack?:boolean) => any>listener.completeCallback.bind(listener) : null;
		}
		else
		{
			console.log("GaiaHQ Error! addListener: " + eventName + " is not a valid event");
			return null;
		}
	}

	public removeListener(eventName:string, target:Function):void
	{
		if (this.listeners[eventName] != undefined)
		{
			for (var id in this.listeners[eventName])
			{
				if (this.listeners[eventName].hasOwnProperty(id))
				{
					if (this.listeners[eventName][id].target == target)
					{
						this.removeListenerByID(eventName, id);
						break;
					}
				}
			}
		}
		else
		{
			console.log("GaiaHQ Error! removeListener: " + eventName + " is not a valid event");
		}
	}

	// This method is the beginning of the event chain
	public goto(branch:string, deeplink:{[param:string]: any;} = {}, flow:string = null, queryString:string = null, replace:boolean = false, route:string = null):void
	{
		if (!branch)
		{
			branch = "index";
		}

		if (branch.substr(0, SiteModel.getIndexID().length) != SiteModel.getIndexID())
		{
			branch = SiteModel.getIndexID() + "/" + branch;
		}

		branch = BranchTools.getValidBranch(branch);

		this.gotoEventObj = new GaiaGotoEventItem();
		this.gotoEventObj.routeResult = new RouteResultItem([{
			branch: branch,
			deeplink: deeplink
		}]);

		if (route)
		{
			var providedResult:IRouteResultItem = Gaia.router.resolvePage(route);

			// if result of provided route doesn't match the goto object, the route has become invalid
			if (!providedResult.equals(this.gotoEventObj.routeResult))
			{
				route = null
			}
		}

		this.gotoEventObj.routeResult.route = route;

		this.gotoEventObj.flow = flow;
		this.gotoEventObj.queryString = queryString;
		this.gotoEventObj.replace = replace;

		this.beforeGoto();
	}

	public onGoto(event:gEvents.GaiaHistoryEvent):void
	{
		this.goto(event.routeResult[0].branch, event.routeResult[0].deeplink, null, null);
	}

	// EVENT HIJACKS

	// GOTO BEFORE / AFTER
	public beforeGoto():void
	{
		this.onEvent(gEvents.GaiaEvent.BEFORE_GOTO);
	}

	public beforeGotoDone():void
	{
		this.gotoEventObj.type = gEvents.GaiaEvent.GOTO;
		this.dispatchGaiaEvent();
	}

	public afterGoto():void
	{
		this.onEvent(gEvents.GaiaEvent.AFTER_GOTO);
	}

	public afterGotoDone():void
	{
		FlowManager.afterGoto();
	}

	// TRANSITION OUT BEFORE / AFTER
	public beforeTransitionOut():void
	{
		this.onEvent(gEvents.GaiaEvent.BEFORE_TRANSITION_OUT);
	}

	public beforeTransitionOutDone():void
	{
		this.dispatchEvent(new BaseEvent(GaiaHQ.TRANSITION_OUT));
	}

	public afterTransitionOut():void
	{
		this.onEvent(gEvents.GaiaEvent.AFTER_TRANSITION_OUT);
	}

	public afterTransitionOutDone():void
	{
		FlowManager.afterTransitionOutDone();
	}

	// PRELOAD BEFORE / AFTER
	public beforePreload():void
	{
		this.onEvent(gEvents.GaiaEvent.BEFORE_PRELOAD);
	}

	public beforePreloadDone():void
	{
		this.dispatchEvent(new BaseEvent(GaiaHQ.PRELOAD));
	}

	public afterPreload():void
	{
		this.onEvent(gEvents.GaiaEvent.AFTER_PRELOAD);
	}

	public afterPreloadDone():void
	{
		FlowManager.afterPreloadDone();
	}

	// TRANSITION IN BEFORE / AFTER
	public beforeTransition():void
	{
		this.onEvent(gEvents.GaiaEvent.BEFORE_TRANSITION);
	}

	public beforeTransitionDone():void
	{
		this.dispatchEvent(new BaseEvent(GaiaHQ.TRANSITION));
	}

	public afterTransition():void
	{
		this.onEvent(gEvents.GaiaEvent.AFTER_TRANSITION);
	}

	public afterTransitionDone():void
	{
		FlowManager.afterTransitionDone();
	}

	// TRANSITION IN BEFORE / AFTER
	public beforeTransitionIn():void
	{
		this.onEvent(gEvents.GaiaEvent.BEFORE_TRANSITION_IN);
	}

	public beforeTransitionInDone():void
	{
		this.dispatchEvent(new BaseEvent(GaiaHQ.TRANSITION_IN));
	}

	public afterTransitionIn():void
	{
		this.onEvent(gEvents.GaiaEvent.AFTER_TRANSITION_IN);
	}

	public afterTransitionInDone():void
	{
		FlowManager.afterTransitionInDone();
	}

	// AFTER COMPLETE
	public afterComplete():void
	{
		this.dispatchEvent(new BaseEvent(GaiaHQ.COMPLETE));
		this.onEvent(gEvents.GaiaEvent.AFTER_COMPLETE);
	}

	public afterCompleteDone():void
	{
		// we're done
	}

	// WHEN GAIA EVENTS OCCUR THEY ARE ROUTED THROUGH HERE FOR HIJACKING
	private onEvent(eventName:string):void
	{
		var eventHasListeners:boolean = false;
		var eventHasHijackers:boolean = false;
		for (var id in this.listeners[eventName])
		{
			if (this.listeners[eventName].hasOwnProperty(id))
			{
				if (this.listeners[eventName][id] != null)
				{
					eventHasListeners = true;
					var listener:GaiaHQListener = this.listeners[eventName][id];
					if (listener.onlyOnce)
					{
						listener.dispatched = true;
					}
					if (listener.hijack)
					{
						eventHasHijackers = true;
					}
				}
			}
		}
		this.gotoEventObj.type = eventName;
		if (eventHasListeners)
		{
			this.dispatchGaiaEvent();
		}
		if (!eventHasHijackers)
		{
			this[eventName + "Done"]();
		}
		this.removeOnlyOnceListeners(eventName);
	}

	// GENERATES AN EVENT HIJACKER
	private generateListener(eventName:string, target:(event:gEvents.GaiaEvent) => any):GaiaHQListener
	{
		// prevent duplicate listeners
		for (var id in this.listeners[eventName])
		{
			if (this.listeners[eventName].hasOwnProperty(id))
			{
				if (this.listeners[eventName][id].target == target)
				{
					this.removeEventListener(eventName, target);
					return this.listeners[eventName][id];
				}
			}
		}
		// new listener
		var listener:GaiaHQListener = new GaiaHQListener();
		listener.event = eventName;
		listener.target = target;
		this.listeners[eventName][String(++this.uniqueID)] = listener;
		return listener;
	}

	// REMOVES EVENT LISTENERS BY THEIR UNIQUE ID
	private removeListenerByID(eventName:string, id:string):void
	{
		(<GaiaHQListener>this.listeners[eventName][id]).removeEventListener(CommonEvent.COMPLETE, this.onHijackComplete);
		this.removeEventListener(eventName, (<GaiaHQListener>this.listeners[eventName][id]).target);
		delete this.listeners[eventName][id];
	}

	// REMOVES EVENT LISTENERS THAT ONLY LISTEN ONCE
	private removeOnlyOnceListeners(eventName:string):void
	{
		for (var id in this.listeners[eventName])
		{
			if (this.listeners[eventName].hasOwnProperty(id))
			{
				var listener:GaiaHQListener = this.listeners[eventName][id];
				if (listener.onlyOnce && listener.dispatched && !listener.hijack)
				{
					this.removeListenerByID(eventName, id);
				}
			}
		}
	}

	// RESET COMPLETED HIJACKERS AFTER ALL HIJACKERS ARE COMPLETE AND REMOVE ONLY ONCE HIJACKERS
	private resetEventHijackers(eventName:string):void
	{
		for (var id in this.listeners[eventName])
		{
			if (this.listeners[eventName].hasOwnProperty(id))
			{
				if (this.listeners[eventName][id].hijack)
				{
					if (!this.listeners[eventName][id].onlyOnce)
					{
						this.listeners[eventName][id].completed = false;
					}
					else
					{
						this.removeListenerByID(eventName, id);
					}
				}
			}
		}
	}

	// EVENT RECEIVED FROM EVENT HIJACKERS WHEN WAIT FOR COMPLETE CALLBACK IS CALLED
	private onHijackComplete(event:BaseEvent):void
	{
		var allDone:boolean = true;
		var eventName:string = (<GaiaHQListener>event.target).event;
		for (var id in this.listeners[eventName])
		{
			if (this.listeners[eventName].hasOwnProperty(id))
			{
				if (!this.listeners[eventName][id].completed)
				{
					allDone = false;
					break;
				}
			}
		}
		if (allDone)
		{
			this.resetEventHijackers(eventName);
			this[eventName + "Done"]();
		}
	}

	private dispatchGaiaEvent():void
	{
		var evt:gEvents.GaiaEvent = new gEvents.GaiaEvent(
			this.gotoEventObj.type,
			this.gotoEventObj.routeResult,
			this.gotoEventObj.external,
			this.gotoEventObj.src,
			this.gotoEventObj.flow,
			this.gotoEventObj.window,
			null,
			this.gotoEventObj.replace
		);
		this.dispatchEvent(evt);
	}
}

class GaiaHQListener extends EventDispatcher
{
	public event:string;
	public target:(event:BaseEvent, data?:any) => any;
	public hijack:boolean;
	public onlyOnce:boolean;
	public completed:boolean;
	public dispatched:boolean;

	_onHijackCompleteDelegate:(event:BaseEvent) => any;

	constructor()
	{
		super();
	}

	public completeCallback(destroy:boolean = false):void
	{
		this.completed = true;
		if (destroy)
		{
			this.onlyOnce = true;
		}
		this.dispatchEvent(new CommonEvent(CommonEvent.COMPLETE));
	}
}

export = GaiaHQ;