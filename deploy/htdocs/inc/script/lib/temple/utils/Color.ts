/**
 * @overview Color utility class
 * @author Arthur Dam <arthur@mediamonks.com>
 * @version 0.1
 * @copyright MediaMonks B.V. 2014
 */

class Color
{
	public r:number;
	public g:number;
	public b:number;
	public a:number = 1;

	private h:number;
	private s:number;
	private v:number;
	private l:number;

	private static CLAMP:number = 0xFF;

	/**
	 * An empty initiation
	 * @constructor
	 */
	constructor() { }

	/**
	 * Set value based on hex string
	 * @param {string} hex - Input string
	 */
	public setHex(hex:string):void
	{
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		this.r = parseInt(result[1], 16);
		this.g = parseInt(result[2], 16);
		this.b = parseInt(result[3], 16);
	}

	/**
	 * Get hex value
	 * @returns {string}
	 */
	public getHex():string
	{
		return "#" + ((1 << 24) + (this.r << 16) + (this.g << 8) + this.b).toString(16).slice(1);
	}

	/**
	 * Set value based on "rgb()" string
	 * @param {string} rgb - Input string
	 */
	public setRgbString(rgb:string):void
	{
		var result:string[] = rgb.replace(/[^\d,]/g, '').split(',');
		var r:number = parseInt(result[0], 10);
		var g:number = parseInt(result[1], 10);
		var b:number = parseInt(result[2], 10);

		if(result.length !== 3 || r > Color.CLAMP || r < 0 || g > Color.CLAMP || g < 0 || b > Color.CLAMP || b < 0)
		{
			console.log('setRgbString: ' + rgb + 'is not a valid input!')
			return;
		}

		this.r = r;
		this.g = g;
		this.b = b;
	}

	/**
	 * Get rgb() string
	 * @returns {string}
	 */
	public getRgbString():string
	{
		return 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')';
	}

	/**
	 * Set value based on "rgba()" string
	 * @param {string} rgba - Input string
	 */
	public setRgbaString(rgba:string):void
	{
		var result:string[] = rgba.replace(/[^\d,]/g, '').split(',');

		var r:number = parseInt(result[0], 10);
		var g:number = parseInt(result[1], 10);
		var b:number = parseInt(result[2], 10);
		var a:number = parseInt(result[3], 10);

		if(result.length !== 4 || r > Color.CLAMP || r < 0 || g > Color.CLAMP || g < 0 || b > Color.CLAMP || b < 0 || a > 1 || a < 0)
		{
			console.log('setRgbaString: ' + rgba + 'is not a valid input!')
			return;
		}

		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	}

	/**
	 * Get rgba() string
	 * @returns {string}
	 */
	public getRgbaString():string
	{
		return 'rgba(' + this.r + ', ' + this.g + ', ' + this.b + ', ' + this.a + ')';
	}

	/**
	 * Set value based on direct input
	 * @param {object} rgb - Input object (r:number; g:number; b:number; a?:number (optional))
	 */
	public setRgb(color:{r:number; g:number; b:number; a?:number;}):void
	{
		this.r = color.r;
		this.g = color.g;
		this.b = color.b;
		if(color.a) this.a = color.a;
	}

	/**
	 * Get rgb
	 * @returns {object}
	 */
	public getRgb():{r:number; g:number; b:number;}
	{
		return {
			r:this.r,
			g:this.g,
			b:this.b
		};
	}

	/**
	 * Set value based on hsl input
	 * @param {object} hsl - Input object (h:number; s:number; l:number;)
	 */
	public setHsl(color:{h:number; s:number; l:number;}):void
	{
		this.h = color.h;
		this.s = color.s;
		this.l = color.l;
		this.hslToRgb();
	}

	/**
	 * Get hsl
	 * @returns {object}
	 */
	public getHsl():{h:number; s:number; l:number}
	{
		this.rgbToHsl();
		return {
			h:this.h,
			s:this.s,
			l:this.l
		};
	}

	/**
	 * Set value based on hsv input
	 * @param {object} hsv - Input object (h:number; s:number; v:number;)
	 */
	public setHsv(color:{h:number; s:number; v:number;}):void
	{
		this.h = color.h;
		this.s = color.s;
		this.v = color.v;
		this.hsvToRgb();
	}

	/**
	 * Get hsv
	 * @returns {object}
	 */
	public getHsv():{h:number; s:number; v:number}
	{
		this.rgbToHsl();
		return {
			h:this.h,
			s:this.s,
			v:this.v
		};
	}

	/**
	 * Set hue
	 * @param {number} hue - Input hue
	 */
	public setHue(hue:number):void
	{
		this.h = hue;
		this.hslToRgb();
	}

	/**
	 * Get hue
	 * @returns {number}
	 */
	public getHue():number
	{
		this.rgbToHsl();
		return this.h;
	}

	/**
	 * Set saturation
	 * @param {number} saturation - Input saturation
	 */
	public setSaturation(saturation:number):void
	{
		this.s = saturation;
		this.hsvToRgb();
	}

	/**
	 * Get saturation
	 * @returns {number}
	 */
	public getSaturation():number
	{
		this.rgbToHsl();
		return this.s;
	}

