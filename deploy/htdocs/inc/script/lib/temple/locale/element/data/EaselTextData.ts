import refdef = require('lib/ReferenceDefinitions');
import AbstractElementData = require('./AbstractElementData');

/**
 * @module Temple
 * @namespace temple.locale.element.data
 * @extend temple.locale.element.data.AbstractElementData
 * @class EaselTextData
 */
class EaselTextData extends AbstractElementData
{
	constructor(element:createjs.Text, public id:string, public key:string)
	{
		super(element);
	}
}

export = EaselTextData;