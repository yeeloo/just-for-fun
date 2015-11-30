import Gaia = require('lib/gaia/api/Gaia');

/**
 * @module Gaia
 * @namespace gaia.flow
 * @class FlowManager
 */
class FlowManager
{
	private static flow:any;

	/**
	 * @public
	 * @static
	 * @method init
	 * @param {string} type
	 */
	public static init(type:string):void
	{
		FlowManager.flow = NormalFlow;
	}

	/**
	 * from GaiaHQ to flow
	 *
	 * @public
	 * @static
	 * @method afterGoto
	 */
	public static afterGoto():void
	{
		FlowManager.flow.start();
	}

	/**
	 * @public
	 * @static
	 * @method afterTransitionOutDone
	 */
	public static afterTransitionOutDone():void
	{
		FlowManager.flow.afterTransitionOutDone();
	}

	/**
	 * @public
	 * @static
	 * @method afterPreloadDone
	 */
	public static afterPreloadDone():void
	{
		FlowManager.flow.afterPreloadDone();
	}

	/**
	 * @public
	 * @static
	 * @method afterTransitionDone
	 */
	public static afterTransitionDone():void
	{
		FlowManager.flow.afterTransitionDone();
	}

	/**
	 * @public
	 * @static
	 * @method afterTransitionInDone
	 */
	public static afterTransitionInDone():void
	{
		FlowManager.flow.afterTransitionInDone();
	}

	// from flow
	// to GaiaHQ

	/**
	 * @public
	 * @static
	 * @method transitionOut
	 */
	public static transitionOut():void
	{
		Gaia.hq.beforeTransitionOut();
	}

	/**
	 * @public
	 * @static
	 * @method preload
	 */
	public static preload():void
	{
		Gaia.hq.beforePreload();
	}

	/**
	 * @public
	 * @static
	 * @method transition
	 */
	public static transition():void
	{
		Gaia.hq.beforeTransition();
	}

	/**
	 * @public
	 * @static
	 * @method transitionIn
	 */
	public static transitionIn():void
	{
		Gaia.hq.beforeTransitionIn();
	}

	/**
	 * @public
	 * @static
	 * @method complete
	 */
	public static complete():void
	{
		Gaia.hq.afterComplete();
	}

	// from SiteController
	// to GaiaHQ

	/**
	 * @public
	 * @static
	 * @method start
	 */
	public static start():void
	{
		Gaia.hq.afterGoto();
	}

	/**
	 * @public
	 * @static
	 * @method transitionOutComplete
	 */
	public static transitionOutComplete():void
	{
		Gaia.hq.afterTransitionOut();
	}

	/**
	 * @public
	 * @static
	 * @method preloadComplete
	 */
	public static preloadComplete():void
	{
		Gaia.hq.afterPreload();
	}

	/**
	 * @public
	 * @static
	 * @method transitionComplete
	 */
	public static transitionComplete():void
	{
		Gaia.hq.afterTransition();
	}

	/**
	 * @public
	 * @static
	 * @method transitionInComplete
	 */
	public static transitionInComplete():void
	{
		Gaia.hq.afterTransitionIn();
	}

}

/**
 * @class NormalFlow
 */
class NormalFlow
{

	/**
	 * @public
	 * @static
	 * @method start
	 */
	public static start():void
	{
		FlowManager.preload();
	}

	/**
	 * @public
	 * @static
	 * @method afterPreloadDone
	 */
	public static afterPreloadDone():void
	{
		FlowManager.transitionOut();
	}

	/**
	 * @public
	 * @static
	 * @method afterTransitionOutDone
	 */
	public static afterTransitionOutDone():void
	{
		FlowManager.transition();
	}

	/**
	 * @public
	 * @static
	 * @method afterTransitionDone
	 */
	public static afterTransitionDone():void
	{
		FlowManager.transitionIn();
	}

	/**
	 * @public
	 * @static
	 * @method afterTransitionInDone
	 */
	public static afterTransitionInDone():void
	{
		FlowManager.complete();
	}
}

/**
 * @class PreloadFlow
 */
class PreloadFlow
{

	/**
	 * @public
	 * @static
	 * @method start
	 */
	public static start():void
	{
		FlowManager.transitionOut();
	}

	/**
	 * @public
	 * @static
	 * @method afterTransitionOutDone
	 */
	public static afterTransitionOutDone():void
	{
		FlowManager.preload();
	}

	/**
	 * @public
	 * @static
	 * @method afterPreloadDone
	 */
	public static afterPreloadDone():void
	{
		FlowManager.transition();
	}

	/**
	 * @public
	 * @static
	 * @method afterTransitionDone
	 */
	public static afterTransitionDone():void
	{
		FlowManager.transitionIn();
	}

	/**
	 * @public
	 * @static
	 * @method afterTransitionInDone
	 */
	public static afterTransitionInDone():void
	{
		FlowManager.complete();
	}
}


/**
 * @class CrosslFlow
 */
class CrosslFlow
{
	private static isInDone:boolean;
	private static isOutDone:boolean;

	/**
	 * @public
	 * @static
	 * @method start
	 */
	public static start():void
	{
		CrosslFlow.isInDone = CrosslFlow.isOutDone = false;
		FlowManager.preload();
	}

	/**
	 * @public
	 * @static
	 * @method afterPreloadDone
	 */
	public static afterPreloadDone():void
	{
		FlowManager.transition();
		FlowManager.transitionOut();
		FlowManager.transitionIn();
	}

	/**
	 * @public
	 * @static
	 * @method afterTransitionDone
	 */
	public static afterTransitionDone():void
	{
	}

	/**
	 * @public
	 * @static
	 * @method afterTransitionInDone
	 */
	public static afterTransitionInDone():void
	{
		CrosslFlow.isInDone = true;
		CrosslFlow.checkBothDone();
	}

	/**
	 * @public
	 * @static
	 * @method afterTransitionOutDone
	 */
	public static afterTransitionOutDone():void
	{
		CrosslFlow.isOutDone = true;
		CrosslFlow.checkBothDone();
	}

	/**
	 * @public
	 * @static
	 * @method checkBothDone
	 */
	public static checkBothDone():void
	{
		if (CrosslFlow.isInDone && CrosslFlow.isOutDone)
		{
			CrosslFlow.isInDone = CrosslFlow.isOutDone = false;
			FlowManager.complete();
		}
	}
}

export = FlowManager;