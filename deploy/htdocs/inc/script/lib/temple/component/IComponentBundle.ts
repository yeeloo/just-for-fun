import IComponentController = require('lib/temple/component/IComponentController');
import IComponentViewModel = require('lib/temple/component/IComponentViewModel');

interface IComponentBundle {
	controller:any;
	viewmodel:any;
	template?:string;
}

export = IComponentBundle;