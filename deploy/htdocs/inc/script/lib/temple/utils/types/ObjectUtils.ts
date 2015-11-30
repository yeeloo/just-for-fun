/**
 * This class contains some functions for Objects.
 *
 * @author Thijs Broerse
 */
class ObjectUtils {

    /**
     * Checks if the value is a primitive (String, Number, or Boolean)
     */
    public static isPrimitive(value:any):boolean {
        if (typeof value == 'string' || typeof value == 'number' || typeof value == 'boolean' || value == null) {
            return true;
        }
        return false;
    }

    /**
     * Checks if the object has (one or more) values
     */
    public static hasValues(object:any):boolean {
        if (object instanceof Array) return object.length > 0;

        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Counts the number of elements in an Object
     */
    public static getLength(object:any):number {
        var count:number = 0;
        for (var key in object) {
            count++;
        }
        return count;
    }

    /**
     * Get the keys of an object.
     * @return an Array of all the keys
     */
    public static getKeys(object:any):string[] {
        var keys:string[] = [];

        for (var key in object) {
            if(object.hasOwnProperty(key))
            {
                keys.push(key);
            }
        }
        return keys;
    }

    /**
     * Get the values of an object.
     * @return an Array of all values.
     */
    public static getValues(object:any):any[] {
        var values:any[] = [];
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                values.push(object[key]);
            }
        }
        return values;
    }

    /**
     * Check if there are properties defined
     * @return true if we have properties
     */
    public static hasKeys(object:any):boolean {
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns an inverted object with all values as key and keys as value.
     */
    public static invert(object:any):any {
        var inverted:any = {};
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                inverted[object[key]] = key;
            }
        }
        return inverted;
    }

	/**
	 * Converts an object to an other class
	 *
	 * @param object
	 * @param toClass
	 */
	public static convert(object:any, toClass:any):void
	{
		for (var property in toClass.prototype)
		{
			if (property in toClass.prototype)
			{
				object[property] = toClass.prototype[property];
			}
		}
		(<any>object).__proto__ = new (toClass)();
	}

	/**
	 * Removes all properties of an object
	 *
	 * @param object
	 */
	public static clear(object:any):void
	{
		for (var property in object)
		{
			delete object[property];
		}
	}
}

export = ObjectUtils;