class Birthdate
{
	/**
	 * Integer value representing the year. Values from 0 to 99 map to the years 1900 to 1999.
	 */
	public year:number;

	/**
	 * Integer value representing the month, beginning with 1 for January to 12 for December.
	 */
	public month:number;

	/**
	 * Integer value representing the day of the month.
	 */
	public day:number;

	constructor(year:number, month:number, day:number);
	constructor(value:string);
	constructor(timestamp:number);
	constructor(date:Date);
	constructor(yearValueTimestampOrDate:any, month?:number, day?:number)
	{
		if (!isNaN(month) && !isNaN(day))
		{
			this.year = yearValueTimestampOrDate;
			this.month = month + 1;
			this.day = day;
		}
		else
		{
			this.parse(yearValueTimestampOrDate);
		}
	}

	public parse(value:any)
	{
		this.fromDate(value instanceof Date ? value : new Date(value));
	}

	public toDate():Date
	{
		return new Date(this.year, this.month - 1, this.day);
	}

	public fromDate(date:Date)
	{
		this.year = date.getFullYear();
		this.month = date.getMonth() + 1;
		this.day = date.getDate();
	}

	public toJSON()
	{
		return this.toString();
	}

	public toString()
	{
		return (this.year < 100 ? "19" : "") + (this.year < 10 ? "0" : "") + this.year + "-" + (this.month < 10 ? "0" : "") + this.month + "-" + (this.day < 10 ? "0" : "") + this.day;
	}
}

export = Birthdate;