	/**
	 * Set brightness
	 * @param {number} brightness - Input brightness
	 */
	public setBrightness(brightness:number):void
	{
		this.v = brightness;
		this.hsvToRgb();
	}

	/**
	 * Get brightness
	 * @returns {number}
	 */
	public getBrightness():number
	{
		this.rgbToHsl();
		return this.v;
	}

	/**
	 * Set lightness
	 * @param {number} lightness - Input lightness
	 */
	public setLightness(lightness:number)
	{
		this.l = lightness;
		this.hslToRgb();
	}

	/**
	 * Get lightness
	 * @returns {number}
	 */
	public getLightness():number
	{
		this.rgbToHsl();
		return this.v;
	}

	/**
	 * Applies matrix color operation to the color
	 * @param {number[]} m - Color transformation matrix
	 */
	public applyMatrixFilter(m:number[]):void
	{
		if(m.length < 20) return;
		this.r = this.r * m[0] + this.g * m[1] + this.b * m[2] + this.a * m[3] + m[4];
		this.g = this.r * m[5] + this.g * m[6] + this.b * m[7] + this.a * m[8] + m[9];
		this.b = this.r * m[10]+ this.g * m[11]+ this.b * m[12]+ this.a * m[13]+ m[14];
		this.a = this.r * m[15]+ this.g * m[16]+ this.b * m[17]+ this.a * m[18]+ m[19];
	}

	/**
	 * Interpolates between two colors
	 * @param {Color} destination - Color to interpolate to
	 * @param {number} factor - Interpolation factor
	 * @returns {Color}
	 */
	public interpolate(destination:Color, factor:number):Color
	{
		this.r = Color.absround(+(this.r) + (destination.r - this.r) * factor);
		this.g = Color.absround(+(this.g) + (destination.g - this.g) * factor);
		this.b = Color.absround(+(this.b) + (destination.b - this.b) * factor);
		this.a = Color.absround(+(this.a) + (destination.a - this.a) * factor);

		return this;
	}

	/**
	 * @private
	 * converts object's rgb to hsl
	 */
	private rgbToHsl():void
	{
		var r = this.r / Color.CLAMP;
		var g = this.g / Color.CLAMP;
		var b = this.b / Color.CLAMP;

		var max = Math.max(r, g, b);
		var min = Math.min(r, g, b);
		var l = (max + min) / 2;
		var v = max;

		if(max == min)
		{
			this.h = 0;
			this.s = 0;
			this.l = Color.absround(l * 100);
			this.v = Color.absround(v * 100);
			return;
		}

		var _d = max - min;
		var _s = _d / ( ( l <= 0.5) ? (max + min) : (2 - max - min) );
		var _h = ((max == r)
			? (g - b) / _d + (g < b ? 6 : 0)
			: (max == g)
			? ((b - r) / _d + 2)
			: ((r - g) / _d + 4)) / 6;

		this.h = Color.absround(_h * 360);
		this.s = Color.absround(_s * 100);
		this.l = Color.absround(l * 100);
		this.v = Color.absround(v * 100);
	}

	/**
	 * @private
	 * converts object's hsl to rgb
	 */
	private hslToRgb():void
	{
		var h = this.h / 360;
		var s = this.s / 100;
		var l = this.l / 100;
		var q = l < 0.5    ? l * (1 + s) : (l + s - l * s);
		var p = 2 * l - q;

		this.r = Color.absround(Color.hue2rgb(p, q, h + 1/3) * 255);
		this.g = Color.absround(Color.hue2rgb(p, q, h) * 255);
		this.b = Color.absround(Color.hue2rgb(p, q, h - 1/3) * 255);
	}

	/**
	 * @private
	 * converts object's hsv to rgb
	 */
	private hsvToRgb():void
	{
		var h = this.h / 360;
		var s = this.s / 100;
		var v = this.v / 100;
		var r = 0;
		var g = 0;
		var b = 0;
		var i = Math.floor(h * 6);
		var f = h * 6 - i;
		var p = v * (1 - s);
		var q = v * (1 - f * s);
		var t = v * (1 - (1 - f) * s);
		switch(i % 6){
			case 0 :
				r = v, g = t, b = p;
				break;
			case 1 :
				r = q, g = v, b = p;
				break;
			case 2 :
				r = p, g = v, b = t;
				break;
			case 3 :
				r = p, g = q, b = v;
				break;
			case 4 :
				r = t, g = p, b = v
				break;
			case 5 :
				r = v, g = p, b = q;
				break;
		}
		this.r = Color.absround(r * 255);
		this.g = Color.absround(g * 255);
		this.b = Color.absround(b * 255);
	}

	/**
	 * @private
	 * makes a number absolute/rounded
	 */
	private static absround(c:number):number
	{
		return (0.5 + c) << 0;
	}

	/**
	 * @private
	 * converts hue to rgb
	 */
	private static hue2rgb(a, b, c):number
	{
		if(c < 0) c += 1;
		if(c > 1) c -= 1;
		if(c < 1/6) return a + (b - a) * 6 * c;
		if(c < 1/2) return b;
		if(c < 2/3) return a + (b - a) * (2/3 - c) * 6;
		return a;
	}
}

export = Color;