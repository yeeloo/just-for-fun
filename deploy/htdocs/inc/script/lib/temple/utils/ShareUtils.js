/**
 * @overview Utility class for sharing popup
 * @author Arthur Dam <arthur@mediamonks.com>
 * @version 0.1
 * @copyright MediaMonks B.V. 2014
 */
define(["require", "exports", "lib/temple/utils/types/StringUtils", "lib/temple/locale/LocaleManager"], function (require, exports, StringUtils, LocaleManager) {
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
    var ShareUtils = (function () {
        function ShareUtils() {
        }
        ShareUtils.init = function () {
            $('body').on('click', '[data-share]', function (event) {
                var el = $(event.currentTarget);
                var type = el.attr('data-share-type');
                if (type === ShareType[0 /* facebook */]) {
                    ShareUtils.shareFacebook(el.attr('data-share-url') || window.location.href);
                }
                else if (type === ShareType[1 /* twitter */]) {
                    ShareUtils.shareTwitter(el.attr('data-share-url') || window.location.href, el.attr('data-share-text'));
                }
                else if (type === ShareType[2 /* plus */]) {
                    ShareUtils.shareGooglePlus(el.attr('data-share-url') || window.location.href);
                }
                else if (type === ShareType[3 /* linkedin */]) {
                    ShareUtils.shareLinkedIn(el.attr('data-share-url') || window.location.href, el.attr('data-share-title'), el.attr('data-share-text'));
                }
            });
        };
        ShareUtils.shareFacebook = function (url) {
            if (typeof url == 'undefined')
                return;
            window.open(StringUtils.replaceVars(ShareUtils.facebookShareUrl, { url: url }), 'sharer', 'toolbar=0,status=0,width=626,height=436');
        };
        ShareUtils.shareTwitter = function (url, text) {
            if (typeof text == 'undefined' || typeof url == 'undefined')
                return;
            window.open(StringUtils.replaceVars(ShareUtils.twitterShareUrl, { tweet: encodeURIComponent(text), url: url }), 'sharer', 'toolbar=0,status=0,width=575,height=370');
        };
        ShareUtils.shareGooglePlus = function (url) {
            if (typeof url == 'undefined')
                return;
            window.open(StringUtils.replaceVars(ShareUtils.plusShareUrl, { url: url, language: LocaleManager.getInstance().getLocale() || 'en' }), 'sharer', 'toolbar=0,status=0,width=550,height=350');
        };
        ShareUtils.shareLinkedIn = function (url, title, text) {
            if (typeof url == 'undefined')
                return;
            if (typeof title == 'undefined')
                title = '';
            if (typeof text == 'undefined')
                text = '';
            window.open(StringUtils.replaceVars(ShareUtils.linkedinShareUrl, { url: encodeURIComponent(url), title: encodeURIComponent(title), text: encodeURIComponent(text) }), 'sharer', 'toolbar=0,status=0,width=520,height=570');
        };
        ShareUtils.facebookShareUrl = "https://www.facebook.com/sharer/sharer.php?p[url]={url}";
        ShareUtils.twitterShareUrl = "https://twitter.com/intent/tweet?url={url}&text={tweet}";
        ShareUtils.plusShareUrl = "https://plusone.google.com/_/+1/confirm?hl={language}&url={url}";
        ShareUtils.linkedinShareUrl = "http://www.linkedin.com/shareArticle?mini=true&url={url}&title={title}&summary={text}";
        return ShareUtils;
    })();
    var ShareType;
    (function (ShareType) {
        ShareType[ShareType["facebook"] = 0] = "facebook";
        ShareType[ShareType["twitter"] = 1] = "twitter";
        ShareType[ShareType["plus"] = 2] = "plus";
        ShareType[ShareType["linkedin"] = 3] = "linkedin";
    })(ShareType || (ShareType = {}));
    return ShareUtils;
});
