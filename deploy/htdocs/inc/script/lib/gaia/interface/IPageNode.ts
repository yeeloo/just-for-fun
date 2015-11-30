import IAssetNode = require('lib/gaia/interface/IAssetNode')

interface IPageNode
{
	id: string;
	title: string;
	route?: any;
	controller: any;
	viewModel: any;
	template: any;
	type?:string;
	folder?:string;
	data: any;
	assets: IAssetNode[];
	pages: IPageNode[];
	popups: IPageNode[];
	landing?: boolean;
	container?: string;
	defaultChild?: string;
	partials?:{
		app?: string[];
		mobile?: string[];
	};
}

export = IPageNode;