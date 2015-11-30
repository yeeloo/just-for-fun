import ecb = require("DisplayObject");
import Browser = require("lib/temple/utils/Browser");
import IResize = require("lib/createjs/easeljs/component/interface/IResize");
import Container = require("lib/createjs/easeljs/component/Container");

/**
 * @author Mient-jan Stelling
 */
class Stage extends Container
{
	private _fps:number = 120;
	private _isRunning:boolean = false;

	/**
	 * used as reusable object when triggering resize.
	 * @protected
	 */
	public _globalSize:IResize = {
		width: 0,
		height: 0
	};

	public stage:createjs.Stage = null;
	public ctx:CanvasRenderingContext2D = null;
	public canvas:HTMLCanvasElement;
	public holder:HTMLElement;

	constructor(element:HTMLElement, width?:any, height?:any, x?:any, y?:any, regX?:any, regY?:any);
	constructor(element:HTMLCanvasElement, width:any = '100%', height:any = '100%', x:any = 0, y:any = 0, regX:any = 0, regY:any = 0)
	{
		super(width, height, x, y, regX, regY);

		switch(element.tagName)
		{
			case 'CANVAS':
			{
				this.canvas = element;
				this.holder = $(element).parent().get(0);

				this._globalSize.width = $(this.canvas).width();
				this._globalSize.height = $(this.canvas).height();

				this.onResize(this._globalSize);
				break;
			}

			case 'DIV':
			{
				var canvas = document.createElement('canvas');
				element.appendChild(canvas);
				this.canvas = canvas;
				this.holder = element;

				window.addEventListener('resize', () =>
				{
					this._globalSize.width = this.holder.offsetWidth;
					this._globalSize.height = this.holder.offsetHeight;

					this.onResize(this._globalSize);
				});

				setTimeout(() => {
					this._globalSize.width = this.holder.offsetWidth;
					this._globalSize.height = this.holder.offsetHeight;

					this.onResize(this._globalSize);
				}, 200 );
				break;
			}

			default:
			{
				throw new Error('unsupported element used "' + element.tagName + '"');
				break;
			}
		}

		this.setStage(this);

		this.stage = new createjs.Stage(this.canvas);
		this.ctx = this.canvas.getContext("2d");

		this.setFps(this._fps);
		createjs.Ticker.timingMode = createjs.Ticker.RAF;
		createjs.Ticker.addEventListener('tick', <any> this.onUpdate);

		if(Browser.Platform.name == 'android' || Browser.Platform.name == 'ios'){
			createjs.Touch.enable(this.stage);
		}

		this.stage.addChild(<createjs.Container> this.view);
	}

	/**
	 * Start the update loop.
	 *
	 * @returns {boolean}
	 */
	public start():boolean
	{
		if(!this._isRunning)
		{
			this.stage.update();
			createjs.Ticker.addEventListener('tick', <any> this.onUpdate);
			this._isRunning = true;
			return true;
		}

		return false;
	}

	/**
	 * Will stop all animation and updates to the stage.
	 *
	 * @returns {boolean}
	 */
	public stop():boolean
	{
		if(this._isRunning)
		{
			createjs.Ticker.removeEventListener('tick', this.onUpdate);

			// update stage for a last tick, solves rendering
			// issues when having slowdown. Last frame is sometimes not rendered. When using createjsAnimations
			setTimeout(this.onUpdate, 1000 / this._fps);

			this._isRunning = false;
			return true;
		}

		return false;
	}

	/**
	 * Check if stage is running
	 *
	 * @returns {boolean}
	 */
	public isRunning():boolean
	{
		return this._isRunning;
	}

	/**
	 * So you can specify the fps of the animation. This operation sets
	 * the fps for all createjs operations and tweenlite.
	 * @param value
	 */
	public setFps(value:number):void
	{
		this._fps = value;
		createjs.Ticker.setFPS(value);
		TweenLite.ticker.fps(value);
	}

	/**
	 * Return the current fps of this stage.
	 *
	 * @returns {number}
	 */
	public getFps():number
	{
		return this._fps;
	}

	/**
	 * Sets the timing mode of the ticker
	 * @param value The timing mode. Valid values are createjs.Ticker.RAF, createjs.Ticker.RAF_SYNCHED and createjs.Ticker.TIMEOUT.
	 */
	public setTimingMode(value:string):void
	{
		if (value != createjs.Ticker.RAF && value != createjs.Ticker.RAF_SYNCHED && value != createjs.Ticker.TIMEOUT)
		{
			throw new Error("timingMode is invalid. Valid values are createjs.Ticker.RAF, createjs.Ticker.RAF_SYNCHED and createjs.Ticker.TIMEOUT.")
		}

		createjs.Ticker.timingMode = value;
	}

	/**
	 * Get the current timing mode of the ticker
	 * @returns {string}
	 */
	public getTimingMode():string
	{
		return createjs.Ticker.timingMode;
	}

	/**
	 * Is triggerd when the stage (canvas) is resized.
	 * Will give this new information to all children.
	 *
	 * @param e IResize
	 */
	public onResize(e:IResize)
	{
		// anti-half pixel
		e.width = Math.floor(e.width / 2) * 2;
		e.height = Math.floor(e.height / 2) * 2;

		if(this._globalSize.width != e.width || this._globalSize.height != e.height)
		{
			this._globalSize.width = e.width;
			this._globalSize.height = e.height;

			this.canvas.width = e.width;
			this.canvas.height = e.height;

			super.onResize(e);

			if(!this.isRunning)
			{
				this.stage.update();
			}
		}
	}

	private onUpdate = () =>
	{
		this.stage.update();
	}

	/**
	 * Enable mouse over, be carefull these type's of operations are considered heavy.
	 *
	 * @param frequency
	 */
	public enableMouseOver(frequency:number = 20)
	{
		this.stage.enableMouseOver(frequency);
	}

	public disableMouseOver()
	{
		clearInterval(this.stage['_mouseOverIntervalID']);
		this.stage['_mouseOverIntervalID'] = null;
	}

	/**
	 * shows mouseover.
	 */
	public setMouseOver = () =>
	{
		this.setCursor('pointer');
	}

	/**
	 * hides mouseover.
	 */
	public setMouseOut = () =>
	{
		this.setCursor('');
	}

	/**
	 * Sets cursor on parent element so a cursor is shown scross-platform.
	 *
	 * @param value
	 */
	public setCursor(value:string)
	{
		$(this.canvas).parent().get(0).style.cursor = value;
	}

	/**
	 * hide stage
	 */
	public hide()
	{
		$(this.canvas).css('display', 'none');
		this.stop();
	}

	/**
	 * show stage
	 */
	public show()
	{
		$(this.canvas).css('display', 'block');
	}
}

export = Stage;