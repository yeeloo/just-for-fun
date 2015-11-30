/**
 * This class contains some functions for Strings.
 *
 * @module Temple
 * @namespace temple.utils.types
 * @class StringUtils
 * @author Arjan van Wijk, Thijs Broerse
 */
class StringUtils
{
	/**
	 * Repeats a string
	 * @param string the string to repeat
	 * @param amount how many times the string should be repeated
	 */
	public static repeat(string:string, amount:number):string
	{
		var ret:string = '';
		for(var i:number = 0; i < amount; i++)
		{
			ret += string;
		}
		return ret;
	}

	/**
	 * Add a character to the left of a string till it has a specified length
	 * @param string the original string
	 * @param length the length of the result string
	 * @param fillChar the character that need the be attached to the left of string
	 */
	public static padLeft(string:string, length:number, fillChar:string = ' '):string
	{
		if(fillChar == null || fillChar.length == 0)
		{
			throw 'invalid value for fillChar: "' + fillChar + '"';
		}

		if(string.length < length)
		{
			var lim:number = length - string.length;
			for(var i:number = 0; i < lim; i++)
			{
				string = fillChar + string;
			}
		}
		return string;
	}

	/**
	 * Add a character to the right of a string till it has a specified length
	 * @param string the original string
	 * @param length the length of the result string
	 * @param fillChar the character that need the be attached to the right of string
	 */
	public static padRight(string:string, length:number, fillChar:string = ' '):string
	{
		if(fillChar == null || fillChar.length == 0)
		{
			throw 'invalid value for fillChar: "' + fillChar + '"';
		}
		if(string.length < length)
		{
			var lim:number = length - string.length;
			for(var i:number = 0; i < lim; i++)
			{
				string += fillChar;
			}
		}
		return string;
	}

	/**
	 * replaces all tabs, newlines spaces to just one space
	 * Works the same as ignore whitespace for XML
	 */
	public static ignoreWhiteSpace(string:string):string
	{
		return string.replace(/[\t\r\n]|\s\s/g, '');
	}

	/**
	 * Does a case insensitive compare or two strings and returns true if they are equal.
	 * @param string1 The first string to compare.
	 * @param s2 The second string to compare.
	 * @param An optional boolean indicating if the equal is case sensitive. Default is true.
	 * @return A boolean value indicating whether the strings' values are equal in a case sensitive compare.
	 */
	public static stringsAreEqual(string1:string, string2:string, caseSensitive:boolean = true):boolean
	{
		if(caseSensitive)
		{
			return (string1 == string2);
		}
		else
		{
			return (string1.toUpperCase() == string2.toUpperCase());
		}
	}

    /**
     * Camelcases a string, e.g. my-awesome-string will turn into MyAwesomeString
     * @param str
     * @returns {string}
     */
    public static camelCase(str:string, camelCaseFirst:boolean = true)
    {
        return str.replace(/(^[a-z]|\-[a-z])/g, function (match, submatch, offset)
        {
            if (camelCaseFirst == false && offset == 0) {
                return match.replace(/-/, '').toLowerCase();
            } else {
                return match.replace(/-/, '').toUpperCase();
            }
        });
    }

	/**
	 * Removes whitespace from the front and the end of the specified string.
	 * @param string The String whose beginning and ending whitespace will be removed.
	 * @return A String with whitespace removed from the beginning and end
	 */
	public static trim(string:string):string
	{
		return StringUtils.ltrim(StringUtils.rtrim(string));
	}

	/**
	 * Removes whitespace from the front of the specified string.
	 * @param string The String whose beginning whitespace will will be removed.
	 * @return A String with whitespace removed from the begining
	 */
	public static ltrim(string:string):string
	{
		var size:number = string.length;
		for(var i:number = 0; i < size; i++)
		{
			if(string.charCodeAt(i) > 32)
			{
				return string.substring(i);
			}
		}
		return '';
	}

