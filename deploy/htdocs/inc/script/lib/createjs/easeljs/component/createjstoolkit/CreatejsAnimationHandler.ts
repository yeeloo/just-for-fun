import refdev = require('lib/ReferenceDefinitions');
import DisplayObject = require('lib/createjs/easeljs/component/DisplayObject');
import s = require('lib/createjs/easeljs/component/Stage');
import ICreatejsMovieClipLabel = require('lib/createjs/easeljs/component/interface/ICreatejsMovieClipLabel');
import IView = require('lib/createjs/easeljs/component/interface/IView');
import ComponentType = require('lib/createjs/easeljs/component/enum/ComponentType');
import Stage = require('lib/createjs/easeljs/component/Stage');

/**
 * @author Mient-jan Stelling
 * @todo needs a refactoring job.
 */
class CreatejsAnimationHandler extends DisplayObject implements IView
{
	/**
	 *
	 * @param lib
	 * @param classInstance
	 * @param name
	 * @returns {*[]}
	 */
	public static getInstancesByName(lib:any, classInstance:any, name:string):any[]
	{
		if(!lib[name])
		{
			throw 'unknown ' + name
		}

		return this.getInstancesByObject(lib[name], classInstance);
	}

	/**
	 *
	 * @param lib
	 * @param classInstance
	 * @param name
	 * @returns {*}
	 */
	public static getInstanceByName(lib:any, classInstance:any, name:string):any
	{
		if(!lib[name])
		{
			throw 'unknown ' + name
		}

		return this.getInstancesByObject(lib[name], classInstance)[0];
	}

	/**
	 *
	 * @param object
	 * @param classInstance
	 * @returns {Array}
	 */
	public static getInstancesByObject(object:any, classInstance:any, foundInstances:any[] = [] ):any[]
	{
		for(var obj in classInstance)
		{
			if(classInstance.hasOwnProperty(obj))
			{
				if(classInstance[obj] instanceof object)
				{
					foundInstances.push(classInstance[obj]);
				}
				else if(classInstance[obj] instanceof createjs.Container)
				{
					this.getInstanceByContainer(classInstance[obj], object, foundInstances);
				}
			}
		}

		return foundInstances;
	}

	/**
	 * Returns all children from a object in a array.
	 *
	 * @param classInstance
	 * @returns {Array}
	 */
	public static getChildrenFromObject(classInstance:any):any[]
	{
		var arr = [];

		for(var obj in classInstance)
		{
			if(classInstance.hasOwnProperty(obj))
			{
				arr.push(classInstance[obj]);
			}
		}

		return arr;
	}

	/**
	 * Returns all instances of specific type from the container tree.
	 *
	 * @param container
	 * @param object
	 * @param arr
	 */
	public static getInstanceByContainer(container:createjs.Container, object:any, arr:any[]):void
	{
		if(container.children)
		{
			for(var i = 0; i < container.children.length; i++)
			{
				if(container.children[i] instanceof object)
				{
					arr.push(container.children[i]);
				}

				if(container.children[i] instanceof createjs.Container)
				{
					this.getInstanceByContainer(<createjs.Container> container.children[i], object, arr);
				}

			}
		}
	}


	/**
	 * @protected
	 */
	private _animationList:number[][] = [];
	private _labels:ICreatejsMovieClipLabel[];
	private _isRunning:boolean = false;
	private _onTickIsRunning:boolean = false;
	private _startPosition:number = -1;
	private _stopPosition:number = -1;
	public _stage:Stage;

	public type:ComponentType = ComponentType.CONTAINER;
	public view:createjs.MovieClip;

	constructor(public moduleObject:any, className:string, width:any = '100%', height:any = '100%', x:any = '50%', y:any = '50%', regX:any = '50%', regY:any = '50%')
	{
		super(width, height, x, y, regX, regY);

		this.view = <createjs.MovieClip> new moduleObject[className]();

		var instances = this.getInstanceByObject(createjs.MovieClip);
		for(var i = 0; i < instances.length; i++)
		{
			instances[i].stop();
		}

		this._onTick = this.onTick.bind(this);

		this.view.stop();
		this._labels = <ICreatejsMovieClipLabel[]> this.view.getLabels();
	}

	public getInstanceByName(name:string):any[]
	{
		return CreatejsAnimationHandler.getInstancesByName(this.moduleObject, this.view, name)
	}

	public getInstanceByObject(object:any):any[]
	{
		return CreatejsAnimationHandler.getInstancesByObject(object, this.view);
	}

	public getLabels():string[]
	{
		var labels = <ICreatejsMovieClipLabel[]> this.view.getLabels(), arr = [];
		for(var i = 0; i < labels.length; i++)
		{
			arr.push(<string> labels[i].label);
		}

		return arr;
	}

	public setStage(stage:Stage):void
	{
		this._stage = stage;
	}

	public getPositionByLabel(label:string):number[]
	{
		var ret:any[] = [];

		for(var i = 0; i < this._labels.length; i++)
		{
			if(this._labels[i].label == label)
			{
				// start position
				ret.push(this._labels[i].position);

				if(typeof this._labels[i + 1] != 'undefined')
				{
					// end position
					ret.push(this._labels[i + 1].position - 1);
				}
				else
				{
					// end position
					ret.push(this.view.timeline.duration);
				}
			}
		}

		if(ret.length == 0)
		{
			throw 'can not find label ' + (label) + ' (' + this.getLabels().join(',') + ') ';
		}

		return ret;
	}

