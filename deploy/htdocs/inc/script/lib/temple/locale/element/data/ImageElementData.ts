import AbstractElementData = require('./AbstractElementData');

/**
 * @module Temple
 * @namespace temple.locale.element.data
 * @extend temple.locale.element.data.AbstractElementData
 * @class ImageElementData
 */
class ImageElementData extends AbstractElementData
{
	constructor(element:any, public url:string)
	{
		super(element);
	}
}

export = ImageElementData;