	/**
	 * Removes whitespace from the end of the specified string.
	 * @param string The String whose ending whitespace will be removed.
	 * @return A String with whitespace removed from the end
	 */
	public static rtrim(string:string):string
	{
		var size:number = string.length;
		for(var i:number = size; i > 0; i--)
		{
			if(string.charCodeAt(i - 1) > 32)
			{
				return string.substring(0, i);
			}
		}

		return '';
	}

	/**
	 * Determines whether the specified string begins with the spcified prefix.
	 * @param string The string that the prefix will be checked against.
	 * @param prefix The prefix that will be tested against the string.
	 * @return true if the string starts with the prefix, false if it does not.
	 */
	public static beginsWith(string:string, prefix:string):boolean
	{
		return (prefix == string.substring(0, prefix.length));
	}

	/**
	 * Determines whether the specified string ends with the spcified suffix.
	 * @param string The string that the suffic will be checked against.
	 * @param prefix The suffic that will be tested against the string.
	 * @return true if the string ends with the suffix, false if it does not.
	 */
	public static endsWith(string:string, suffix:string):boolean
	{
		return (suffix == string.substring(string.length - suffix.length));
	}

	/**
	 * Removes all instances of the remove string in the input string.
	 * @param string The string that will be checked for instances of remove
	 * @param remove The string that will be removed from the input string.
	 * @param caseSensitive An optional boolean indicating if the replace is case sensitive. Default is true.
	 */
	public static remove(string:string, remove:string, caseSensitive:boolean = true):string
	{
		if(string == null)
		{
			return '';
		}
		var rem:string = StringUtils.escapePattern(remove);
		var flags:string = (!caseSensitive) ? 'ig' : 'g';
		return string.replace(new RegExp(rem, flags), '');
	}

	private static escapePattern(pattern:string):string
	{
		return pattern.replace(/(\]|\[|\{|\}|\(|\)|\*|\+|\?|\.|\\)/g, '\\$1');
	}

	/**
	 * Escapes a UTF-8 string to unicode; e.g. "é" -> "\u00e9"
	 * @param input The string to be escaped
	 * @return An escaped UTF-8 String
	 */
	public static escapeToUnicode(input:string):string
	{
		var inputCopy:string = input;
		var escapedInput:string = '';
		for(var i:number = 0; i < inputCopy.length; i++)
		{
			escapedInput += StringUtils.escapeToUnicodeChar(inputCopy.substr(i, 1));
		}
		return escapedInput;
	}

	/**
	 * Escapes a UTF-8 character to unicode; e.g. "é" -> "\u00e9"
	 * @param inputChar The character to be escaped
	 * @return An escaped UTF-8 String
	 */
	public static escapeToUnicodeChar(inputChar:string):string
	{
		if(inputChar < ' ' || inputChar > '}')
		{
			// get the hex digit(s) of the character (either 1 or 2 digits)
			var hexCode:String = inputChar.charCodeAt(0).toString(16);

			// ensure that there are 4 digits by adjusting
			// the # of zeros accordingly.
			while(hexCode.length < 4)
			{
				hexCode = '0' + hexCode;
			}

			// create the unicode escape sequence with 4 hex digits
			return '\\u' + hexCode;
		}
		else
		{
			return inputChar;
		}
	}

	/**
	 * Replaces all instances of the replace string in the input string with the replaceWith string.
	 * @param string The string that instances of replace string will be replaces with removeWith string.
	 * @param replace The string that will be replaced by instances of the replaceWith string.
	 * @param replaceWith The string that will replace instances of replace string.
	 * @return A new String with the replace string replaced with the replaceWith string.
	 */
	public static replace(string:string, replace:string, replaceWith:string):string
	{
		var sb:string = '';
		var found:boolean = false;

		var sLen:number = string.length;
		var rLen:number = replace.length;

		for(var i:number = 0; i < sLen; i++)
		{
			if(string.charAt(i) == replace.charAt(0))
			{
				found = true;
				for(var j:number = 0; j < rLen; j++)
				{
					if(!(string.charAt(i + j) == replace.charAt(j)))
					{
						found = false;
						break;
					}
				}

				if(found)
				{
					sb += replaceWith;
					i = i + (rLen - 1);
					continue;
				}
			}
			sb += string.charAt(i);
		}
		return sb;
	}

