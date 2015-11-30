import IEventDispatcher = require('lib/temple/events/IEventDispatcher');

import IPageAsset = require('lib/gaia/interface/IPageAsset');
import IPageViewModel = require('lib/gaia/interface/IPageViewModel');
import gEvents = require('lib/gaia/events/GaiaEvents');

import IComponentController = require('lib/temple/component/IComponentController');

interface IPageController extends IComponentController
{
	page: IPageAsset;

	transition(): void;
	transitionIn(): void;
	transitionInComplete(): void;
	transitionOut(): void;
	transitionOutComplete(): void;

	onDeeplink(event:gEvents.GaiaHistoryEvent): void;
}

export = IPageController;