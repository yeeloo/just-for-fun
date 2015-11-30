import refdef = require("lib/ReferenceDefinitions");
import EventDispatcher = require('lib/createjs/easeljs/component/EventDispatcher');
import ICssCalcUnit = require('lib/createjs/easeljs/component/interface/ICssCalcUnit');
import IResize = require('lib/createjs/easeljs/component/interface/IResize');
import IView = require('lib/createjs/easeljs/component/interface/IView');
import ComponentType = require('lib/createjs/easeljs/component/enum/ComponentType');
import CalculationType = require('lib/createjs/easeljs/component/enum/CalculationType');
import CalculationComponent = require('lib/createjs/easeljs/component/CalculationComponent');

/**
 * @name DisplayObject
 * @author Mient-jan Stelling
 * @abstract
 */
class DisplayObject extends EventDispatcher implements IView
{
	public type:ComponentType = ComponentType.UNKNOWN;

	public width:number = 0;
	public height:number = 0;

	public x:number = 0;
	public y:number = 0;

	public regX:number = 0;
	public regY:number = 0;

	public _scaleToFitContainer:boolean = false;

	/**
	 * @protected
	 */
	public scaleX:number = 1;

	/**
	 * @protected
	 */
	public scaleY:number = 1;

	public updateOnResize:boolean = true;
	public updateWidthOnResize:boolean = true;
	public updateHeightOnResize:boolean = true;
	public updateXOnResize:boolean = true;
	public updateYOnResize:boolean = true;
	public updateRegXOnResize:boolean = true;
	public updateRegYOnResize:boolean = true;

	private _storeUpdateOnResize:boolean;
	private _storeUpdateWidthOnResize:boolean;
	private _storeUpdateHeightOnResize:boolean;
	private _storeUpdateXOnResize:boolean;
	private _storeUpdateYOnResize:boolean;
	private _storeUpdateRegXOnResize:boolean;
	private _storeUpdateRegYOnResize:boolean;

	// @protected

	public _containerSizeKnown:boolean = false;
	public _containerSize:IResize = {
		width: 0,
		height: 0
	};

	public _size:IResize = {
		width: 0,
		height: 0
	};

	private _x:any = 0;
	private _y:any = 0;

	private _x_type:CalculationType;
	private _y_type:CalculationType;

	private _width_type:CalculationType;
	private _height_type:CalculationType;

	private _width:any = 0;
	private _height:any = 0;

	private _regX_type:CalculationType;
	private _regY_type:CalculationType;

	/**
	 * @protected
	 */
	public _regX:any;

	/**
	 * @protected
	 */
	public _regY:any;

	/**
	 * @abstract
	 */
	public view:createjs.DisplayObject;

	constructor(width:any = '100%', height:any = '100%', x:any = 0, y:any = 0, regX:any = 0, regY:any = 0)
	{
		super();

		this.setWidth(width);
		this.setHeight(height);
		this.setRegX(regX);
		this.setRegY(regY);
		this.setX(x);
		this.setY(y);
	}

	private storeUpdateOnData(){
		this._storeUpdateOnResize = this.updateOnResize;
		this._storeUpdateWidthOnResize = this.updateWidthOnResize;
		this._storeUpdateHeightOnResize = this.updateHeightOnResize;
		this._storeUpdateRegXOnResize = this.updateRegXOnResize;
		this._storeUpdateRegYOnResize = this.updateRegYOnResize;
		this._storeUpdateXOnResize = this.updateXOnResize;
		this._storeUpdateYOnResize = this.updateYOnResize;
	}

	private restoreUpdateOnData(){
		this.updateOnResize = this._storeUpdateOnResize;
		this.updateWidthOnResize = this._storeUpdateWidthOnResize;
		this.updateHeightOnResize = this._storeUpdateHeightOnResize;
		this.updateRegXOnResize = this._storeUpdateRegXOnResize;
		this.updateRegYOnResize = this._storeUpdateRegYOnResize;
		this.updateXOnResize = this._storeUpdateXOnResize;
		this.updateYOnResize = this._storeUpdateYOnResize;
	}

