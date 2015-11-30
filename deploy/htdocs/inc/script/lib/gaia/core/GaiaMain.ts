import utils = require('lib/temple/utils/Utils');
import Gaia = require('lib/gaia/api/Gaia');
import GaiaHQ = require('lib/gaia/core/GaiaHQ');
import BranchTools = require('lib/gaia/core/BranchTools');
import SiteModel = require('lib/gaia/core/SiteModel');
import SiteController = require('lib/gaia/core/SiteController');
import SiteView = require('lib/gaia/core/SiteView');
import BaseEvent = require('lib/temple/events/BaseEvent');

import gEvents = require('lib/gaia/events/GaiaEvents');
import ga = require('app/util/Analytics')

window['Gaia'] = Gaia;

/**
 * @module Gaia
 * @namespace gaia.core
 * @class GaiaMain
 */
export class GaiaMain
{
	_model:SiteModel;
	_controller:SiteController;

	constructor()
	{
	}

	/**
	 * @method startGaia
	 * @param {?} siteConfig
	 * @return {void}
	 */
	public startGaia(siteConfig:any):void
	{
		this._model = new SiteModel();
		this._model.load(siteConfig);

		this._controller = new SiteController(new SiteView());

		GaiaHQ.birth();

		Gaia.history.birth('');

		// lower prio than GaiaHistory listener
		GaiaHQ.getInstance().addEventListener(gEvents.GaiaEvent.GOTO, <(event:BaseEvent) => any>this._controller.onGoto.bind(this._controller));
		GaiaHQ.getInstance().addEventListener(GaiaHQ.TRANSITION_OUT, <(event:BaseEvent) => any>this._controller.onTransitionOut.bind(this._controller));
		GaiaHQ.getInstance().addEventListener(GaiaHQ.TRANSITION_IN, <(event:BaseEvent) => any>this._controller.onTransitionIn.bind(this._controller));
		GaiaHQ.getInstance().addEventListener(GaiaHQ.TRANSITION, <(event:BaseEvent) => any>this._controller.onTransition.bind(this._controller));
		GaiaHQ.getInstance().addEventListener(GaiaHQ.PRELOAD, <(event:BaseEvent) => any>this._controller.onPreload.bind(this._controller));
		GaiaHQ.getInstance().addEventListener(GaiaHQ.COMPLETE, <(event:BaseEvent) => any>this._controller.onComplete.bind(this._controller));

		//GaiaLite.GaiaHQ.getInstance().addListener(GaiaLite.GaiaEvent.AFTER_PRELOAD, initHistory, false, true);

		this.onInit();
	}

	public onInit(beforeStart:(route:string, validBranch:string) => string = null):void
	{
		ga.enableGaiaTracking(Gaia.api);

		var hq = GaiaHQ.getInstance();

		// higher prio than own HQ listener
		hq.addEventListener(gEvents.GaiaEvent.GOTO, <(event:BaseEvent) => any>Gaia.history.onGoto.bind(Gaia.history), 1);
		Gaia.history.addEventListener(gEvents.GaiaHistoryEvent.GOTO, <(event:BaseEvent) => any>hq.onGoto.bind(hq));

		Gaia.history.init(beforeStart);

		// gaia-goto bindings
		$('body')
//      .on('click', '[data-gaia-goto]', (event:JQueryEventObject) =>
//		{
//			event.preventDefault();
//
//			var target = $(event.currentTarget);
//			var value:string = target.attr('data-gaia-goto') || target.attr('href');
//
//			if (value.length > 0)
//			{
//				Gaia.api.goto(value);
//			}
//		})
//		.on('click', '[data-gaia-goto-route]', (event:JQueryEventObject) =>
//		{
//			event.preventDefault();
//
//			var target = $(event.currentTarget);
//			var value:string = target.attr('data-gaia-route') || target.attr('href');
//
//			if (value.length > 0)
//			{
//				Gaia.api.gotoRoute(value);
//			}
//		})
//		.on('click', '[data-gaia-popup]', (event:JQueryEventObject) =>
//		{
//			event.preventDefault();
//
//			var target = $(event.currentTarget);
//			var value:string = target.attr('data-gaia-popup') || target.attr('href');
//
//			if (value.length > 0)
//			{
//				Gaia.api.gotoPopup(value);
//			}
//		})
		.on('tap', '[data-gaia-popup-close]', (event:JQueryEventObject) =>
		{
			// close popups

			event.preventDefault();

			Gaia.api.closePopup();
		})
		.on('tap', 'a[href]', (event:JQueryEventObject) =>
		{
			// check for internal links and pass them to Gaia

			var target = $(event.currentTarget);

			// check requirements:
			// - check for self target
			// - check for other gaia actions
			// - check for url-match
			if (
				(!target.attr('target') || target.attr('target') == '_self') &&
				!target.attr('data-gaia-goto') &&
				!target.attr('data-gaia-popup') &&
				!target.attr('data-gaia-goto-route') &&
				!target.attr('data-gaia-popup-close') &&
				target.attr('href').indexOf($('meta[name="document-base"]').attr('content')) != -1)
			{
				event.preventDefault();

				// get route from URL
				var fullRoute = (target.attr('href').match(new RegExp($('meta[name="document-base"]').attr('content') + '(.*)', 'i')))[1];

				// todo
//				Gaia.api.gotoRoute(fullRoute);
			}
		});
	}
}