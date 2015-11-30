import refdef = require("lib/ReferenceDefinitions");

/**
 * @author Mient-jan Stelling
 */
class EventDispatcher
{
	private _destructed = false;
	private _events:{[index:string]: Function[]} = {};
	private _eventsSingle:{[index:string]: Function[]} = {};

	constructor(private _target:any = null)
	{
		if(!this._target){
			this._target = this;
		}
	}

	private throwAlreadyDestructed(){
		throw 'eventDispatcher already distructed';
	}

	private emptyArray(arr:any[]){
		while(arr.length > 0){
			arr.pop();
		}
	}

	public addEventListener(type:string, listener:Function, single:boolean = false):void
	{
		if(this._destructed){
			this.throwAlreadyDestructed();
		}

		if(single)
		{
			if(!this._eventsSingle.hasOwnProperty(type))
			{
				this._eventsSingle[type] = [];
			}

			this._eventsSingle[type].push(listener);
		}
		else
		{
			if(!this._events.hasOwnProperty(type))
			{
				this._events[type] = [];
			}

			this._events[type].push(listener);
		}
	}

	public dispatchEvent(type:string, ...args:any[]):void
	{
		if(this._destructed){
			this.throwAlreadyDestructed();
		}

		if(this._events.hasOwnProperty(type))
		{
			for(var i = 0, l = this._events[type].length; i < l; ++i)
			{
				this._events[type][i].apply(this._target, args);
			}
		}

		if(this._eventsSingle.hasOwnProperty(type))
		{
			for(var i = 0, l = this._eventsSingle[type].length; i < l; ++i)
			{
				this._eventsSingle[type][i].apply(this._target, args);
			}

			this.emptyArray(this._eventsSingle[type]);
		}
	}

	public removeAllEventListeners(type?:string):void
	{
		if(this._destructed){
			this.throwAlreadyDestructed();
		}

		if(typeof(type) == 'undefined')
		{
			for(var name in this._events)
			{
				if(this._events.hasOwnProperty(name))
				{
					this.emptyArray(this._events[name]);
					this._events[name] = null;
				}
			}

			for(var name in this._eventsSingle)
			{
				if(this._eventsSingle.hasOwnProperty(name))
				{
					this.emptyArray(this._eventsSingle[name]);
					this._eventsSingle[name] = null;
				}
			}

		}
		else
		{
			if(this._events.hasOwnProperty(type))
			{
				this.emptyArray(this._events[type]);
			}

			if(this._eventsSingle.hasOwnProperty(type))
			{
				this.emptyArray(this._eventsSingle[type]);
			}
		}
	}

	public removeEventListener(type:string, fn:Function):void
	{
		if(this._destructed){
			this.throwAlreadyDestructed();
		}

		if(this._events[type])
		{
			for(var i = 0, l = this._events[type].length; i < l; ++i)
			{
				if(this._events[type][i] === fn)
				{
					this._events[type].splice(i, 1);
					return;
				}
			}
		}

		if(this._eventsSingle[type])
		{
			for(var i = 0, l = this._eventsSingle[type].length; i < l; ++i)
			{
				if(this._eventsSingle[type][i] === fn)
				{
					this._eventsSingle[type].splice(i, 1);
					return;
				}
			}
		}
	}

	public destruct()
	{
		if(this._destructed){
			this.throwAlreadyDestructed();
		}

		this._destructed = true;
		this._events = null;
		this._eventsSingle = null;
	}
}

export = EventDispatcher;