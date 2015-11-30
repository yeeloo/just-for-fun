import IPoint = require('lib/temple/geom/IPoint');

interface IRectangle extends IPoint
{
	width:number;
	height:number;
}

export = IRectangle;