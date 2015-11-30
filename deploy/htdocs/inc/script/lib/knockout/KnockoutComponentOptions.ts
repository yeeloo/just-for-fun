import IComponentViewModel = require('lib/temple/component/IComponentViewModel');
import IComponentController = require('lib/temple/component/IComponentController');

interface KnockoutComponentOptions {
	// name of the component (dashed, not camelCase, e.g. 'my-super-component')
	component:string;

	// should be the root of the template (usually $root).
	// if you are in a knockout foreach, the scope is the $data of the foreach iteration
	// so you need to provide a $root which points to your viewmodel
	root:IComponentViewModel;

	// can be anything (string, object, number, etc).
	// passed to the component's constructor
	options:any;

	// called when creation of the component is complete
	callback:(component:IComponentController) => void;
}

export = KnockoutComponentOptions;