import Container = require("lib/createjs/easeljs/component/Container");
import ComponentType = require("lib/createjs/easeljs/component/enum/ComponentType");

class Debug extends Container
{
	public type = ComponentType.DEBUG;

	private _shape:createjs.Shape = new createjs.Shape();
	private _text:createjs.Text = new createjs.Text('', 'bold 16px Arial');
	private _clickable = false;

	constructor(public name:string = 'unknown', width:any = '100%', height:any = '100%', x:any = '0%', y:any = '0%', regX:any = '0%', regY:any = '0%')
	{
		super();

		this.setWidth(width);
		this.setHeight(height);
		this.setRegX(regX);
		this.setRegY(regY);
		this.setX(x);
		this.setY(y);

		this._text.textAlign = 'center';
		this._text.textBaseline = 'center';
		this.view.addChild(this._shape);
		this.view.addChild(this._text);
		this.view.mouseEnabled = false;

		this.update();
	}

	update()
	{

		if(this.width > 0 && this.height > 0)
		{
			this._text.text = (this.name.length > 0 ? this.name + '\n' : '') + Math.round(this.width) + ' x ' + Math.round(this.height);
			this._text.x = this.width / 2;
			this._text.y = this.height / 2;

			if( this.width < 100 || this.height < 100){
				this._text.visible = false;
			}

			this._shape.graphics.clear();
			this._shape.graphics.beginStroke(createjs.Graphics.getRGB(0, 0, 0));

			this._shape.graphics.setStrokeStyle(1);

			if(this._hitarea)
			{
				this._hitarea.graphics.clear();
				this._hitarea.graphics.beginFill('#FFFFFF')
				this._hitarea.graphics.drawRect(0, 0, this.width, this.height);
				//				this._hitarea.x = this.x;
				//				this._hitarea.y = this.y;
				//				this._hitarea.regX = this.regX;
				//				this._hitarea.regY = this.regY;
			}
			this._shape.graphics.drawRect(0, 0, this.width, this.height);
			this._shape.graphics.setStrokeStyle(1);
			this._shape.graphics.moveTo(10, 10);
			this._shape.graphics.lineTo(this.width - 10, this.height - 10);
			this._shape.graphics.moveTo(this.width - 10, 10);
			this._shape.graphics.lineTo(10, this.height - 10);

//			this._shape.graphics.beginFill('#FFFFFF');
			this._shape.graphics.drawRect(this.width / 2 - 50, this.height / 2 - 20, 100, 40);

			this.view.y = this.y;
			this.view.x = this.x;

			this.view.regX = this.regX;
			this.view.regY = this.regY;
		}
	}


	public addEventListener(type:string, listener:Function)
	{
		if(type == 'click')
		{
			this._clickable = true;
			this._hitarea = new createjs.Shape();
			this._hitarea.visible = true;
			this.view.hitArea = this._hitarea;
			//			this.view.addChild(this._hitarea);
			this.update();

			this.view.addEventListener(type, listener);
		}

		super.addEventListener(type, listener);
	}

	public onResize(e)
	{
		console.log(e);
		super.onResize(e);
		this.update();
	}
}

export = Debug;