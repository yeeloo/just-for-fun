import mc = require("lib/createjs/easeljs/component/Container");
import d = require("lib/createjs/easeljs/component/Debug");
import s = require("lib/createjs/easeljs/component/Stage");
import DisplayObject = require("lib/createjs/easeljs/component/DisplayObject");

import IView = require("lib/createjs/easeljs/component/interface/IView");
import ComponentType = require("lib/createjs/easeljs/component/enum/ComponentType");
import ResourceManager = require("lib/temple/net/ResourceManager");

class Image extends DisplayObject implements IView
{
	public view:createjs.Bitmap;
	public type:ComponentType = ComponentType.IMAGE;

	public loaded = false;
	public widthInherit = false;
	public heightInherit = false;
	private _resizeTmp;

	constructor(public src:any, width:any = 'inherit', height:any = 'inherit', x:any = '50%', y:any = '50%', regX:any = '50%', regY:any = '50%', public keepRatio:boolean = true)
	{
		super();

		if(width != 'inherit')
		{
			this.setWidth(width);
		}
		else
		{
			this.widthInherit = true;
		}

		if(height != 'inherit' )
		{
			this.setHeight(height);
		}
		else
		{
			this.heightInherit = true;
		}

		this.setRegX(regX);
		this.setRegY(regY);
		this.setX(x);
		this.setY(y);

		var img = ResourceManager.getImageElement(src, () =>
		{
			this.loaded = true;
			if(this._resizeTmp)
			{
				this.onResize(this._resizeTmp);
			}
		});

		this.view = new createjs.Bitmap(img);

		this.view.x = this.x;
		this.view.y = this.y;
	}

	public addEventListener(type:string, listener:Function)
	{
		if(type == 'click' || type == 'mouseover' || type == 'mouse')
		{
			this.view.addEventListener(type, listener);
		}

		super.addEventListener(type, listener);
	}

	public onResize(e)
	{
		if(this.loaded)
		{
			if(this.widthInherit)
			{
				this.setWidth(this.view.image.width);
			}

			if(this.heightInherit)
			{
				this.setHeight(this.view.image.height);
			}
		}

		this._resizeTmp = e;

		if(this.loaded)
		{
			super.onResize(e);

			this.view.scaleX = Math.max(this.width / this.view.image.width, this.height / this.view.image.height);
			this.view.scaleY = Math.max(this.height / this.view.image.height, this.height / this.view.image.height);

			if(this.keepRatio)
			{
				this.view.scaleX = Math.max(this.view.scaleX, this.view.scaleY);
				this.view.scaleY = Math.max(this.view.scaleX, this.view.scaleY);
			}

			if(typeof(this._regX) != 'undefined')
			{
				this.view.regX = this.view.image.width * this._regX;
			}

			if(typeof(this._regY) != 'undefined')
			{
				this.view.regY = this.view.image.height * this._regY;
			}

		}

		this.view.x = this.x;
		this.view.y = this.y;
	}

	public destruct()
	{
		this.view.removeAllEventListeners();
		super.destruct();
	}
}

export = Image;