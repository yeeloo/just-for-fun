import DisplayObject = require("lib/createjs/easeljs/component/DisplayObject");
import ComponentType = require("lib/createjs/easeljs/component/enum/ComponentType");
import Stage = require("lib/createjs/easeljs/component/Stage");
import IView = require("lib/createjs/easeljs/component/interface/IView");
import IResize = require("lib/createjs/easeljs/component/interface/IResize");

class Container extends DisplayObject
{
	public type = ComponentType.CONTAINER;
	public view = new createjs.Container();

	// @protected
	public _hitarea:createjs.Shape;
	public children:any[] = [];

	// protected
	public _stage:Stage;
	public _mouseOverEffectEnabled:boolean = false;

	constructor(width:any = '100%', height:any = '100%', x:any = '50%', y:any = '50%', regX:any = '50%', regY:any = '50%')
	{
		super(width, height, x, y, regX, regY);
	}

	public setStage(stage:Stage)
	{
		if( !this._stage ){
			this._stage = stage;

			this.dispatchEvent('stageload');

			if( this.children.length > 0 ){
				var view;
				for(var i = 0; i < this.children.length; i++)
				{
					view = this.children[i];
					if( view.type == ComponentType.BUTTON || view.type == ComponentType.CONTAINER )
					{
						view.setStage(stage);
					}
				}
			}
		}
	}

	public enableHitArea()
	{
		if(!this._hitarea)
		{
			this._hitarea = new createjs.Shape();
			this._hitarea.graphics.clear();
			this._hitarea.graphics.beginFill('#FFFFFF')
			this._hitarea.graphics.drawRect(0, 0, this.width, this.height);

			this.view.hitArea = this._hitarea;
		}
	}

	public enableMouseOverHandEffect(){
		if( !this._mouseOverEffectEnabled ){
			this._mouseOverEffectEnabled = true;

			if( this._stage ){
				this.view.addEventListener('mouseover', this._stage.setMouseOver );
				this.view.addEventListener('mouseout', this._stage.setMouseOut );
			} else {
				super.addEventListener('stageload', () => {
					this.view.addEventListener('mouseover', this._stage.setMouseOver );
					this.view.addEventListener('mouseout', this._stage.setMouseOut );
				}, true );
			}
		}
	}

	public disableMouseOverHandEffect(){
		if( this._mouseOverEffectEnabled && this._stage ){
			this._mouseOverEffectEnabled = false;
			this.view.removeEventListener('mouseover', this._stage.setMouseOver );
			this.view.removeEventListener('mouseout', this._stage.setMouseOut );
		}
	}

	public add(...args:IView[])
	{
		var view;
		for(var i = 0, l = args.length; i < l; i++)
		{
			view = args[i];
			if(( view.type == ComponentType.BUTTON || view.type == ComponentType.CONTAINER ) && this._stage )
			{
				view['setStage'](this._stage);
			}

			this.children.push(view);
			this.view.addChild(view.view);

			view.onResize(this._size);
		}
	}

	public removeAll()
	{
		this.view.removeAllChildren();
		while(this.children.length > 0)
		{
			this.children.pop().destruct();
		}
	}

	public remove(child:any)
	{
		for(var i = 0; i < this.children.length; i++)
		{
			if(this.children[i] === child)
			{
				this.children.splice(i, 1);
				break;
			}
		}

		this.view.removeChild(child.view);
	}

	public onResize(e:IResize)
	{
		super.onResize(e);

		for(var i = 0; i < this.children.length; i++)
		{
			this.children[i].onResize(this._size);
		}

		if(this._hitarea)
		{
			this._hitarea.graphics.clear();
			this._hitarea.graphics.beginFill('#FFFFFF')
			this._hitarea.graphics.drawRect(0, 0, this.width, this.height);
		}
	}

	public addEventListener(type:string, callback:Function, single:boolean = false)
	{
		if(type == 'click'
			|| type == 'mouseover'
			|| type == 'mouseout'
			|| type == 'mousedown'
			|| type == 'mouseup')
		{
			this.enableHitArea();
			this.view.addEventListener(type, callback);
		}
		else
		{
			super.addEventListener(type, callback, single);
		}
	}

	public hide(){
		this.view.visible = false;
	}

	public show(){
		this.view.visible = true;
	}

	public destruct()
	{
		this.removeAllEventListeners();
		this.removeAll();

		super.destruct();
	}
}

export = Container;