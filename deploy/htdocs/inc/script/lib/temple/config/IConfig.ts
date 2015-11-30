import IConfigUrl = require('./IConfigUrl');

interface IConfig
{
	vars:{[name:string]:any};

	urls:{[name:string]:IConfigUrl};

	properties:{[name:string]:any};

	environments?:{[name:string]:IConfig};
}

export = IConfig;