	private disableAllX(){
		this.updateHeightOnResize = this.updateYOnResize = this.updateRegYOnResize = false;
	}

	private disableAllY(){
		this.updateWidthOnResize = this.updateXOnResize = this.updateRegXOnResize = false;
	}

	public setWidth(width:string):any
	public setWidth(width:number):any
	public setWidth(width:any):any
	{
		if(typeof(width) == 'string')
		{
			if(width.substr(-1) == '%')
			{
				this._width = parseFloat(width.substr(0, width.length - 1)) / 100;
				this._width_type = CalculationType.FLUID;
			}
			else
			{
				this._width = CalculationComponent.dissolveCalcElements(width);
				this._width_type = CalculationType.CALC;
			}

		}
		else
		{
			this.width = width;
			this._width_type = CalculationType.STATIC;
		}

		if(this._containerSizeKnown){
			this.storeUpdateOnData();
			this.disableAllY();
			this.onResize(this._containerSize);
			this.restoreUpdateOnData();
		}
		return this;
	}

	public setHeight(height:string):any
	public setHeight(height:number):any
	public setHeight(height:any):any
	{
		if(typeof(height) == 'string')
		{
			// @todo check if only procent unit.
			if(height.substr(-1) == '%')
			{
				this._height = parseFloat(height.substr(0, height.length - 1)) / 100;
				this._height_type = CalculationType.FLUID;
			}
			else
			{
				this._height = CalculationComponent.dissolveCalcElements(height);
				this._height_type = CalculationType.CALC;
			}
		}
		else
		{
			this.height = height;
			this._height_type = CalculationType.STATIC;
		}

		if(this._containerSizeKnown){
			this.storeUpdateOnData();
			this.disableAllX();
			this.onResize(this._containerSize);
			this.restoreUpdateOnData();
		}
		return this;
	}

	public setX(x:string):any
	public setX(x:number):any
	public setX(x:any):any
	{
		if(typeof(x) == 'string')
		{
			if(x.substr(-1) == '%')
			{
				this._x = parseFloat(x.substr(0, x.length - 1)) / 100;
				this._x_type = CalculationType.FLUID;
			}
			else
			{
				this._x = CalculationComponent.dissolveCalcElements(x);
				this._x_type = CalculationType.CALC;
			}

		}
		else
		{
			this.x = x;
			this._x_type = CalculationType.STATIC;
		}

		if(this._containerSizeKnown){
			this.storeUpdateOnData();
			this.disableAllY();
			this.onResize(this._containerSize);
			this.restoreUpdateOnData();
		}
		return this;
	}

	public setY(y:string):any
	public setY(y:number):any
	public setY(y:any)
	{
		if(typeof(y) == 'string')
		{
			if(y.substr(-1) == '%')
			{
				this._y = parseFloat(y.substr(0, y.length - 1)) / 100;
				this._y_type = CalculationType.FLUID;
			}
			else
			{
				this._y = CalculationComponent.dissolveCalcElements(y);
				this._y_type = CalculationType.CALC;
			}

		}
		else
		{
			this.y = y;
			this._y_type = CalculationType.STATIC;
		}

		if(this._containerSizeKnown){
			this.storeUpdateOnData();
			this.disableAllX();
			this.onResize(this._containerSize);
			this.restoreUpdateOnData();
		}
		return this;
	}

	public setRegX(x:string):any
	public setRegX(x:number):any
	public setRegX(x:any):any
	{
		if(typeof(x) == 'string')
		{
			if(x.substr(-1) == '%')
			{
				this._regX = parseFloat(x.substr(0, x.length - 1)) / 100;
				this._regX_type = CalculationType.FLUID;
			}
			else
			{
				this._regX = CalculationComponent.dissolveCalcElements(x);
				this._regX_type = CalculationType.CALC;
			}

		}
		else
		{
			this.regX = x;
			this._regX_type = CalculationType.STATIC;
		}

		if(this._containerSizeKnown){
			this.storeUpdateOnData();
			this.disableAllY();
			this.onResize(this._containerSize);
			this.restoreUpdateOnData();

		}
		return this;
	}

