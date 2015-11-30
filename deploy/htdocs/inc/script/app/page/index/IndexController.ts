import CustomAbstractController = require("app/page/CustomAbstractController");
import IndexViewModel = require("app/page/index/IndexViewModel");
import gEvents = require('lib/gaia/events/GaiaEvents');
import Gaia = require('lib/gaia/api/Gaia');
import SiteModel = require('lib/gaia/core/SiteModel');

/**
 * IndexController
 *
 * @namespace app.page
 * @class IndexController
 * @extend app.page.CustomAbstractController
 */
class IndexController extends CustomAbstractController
{
	public viewModel:IndexViewModel;

	constructor()
	{
		super();
	}

	public init()
	{
		super.init();

		var routes = SiteModel.getRoutes();

		var popups = SiteModel.getXml().popups
		for (var i = 0; i < popups.length; i++)
		{
			this.viewModel.popups.push(popups[i]);
		}

		for (var route in routes)
		{
			var page = Gaia.api.getPage(routes[route]);

			if (page.type != "popup")
			{
				this.viewModel.items.push({
					page: page,
					route: route,
					branch: routes[route],
					active: page.getData('nav-highlight') || route
				});
			}
		}

		this.updateNavigation(Gaia.api.getCurrentBranch());
	}

	public onDeeplink(event:gEvents.GaiaHistoryEvent):void
	{
		this.updateNavigation(event.routeResult[0].branch);
	}

	private updateNavigation(branch:string):void
	{
		this.viewModel.active(Gaia.api.getPage(branch).getData('nav-highlight') || Gaia.api.getPage(branch).route);
	}

	public destruct()
	{
		super.destruct();
	}
}

export = IndexController;