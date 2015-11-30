/**
 *         MinMax
 *
 *         lazy min/max number values util (easy randomizer/limiter etc)
 *
 * @author Bart (bart[at]mediamonks.com)
 *
 */
class MinMax
{
	private _min:number = 0;
	private _max:number = 1;
	private _range:number = 1;

	constructor(min:number = 0, max:number = 1)
	{
		this._min = min;
		this._max = max;
		this.order();
	}

	public getRandom():number
	{
		return this._range * Math.random() + this._min;
	}

	public getRange():number
	{
		return this._range;
	}

	public getCenter():number
	{
		return this._range / 2 + this._min;
	}

	public getMin():number
	{
		return this._min;
	}

	public setMin(value:number):void
	{
		this._min = value;
		this.order();
	}

	public getMax():number
	{
		return this._max;
	}

	public setMax(value:number):void
	{
		this._max = value;
		this.order();
	}

	public limit(value:number):number //translate into a limited number
	{
		if(value < this._min)
		{
			value = this._min;
		}
		else if(value > this._max)
		{
			value = this._max;
		}
		return value;
	}

	public contains(value:number):boolean //check
	{
		if(value < this._min || value > this._max)
		{
			return false;
		}
		return true;
	}

	private order():void //basic limiting
	{
		if(this._min > this._max)
		{
			var tmp:number = this._min;
			this._min = this._max;
			this._max = tmp;
		}
		this._range = this._max - this._min; //allways do this
	}
}

export = MinMax;