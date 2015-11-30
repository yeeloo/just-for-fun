import IPageController = require("lib/gaia/interface/IPageController");
import IComponentViewModel = require('lib/temple/component/IComponentViewModel');

interface IPageViewModel extends IComponentViewModel
{
	controller:IPageController;
	setController(value:IPageController):void;
}

export = IPageViewModel;