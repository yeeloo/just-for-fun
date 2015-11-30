import AbstractElementManager = require('./AbstractElementManager');
import ImageElementData = require('./data/ImageElementData');

/**
 * @module Temple
 * @namespace temple.locale.element
 * @extend temple.locale.element.AbstractElementManager
 * @class BackgroundImageElementManager
 */
class BackgroundImageElementManager extends AbstractElementManager
{
	static _instance:BackgroundImageElementManager;

	static getInstance():BackgroundImageElementManager
	{
		if (typeof BackgroundImageElementManager._instance === 'undefined')
		{
			BackgroundImageElementManager._instance = new BackgroundImageElementManager();
		}
		return BackgroundImageElementManager._instance;
	}

	constructor()
	{
		super();
	}

	/**
	 * @public
	 * @method add
	 * @param {HTMLElement} element
	 * @param {string} url
	 */
	public add(element:HTMLElement, url:string = null)
	{
		if (!element || typeof element === 'undefined')
		{
			console.error('no element ', element);
			return;
		}

		if (!url)
		{
			var bgImage = ((typeof window.getComputedStyle !== 'undefined' && window.getComputedStyle(element, null)) || element.currentStyle).backgroundImage;

			if (bgImage)
			{
				url = bgImage.replace(/\/([a-z]{2}_[A-Z]{2})\//gi, '/{locale}/');
			}

			if (url.substr(0, 4) == 'url(')
			{
				url = url.substring(4, url.length - 1);
			}
		}

		if (!element || typeof element === 'undefined')
		{
			console.error('missing url', element);
			return;
		}

//		console.log('>>> URL: ', url);

		super.addElement(new ImageElementData(element, url));
	}

	/**
	 * @public
	 * @method updateElement
	 * @param {ImageElementData} data
	 */
	public updateElement(data:ImageElementData):void
	{
		console.log('UPDATE BG IMAGE: ', data.url);
		$(data.element).css('backgroundImage', 'url(' + data.url.replace('{locale}', this._localeManager.getLocale()) + ')');
	}
}

export = BackgroundImageElementManager;