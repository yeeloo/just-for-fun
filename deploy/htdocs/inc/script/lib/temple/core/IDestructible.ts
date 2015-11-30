import refdef = require('lib/ReferenceDefinitions');

interface IDestructible
{
	isDestructed():boolean;
	destruct():void;
}

export = IDestructible;