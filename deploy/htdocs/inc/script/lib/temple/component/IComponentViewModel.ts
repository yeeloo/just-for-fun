import IComponentController = require('lib/temple/component/IComponentController');
import IDestructible = require('lib/temple/core/IDestructible');

interface IComponentViewModel extends IDestructible
{
	controller:IComponentController;
	setController(controller:IComponentController);
}

export = IComponentViewModel;