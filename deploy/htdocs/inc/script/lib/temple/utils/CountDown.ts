import Destructible = require("lib/temple/core/Destructible");

/**
 * Class for calculating the remaining time till a specific Date and time.
 *
 * @class CountDown
 * @author Arjan van Wijk
 */
class CountDown extends Destructible
{
	private _isPaused:boolean;
	private _duration:number;
	private _pauseTime:number;
	private _endDate:Date;
	private _startDate:Date;
	private _allowNegative:boolean;
	private _pauseEndTime:Date;
	private _timeDiff:number;

	constructor(endDate:Date = null, allowNegative:boolean = false)
	{
		super();

		this._startDate = new Date();
		this.setEndDate(endDate);
		this._allowNegative = allowNegative;
	}

	/**
	 * Date when the CountDown is ended
	 */
	public getEndDate():Date
	{
		return this._endDate;
	}

	/**
	 * @method setEndDate
	 * @param {Date} value
	 * @return void
	 */
	public setEndDate(value:Date):void
	{
		this._endDate = value;
	}

	/**
	 * @private
	 * Set the time difference in miliseconds to work with (instead of an end-date)
	 * Use 2 constant times (endtime - now) and substract the getTimer
	 */
	public setTimeDiff(value:number):void
	{
		this._timeDiff = value;
	}

	/**
	 * Date when the CountDown is started
	 *
	 * @method getStartDate
	 * @return Date
	 */
	public getStartDate():Date
	{
		return this._startDate;
	}

	/**
	 * @public
	 * @method setStartDate
	 * @param {Date} value
	 * @return void
	 */
	public setStartDate(value:Date):void
	{
		this._startDate = value;
	}

	/**
	 * Duration in milliseconds
	 *
	 * @method getDuration
	 * @return number
	 * @public
	 */
	public getDuration():number
	{
		return this._duration;
	}

	/**
	 * Duration in milliseconds
	 *
	 * @method setDuration
	 * @param {number} value
	 * @return number
	 * @public
	 */
	public setDuration(value:number):void
	{
		this._duration = value;
	}

	/**
	 * Use only when set duration, functions as restart when called twice
	 *
	 * @method start
	 * @param {number} duration duration in milliseconds
	 * @return void
	 */
	public start(duration:number = NaN):void
	{
		if(!isNaN(duration))
		{
			this._duration = duration;
		}
		if(isNaN(this._duration))
		{
			throw 'duration not set';
		}

		this._startDate = new Date();
		this._endDate = new Date();
		this._endDate.setMilliseconds(this._endDate.getMilliseconds() + this._duration);

		this._isPaused = false;
	}

	/**
	 * Stop the CountDown
	 *
	 * @method stop
	 * @return void
	 */
	public stop():void
	{
		this._endDate = null;
		this._pauseTime = NaN;
		this._pauseEndTime = null;
		this._isPaused = false;
	}

	/**
	 * @method pause
	 * @return void
	 */
	public pause():void
	{
		this._pauseTime = new Date().getTime();
		this._pauseEndTime = this.getTime();
		this._isPaused = true;
	}

	/**
	 * @method resume
	 * @return void
	 */
	public resume():void
	{
		if(this._isPaused)
		{
			this._endDate.setMilliseconds(this._endDate.getMilliseconds() - (new Date().getTime() - this._pauseTime));
			this._isPaused = false;
		}
	}

	/**
	 * @method isPaused
	 * @return boolean
	 */
	public isPaused():boolean
	{
		return this._isPaused;
	}

	/**
	 * Get the time till end as date
	 *
	 * @method getTime
	 * @return Date
	 */
	public getTime():Date
	{
		if(this._isPaused)
		{
			return this._pauseEndTime;
		}
		else if(this._endDate)
		{
			var diff:number = this._endDate.getTime() - new Date().getTime();

			if(diff < 0 && !this._allowNegative)
			{
				diff = 0;
			}

			return new Date(1970, 0, 1, 0, 0, 0, diff);
		}
		else
		{
			return null;
		}
	}

	/**
	 * Get the time till end as date
	 *
	 * @method getYears
	 * @return number
	 */
	public getYears():number
	{
		return this.getTime().getFullYear() - 1970;
	}

	/**
	 * Get the total amount of months till end.
	 *
	 * @method getTotalMonths
	 * @return number
	 */
	public getTotalMonths():number
	{
		return this.getTime().getMonth() + 1 - 1 + (this.getYears() * 12);
	}

