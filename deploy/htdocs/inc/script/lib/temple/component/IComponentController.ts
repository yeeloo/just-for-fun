import IComponentViewModel = require('lib/temple/component/IComponentViewModel');
import IEventDispatcher = require('lib/temple/events/IEventDispatcher');

interface IComponentController extends IEventDispatcher
{
	viewModel:IComponentViewModel;
	element: HTMLElement;

	setTemplate(template:string): void;
	setViewModel(viewModel:IComponentViewModel): void;

	init(): void;

	registerComponent(controller:IComponentController):void;
}

export = IComponentController;