	public gotoAndPlay(label:number, fn?:Function, reset?:boolean);
	public gotoAndPlay(label:string, fn?:Function, reset?:boolean);
	public gotoAndPlay(label:string[], fn?:Function, reset?:boolean);
	public gotoAndPlay(label:any, fn?:any, reset = false)
	{
		if(reset){
			this._animationList.length = 0;
			this.pause();
		}

		var position;
		if(typeof label == 'number')
		{ 
			position = [label, this.view.timeline.duration];
			this._animationList.push(position);

			if(fn){
				this.addEventListener('complete_' + position[1], fn, true );
			}
		} else if(typeof label != 'string')
		{
			for(var i = 0; i < label.length; i++)
			{
				position = this.getPositionByLabel(label[i]);
				this._animationList.push(position);
			}

			if(fn){
				this.addEventListener('complete_' + position[1], fn, true );
			}
		}
		else
		{
			position = this.getPositionByLabel(label);
			this._animationList.push(position);

			if(fn){
				this.addEventListener('complete_' + position[1], fn, true );
			}
		}

		this._play();
	}

	public gotoAndStop(label:any)
	{
		if(typeof label == 'number')
		{
			this.view.gotoAndStop(label);
		}
		else
		{
			throw 'string labels not implemented yet. Only frame numbers';
		}
	}

	private _play()
	{
		if(!this._isRunning && this._animationList.length > 0)
		{
			this.view.visible = true;
			this._isRunning = true;

			var position = <any[]> this._animationList.shift();

			this._startPosition = position[0];
			this._stopPosition = position[1];

			this.view.gotoAndPlay(this._startPosition);

			if( !this._onTickIsRunning ){
				this._onTickIsRunning = true;
				createjs.Ticker.addEventListener('tick', <any> this._onTick );
			}
		}
	}

	private _onTick;
	private onTick()
	{
//		if(this._onTickIsRunning){
			this.dispatchEvent('progress', this.view.currentFrame / this.view.timeline.duration );

			if( this.view.currentFrame >= this._stopPosition )
			{
				this.dispatchEvent('complete_' +  this._stopPosition );

				this._isRunning = false;
				if(this._animationList.length > 0)
				{
					this._play();
				}
				else
				{
					this._onTickIsRunning = false;
					this.view.stop();

					createjs.Ticker.removeEventListener('tick', <any> this._onTick );
				}
			}
//		}
	}

	public addEventListenerToAssetCollection(arr:any[], name:string, fn:Function)
	{
		for(var i = 0; i < arr.length; i++)
		{
			arr[i].addEventListener(name, fn);
		}
	}

	/**
	 * Get first label and start playing there. Animation will stop when the next label is found.
	 */
	public play(callback?:Function)
	{
		var labels = this.getLabels();

		if(labels.length > 0)
		{
			this.gotoAndPlay(labels[0], callback);
		}
		else
		{
			// no labels where defined in the animation.
			this._animationList.push([0, this.view.timeline.duration]);
			if(callback) this.addEventListener('complete_' + this.view.timeline.duration, callback );

			this._play();
		}
	}

	/**
	 * Pause animation, use resume(); to resume the paused animation.
	 */
	public pause()
	{
		this.view.stop();
		this._isRunning = false;
		if(this._onTickIsRunning){
			this._onTickIsRunning = false;
			createjs.Ticker.removeEventListener('tick', <any> this._onTick );
		}
	}

	/**
	 * Resume paused animation, only use with paused animations.
	 */
	public resume(){
		if(!this._onTickIsRunning){
			this._onTickIsRunning = true;
			createjs.Ticker.addEventListener('tick', <any> this._onTick );
		}

		this._isRunning = true;
		this.view.play();
	}

	/**
	 * Get first label and start playing. Animation will stop when it reaches the position of the next label / end of animation.
	 */
	public playAll(callback?:Function)
	{
		var labels = this.getLabels();

		if(labels.length > 0)
		{
			this.gotoAndPlay(labels, callback);
		}
		else
		{
			this.play(callback);
		}
	}

	/**
	 * Animation is paused and animation qui is clearen
	 */
	public clearAnimationList():void {
		this._animationList.length = 0;
		this.pause();
	}

	/**
	 * Hide animation
	 * @returns {CreatejsAnimationHandler}
	 */
	public hide():CreatejsAnimationHandler
	{
		this.view.visible = false;
		return this;
	}

	/**
	 * Show animation
	 * @returns {CreatejsAnimationHandler}
	 */
	public show():CreatejsAnimationHandler
	{
		this.view.visible = true;
		return this;
	}

	/**
	 * Cache a single frame of the animation. Animation will not be shown un till clearCache() is called.
	 * @param size
	 * @returns {CreatejsAnimationHandler}
	 */
	public cache(size:number = 1):CreatejsAnimationHandler
	{
		this.view.cache(0, 0, this.width, this.height, size);
		return this;
	}

	/**
	 * Cache is cleared
	 * @returns {CreatejsAnimationHandler}
	 */
	public clearCache(){
		this.view.uncache();
		return this;
	}


	public onResize(e)
	{
		super.onResize(e);

		this.view.x = this.x;
		this.view.y = this.y;
		this.view.regX = this.regX;
		this.view.regY = this.regY;
		this.view.scaleX = this.scaleX;
		this.view.scaleY = this.scaleY;
	}

	public destruct()
	{
		this.pause();
		this.view.visible = false;
		this.view.removeAllChildren();
		this.view.removeAllEventListeners();
		this.view.uncache();
		this.removeAllEventListeners();

		while(this._animationList.length > 0)
		{
			this._animationList.pop();
		}

		super.destruct();
	}
}

export = CreatejsAnimationHandler;