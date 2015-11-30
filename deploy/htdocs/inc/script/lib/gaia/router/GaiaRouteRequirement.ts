/**
 * @namespace gaia.router
 * @class GaiaRouteRequirement
 */
class GaiaRouteRequirement
{
	constructor(name:string, assertion:string);
	constructor(name:string, assertion:RegExp);
	constructor(name:string, assertion:(value:string) => boolean);
	constructor(public name:string, public assertion:any)
	{
		var check:string = '';


		if (typeof this.assertion !== 'function')
		{
			check = this.assertion.toString();
		}

		if (check)
		{
			if (check.charAt(0) != '^')
			{
				console.warn('Missing ^ at the beginning, this might be unintential.', name, this.assertion);
			}
			if (this.assertion.charAt(this.assertion.length - 1) != '$')
			{
				console.warn('Missing $ at the end, this might be unintential.', name, this.assertion);
			}
		}
	}

	/**
	 * @method assert
	 * @param {string} value
	 * @returns {boolean}
	 */
	public assert(value:string):boolean
	{
		// string
		if (typeof this.assertion === 'string')
		{
			return value['test'](new RegExp(this.assertion, 'i'));
		}
		// function
		else if (typeof this.assertion === 'function')
		{
			return this.assertion(value);
		}
		// regexp
		else
		{
			return value['test'](this.assertion);
		}
	}
}

export = GaiaRouteRequirement;