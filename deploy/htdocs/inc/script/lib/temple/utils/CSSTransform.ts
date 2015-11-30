class CSSTransform
{
	private static _PROPERTIES:Array<string> = [
		'transform',
		'webkitTransform',
		'MozTransform',
		'OTransform',
		'msTransform'
	]

	private static getProperty():string
	{
		var div = document.createElement('div');

		for (var i = 0; i < CSSTransform._PROPERTIES.length; i++)
		{
			var prop = CSSTransform._PROPERTIES[i];
			if (div.style[prop] !== void 0)
			{
				return prop;
			}
		}

		// return unprefixed version by default
		return CSSTransform._PROPERTIES[0];
	}

	public static PROPERTY:string = CSSTransform.getProperty();
}

export = CSSTransform;