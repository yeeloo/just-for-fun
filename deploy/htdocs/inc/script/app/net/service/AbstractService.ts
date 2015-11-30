import gw = require("app/net/Gateway");
import IDebuggable = require('lib/temple/core/IDebuggable');

class AbstractService implements IDebuggable
{
	constructor(public gateway:gw.IGateway, public debug:boolean)
	{
		if (!gateway) throw new Error("Gateway cannot be null");
	}
}

export = AbstractService;