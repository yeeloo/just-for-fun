import Gaia = require('lib/gaia/api/Gaia');
import PageAsset = require('lib/gaia/assets/PageAsset');

import ISiteConfig = require('lib/gaia/interface/ISiteConfig')
import IPageNode = require('lib/gaia/interface/IPageNode')
import IAssetNode = require('lib/gaia/interface/IAssetNode')
import IRoute = require('lib/gaia/interface/IRoute')
import IPageAsset = require('lib/gaia/interface/IPageAsset');

import EventDispatcher = require('lib/temple/events/EventDispatcher');
import BaseEvent = require('lib/temple/events/BaseEvent');

class SiteModel extends EventDispatcher
{
	static _xml:ISiteConfig;
	static _tree:IPageAsset;
	static _title:string;
	static _delimiter:string;
	static _preloader:string;
	static _preloaderDepth:string;
	static _preloaderDomain:string;
	static _menu:boolean;
	static _defaultFlow:string;
	static _routing:boolean;
	static _routes:{
		[index: string]: string;
	};
	static _history:boolean;
	static _indexFirst:boolean;
	static _indexID:string;
	static _assetPath:string;
	static _domain:string;
	static _version:number;

	constructor()
	{
		super();
	}

	public load(siteConfig:ISiteConfig):void
	{
		SiteModel._xml = siteConfig;

		if (SiteModel._xml.config)
		{
			if (SiteModel._xml.config.controllerPath)
			{
				PageAsset.controllerPath = SiteModel._xml.config.controllerPath;
			}
			if (SiteModel._xml.config.viewModelPath)
			{
				PageAsset.viewModelPath = SiteModel._xml.config.viewModelPath;
			}
			if (SiteModel._xml.config.templatePath)
			{
				PageAsset.templatePath = SiteModel._xml.config.templatePath;
			}
		}

		// Thijs hack: dispatch init event so you can do something with the xml before it is parsed
		//dispatchEvent(new Event(Event.INIT));

		this.parseSite();
		this.parseTree();

		//dispatchEvent(new Event(Event.COMPLETE));
	}

	public static getXml():ISiteConfig
	{
		return SiteModel._xml;
	}

	public static getTree():IPageAsset
	{
		return SiteModel._tree;
	}

	public static getTitle():string
	{
		return SiteModel._title;
	}

	public static getRouting():boolean
	{
		return SiteModel._routing;
	}

	public static getRoutes():Object
	{
		return SiteModel._routes;
	}

	public static getIndexFirst():boolean
	{
		return SiteModel._indexFirst;
	}

	public static getIndexID():string
	{
		return SiteModel._indexID;
	}

	public static getVersion():string
	{
		return SiteModel._version.toString();
	}

	private parseSite():void
	{
		SiteModel._title = SiteModel._xml.title || "";
		SiteModel._routing = !(SiteModel._xml.routing == false);
		SiteModel._history = !(SiteModel._xml.history == false);
		SiteModel._indexFirst = (SiteModel._xml.indexFirst == true);
		//SiteModel._assetPath = SiteModel._xml.assetPath || "";
		SiteModel._version = SiteModel._xml.version;// || FlashVars.getValue("version");
		if (SiteModel._routing)
		{
			SiteModel._routes = {};
		}
	}

	private parsePopupPage(page:IPageNode, node:IPageNode):void
	{
		page.route = this.getValidRoute(node.route || node.title, node.id) + "/" + this.getValidRoute(page.route || page.title, page.id);

		if (page.pages)
		{
			for (var j = 0; j < page.pages.length; ++j)
			{
				this.parsePopupPage(page.pages[j], node);
			}
		}
	}

	private getPages(page:any)
	{
		var pages:IPageNode[] = [];
		if (page.pages)
		{
			for (var i:number = 0; i < page.pages.length; ++i)
			{
				pages.push(page.pages[i]);
				pages = pages.concat(this.getPages(page.pages[i]));
			}
		}

		return pages;
	}

	private parseTree():void
	{
		var node:IPageNode = SiteModel._xml.pages[0];
		if (node.id != undefined)
		{
			SiteModel._indexID = node.id;
		}

		var popupString = '[]';

		if (typeof SiteModel._xml.popups !== 'undefined')
		{
			for (var i = 0; i < SiteModel._xml.popups.length; i++)
			{
				var popup = SiteModel._xml.popups[i];
				popup.type = "popup";
			}
			popupString = JSON.stringify(SiteModel._xml.popups);
		}

		SiteModel._tree = this.parsePage(node, null, popupString);
	}

	private parseChildren(parent:IPageAsset, childNodes:IPageNode[], popupString:string = null):any
	{
		var children:Object = {};
		var len:number = childNodes.length;
		for (var i:number = 0; i < len; i++)
		{
			var node:any = childNodes[i];
			var page:IPageAsset = this.parsePage(node, parent, popupString);
			children[page.id] = page;
		}
		return children;
	}

