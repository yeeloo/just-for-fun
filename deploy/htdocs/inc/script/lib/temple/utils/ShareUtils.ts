/**
 * @overview Utility class for sharing popup
 * @author Arthur Dam <arthur@mediamonks.com>
 * @version 0.1
 * @copyright MediaMonks B.V. 2014
 */

import StringUtils = require("lib/temple/utils/types/StringUtils");
import LocaleManager = require("lib/temple/locale/LocaleManager");

/*
* usage:
*
 <a data-share
 data-share-type="facebook"
 data-share-url="http://www.google.com/">share on facebook</a>

 <a data-share
 data-share-type="twitter"
 data-share-text="share onto your #twitter feed">share on twitter</a>

 <a data-share
 data-share-type="plus"
 data-share-url="http://www.google.com/">share on plus</a>

 <a data-share
 data-share-type="linkedin"
 data-share-url="http://www.google.com/">share on linkedin</a>

* or just bind the static share functions via some other way
 */

class ShareUtils
{
	private static facebookShareUrl:string = "https://www.facebook.com/sharer/sharer.php?p[url]={url}";
	private static twitterShareUrl:string = "https://twitter.com/intent/tweet?url={url}&text={tweet}";
	private static plusShareUrl:string = "https://plusone.google.com/_/+1/confirm?hl={language}&url={url}";
	private static linkedinShareUrl:string = "http://www.linkedin.com/shareArticle?mini=true&url={url}&title={title}&summary={text}";

	public static init():void
	{
		$('body').on('click', '[data-share]', (event:JQueryEventObject) => {
			var el = $(event.currentTarget);
			var type = el.attr('data-share-type');
			if(type === ShareType[ShareType.facebook])
			{
				ShareUtils.shareFacebook(el.attr('data-share-url') || window.location.href);
			} else if(type === ShareType[ShareType.twitter])
			{
				ShareUtils.shareTwitter(el.attr('data-share-url') || window.location.href, el.attr('data-share-text'));
			} else if(type === ShareType[ShareType.plus])
			{
				ShareUtils.shareGooglePlus(el.attr('data-share-url') || window.location.href)
			} else if(type === ShareType[ShareType.linkedin])
			{
				ShareUtils.shareLinkedIn(el.attr('data-share-url') || window.location.href, el.attr('data-share-title'), el.attr('data-share-text'))
			}
		});
	}
	
	public static shareFacebook(url:string):void
	{
		if(typeof url == 'undefined') return;
		window.open(StringUtils.replaceVars(ShareUtils.facebookShareUrl, {url: url}), 'sharer','toolbar=0,status=0,width=626,height=436');
	}

	public static shareTwitter(url:string, text:string):void
	{
		if(typeof text == 'undefined' || typeof url == 'undefined') return;

		window.open(StringUtils.replaceVars(ShareUtils.twitterShareUrl, {tweet: encodeURIComponent(text), url: url}), 'sharer','toolbar=0,status=0,width=575,height=370');
	}

	public static shareGooglePlus(url:string):void
	{
		if(typeof url == 'undefined') return;
		window.open(StringUtils.replaceVars(ShareUtils.plusShareUrl, {url: url, language: LocaleManager.getInstance().getLocale() || 'en'}), 'sharer','toolbar=0,status=0,width=550,height=350');
	}

	public static shareLinkedIn(url:string, title:string, text:string):void
	{
		if(typeof url == 'undefined') return;
		if(typeof title == 'undefined') title = '';
		if(typeof text == 'undefined') text = '';
		window.open(StringUtils.replaceVars(ShareUtils.linkedinShareUrl, {url: encodeURIComponent(url), title: encodeURIComponent(title), text: encodeURIComponent(text)}), 'sharer','toolbar=0,status=0,width=520,height=570');
	}
}

enum ShareType {
	facebook, twitter, plus, linkedin
}

export = ShareUtils;
