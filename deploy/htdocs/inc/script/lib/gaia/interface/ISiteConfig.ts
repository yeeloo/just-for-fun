import IPageNode = require('lib/gaia/interface/IPageNode')

interface ISiteConfig
{
	title: string;
	config: {
		controllerPath?: string;
		viewModelPath?: string;
		templatePath?: string;
	};
	pages: IPageNode[];
	popups?: IPageNode[];
	routes?: any;
	routing?: boolean;
	history?: boolean;
	indexFirst?: boolean;
	version?: number;
}

export = ISiteConfig;