define(["require", "exports"], function (require, exports) {
    var RectangleUtils = (function () {
        function RectangleUtils() {
        }
        /**
         * Determines whether the specified point is contained within the rectangular region defined by this Rectangle object.
         */
        RectangleUtils.contains = function (rectangle, x, y) {
            return rectangle.x <= x && rectangle.x + rectangle.width >= x && rectangle.y <= y && rectangle.y + rectangle.height >= y;
        };
        /**
         * Determines whether the specified point is contained within the rectangular region defined by this Rectangle object.
         */
        RectangleUtils.containsPoint = function (rectangle, point) {
            return RectangleUtils.contains(rectangle, point.x, point.y);
        };
        /**
         * Adjust the rectangle so it contains the x and y
         */
        RectangleUtils.fit = function (rectangle, x, y) {
            if (x < rectangle.x) {
                rectangle.width += rectangle.x - x;
                rectangle.x = x;
            }
            else if (x > rectangle.x + rectangle.width) {
                rectangle.width = x - rectangle.x;
            }
            if (y < rectangle.y) {
                rectangle.height += rectangle.y - y;
                rectangle.y = y;
            }
            else if (x > rectangle.y + rectangle.height) {
                rectangle.height = y - rectangle.y;
            }
        };
        /**
         * Adjust the rectangle so it contains the point
         */
        RectangleUtils.fitPoint = function (rectangle, point) {
            RectangleUtils.fit(rectangle, point.x, point.y);
        };
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
        RectangleUtils.equals = function (rectangle, toCompare) {
            return rectangle.x == toCompare.x && rectangle.y == toCompare.y && rectangle.width == toCompare.width && rectangle.height == toCompare.height;
        };
        /**
         * Increases the size of the Rectangle object by the specified amounts, in pixels. The center point of the Rectangle object stays the same, and its size increases to the left and right by the dx value, and to the top and the bottom by the dy value.
         */
        RectangleUtils.inflate = function (rectangle, dx, dy) {
            rectangle.x -= .5 * dx;
            rectangle.y -= .5 * dy;
            rectangle.width += dx;
            rectangle.height += dy;
        };
        /**
         * Increases the size of the Rectangle object.
         */
        RectangleUtils.inflatePoint = function (rectangle, point) {
            RectangleUtils.inflate(rectangle, point.x, point.y);
        };
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
        RectangleUtils.union = function (rectangle, toUnion, unioned) {
            var x = Math.min(rectangle.x, toUnion.x);
            var y = Math.min(rectangle.y, toUnion.y);
            var width = Math.max(rectangle.x + rectangle.width, toUnion.x + toUnion.width) - x;
            var height = Math.max(rectangle.y + rectangle.height, toUnion.y + toUnion.height) - y;
            unioned = unioned || new rectangle.constructor();
            unioned.x = x;
            unioned.y = y;
            unioned.width = width;
            unioned.height = height;
            return unioned;
        };
        return RectangleUtils;
    })();
    return RectangleUtils;
});
