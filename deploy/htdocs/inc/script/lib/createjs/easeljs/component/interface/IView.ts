import refdev = require("lib/ReferenceDefinitions");
import IResize = require("lib/createjs/easeljs/component/interface/IResize");
import ComponentType = require("lib/createjs/easeljs/component/enum/ComponentType");

interface IView {
	type:ComponentType;
	view:createjs.DisplayObject;
	onResize(e:IResize):any;
}

export = IView;