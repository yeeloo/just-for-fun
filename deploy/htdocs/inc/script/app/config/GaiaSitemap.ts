/**
 * @module Gaia
 */

/**
 * Gaia uses a JSON file structure to define the site. A general GaiaSitemap.ts could look like this:
 *
 * 	define({
 * 	    "title": "Gaia - {page}",
 * 	    "config": {
 * 	        "controllerPath": "app/page/",
 * 	        "viewModelPath": "app/page/",
 * 	        "templatePath": "../../../../template/"
 * 	    },
 * 	    "routes": [
 * 	    ],
 * 	    "pages": [
 * 	        {
 * 	            "id": "index",
 * 	            "title": "index",
 * 	            "pages": [
 * 	                {
 * 	                    "id": "home",
 * 	                    "title": "Home"
 * 	                }
 * 	            ]
 * 	        }
 * 	    ],
 * 	    "popups": [
 * 	        {
 * 	            "id": "popup1",
 * 	            "title": "popup1",
 * 	            "controller": "default",
 * 	            "viewModel": "default",
 * 	            "template": "default"
 * 	        }
 * 	    ]
 * 	});
 *
 * ## Popups
 * Popups are special pages that are inserted as sub-pages for every page in the sitemap. This way you can open a popup-page without navigating away from the current page.
 * Like normap pages, you can nest popup-pages. Nested popup-pages need to have a "type" attribute set to "popup"
 * Opening and closing popups can be done by using Gaia.api.gotoPopup("popupId"); and Gaia.api.closePopup(); from code, and the data-gaia-popup="popupId" and data-gaia-popup-close attributes from HTML.
 *
 * ## Scaffolding
 * Running grunt scaffold from within the /tools/build/ folder will create all the files (Controller.ts, ViewModel.ts and page.html) needed to run the site.
 *
 * @namespace app.config
 * @class GaiaSitemap
 */

/**
 * The title attribute is used to set the page's title. The {page} variable is replaced by the "title" attribute from the active page, so when you are
 * on the home-page title will say Gaia - Home.
 * @attribute title
 */

/**
 * The config section is used for setting paths to the files that are loaded by Gaia. You normally won't touch these, but if you are doing some funky stuff you can change them here.
 * @attribute config
 */

/**
 * Here you can insert a list of subpages for the current page. As you can see in the sitemap example this is also done
 * for the index-page. This subpages are not the same as subpages in a conventional sitemap that show a hierarchical view of
 * grouped sections. The structure in this sitemap is for defining which pages should be visible at the same time. So navigating
 * to a sub-page will not close the parent page, but instead let them be visible at the same time.
 *
 * If we take the index-page as an example, we can add the header, navigation, footer and background to the index-page,
 * and the actual page-content to the subpages (home, products, contact). Because the index-page will never be closed (it is
 * the root page of the sitemap), those elements will always remain visible.
 *
 * Now, if we want to have an intro-page that has no navigation, we can do two things. The first option is to hide the
 * navigation when we are on the intro page, and show them on the other pages. The other option is to move the navigation elements
 * to a navigation-page, that is a sibling from the intro-page, and move all the other pages as subpages in the navigation-page.
 * Because the navigation-page is a parent-page from the home-page, but not from the intro-page, it will only be visible on the
 * home-page. The result would look like this:
 *
 *	{
 *		"id": "home",
 *		"title": "Home Page",
 *		"route": "home-page"
 *		"controller": "default" | "mobile" | "path/to/HomeController",
 *		"viewModel": "default" | "mobile" | "path/to/HomeViewModel",
 *		"template": "default" | "mobile" | "path/to/template.html",
 *		"folder": "folder/path/",
 *		"data": {"custom": "data", "in": ["here"]},
 *		"pages": [],
 *		"landing": true
 *	}
 *
 *  - __id__ (required) Used for navigating to the page, used for loading files by convention
 *  - __title__ Used in the browsers title-bar by inserting this value in the site title "title": "Gaia - {page}".
 *  - __route__ Used in the url-bar when navigating to pages and used for deeplinking. If omitted, it will slugify the title
 * value. Routes must be unique and can only be applied to terminal pages (pages that have no subpages). Can be expanded to
 * an object for deeplinking and parameters.
 *
 * When navigationg to pages you should use the path to the page you want to navigate to including all the parent pages, like Gaia.api.goto('/index/navigation/home');.
 * For more information about navigating see the reference for Gaia.api.goto
 *
 * @attribute pages
 *
 */

/**
 * The config section is used for setting paths to the files that are loaded by Gaia. You normally won't touch these,
 * but if you are doing some funky stuff you can change them here.
 *
 * @attribute config
 */

var GaiaSiteMap = <any> {

	"title": "Just.For.Fun",
	"config": {
		"controllerPath": "app/page/",
		"viewModelPath": "app/page/",
		"templatePath": "app/../../template/"
	},

	"pages": [
		{
			"id": "index",
			"title": "index",
			"landing": false,
			"pages": [
				{
					"id": "home",
					"title": "home"
				}
			]
		}
	],

	// popup example
	"popups": [
		{
			"id": "popup1",
			"title": "popup1",
			"controller": "default",
			"viewModel": "default",
			"template": "default",
			"container": "index"
		}
	]
};

export = GaiaSiteMap;