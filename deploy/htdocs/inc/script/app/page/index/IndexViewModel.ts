import DefaultViewModel = require('app/page/DefaultViewModel')
import Gaia = require('lib/gaia/api/Gaia');
import ko = require('knockout');

/**
 * IndexViewModel
 *
 * @namespace app.page
 * @class IndexViewModel
 * @extend app.page.DefaultViewModel
 */
class IndexViewModel extends DefaultViewModel
{
	public active:KnockoutObservable<string>;
	public items:KnockoutObservableArray<any>;
	public popups:KnockoutObservableArray<any>;

	constructor()
	{
		super();

		this.active = ko.observable('');
		this.items = ko.observableArray([]);
		this.popups = ko.observableArray([]);
	}

	public destruct()
	{
		this.active = null;
		this.items = null;
		this.popups = null;

		super.destruct();
	}
}

export = IndexViewModel;