	/**
	 * Get the total amount of months till end minus the years.
	 *
	 * @method getMonths
	 * @return number
	 */
	public getMonths():number
	{
		return this.getTime().getMonth() + 1 - 1;
	}

	/**
	 * Get the total amount of weeks till end
	 *
	 * @method getTotalWeeks
	 * @return number
	 */
	public getTotalWeeks():number
	{
		return Math.floor(this.getTotalTime() / 1000 / 60 / 60 / 24 / 7);
	}

	/**
	 * Get the total amount of weeks till end minus the years.
	 *
	 * @method getWeeks
	 * @return number
	 */
	public getWeeks():number
	{
		if(this._endDate)
		{
			return Math.floor(this.getDays() / 7);
		}
		else
		{
			return this.getTotalWeeks();
		}
	}

	/**
	 * Get the total amount of days till end.
	 *
	 * @method getTotalDays
	 * @return number
	 */
	public getTotalDays():number
	{
		return this.getTotalTime() / 1000 / 60 / 60 / 24;
	}

	/**
	 * Get the total amount of days till end minus the years.
	 *
	 * @method getDays
	 * @return number
	 */
	public getDays():number
	{
		if(this._endDate)
		{
			return this.getTime().getDate() - 1;
		}
		else
		{
			return Math.floor(this.getTotalDays());
		}
	}

	/**
	 * @method getTotalHours
	 * @return {number}
	 */
	public getTotalHours():number
	{
		return this.getTotalTime() / 1000 / 60 / 60;
	}

	/**
	 * @method getHours
	 * @return {number}
	 */
	public getHours():number
	{
		if(this._endDate)
		{
			return this.getTime().getHours();
		}
		else
		{
			return Math.floor(this.getTotalHours() % 24);
		}
	}

	/**
	 * @method getTotalMinutes
	 * @return {number}
	 */
	public getTotalMinutes():number
	{
		return this.getTotalTime() / 1000 / 60;
	}

	/**
	 * @method getMinutes
	 * @return {number}
	 */
	public getMinutes():number
	{
		if(this._endDate)
		{
			return this.getTime().getMinutes();
		}
		else
		{
			return Math.floor(this.getTotalMinutes() % 60);
		}
	}

	/**
	 * @method getTotalSeconds
	 * @return {number}
	 */
	public getTotalSeconds():number
	{
		return this.getTotalTime() / 1000;
	}

	/**
	 * @method getSeconds
	 * @return {number}
	 */
	public getSeconds():number
	{
		if(this._endDate)
		{
			return this.getTime().getSeconds();
		}
		else
		{
			return Math.floor(this.getTotalSeconds() % 60);
		}
	}

	/**
	 * @method getTotalMilliseconds
	 * @return {number}
	 */
	public getTotalMilliseconds():number
	{
		return this.getTotalTime();
	}

	/**
	 * @method getMilliseconds
	 * @return {number}
	 */
	public getMilliseconds():number
	{
		if(this._endDate)
		{
			return this.getTime().getMilliseconds();
		}
		else
		{
			return Math.floor(this.getMilliseconds());
		}
	}

	/**
	 * @method getTotalTime
	 * @return {number}
	 */
	private getTotalTime():number
	{
		var time:Date = this.getTime();
		return time ? time.getTime() - (time.getTimezoneOffset() * 60 * 1000) : (this._allowNegative ? this._timeDiff : Math.max(this._timeDiff, 0));
	}

	/**
	 * Get the relative time left till end, where 1 means that we are on the start and 0 means we are at the end.
	 *
	 * @method getRatio
	 * @return {number}
	 */
	public getRatio():number
	{
		if(!this._startDate || !this._endDate)
		{
			return NaN;
		}

		return this.getTotalTime() / (this._endDate.getTime() - this._startDate.getTime());
	}

	/**
	 * A Boolean which indicates if a negative value is allowed. If not all values will return 0 if endDate is in the past.
	 *
	 * @method getAllowNegative
	 * @return {number}
	 */
	public getAllowNegative():boolean
	{
		return this._allowNegative;
	}

	/**
	 * @method setAllowNegative
	 * @return {number}
	 * @public
	 */
	public setAllowNegative(value:boolean):void
	{
		this._allowNegative = value;
	}

	/**
	 * @inheritDoc
	 */
	public destruct():void
	{
		this._endDate = null;
		this._startDate = null;
		this._pauseEndTime = null;
		super.destruct();
	}
}

export = CountDown;
