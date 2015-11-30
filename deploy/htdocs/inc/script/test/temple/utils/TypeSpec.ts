import refdef = require('lib/ReferenceDefinitions');
import externals = require('lib/externals');

import Type = require('lib/temple/utils/Type');

describe('temple.utils.Type', () => {

	it('Type(Object) to return \'string\'', () =>
	{
		var date = new Date();
		var obj0 = {};
		var obj1 = new Object();
		var obj2 = new Function().prototype;

		expect(Type({})).toEqual(Type.TYPE_OBJECT);
		expect(Type(obj0)).toEqual(Type.TYPE_OBJECT);
		expect(Type(obj1)).toEqual(Type.TYPE_OBJECT);
		expect(Type(obj2)).toEqual(Type.TYPE_OBJECT);
	});

	it('Type(Array) to return \'array\'', () =>
	{
		var date = []
		var obj = {length:1}

		expect(Type([])).toEqual(Type.TYPE_ARRAY);
		expect(Type(obj)).toEqual(Type.TYPE_OBJECT);
		expect(Type(arguments)).toEqual(Type.TYPE_ARGUMENTS);
		expect(Type.isArray([])).toEqual(true);
		expect(Type.isArray(arguments)).toEqual(false);
	});

	it('Type(arguments) to return \'arguments\'', () =>
	{
		expect(Type(arguments)).toEqual(Type.TYPE_ARGUMENTS);
		expect(Type.isArguments(arguments)).toEqual(true);
	});

	it('Type(Date) to return \'date\'', () =>
	{
		var d = new Date();
		expect(Type(d)).toEqual(Type.TYPE_DATE);
		expect(Type.isDate(d)).toEqual(true);
	});

	it('Type(function) to return \'function\'', () =>
	{
		var t = function(){};
		expect(Type(t)).toEqual(Type.TYPE_FUNCTION);
		expect(Type.isFunction(t)).toEqual(true);
	});

	it('Type(number) to return \'number\'', () =>
	{
		var t = [
			0, 1, -1, -20000
		];

		for(var i = 0; i < 10; i++)
		{
			t.push(Math.random() * Number.MAX_VALUE );
			t.push(Math.random() * Number.MIN_VALUE );
		}

		for(var i = 0; i < t.length; i++)
		{
			var n = t[i];
			expect(Type(n)).toEqual(Type.TYPE_NUMBER);
		}

	});

	it('Type.isFloat(float) to return true', () =>
	{
		var int = [
			0, 1, -1, -20000
		];

		var float = [];

		for(var i = 0; i < 10; i++)
		{
			float.push( (Math.random() * (Number.MAX_VALUE - 100)) + .1236918236 );
			float.push((Math.random() * (Number.MIN_VALUE + 100)) + .1236918236 );
		}

		for(var i = 0; i < float.length; i++)
		{
			expect(Type.isFloat(float[i])).toEqual(true);
		}

		for(var i = 0; i < int.length; i++)
		{
			expect(Type.isFloat(int[i])).toEqual(false);
		}

	});

	it('Type.isInt(int) to return true', () =>
	{
		var int = [
			0, 1, -1, -20000
		];

		var float = [];

		for(var i = 0; i < 10; i++)
		{
			float.push( (Math.random() * (Number.MAX_VALUE - 100)) + .1236918236 );
			float.push((Math.random() * (Number.MIN_VALUE + 100)) + .1236918236 );
		}

		for(var i = 0; i < float.length; i++)
		{
			expect(Type.isInteger(float[i])).toEqual(false);
		}

		for(var i = 0; i < int.length; i++)
		{
			expect(Type.isInteger(int[i])).toEqual(true);
		}

	});

	it('Type.isUndefined(int) to return true', () =>
	{
		var asd;
		expect(Type.isUndefined(asd)).toEqual(true);
		expect(Type.isUndefined()).toEqual(true);
	});

	it('Type.isElement(element) to return true', () =>
	{
		var elements = ['div', 'span', 'table', 'br', 'video'];

		for(var i = 0; i < elements.length; i++)
		{
			var el = document.createElement(elements[i]);
			expect(Type.isElement(el)).toEqual(true);
			expect(Type(el)).toEqual(Type.TYPE_ELEMENT);
		}
	});

	it('Type.isWhiteSpace(\' \') to return true', () =>
	{
		var elements = ['div', 'span', 'table', 'br', 'video'];

		var el = document.createElement('div');
		el.innerHTML = "asd\nasd";

		console.log(el.childNodes[0])

		expect(Type.isWhiteSpace(' ')).toEqual(false);
		expect(Type.isTextNode(el.childNodes[0])).toEqual(true);

	});

	it('Type.isTextnode(textNode) to return true', () =>
	{
		var el = document.createElement('div');
		el.innerHTML = "asd\nasd";
		expect(Type.isTextNode('asdasd')).toEqual(false);
		expect(Type.isTextNode(el.childNodes[0])).toEqual(true);

	});

	it('Type.isNaN(NaN) to return true', () =>
	{
		expect(Type.isNaN(NaN)).toEqual(true);
		expect(Type.isNaN('assadds')).toEqual(false);
		expect(Type.isNaN(12212312)).toEqual(false);
		expect(Type.isNotANumber('assadds')).toEqual(true);
		expect(Type.isNotANumber(123)).toEqual(false);
	});

	it('Type.isNULL(null) to return true', () =>
	{
		expect(Type.isNULL(null)).toEqual(true);
		expect(Type.isNULL('')).toEqual(false);
		expect(Type.isNULL(0)).toEqual(false);
	});
});