	/**
	 * Replaces vars in a String. Vars defined between {}: '{var}'. The var can be prefix with an (optional) $.
	 * Searches for a value in de object with the same name as the var.
	 *
	 * @param string the String containing variable which must be replaced
	 * @param object an object containing all the properties for the replacement (as name-value pair)
	 * @param keepIrreplaceableVars a boolean which indicates if variables which can not be replaced should be
	 * removed (false) or should be kept (true) in the string
	 * @param debug if set true the replacement will not be executed in a try-catch statement.
	 */
	public static replaceVars(string:string, object:any, keepIrreplaceableVars:boolean = true, debug:boolean = false):string
	{
		if(string == null)
		{
			throw 'String can not be null';
		}
		if(object == null)
		{
			throw 'Object can not be null';
		}

		return string.replace(/\$?\{([@#$%&\w]*)(\((.*?)\))?\}/gi, () =>
		{
			var prop:string = arguments[1];
			if(object != null && prop in object)
			{
				if(typeof object[prop] == 'function' && arguments[2])
				{
					if(arguments[3])
					{
						var args:any[] = arguments[3].split(',');
						for(var i:number = 0, leni:number = args.length; i < leni; i++)
						{
							args[i] = StringUtils.replaceVars(args[i], object);
						}
					}

					var argsss:IArguments = arguments;

					if(debug)
					{
						return (object[prop]).apply(null, args);
					}
					else
					{
						try
						{
							return (object[prop]).apply(null, args);
						}
						catch(error)
						{
							console.log('Unable to replace var ' + argsss[0] + ': ' + error.message);
						}
					}
				}
				else
				{
					return object[prop];
				}
			}
			if(keepIrreplaceableVars)
			{
				return '{' + prop + '}';
			}
			if(debug)
			{
				return '*VALUE \'' + prop + '\' NOT FOUND*';
			}
			return '';
		});
	}

	/**
	 * Returns everything after the first occurrence of the provided character in the string.
	 */
	public static afterFirst(string:string, character:string):string
	{
		if(string == null)
		{
			return '';
		}
		var idx:number = string.indexOf(character);
		if(idx == -1)
		{
			return '';
		}
		idx += character.length;
		return string.substr(idx);
	}

	/**
	 * Returns everything after the last occurence of the provided character in source.
	 */
	public static afterLast(string:string, character:string):string
	{
		if(string == null)
		{
			return '';
		}
		var idx:number = string.lastIndexOf(character);
		if(idx == -1)
		{
			return '';
		}
		idx += character.length;
		return string.substr(idx);
	}

	/**
	 * Returns everything before the first occurrence of the provided character in the string.
	 */
	public static beforeFirst(string:string, character:string):string
	{
		if(string == null)
		{
			return '';
		}
		var characterIndex:number = string.indexOf(character);
		if(characterIndex == -1)
		{
			return '';
		}
		return string.substr(0, characterIndex);
	}

	/**
	 * Returns everything before the last occurrence of the provided character in the string.
	 */
	public static beforeLast(string:string, character:string):string
	{
		if(string == null)
		{
			return '';
		}
		var characterIndex:number = string.lastIndexOf(character);
		if(characterIndex == -1)
		{
			return '';
		}
		return string.substr(0, characterIndex);
	}

	/**
	 * Returns everything after the first occurance of start and before the first occurrence of end in the given string.
	 */
	public static between(string:string, start:string, end:string):string
	{
		var str:string = '';
		if(string == null)
		{
			return str;
		}
		var startIdx:number = string.indexOf(start);
		if(startIdx != -1)
		{
			startIdx += start.length;

			var endIdx:number = string.indexOf(end, startIdx);
			if(endIdx != -1)
			{
				str = string.substr(startIdx, endIdx - startIdx);
			}
		}
		return str;
	}

	/**
	 * Determines whether the specified string contains any instances of char.
	 */
	public static contains(source:string, char:string):boolean
	{
		return source ? source.indexOf(char) != -1 : false;
	}

	/**
	 * Returns a string truncated to a specified length with optional suffix
	 * @param string The string.
	 * @param len The length the string should be shortend to
	 * @param suffix (optional, default=...) The string to append to the end of the truncated string.
	 */
	public static truncate(string:string, len:number, suffix:string = '...'):string
	{
		if(string == null)
		{
			return '';
		}
		len -= suffix.length;
		var trunc:string = string;
		if(trunc.length > len)
		{
			trunc = trunc.substr(0, len);
			if(/[^\s]/.test(string.charAt(len)))
			{
				trunc = StringUtils.rtrim(trunc.replace(/\w+$|\s+$/, ''));
			}
			trunc += suffix;
		}

		return trunc;
	}

	/**
	 * Returns a string with the first character of source capitalized, if that character is alphabetic.
	 */
	public static ucFirst(string:string):string
	{
		return string ? string.substr(0, 1).toUpperCase() + string.substr(1) : null;
	}

	/**
	 * Determines the number of times a charactor or sub-string appears within the string.
	 * @param string The string.
	 * @param char The character or sub-string to count.
	 * @param caseSensitive (optional, default is true) A boolean flag to indicate if the search is case sensitive.
	 */
	public static countOf(string:string, char:string, caseSensitive:boolean = true):number
	{
		if(string == null)
		{
			return 0;
		}
		char = StringUtils.escapePattern(char);
		var flags:string = (!caseSensitive) ? 'ig' : 'g';
		return string.match(new RegExp(char, flags)).length;
	}

	/**
	 * Counts the total amount of words in a text
	 * NOTE: does only work correctly for English texts
	 */
	public static countWords(string:string):number
	{
		if(string == null)
		{
			return 0;
		}
		return string.match(/\b\w+\b/g).length;
	}

	/**
	 * Levenshtein distance (editDistance) is a measure of the similarity between two strings. The distance is the number of deletions, insertions, or substitutions required to transform source into target.
	 */
	public static editDistance(string:String, target:String):number
	{
		var i:number;

		if(string == null)
		{
			string = '';
		}
		if(target == null)
		{
			target = '';
		}

		if(string == target)
		{
			return 0;
		}

		var d:any[] = []
		var cost:number;
		var n:number = string.length;
		var m:number = target.length;
		var j:number;

		if(n == 0)
		{
			return m;
		}
		if(m == 0)
		{
			return n;
		}

		for(i = 0; i <= n; i++)
		{
			d[i] = [];
		}
		for(i = 0; i <= n; i++)
		{
			d[i][0] = i;
		}
		for(j = 0; j <= m; j++)
		{
			d[0][j] = j;
		}

		for(i = 1; i <= n; i++)
		{
			var s_i:string = string.charAt(i - 1);
			for(j = 1; j <= m; j++)
			{

				var t_j:string = target.charAt(j - 1);

				if(s_i == t_j)
				{
					cost = 0;
				}
				else
				{
					cost = 1;
				}

				d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
			}
		}
		return d[n][m];
	}

	/**
	 * Determines whether the specified string contains text.
	 */
	public static hasText(string:string):boolean
	{
		return string && StringUtils.removeExtraWhitespace(string).length > 0;
	}

	/**
	 * Removes extraneous whitespace (extra spaces, tabs, line breaks, etc) from the specified string.
	 */
	public static removeExtraWhitespace(string:string):string
	{
		if(string == null)
		{
			return '';
		}
		var str:string = StringUtils.trim(string);
		return str.replace(/\s+/g, ' ');
	}

	/**
	 * Determines whether the specified string contains any characters.
	 */
	public static isEmpty(string:string):boolean
	{
		return !string;
	}

	/**
	 * Determines whether the specified string is numeric.
	 */
	public static isNumeric(string:string):boolean
	{
		if(string == null)
		{
			return false;
		}
		var regx:RegExp = /^[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?$/;
		return regx.test(string);
	}

	/**
	 * Escapes all of the characters in a string to create a friendly "quotable" sting
	 */
	public static quote(string:string):string
	{
		var regx:RegExp = /[\\"\r\n]/g;
		return '"' + string.replace(regx, StringUtils._quote) + '"'; //"
	}

	private static _quote(source:string):string
	{
		switch(source)
		{
			case '\\':
				return '\\\\';
			case '\r':
				return '\\r';
			case '\n':
				return '\\n';
			case '"':
				return '\\"';
			default:
				return '';
		}
	}

	/**
	 * Returns the specified string in reverse character order.
	 */
	public static reverse(string:string):string
	{
		if(string == null)
		{
			return '';
		}
		return string.split('').reverse().join('');
	}

	/**
	 * Returns the specified string in reverse word order.
	 */
	public static reverseWords(string:string):string
	{
		if(string == null)
		{
			return '';
		}
		return string.split(/\s+/).reverse().join(' ');
	}

	/**
	 * Determines the percentage of similarity, based on editDistance
	 */
	public static similarity(string:string, target:string):number
	{
		var ed:number = StringUtils.editDistance(string, target);
		var maxLen:number = Math.max(string.length, target.length);
		if(maxLen == 0)
		{
			return 100;
		}
		else
		{
			return (1 - ed / maxLen) * 100;
		}
	}

	/**
	 * Removes all &lt; and &gt; based tags from a string
	 */
	public static stripTags(string:string):string
	{
		if(string == null)
		{
			return '';
		}
		return string.replace(/<\/?[^>]+>/igm, '');
	}

	/**
	 * Swaps the casing of a string.
	 */
	public static swapCase(string:string):string
	{
		if(string == null)
		{
			return '';
		}
		return string.replace(/(\w)/, StringUtils._swapCase);
	}

	private static _swapCase(char:string):string
	{
		var lowChar:string = char.toLowerCase();
		var upChar:string = char.toUpperCase();
		switch(char)
		{
			case lowChar:
				return upChar;
			case upChar:
				return lowChar;
			default:
				return char;
		}
	}

	/**
	 * Removes all instances of word in string.
	 * @param string the original string.
	 * @param word the word to remove from string.
	 * @param caseSensitive indicates in removing is case sensative.
	 * @return the string without the word
	 */
	public static removeWord(string:string, word:string, caseSensitive:boolean = true):string
	{
		return string.replace(new RegExp('^' + word + '(\\W)|(\\W)' + word + '$|\\W' + word + '(?=\\W)', 'g' + (caseSensitive ? '' : 'i')), '');
	}

	/**
	 * Removes all instances of all words in string
	 * @param string the original string
	 * @param word the word to remove from string
	 * @param caseSensitive indicates in removing is case sensative.
	 * @return the string without the word
	 */
	public static removeWords(string:string, words:string[], caseSensitive:boolean = true):string
	{
		var leni:number = words.length;
		for(var i:number = 0; i < leni; i++)
		{
			string = StringUtils.removeWord(string, words[i], caseSensitive);
		}
		return string;
	}

	/**
	 * Split a string on multiple seperators
	 * @param string The string.
	 * @param seperators Array with the seperators to split on
	 * @param reappendSeperator (optional) Re-append the seperator after each part
	 * @return a single-dimension array with the parts
	 */
	public static splitMultiSeperator(string:string, seperators:string[], reappendSeperator:boolean = false):string[]
	{
		var ret:string[] = [string];
		for(var i = 0; i < seperators.length; i++)
		{
			ret = StringUtils.splitElements(ret, seperators[i], reappendSeperator);
		}
		return ret;
	}

	/**
	 * Split multiple strings on a seperator
	 * @param string Array with the strings
	 * @param seperators The seperator to split on
	 * @param reappendSeperator (optional) Re-append the seperator after each part
	 * @return a single-dimension array with the parts
	 */
	public static splitElements(strings:string[], seperator:string, reappendSeperator:boolean = false):string[]
	{
		var ret:string[] = [];
		for(var i:number = 0; i < strings.length; i++)
		{
			var split:string[] = strings[i].split(seperator);
			for(var j:number = 0; j < split.length; j++)
			{
				var p:string = StringUtils.trim(split[j]);
				if(p != '')
				{
					ret.push(reappendSeperator && j < split.length - 1 ? p + seperator : p);
				}
			}
		}
		return ret;
	}

	/**
	 * Trim all elements in an Array (in place)
	 * @param string Array with the strings
	 * @return the modified input array
	 */
	public static trimAll(array:string[]):string[]
	{
		for(var i:number = 0; i < array.length; i++)
		{
			array[i] = StringUtils.ltrim(StringUtils.rtrim(array[i]));
		}
		return array;
	}

	/**
	 * Trim all elements in an Array, and after trimming remove any empty (== '') elements
	 * @param string Array with the strings
	 * @param seperators The seperator to split on
	 * @param reappendSeperator (optional) Re-append the seperator after each part
	 * @return a new array with the parts
	 */
	public static trimAllFilter(array:string[]):string[]
	{
		var ret:string[] = [];

		for(var i:number = 0; i < array.length; i++)
		{
			var tmp:string = StringUtils.ltrim(StringUtils.rtrim(array[i]));
			if(tmp != '')
			{
				ret.push(tmp);
			}
		}
		return ret;
	}

	public static cleanSpecialChars(string:string):string
	{
		var validString:string = '';
		var len:number = string.length;
		//
		for(var i:number = 0; i < len; i++)
		{
			var charCode:number = string.charCodeAt(i);
			if((charCode < 47) || (charCode > 57 && charCode < 65) || charCode == 95)
			{
				validString += '-';
			}
			else if((charCode > 90 && charCode < 97) || (charCode > 122 && charCode < 128))
			{
				validString += '-';
			}
			else if(charCode > 127)
			{
				if((charCode > 130 && charCode < 135) || charCode == 142 || charCode == 143 || charCode == 145 || charCode == 146 || charCode == 160 || charCode == 193 || charCode == 225)
				{
					validString += 'a';
				}
				else if(charCode == 128 || charCode == 135)
				{
					validString += 'c';
				}
				else if(charCode == 130 || (charCode > 135 && charCode < 139) || charCode == 144 || charCode == 201 || charCode == 233)
				{
					validString += 'e';
				}
				else if((charCode > 138 && charCode < 142) || charCode == 161 || charCode == 205 || charCode == 237)
				{
					validString += 'i';
				}
				else if(charCode == 164 || charCode == 165)
				{
					validString += 'n';
				}
				else if((charCode > 146 && charCode < 150) || charCode == 153 || charCode == 162 || charCode == 211 || charCode == 214 || charCode == 243 || charCode == 246 || charCode == 336 || charCode == 337)
				{
					validString += 'o';
				}
				else if(charCode == 129 || charCode == 150 || charCode == 151 || charCode == 154 || charCode == 163 || charCode == 218 || charCode == 220 || charCode == 250 || charCode == 252 || charCode == 368 || charCode == 369)
				{
					validString += 'u';
				}
			}
			else
			{
				validString += string.charAt(i);
			}
		}
		validString = validString.replace(/\-+/g, '-').replace(/\-*$/, '');
		return validString.toLowerCase();
	}

	public static makeMultiline(str:string, lineLength:number, splitOn:string = ' ', replaceSplit:string = "\n"):string
	{
		var strArr = str.split(splitOn);

		var _l = 0;
		var resultStr = '';

		for(var i = 0; i < strArr.length; i++)
		{
			if((_l + strArr[i].length + splitOn.length) > lineLength)
			{
				if(resultStr.length == 0)
				{
					resultStr = strArr[i];
				}
				else
				{
					resultStr += replaceSplit + strArr[i];
				}

				_l = 0;
			}
			else
			{
				if(resultStr.length == 0)
				{
					resultStr = strArr[i];
				}
				else
				{
					resultStr += splitOn + strArr[i];
				}
			}
		}

		return StringUtils.ltrim(StringUtils.rtrim(resultStr));
	}

	private static _UID = Date.now();

	public static uniqueID()
	{
		return (StringUtils._UID++).toString(36);
	}

}

export = StringUtils;