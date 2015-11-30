/**
 * This class contains some functions for Regular Expressions.
 *
 * @author Arjan van Wijk
 */
class RegExpUtils
{
	/**
	 * @method pregMatchAll
	 *
	 * Searches text for all matches to the regular expression given in pattern and return the result.
	 * Modelled like http://php.net/manual/en/function.preg-match-all.php
	 *
	 * @param regExp the regular expression
	 * @param content the string to search on
	 */
	public static pregMatchAll(regExp:RegExp, content:string):Array<any>
	{
		var resultList:Array<any> = [];

		var result:any = regExp.exec(content);

		var index:number = -1;
		while (result != null && index != result.index)
		{
			for (var i:number = 0; i < result.length; ++i)
			{
				if (true)
				{
					if (resultList[i] == null) resultList[i] = [];
					resultList[i].push(result[i] != undefined ? result[i] : '');
				}
				else
				{
					// PREG_SET_ORDER implementatie
				}
			}
			index = result.index;
			result = regExp.exec(content);
		}
		return resultList;
	}

	/**
	 * @method pregMatch
	 *
	 * Searches for a match to the regular expression given in pattern.
	 * Moddelled like http://php.net/manual/en/function.preg-match.php
	 *
	 * @param regExp {RegExp} the regular expression
	 * @param content {string} the string to search on
	 */
	public static pregMatch(regExp:RegExp, content:string):Array<any>
	{
		var resultList:Array<any> = [];

		var result:any = regExp.exec(content);
		if (result != null)
		{
			for (var i:number = 0; i < result.length; ++i)
			{
				resultList.push(result[i] != undefined ? result[i] : '');
			}
		}
		return resultList;
	}
}

export = RegExpUtils;