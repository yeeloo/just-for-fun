import refdef = require("lib/ReferenceDefinitions");
import EventDispatcher = require('lib/createjs/easeljs/component/EventDispatcher');
import ICssCalcUnit = require('lib/createjs/easeljs/component/interface/ICssCalcUnit');
import IResize = require('lib/createjs/easeljs/component/interface/IResize');
import CalculationType = require('lib/createjs/easeljs/component/enum/CalculationType');
import CalculationUnitType = require('lib/createjs/easeljs/component/enum/CalculationUnitType');


/**
 * @name CalculationComponent
 * @author Mient-jan Stelling
 */
class CalculationComponent extends EventDispatcher
{
	/**
	 *
	 */
	private static _unittype:CalculationUnitType[] = [ CalculationUnitType.ADDITION, CalculationUnitType.SUBSTRACTION,
		CalculationUnitType.MULTIPLICATION, CalculationUnitType.DIVISION ];

	private static _unitypeString = '+-*/';

	private static _valueUnitDisolvement:RegExp = /([\+\-]?[0-9\.]+)(%|px|pt|em|in|cm|mm|ex|pc|vw)?/;
	private static _spaceSplit:RegExp = /\s+/;

	public static dissolveCalcElements(statement:string):any[]
	{
		statement = statement.replace('*', ' * ').replace('/', ' / ');
		var arr = statement.split(CalculationComponent._spaceSplit);

		var calculationElements = [];
		for(var i = 0; i < arr.length; i++)
		{
			var d = CalculationComponent.dissolveElement(arr[i]);
			calculationElements.push(d);
		}
		return calculationElements;
	}

	public static dissolveElement(val):any
	{
		var index = CalculationComponent._unitypeString.indexOf(val);
		if(index >= 0)
		{
			return CalculationComponent._unittype[index];
		}

		var o = <ICssCalcUnit> {};
		var match = CalculationComponent._valueUnitDisolvement.exec(val);

		if(match)
		{
			var v = match.length >= 2 ? match[1] : match[0];
			o.value = CalculationComponent.toFloat(v); // value > float
			o.unit = match.length >= 3 ? match[2] : '';
		}
		else
		{
			o = { value: val, unit: null};
		}

		return o;
	}

	/**
	 *
	 * @param size
	 * @param data
	 * @returns {number}
	 */
	public static calcUnit(size:number, data:ICssCalcUnit[]):number
	{
		var sizea = CalculationComponent.getCalcUnitSize(size, data[0]);

		for(var i = 2, l = data.length; i < l; i = i + 2)
		{
			sizea = CalculationComponent.getCalcUnit(
				sizea,
				<any> data[i - 1],
				CalculationComponent.getCalcUnitSize(size, data[i])
			);
		}

		return sizea;
	}

	/**
	 * Calculates arithmetic on 2 units.
	 *
	 * @author Mient-jan Stelling
	 * @param unit1
	 * @param math
	 * @param unit2
	 * @returns number;
	 */
	public static getCalcUnit(unit1:number, math:CalculationUnitType, unit2:number):number
	{
		switch(math)
		{
			case CalculationUnitType.ADDITION:
			{
				return unit1 + unit2;
				break;
			}

			case CalculationUnitType.SUBSTRACTION:
			{
				return unit1 - unit2;
				break;
			}

			case CalculationUnitType.MULTIPLICATION:
			{
				return unit1 * unit2;
				break;
			}

			case CalculationUnitType.DIVISION:
			{
				return unit1 / unit2;
				break;
			}

			default:
			{
				return 0;
				break;
			}
		}
	}

	/**
	 *
	 * @todo add support for more unit types.
	 *
	 * @author Mient-jan Stelling
	 * @param size
	 * @param data
	 * @returns {number}
	 */
	public static getCalcUnitSize(size:number, data:ICssCalcUnit):number
	{
		switch(data.unit)
		{
			case '%':
			{
				return size * ( data.value / 100 );
				break;
			}

			default:
			{
				return data.value;
				break;
			}
		}
	}

	public static toFloat(value)
	{
		return parseFloat(value) || 0.0;
	}
}

export = CalculationComponent;