/**
 * This class contains some functions for Booleans.
 *
 * @author Thijs Broerse
 */
class BooleanUtils
{
	/**
	 * Attempts to convert a object to a native boolean.
	 */
	public static getBoolean(value:any):boolean
	{
		if(!value)
		{
			return false;
		}
		if(typeof value === 'object')
		{
			value = String(value);
		}
		if(typeof value === 'string')
		{
			value.toString().toLowerCase();
		}
		switch(value)
		{
			case true :
			case 'on' :
			case 'true' :
			case 'yes' :
			case '1' :
			case 1 :
			{
				return true;
			}
		}
		return false;
	}
}

export = BooleanUtils;