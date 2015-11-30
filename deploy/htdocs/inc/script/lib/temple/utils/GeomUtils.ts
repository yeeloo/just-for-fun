/**
 * GeomUtils
 *
 * @module Temple
 * @namespace temple.utils
 * @class GeomUtils
 * @author Thijs Broerse
 */
class GeomUtils
{
	/**
	 * @property RAD2DEG
	 * @type number
	 */
	public static RAD2DEG:number = 180 / Math.PI;

	/**
	 * @property DEG2RAD
	 * @type number
	 */
	public static DEG2RAD:number = Math.PI / 180;

	/**
	 * Converts an angle from radians to degrees.
	 * <p><strong>WARNING: this is MUCH slower than the actual calculation : "radians / Math.PI * 180"</strong></p>
	 *
	 * @static
	 * @method radiansToDegrees
	 * @param {number} radians The angle in radians
	 * @return The angle in degrees
	 */
	public static radiansToDegrees(radians:number):number
	{
		return radians * GeomUtils.RAD2DEG;
	}

	/**
	 * Converts an angle from degrees to radians.
	 * <p><strong>WARNING: this is MUCH slower than the actual calculation : "degrees / 180 * Math.PI"</strong></p>
	 *
	 * @static
	 * @method degreesToRadians
	 * @param {number} degrees The angle in degrees
	 * @return {number} The angle in radians
	 */
	public static degreesToRadians(degrees:number):number
	{
		return degrees * GeomUtils.DEG2RAD;
	}
}

export  = GeomUtils;