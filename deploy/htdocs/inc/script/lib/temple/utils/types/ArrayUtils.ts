class ArrayUtils {

	static CASEINSENSITIVE = 1;
	static DESCENDING = 2;
	static UNIQUESORT = 4;
	static RETURNINDEXEDARRAY = 8;
	static NUMERIC = 16;

	/**
	 * Checks if an array contains a specific value
	 */
	public static inArray( array:any[], value:any ):boolean{
		return (array.indexOf( value ) != -1);
	}

	/**
	 * Checks if an element in the array has a field with a specific value
	 */
	public static inArrayField( array:any[], field:string, value:any ):boolean{
		for( var i = 0; i < array.length; i++ ){
			if( array[i][field] == value ) return true;
		}
		return false;
	}

	/**
	 * Get a random element form the array
	 */
	public static randomElement( array:any[] ):any{
		if( array.length > 0 ){
			return array[Math.floor( Math.random() * array.length )];
		}
		return null;
	}

	/**
	 * Shuffles an array (sort random)
	 */
	public static shuffle( array:any[] ):void{
		var i:number = array.length;
		if( i == 0 ){
			return;
		}
		var j:number;
		var temp:any;
		while( --i ) {
			j = Math.floor( Math.random() * (i + 1) );
			temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
	}

	/**
	 * copies the source array to the target array, without remove the reference
	 */
	public static copy( array:any[], target:any[] ):void{
		var leni:number = target.length = array.length;
		for( var i:number = 0; i < leni; i++ ){
			target[i] = array[i];
		}
	}

	/**
	 * recursively clone an Array and it's sub-Array's (doesn't clone content objects)
	 */
	public static deepArrayClone( array:any[] ):any[]{
		var ret:any[] = array.concat();
		var iLim:number = ret.length;
		var i:number;
		for( i = 0; i < iLim; i++ ){
			if( ret[i] instanceof Array ){
				ret[i] = ArrayUtils.deepArrayClone( ret[i] );
			}
		}
		return ret;
	}

	/**
	 * Calculates the average value of all elements in an array
	 * Works only for array's with numeric values
	 */
	public static average( array:any[] ):number{
		if( array == null || array.length == 0 ) return NaN;
		var total:number = 0;
		for( var i = 0; i < array.length; i++ ){
			total += array[i];
		}
		return total / array.length;
	}

	/**
	 * Remove all instances of the specified value from the array,
	 * @param array The array from which the value will be removed
	 * @param value The item that will be removed from the array.
	 *
	 * @return the number of removed items
	 */
	public static removeValueFromArray( array:any[], value:any ):number{
		var total:number = 0;
		for( var i:number = array.length - 1; i > -1; i-- ){
			if( array[i] === value ){
				array.splice( i, 1 );
				total++;
			}
		}
		return total;
	}

	/**
	 * Removes a single (first occurring) value from an Array.
	 * @param array The array from which the value will be removed
	 * @param value The item that will be removed from the array.
	 *
	 * @return a boolean which indicates if a value is removed
	 */
	public static removeValueFromArrayOnce( array:any[], value:any ):boolean{
		var len:number = array.length;

		for( var i:number = len; i > -1; i-- ){
			if( array[i] === value ){
				array.splice( i, 1 );
				return true;
			}
		}
		return false;
	}

	/**
	 * Create a new array that only contains unique instances of objects
	 * in the specified array.
	 *
	 * <p>Basically, this can be used to remove duplication object instances
	 * from an array</p>
	 *
	 * @param array The array which contains the values that will be used to
	 * create the new array that contains no duplicate values.
	 *
	 * @return A new array which only contains unique items from the specified
	 * array.
	 */
	public static createUniqueCopy( array:any[] ):any[]{
		var newArray:any[] = [];

		var len:number = array.length;
		var item:any;

		for( var i:number = 0; i < len; ++i ){
			item = array[i];

			if( ArrayUtils.inArray( newArray, item ) ){
				continue;
			}

			newArray.push( item );
		}
		return newArray;
	}

	/**
	 * Creates a copy of the specified array.
	 *
	 * <p>Note that the array returned is a new array but the items within the
	 * array are not copies of the items in the original array (but rather
	 * references to the same items)</p>
	 *
	 * @param array The array that will be cloned.
	 *
	 * @return A new array which contains the same items as the array passed
	 * in.
	 */
	public static clone( array:any[] ):any[]{
		return array.slice( 0, array.length );
	}

	/**
	 * Compares two arrays and returns a boolean indicating whether the arrays
	 * contain the same values at the same indexes.
	 *
	 * @param array1 The first array that will be compared to the second.
	 * @param array2 The second array that will be compared to the first.
	 *
	 * @return True if the arrays contains the same values at the same indexes.
	 *     False if they do not.
	 */
	public static areEqual( array1:any[], array2:any[] ):boolean{
		if( array1 == array2 ){
			return true;
		}
		if( array1.length != array2.length ){
			return false;
		}
		for( var i:number = array1.length - 1; i >= 0; --i ){
			if( array1[i] != array2[i] ){
				return false;
			}
		}
		return true;
	}

	/**
	 * Returns the amount of (not empty) items in an Array.
	 */
	public static filledLength( array:any[] ):number{
		var length:number = 0;

		var leni:number = array.length;
		for( var i:number = 0; i < leni; i++ ){
			if( array[i] != undefined ) length++;
		}
		return length;
	}

	/**
	 * Returs the items that are unique in the first array
	 */
	public static getUniqueFirst( array1:any[], array2:any[] ):any[]{
		var ret:any[] = [];

		for( var i:number = 0; i < array1.length; i++ ){
			if( array2.indexOf( array1[i] ) == -1 ) ret.push( array1[i] );
		}

		return ret;
	}

	/**
	 * Returs the items that are in both arrays
	 */
	public static intersect( array1:any[], array2:any[] ):any[]{
		var ret:any[] = [];
		var i:number;

		for( i = 0; i < array1.length; i++ ){
			if( array2.indexOf( array1[i] ) != -1 ) ret.push( array1[i] );
		}
		for( i = 0; i < array2.length; i++ ){
			if( array1.indexOf( array2[i] ) != -1 ) ret.push( array2[i] );
		}

		ret = ArrayUtils.createUniqueCopy( ret );

		return ret;
	}

	/**
	 * Adds an element to an Array
	 * @param element the element to add
	 * @param amount number of times the element must be added
	 * @param array the array where the element is added to. If null, a new Array is created
	 *
	 * @return the array or the newly create array, with the element
	 */
	public static addElements( element:any, amount:number, array:any[] = null ):any[]{
		if( !array ) array = [];
		for( var i:number = 0; i < amount; i++ ){
			array.push( element );
		}
		return array;
	}

	/**
	 * Simple joins a Array to a String
	 */
	public static simpleJoin( array:any[], sort:boolean = true, pre:string = ' - ', post:string = '\n', empty:string = '(empty)' ):string{
		if( !array ){
			return '(null array)';
		}
		if( array.length == 0 ){
			return empty;
		}
		if( sort ){
			array = array.concat().sort();
		}
		return pre + array.join( post + pre ) + post;
	}

	/**
	 * Returns a new Array from an Array without the empty (null, '' or undefined) elements.
	 */
	public static removeEmptyElements( array:any[] ):any[]{
		var results:any[] = [];
		for( var i:number = 0; i < array.length; ++i ){
			if( array[i] != '' && array[i] != null && array[i] != undefined ) results.push( array[i] );
		}

		return results;
	}

	/*
	 ---

	 script: Array.sortOn.js

	 description: Adds Array.sortOn function and related constants that works like in ActionScript for sorting arrays of objects (applying all same strict rules)

	 license: MIT-style license.

	 authors:
	 - gonchuki

	 github: https://github.com/gonchuki/mootools-Array.sortOn/blob/master/Source/Array.sortOn.js
	 docs: http://www.adobe.com/livedocs/flash/9.0/ActionScriptLangRefV3/Array.html#sortOn()

	 requires:
	 - core/1.2.4: [Array]

	 provides:
	 - [sortOn, CASEINSENSITIVE, DESCENDING, UNIQUESORT, RETURNINDEXEDARRAY, NUMERIC]

	 ...
	 */
	public static sortOn(array:any[], fields, options?:any):any
	{
		var dup_fn = function(field, field_options) {
			var filtered = (field_options & ArrayUtils.NUMERIC)
				? this.map(function(item) {return item[field].toFloat(); })
				: (field_options & ArrayUtils.CASEINSENSITIVE)
				? this.map(function(item) {return item[field].toLowerCase(); })
				: this.map(function(item) {return item[field]; });
			return filtered.length !== []['combine'](filtered).length;
		};

		var sort_fn = function(item_a, item_b, fields, options) {
			return (function sort_by(fields, options) {
				var ret, a, b,
					opts = options[0],
					sub_fields = fields[0].match(/[^.]+/g);

				(function get_values(s_fields, s_a, s_b) {
					var field = s_fields[0];
					if (s_fields.length > 1) {
						get_values(s_fields.slice(1), s_a[field], s_b[field]);
					} else {
						a = s_a[field].toString();
						b = s_b[field].toString();
					}
				})(sub_fields, item_a, item_b);

				if (opts & ArrayUtils.NUMERIC) {
					ret = (a.toFloat() - b.toFloat());
				} else {
					if (opts & ArrayUtils.CASEINSENSITIVE) { a = a.toLowerCase(); b = b.toLowerCase(); }

					ret = (a > b) ? 1 : (a < b) ? -1 : 0;
				}

				if ((ret === 0) && (fields.length > 1)) {
					ret = sort_by(fields.slice(1), options.slice(1));
				} else if (opts & ArrayUtils.DESCENDING) {
					ret *= -1;
				}

				return ret;
			})(fields, options);
		};

		fields = Array['from'](fields);
		options = Array['from'](options);

		if (options.length !== fields.length) options = [];

		if ((options[0] & ArrayUtils.UNIQUESORT) && (fields.some(function(field, i){return dup_fn(field, options[i]);}))) return 0;

		var curry_sort = function(item_a, item_b) {
			return sort_fn(item_a, item_b, fields, options);
		};

		if (options[0] & ArrayUtils.RETURNINDEXEDARRAY)
		{
			return array.concat().sort(curry_sort);
		}
		else
		{
			return array.sort(curry_sort);
		}
	}
}

export = ArrayUtils;