	private parsePage(node:IPageNode, parent:IPageAsset = null, popupString:string = null):IPageAsset
	{
		SiteModel.validateNode(node, true);

		var isIndex:boolean = (node.id == SiteModel._indexID);

		// merge popups from this page
		if (node.popups)
		{
			for (var i = 0; i < node.popups.length; i++)
			{
				var popup = node.popups[i];
				popup.type = "popup";
			}
			popupString = JSON.stringify(JSON.parse(popupString).concat(node.popups));
		}

		if (!isIndex)
		{
			if (node.type == 'popup' || parent.type == 'popup')
			{
				node.type = 'popup';
			}
		}

		// add popup pages to node
		if (node.type != "popup" && (node.landing || !node.pages || node.pages.length == 0))
		{
			if (!node.pages)
			{
				node.pages = [];
			}

			var copy:IPageNode[] = JSON.parse(popupString);
			for (var j = 0; j < copy.length; ++j)
			{
				this.parsePopupPage(copy[j], node);
			}
			node.pages = node.pages.concat(copy);
			node.landing = true;
		}

		var page:IPageAsset = new PageAsset(node);

		if (!isIndex)
		{
			page.setParent(parent);
		}

		page.data = node.data;
		page.type = node.type;

		if (node.type == 'popup')
		{
			page.type = 'popup';

//			var route = Gaia.router.getRoute(page.getParent().getBranch())
//				.addChild(
//					Gaia.router.page(page.route, page.getBranch())
//				);
//			console.log('parse: ', route);
		}

		// assets
//		if (node.assets && node.assets.length > 0){
//			page.assets = this.parseAssets(node.assets, page);
//		}

		// child pages
		if (node.pages && node.pages.length > 0)
		{
			page.defaultChild = node.defaultChild;
			page.pages = this.parseChildren(page, node.pages, popupString);
			if (!page.pages[page.defaultChild])
			{
				page.defaultChild = node.pages[0].id;
			}
		}
		// terminal page
		else
		{
			page.landing = true;
		}

		// only add terminal and landing pages to routes
		if (SiteModel._routing && page.landing)
		{
			page.route = this.getValidRoute(node.route || page.title , page.id);

			// only add route if it wasn't there already.
			// So if there are multiple pages with the same route, the first (in the sitemap) will be used
			if (!SiteModel._routes[page.route])
			{
				SiteModel._routes[page.route] = page.getBranch();
			}
		}

		return page;
	}

	private parseAssets(nodes:IAssetNode[], page:IPageAsset):any
	{
		var order:number = 0;
		var assets:any = {};
		// ------- TODO --------
		//var len: number = nodes.length;
		//for (var i: number = 0; i < len; i++) 
		//{
		//	var node: any = nodes[i];
		//	SiteModel.validateNode(node);
		//	assets[node.id] = AssetCreator.create(node, page);
		//	AbstractAsset(assets[node.id]).order = ++order;
		//}
		return assets;
	}

	private getValidRoute(route:string, id:string):string
	{
		// missing > id
		if (typeof route === "undefined")
		{
			route = id;
		}

		if (route.indexOf("&") > -1)
		{
			route = route.split("&").join("and");
		}
		var validRoute:string = "";
		var len:number = route.length;

		for (var i:number = 0; i < len; i++)
		{
			var charCode:number = route.charCodeAt(i);
			if ((charCode < 47) || (charCode > 57 && charCode < 65) || charCode == 95)
			{
				validRoute += "-";
			}
			else if ((charCode > 90 && charCode < 97) || (charCode > 122 && charCode < 128))
			{
				validRoute += "-";
			}
			else if (charCode > 127)
			{
				if ((charCode > 130 && charCode < 135) || charCode == 142 || charCode == 143 || charCode == 145 || charCode == 146 || charCode == 160 || charCode == 193 || charCode == 225)
				{
					validRoute += "a";
				}
				else if (charCode == 128 || charCode == 135)
				{
					validRoute += "c";
				}
				else if (charCode == 130 || (charCode > 135 && charCode < 139) || charCode == 144 || charCode == 201 || charCode == 233)
				{
					validRoute += "e";
				}
				else if ((charCode > 138 && charCode < 142) || charCode == 161 || charCode == 205 || charCode == 237)
				{
					validRoute += "i";
				}
				else if (charCode == 164 || charCode == 165)
				{
					validRoute += "n";
				}
				else if ((charCode > 146 && charCode < 150) || charCode == 153 || charCode == 162 || charCode == 211 || charCode == 214 || charCode == 243 || charCode == 246 || charCode == 336 || charCode == 337)
				{
					validRoute += "o";
				}
				else if (charCode == 129 || charCode == 150 || charCode == 151 || charCode == 154 || charCode == 163 || charCode == 218 || charCode == 220 || charCode == 250 || charCode == 252 || charCode == 368 || charCode == 369)
				{
					validRoute += "u";
				}
			}
			else
			{
				validRoute += route.charAt(i);
			}
		}
		validRoute = validRoute.replace(/\-+/g, "-").replace(/\-*$/, "");

		return validRoute.toLowerCase();
	}

	// Site XML Validation
	public static validateNode(node:IPageNode, isPage:boolean = false):void
	{
		var error:string = "*Invalid Site XML* " + (isPage ? "Page " : "Asset ");
		if (node.id == undefined)
		{
			throw new Error(error + "node missing required attribute 'id'");
		}
//		else if (node.controller == undefined)
//		{
//			throw new Error(error + "node missing required attribute 'controller'");
//		}
		else if (isPage)
		{
			var message:string = SiteModel.validatePage(node);
			if (message != null)
			{
				throw new Error(error + message);
			}
		}
	}

	private static validatePage(node:IPageNode):string
	{
		var message:string;
		if ((node.landing == true) && (node.title == undefined || node.title.length == 0))
		{
			message = node.id + " missing required attribute 'title'";
		}
		return message;
	}

	private static invalidBinding(value:string):boolean
	{
		return ((value.indexOf("}") > -1 && value.indexOf("{") == -1) || (value.indexOf("{") > -1 && value.indexOf("}") == -1));
	}
}

export = SiteModel;