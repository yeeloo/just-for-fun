import ko = require('knockout');

import IComponentController = require('lib/temple/component/IComponentController');
import IComponentViewModel = require('lib/temple/component/IComponentViewModel');
import IComponentBundle = require('lib/temple/component/IComponentBundle');

import KnockoutComponentOptions = require('lib/knockout/KnockoutComponentOptions');

import StringUtils = require('lib/temple/utils/types/StringUtils');

class KnockoutComponent
{
	static baseDir:string = 'app/component/';

	static init(element, valueAccessor:() => any, allBindings):any
	{
		var value:any = valueAccessor();
		var componentId:string;
		var componentIdCamelCase:string;
		var componentBaseDir:string;
		var options:any;
		var callback:(controller:IComponentController) => void;
		var rootViewModel:IComponentViewModel;
		var path = '';

		var $element = $(element);

		// if applyBinding is called from the component, it will try to create a new instance
		// so skip if we already have a component
		if (typeof $element.data('component_loading') !== 'undefined' || typeof $element.data('component') !== 'undefined')
		{
			return;
		}

		// parse 2 different types
		// basic string with ID
		if (typeof value === 'string')
		{
			componentId = <string> value;
		}
		// or object with multiple properties
		else
		{
			componentId = (<KnockoutComponentOptions> value).component;

			if (value.root)
			{
				rootViewModel = value.root;
			}

			if (value.options)
			{
				options = <KnockoutComponentOptions> value.options;
			}

			if (value.callback) {
				callback = value.callback;
			}
		}

		if(!rootViewModel)
		{
			rootViewModel = ko.contextFor(element).$root;
		}
		
		componentIdCamelCase = StringUtils.camelCase(componentId);
		
		if (componentId.split('/').length > 1)
		{
			var parts = componentId.split('/');
			componentId = parts.pop()
			componentIdCamelCase = StringUtils.camelCase( componentId );
			path = parts.join('/') + '/';
		}

		componentBaseDir = KnockoutComponent.baseDir + path + componentId + '/';

		require([
			componentBaseDir + componentIdCamelCase + 'Bundle'
		], (bundle:IComponentBundle) => {
			var controller = bundle.controller;
			var viewModel = bundle.viewmodel;
			var template = bundle.template;
			
			var vmInstance:IComponentViewModel = <IComponentViewModel> new (viewModel)();
			var controllerInstance:IComponentController = <IComponentController> new (controller)(element, options || {});

			controllerInstance.setViewModel(vmInstance);
			controllerInstance.setTemplate(template);

			var disposeCallback = () =>
			{
				ko.utils.domNodeDisposal.removeDisposeCallback(controllerInstance.element, disposeCallback);
				controllerInstance.destruct();
			};

			ko.utils.domNodeDisposal.addDisposeCallback(controllerInstance.element, disposeCallback);

			rootViewModel.controller.registerComponent(controllerInstance);

			controllerInstance.init();

			if (typeof callback != 'undefined') {
				callback(controllerInstance);
			}
		});

		return { controlsDescendantBindings: true };
	}
}

ko.bindingHandlers['component'] = KnockoutComponent;
ko.virtualElements.allowedBindings['component'] = true;