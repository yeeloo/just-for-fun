import IRectangle = require('lib/temple/geom/IRectangle');
import IPoint = require('lib/temple/geom/IPoint');

class RectangleUtils
{
	/**
	 * Determines whether the specified point is contained within the rectangular region defined by this Rectangle object.
	 */
	public static contains(rectangle:IRectangle, x:number, y:number):boolean
	{
		return rectangle.x <= x && rectangle.x + rectangle.width >= x &&
				rectangle.y <= y && rectangle.y + rectangle.height >= y;
	}

	/**
	 * Determines whether the specified point is contained within the rectangular region defined by this Rectangle object.
	 */
	public static containsPoint(rectangle:IRectangle, point:IPoint):boolean
	{
		return RectangleUtils.contains(rectangle, point.x, point.y);
	}

	/**
	 * Adjust the rectangle so it contains the x and y
	 */
	public static fit(rectangle:IRectangle, x:number, y:number):void
	{
		if (x < rectangle.x)
		{
			rectangle.width += rectangle.x - x;
			rectangle.x = x;
		}
		else if (x > rectangle.x + rectangle.width)
		{
			rectangle.width = x - rectangle.x;
		}

		if (y < rectangle.y)
		{
			rectangle.height += rectangle.y - y;
			rectangle.y = y;
		}
		else if (x > rectangle.y + rectangle.height)
		{
			rectangle.height = y - rectangle.y;
		}
	}

	/**
	 * Adjust the rectangle so it contains the point
	 */
	public static fitPoint(rectangle:IRectangle, point:IPoint):void
	{
		RectangleUtils.fit(rectangle, point.x, point.y);
	}

	/**
	 * Determines whether the Rectangle object specified by the rect parameter is contained within this Rectangle object.
	 */
//	public static containsRect(rectangle:IRectangle, rect:IRectangle):boolean
//	{
//	}

	/**
	 * Copies all of rectangle data from the source Rectangle object into the calling Rectangle object.
	 */
//	public static copyFrom(rectangle:IRectangle, sourceRect:IRectangle):void

	/**
	 * Determines whether the object specified in the toCompare parameter is equal to this Rectangle object.
	 */
	public static equals(rectangle:IRectangle, toCompare:IRectangle):boolean
	{
		return rectangle.x == toCompare.x && rectangle.y == toCompare.y && rectangle.width == toCompare.width && rectangle.height == toCompare.height;
	}

	/**
	 * Increases the size of the Rectangle object by the specified amounts, in pixels. The center point of the Rectangle object stays the same, and its size increases to the left and right by the dx value, and to the top and the bottom by the dy value.
	 */
	public static inflate(rectangle:IRectangle, dx:number, dy:number):void
	{
		rectangle.x -= .5 * dx;
		rectangle.y -= .5 * dy;
		rectangle.width += dx;
		rectangle.height += dy;
	}

	/**
	 * Increases the size of the Rectangle object.
	 */
	public static inflatePoint(rectangle:IRectangle, point:IPoint):void
	{
		RectangleUtils.inflate(rectangle, point.x, point.y);
	}

	/**
	 * If the Rectangle object specified in the toIntersect parameter intersects with this Rectangle object, returns the area of intersection as a Rectangle object.
	 */
//	public static intersection(rectangle:IRectangle, toIntersect:IRectangle):IRectangle

	/**
	 * Determines whether the object specified in the toIntersect parameter intersects with this Rectangle object.
	 */
//	public static intersects(rectangle:IRectangle, toIntersect:IRectangle):boolean

	/**
	 * Determines whether or not this Rectangle object is empty.
	 */
//	public static isEmpty(rectangle:IRectangle):boolean

	/**
	 * Adjusts the location of the Rectangle object, as determined by its top-left corner, by the specified amounts.
	 */
//	public static offset(rectangle:IRectangle, dx:number, dy:number):void

	/**
	 * Adjusts the location of the Rectangle object using a Point object as a parameter.
	 */
//	public static offsetPoint(rectangle:IRectangle, point:IPoint):void

	/**
	 * Sets all of the Rectangle object's properties to 0.
	 */
//	public static setEmpty():void

	/**
	 * Adds two rectangles together to create a new Rectangle object, by filling in the horizontal and vertical space between the two rectangles.
	 */
	public static union(rectangle:IRectangle, toUnion:IRectangle, unioned?:IRectangle):IRectangle
	{
		var x:number = Math.min(rectangle.x, toUnion.x);
		var y:number = Math.min(rectangle.y, toUnion.y);
		var width:number = Math.max(rectangle.x + rectangle.width, toUnion.x + toUnion.width) - x;
		var height:number = Math.max(rectangle.y + rectangle.height, toUnion.y + toUnion.height) - y;

		unioned = unioned || new (<any>rectangle).constructor();

		unioned.x = x;
		unioned.y = y;
		unioned.width = width;
		unioned.height = height;

		return unioned;

	}
}

export = RectangleUtils;