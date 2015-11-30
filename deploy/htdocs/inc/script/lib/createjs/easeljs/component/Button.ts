import d = require("lib/createjs/easeljs/component/Debug");
import ComponentType = require("lib/createjs/easeljs/component/enum/ComponentType");
import Stage = require("lib/createjs/easeljs/component/Stage");
import Container = require("lib/createjs/easeljs/component/Container");
import Image = require("lib/createjs/easeljs/component/Image");
import IView = require("lib/createjs/easeljs/component/interface/IView");

class Button extends Container implements IView
{
	public type = ComponentType.BUTTON;
	public img:Image;

	// protected
	public _stage:Stage;

	constructor(src, width:any, height:any, x:any = '50%', y:any = '50%', regX:any = '50%', regY:any = '50%')
	{
		super();

		this.img = new Image(src, 'inherit', 'inherit', 0, 0, 0, 0);

		this.setWidth(width);
		this.setHeight(height);
		this.setX(x);
		this.setY(y);
		this.setRegX(regX);
		this.setRegY(regY);

		this.add(this.img);
		this.view.mouseChildren = false;
	}

	setStage(stage:Stage)
	{
		if(!this._stage)
		{
			this.addEventListener('mouseover', stage.setMouseOver);
			this.addEventListener('mouseout', stage.setMouseOut);
		}

		super.setStage(stage);
	}

	destruct()
	{
		this.img = null;
		this._stage = null;

		super.destruct();
	}
}

export = Button;