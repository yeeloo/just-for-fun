// todo: add automatich destruction of intervals, gateway PendingCalls, knockout subscriptions and components

import IDestructible = require('lib/temple/core/IDestructible');

/**
 * @module Temple
 * @namespace temple.core
 * @class Destructible
 */
class Destructible implements IDestructible
{
	static eventNamespaceCount:number = 10000000;

	private _isDestructed:boolean = false;


	/**
	 * @property eventNamespace
	 * @type string
	 * @default
	 */
	public eventNamespace:string = '';

	constructor()
	{
		this.eventNamespace = '.' + (++Destructible.eventNamespaceCount);
	}

	public isDestructed():boolean
	{
		return this._isDestructed;
	}

	public destruct():void
	{
		this._isDestructed = true;
	}
}

export = Destructible;