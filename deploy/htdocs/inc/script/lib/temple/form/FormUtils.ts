import refdef = require('lib/ReferenceDefinitions');

class FormUtils
{
	public static getValue(name:string, form?:HTMLFontElement):any
	{
		var input:HTMLInputElement = <HTMLInputElement>$("[name='" +name + "']" , form)[0];

		if (input)
		{
			return input.value;
		}
		else
		{
			console.error("No input found with name '" + name + "'");
		}
		return null;
	}
}

export = FormUtils;