define(["require", "exports"], function (require, exports) {
    /**
     * @namespace app.data.enum
     * @class Page
     */
    var Page = (function () {
        function Page() {
        }
        Page.INDEX = 'index';
        Page.HOME = 'index/home';
        Page.KNOCKOUT = 'index/knockout';
        Page.SUBMIT = 'index/submit';
        Page.CANVAS = 'index/canvas';
        Page.DETAIL = 'index/detail';
        Page.VIDEO = 'index/video';
        Page.INFO = 'index/info';
        Page.POPUP_POPUP1 = 'popup1';
        Page.POPUP_POPUP2 = 'popup2';
        Page.POPUP_TAKEOVER = 'takeover';
        Page.POPUP_ABOUT = 'takeover/about';
        Page.POPUP_PRIVACY = 'takeover/privacy';
        return Page;
    })();
    // use in templates
    window['Page'] = Page;
    return Page;
});
