var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'lib/gaia/assets/PageAsset', 'lib/temple/events/EventDispatcher'], function (require, exports, PageAsset, EventDispatcher) {
    var SiteModel = (function (_super) {
        __extends(SiteModel, _super);
        function SiteModel() {
            _super.call(this);
        }
        SiteModel.prototype.load = function (siteConfig) {
            SiteModel._xml = siteConfig;
            if (SiteModel._xml.config) {
                if (SiteModel._xml.config.controllerPath) {
                    PageAsset.controllerPath = SiteModel._xml.config.controllerPath;
                }
                if (SiteModel._xml.config.viewModelPath) {
                    PageAsset.viewModelPath = SiteModel._xml.config.viewModelPath;
                }
                if (SiteModel._xml.config.templatePath) {
                    PageAsset.templatePath = SiteModel._xml.config.templatePath;
                }
            }
            // Thijs hack: dispatch init event so you can do something with the xml before it is parsed
            //dispatchEvent(new Event(Event.INIT));
            this.parseSite();
            this.parseTree();
            //dispatchEvent(new Event(Event.COMPLETE));
        };
        SiteModel.getXml = function () {
            return SiteModel._xml;
        };
        SiteModel.getTree = function () {
            return SiteModel._tree;
        };
        SiteModel.getTitle = function () {
            return SiteModel._title;
        };
        SiteModel.getRouting = function () {
            return SiteModel._routing;
        };
        SiteModel.getRoutes = function () {
            return SiteModel._routes;
        };
        SiteModel.getIndexFirst = function () {
            return SiteModel._indexFirst;
        };
        SiteModel.getIndexID = function () {
            return SiteModel._indexID;
        };
        SiteModel.getVersion = function () {
            return SiteModel._version.toString();
        };
        SiteModel.prototype.parseSite = function () {
            SiteModel._title = SiteModel._xml.title || "";
            SiteModel._routing = !(SiteModel._xml.routing == false);
            SiteModel._history = !(SiteModel._xml.history == false);
            SiteModel._indexFirst = (SiteModel._xml.indexFirst == true);
            //SiteModel._assetPath = SiteModel._xml.assetPath || "";
            SiteModel._version = SiteModel._xml.version; // || FlashVars.getValue("version");
            if (SiteModel._routing) {
                SiteModel._routes = {};
            }
        };
        SiteModel.prototype.parsePopupPage = function (page, node) {
            page.route = this.getValidRoute(node.route || node.title, node.id) + "/" + this.getValidRoute(page.route || page.title, page.id);
            if (page.pages) {
                for (var j = 0; j < page.pages.length; ++j) {
                    this.parsePopupPage(page.pages[j], node);
                }
            }
        };
        SiteModel.prototype.getPages = function (page) {
            var pages = [];
            if (page.pages) {
                for (var i = 0; i < page.pages.length; ++i) {
                    pages.push(page.pages[i]);
                    pages = pages.concat(this.getPages(page.pages[i]));
                }
            }
            return pages;
        };
        SiteModel.prototype.parseTree = function () {
            var node = SiteModel._xml.pages[0];
            if (node.id != undefined) {
                SiteModel._indexID = node.id;
            }
            var popupString = '[]';
            if (typeof SiteModel._xml.popups !== 'undefined') {
                for (var i = 0; i < SiteModel._xml.popups.length; i++) {
                    var popup = SiteModel._xml.popups[i];
                    popup.type = "popup";
                }
                popupString = JSON.stringify(SiteModel._xml.popups);
            }
            SiteModel._tree = this.parsePage(node, null, popupString);
        };
        SiteModel.prototype.parseChildren = function (parent, childNodes, popupString) {
            if (popupString === void 0) { popupString = null; }
            var children = {};
            var len = childNodes.length;
            for (var i = 0; i < len; i++) {
                var node = childNodes[i];
                var page = this.parsePage(node, parent, popupString);
                children[page.id] = page;
            }
            return children;
        };
        SiteModel.prototype.parsePage = function (node, parent, popupString) {
            if (parent === void 0) { parent = null; }
            if (popupString === void 0) { popupString = null; }
            SiteModel.validateNode(node, true);
            var isIndex = (node.id == SiteModel._indexID);
            // merge popups from this page
            if (node.popups) {
                for (var i = 0; i < node.popups.length; i++) {
                    var popup = node.popups[i];
                    popup.type = "popup";
                }
                popupString = JSON.stringify(JSON.parse(popupString).concat(node.popups));
            }
            if (!isIndex) {
                if (node.type == 'popup' || parent.type == 'popup') {
                    node.type = 'popup';
                }
            }
            // add popup pages to node
            if (node.type != "popup" && (node.landing || !node.pages || node.pages.length == 0)) {
                if (!node.pages) {
                    node.pages = [];
                }
                var copy = JSON.parse(popupString);
                for (var j = 0; j < copy.length; ++j) {
                    this.parsePopupPage(copy[j], node);
                }
                node.pages = node.pages.concat(copy);
                node.landing = true;
            }
            var page = new PageAsset(node);
            if (!isIndex) {
                page.setParent(parent);
            }
            page.data = node.data;
            page.type = node.type;
            if (node.type == 'popup') {
                page.type = 'popup';
            }
            // assets
            //		if (node.assets && node.assets.length > 0){
            //			page.assets = this.parseAssets(node.assets, page);
            //		}
            // child pages
            if (node.pages && node.pages.length > 0) {
                page.defaultChild = node.defaultChild;
                page.pages = this.parseChildren(page, node.pages, popupString);
                if (!page.pages[page.defaultChild]) {
                    page.defaultChild = node.pages[0].id;
                }
            }
            else {
                page.landing = true;
            }
            // only add terminal and landing pages to routes
            if (SiteModel._routing && page.landing) {
                page.route = this.getValidRoute(node.route || page.title, page.id);
                // only add route if it wasn't there already.
                // So if there are multiple pages with the same route, the first (in the sitemap) will be used
                if (!SiteModel._routes[page.route]) {
                    SiteModel._routes[page.route] = page.getBranch();
                }
            }
            return page;
        };
        SiteModel.prototype.parseAssets = function (nodes, page) {
            var order = 0;
            var assets = {};
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
        };
        SiteModel.prototype.getValidRoute = function (route, id) {
            // missing > id
            if (typeof route === "undefined") {
                route = id;
            }
            if (route.indexOf("&") > -1) {
                route = route.split("&").join("and");
            }
            var validRoute = "";
            var len = route.length;
            for (var i = 0; i < len; i++) {
                var charCode = route.charCodeAt(i);
                if ((charCode < 47) || (charCode > 57 && charCode < 65) || charCode == 95) {
                    validRoute += "-";
                }
                else if ((charCode > 90 && charCode < 97) || (charCode > 122 && charCode < 128)) {
                    validRoute += "-";
                }
                else if (charCode > 127) {
                    if ((charCode > 130 && charCode < 135) || charCode == 142 || charCode == 143 || charCode == 145 || charCode == 146 || charCode == 160 || charCode == 193 || charCode == 225) {
                        validRoute += "a";
                    }
                    else if (charCode == 128 || charCode == 135) {
                        validRoute += "c";
                    }
                    else if (charCode == 130 || (charCode > 135 && charCode < 139) || charCode == 144 || charCode == 201 || charCode == 233) {
                        validRoute += "e";
                    }
                    else if ((charCode > 138 && charCode < 142) || charCode == 161 || charCode == 205 || charCode == 237) {
                        validRoute += "i";
                    }
                    else if (charCode == 164 || charCode == 165) {
                        validRoute += "n";
                    }
                    else if ((charCode > 146 && charCode < 150) || charCode == 153 || charCode == 162 || charCode == 211 || charCode == 214 || charCode == 243 || charCode == 246 || charCode == 336 || charCode == 337) {
                        validRoute += "o";
                    }
                    else if (charCode == 129 || charCode == 150 || charCode == 151 || charCode == 154 || charCode == 163 || charCode == 218 || charCode == 220 || charCode == 250 || charCode == 252 || charCode == 368 || charCode == 369) {
                        validRoute += "u";
                    }
                }
                else {
                    validRoute += route.charAt(i);
                }
            }
            validRoute = validRoute.replace(/\-+/g, "-").replace(/\-*$/, "");
            return validRoute.toLowerCase();
        };
        // Site XML Validation
        SiteModel.validateNode = function (node, isPage) {
            if (isPage === void 0) { isPage = false; }
            var error = "*Invalid Site XML* " + (isPage ? "Page " : "Asset ");
            if (node.id == undefined) {
                throw new Error(error + "node missing required attribute 'id'");
            }
            else if (isPage) {
                var message = SiteModel.validatePage(node);
                if (message != null) {
                    throw new Error(error + message);
                }
            }
        };
        SiteModel.validatePage = function (node) {
            var message;
            if ((node.landing == true) && (node.title == undefined || node.title.length == 0)) {
                message = node.id + " missing required attribute 'title'";
            }
            return message;
        };
        SiteModel.invalidBinding = function (value) {
            return ((value.indexOf("}") > -1 && value.indexOf("{") == -1) || (value.indexOf("{") > -1 && value.indexOf("}") == -1));
        };
        return SiteModel;
    })(EventDispatcher);
    return SiteModel;
});