	public setRegY(y:string):any
	public setRegY(y:number):any
	public setRegY(y:any):any
	{
		if(typeof(y) == 'string')
		{
			if(y.substr(-1) == '%')
			{
				this._regY = parseFloat(y.substr(0, y.length - 1)) / 100;
				this._regY_type = CalculationType.FLUID;
			}
			else
			{
				this._regY = CalculationComponent.dissolveCalcElements(y);
				this._regY_type = CalculationType.CALC;
			}

		}
		else
		{
			this.regY = y;
			this._regY_type = CalculationType.STATIC;
		}

		if(this._containerSizeKnown){
			this.storeUpdateOnData();
			this.disableAllX();
			this.onResize(this._containerSize);
			this.restoreUpdateOnData();
		}

		return this;
	}

	public setTransform(w:any, h:any, x:any, y:any, rx:any, ry:any):any
	{
		var isKnown = this._containerSizeKnown;
		if(this._containerSizeKnown){
			this._containerSizeKnown = false;
		}
		if(x!=null) this.setX(x);
		if(y!=null) this.setY(y);
		if(w!=null) this.setWidth(w);
		if(h!=null) this.setHeight(h);
		if(rx!=null) this.setRegX(rx);
		if(ry!=null) this.setRegY(ry);

		if(isKnown){
			this._containerSizeKnown = isKnown;
			this.onResize(this._containerSize);
		}

		return this;
	}

	public onResize(e:IResize )
	{
		this._containerSize.width = e.width;
		this._containerSize.height = e.height;

		if(this.updateOnResize)
		{
			if(this.updateWidthOnResize && this._width_type == CalculationType.FLUID)
			{
				this.width = this._width * e.width;
			}
			else if(this._width_type == CalculationType.CALC)
			{
				this.width = CalculationComponent.calcUnit(e.width, this._width);
			}

			if(this.updateHeightOnResize && this._height_type == CalculationType.FLUID)
			{
				this.height = this._height * e.height;
			}
			else if(this._height_type == CalculationType.CALC)
			{
				this.height = CalculationComponent.calcUnit(e.height, this._height);
			}

			if(this.updateRegXOnResize && this._regX_type == CalculationType.FLUID)
			{
				this.regX = this._regX * this.width;
				this.view.regX = this.regX;
			}
			else if(this._regX_type == CalculationType.CALC)
			{
				this.regX = CalculationComponent.calcUnit(this.width, this._regX);
				this.view.regX = this.regX;
			}

			if(this.updateRegYOnResize && this._regY_type == CalculationType.FLUID)
			{
				this.regY = this._regY * this.height;
				this.view.regY = this.regY;
			}
			else if(this.updateRegYOnResize && this._regY_type == CalculationType.CALC)
			{
				this.regY = CalculationComponent.calcUnit(this.height, this._height);
				this.view.regY = this.regY;
			}

			if(this.updateXOnResize && this._x_type == CalculationType.FLUID)
			{
				this.x = Math.round(this._x * e.width);
				this.view.x = this.x;
			}
			else if(this.updateXOnResize && this._x_type == CalculationType.CALC)
			{
				this.x = Math.round(CalculationComponent.calcUnit(e.width, this._x));
				this.view.x = this.x;
			}

			if(this.updateYOnResize && this._y_type == CalculationType.FLUID)
			{
				this.y = Math.round(this._y * e.height);
				this.view.y = this.y;
			}
			else if(this.updateYOnResize && this._y_type == CalculationType.CALC)
			{
				this.y = Math.round(CalculationComponent.calcUnit(e.height, this._y));
				this.view.y = this.y;
			}

			if( this._scaleToFitContainer ){
				this.view.scaleX = this.view.scaleY = this.scaleX = this.scaleY = Math.max(e.width/this.width, e.height/this.height);
			}
		}

		this._size.width = this.width;
		this._size.height = this.height;

	}
}

export = DisplayObject;
