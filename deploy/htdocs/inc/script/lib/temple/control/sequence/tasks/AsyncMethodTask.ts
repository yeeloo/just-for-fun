import AbstractTask = require("lib/temple/control/sequence/tasks/AbstractTask");

class AsyncMethodTask extends AbstractTask
{
	/**
	 * @param method the method that will be called when executing this task.
	 */
	constructor(private _method:(onDone:()=> void) => void)
	{
		super();
	}

	public executeTaskHook():void
	{
		if (this._method) this._method(<any>this.done.bind(this));
	}

	/**
	 * @inheritDoc
	 */
	public destruct():void
	{
		this._method = null;

		super.destruct();
	}
}

export = AsyncMethodTask;