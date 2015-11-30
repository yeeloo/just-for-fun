define(["require", "exports", 'lib/gaia/core/BranchTools', 'lib/gaia/core/SiteModel', 'lib/gaia/assets/PageAsset'], function (require, exports, BranchTools, SiteModel, PageAsset) {
    var m = {
        "title": "Skeleton - Gaia - {page}",
        "routes": [
        ],
        "config": {},
        "pages": [
            {
                "id": "index",
                "title": "index",
                "landing": false,
                "pages": [
                    {
                        "id": "home",
                        "title": "home",
                        "controller": "default",
                        "viewModel": "default",
                        "template": "default"
                    },
                    {
                        "id": "contact",
                        "title": "contact",
                        "controller": "default",
                        "viewModel": "default",
                        "template": "default"
                    },
                    {
                        "id": "detail",
                        "title": "detail",
                        "controller": "default",
                        "viewModel": "default",
                        "template": "default"
                    },
                    {
                        "id": "video",
                        "title": "video",
                        "controller": "default",
                        "viewModel": "default",
                        "template": "default"
                    }
                ]
            }
        ],
        "popups": [
            {
                "id": "popup1",
                "title": "popup1",
                "controller": "default",
                "viewModel": "default",
                "template": "default",
                "container": "index"
            },
            {
                "id": "popup2",
                "title": "popup2",
                "controller": "default",
                "viewModel": "default",
                "template": "default",
                "container": "main"
            },
            {
                "id": "takeover",
                "title": "takeover",
                "controller": "default",
                "viewModel": "default",
                "template": "default",
                "landing": false,
                "pages": [
                    {
                        "id": "about",
                        "title": "about",
                        "controller": "default",
                        "viewModel": "default",
                        "template": "default",
                        "type": "popup"
                    },
                    {
                        "id": "terms",
                        "title": "terms",
                        "controller": "default",
                        "viewModel": "default",
                        "template": "default",
                        "type": "popup"
                    }
                ]
            }
        ]
    };
    function setupModel() {
        var model = new SiteModel();
        model.load(m);
        return model;
    }
    describe('Gaia SiteModel', function () {
        var model = setupModel();
        it('should return the sitemodel', function () {
            expect(SiteModel.getXml()).toEqual(m);
        });
        it('should return the correct title', function () {
            expect(SiteModel.getTitle()).toBe("Skeleton - Gaia - {page}");
        });
        it('should return the base tree', function () {
            expect(SiteModel.getTree()).toEqual(jasmine.any(PageAsset));
        });
    });
    describe('BranchTools', function () {
        it('should return the correct page', function () {
            expect(BranchTools.getPage('').getBranch()).toEqual('index');
            expect(BranchTools.getPage('index').getBranch()).toEqual('index');
            expect(BranchTools.getPage('index/home').getBranch()).toEqual('index/home');
            expect(BranchTools.getPage('home').getBranch()).toEqual('index/home');
            expect(BranchTools.getPage('detail').getBranch()).toEqual('index/detail');
        });
        it('should return the correct validBranch', function () {
            expect(BranchTools.getValidBranch('random-value')).toEqual('index/home');
            expect(BranchTools.getValidBranch('index')).toEqual('index/home');
            expect(BranchTools.getValidBranch('home')).toEqual('index/home');
            expect(BranchTools.getValidBranch('detail/deeplink/that/shoud/be/stripped')).toEqual('index/detail');
            expect(BranchTools.getValidBranch('random-value', false)).toEqual('index');
            expect(BranchTools.getValidBranch('index', false)).toEqual('index');
        });
        it('should return the correct fullBranch', function () {
            expect(BranchTools.getFullBranch('')).toEqual('index/home');
            expect(BranchTools.getFullBranch('home')).toEqual('index/home');
            expect(BranchTools.getFullBranch('detail')).toEqual('index/detail');
        });
        it('should return a list of pages', function () {
            var pagesIndex = BranchTools.getPagesOfBranch('');
            expect(pagesIndex.length).toEqual(2);
            expect(pagesIndex).toContain(BranchTools.getPage('index'));
            expect(pagesIndex).toContain(BranchTools.getPage('home'));
            var pagesHome = BranchTools.getPagesOfBranch('home');
            expect(pagesHome.length).toEqual(2);
            expect(pagesHome).toContain(BranchTools.getPage('index'));
            expect(pagesHome).toContain(BranchTools.getPage('home'));
            var pagesDetail = BranchTools.getPagesOfBranch('index/detail');
            expect(pagesDetail.length).toEqual(2);
            expect(pagesDetail).toContain(BranchTools.getPage('index'));
            expect(pagesDetail).toContain(BranchTools.getPage('detail'));
        });
        it('should return a valid route', function () {
            // valid lookup
            expect(BranchTools.getValidRoute('home')).toEqual('home');
            expect(BranchTools.getValidRoute('home/deeplink')).toEqual('home');
            // invalid lookup
            expect(BranchTools.getValidRoute('')).toEqual('');
            expect(BranchTools.getValidRoute('/home')).toEqual('');
            expect(BranchTools.getValidRoute('/home/deeplink')).toEqual('');
        });
        it('should return the default child branch', function () {
            expect(BranchTools.getDefaultChildBranch('index')).toEqual('index/home');
            expect(BranchTools.getDefaultChildBranch('index/home')).toEqual('index/home');
            expect(BranchTools.getDefaultChildBranch('index/detail')).toEqual('index/detail');
        });
        it('should return the correct popup branch', function () {
            expect(BranchTools.getPopupBranch('popup1', 'index')).toEqual('index/popup1');
            expect(BranchTools.getPopupBranch('popup1', 'index/home')).toEqual('index/home/popup1');
            expect(BranchTools.getPopupBranch('popup1', 'index/home/popup1')).toEqual('index/home/popup1');
            expect(BranchTools.getPopupBranch('popup1', 'index/home/popup2')).toEqual('index/home/popup1');
            expect(BranchTools.getPopupBranch('popup1', 'index/home/takeover')).toEqual('index/home/popup1');
            expect(BranchTools.getPopupBranch('popup1', 'index/home/takeover/about')).toEqual('index/home/popup1');
            expect(BranchTools.getPopupBranch('takeover/about', 'index/home')).toEqual('index/home/takeover/about');
            expect(BranchTools.getPopupBranch('takeover/about', 'index/home/popup1')).toEqual('index/home/takeover/about');
            expect(BranchTools.getPopupBranch('takeover/about', 'index/home/takeover')).toEqual('index/home/takeover/about');
            expect(BranchTools.getPopupBranch('takeover/about', 'index/home/takeover/about')).toEqual('index/home/takeover/about');
            expect(BranchTools.getPopupBranch('takeover', 'index/home/popup1')).toEqual('index/home/takeover');
            expect(BranchTools.getPopupBranch('takeover', 'index/home/takeover')).toEqual('index/home/takeover');
            expect(BranchTools.getPopupBranch('takeover', 'index/home/takeover/about')).toEqual('index/home/takeover');
            expect(BranchTools.getPopupBranch('takeover', 'index/home/deeplink')).toEqual('index/home/takeover');
            expect(BranchTools.getPopupBranch('takeover', 'index/home/takeover/deeplink')).toEqual('index/home/takeover');
            expect(BranchTools.getPopupBranch('takeover', 'index/home/takeover/about/deeplink')).toEqual('index/home/takeover');
        });
    });
});
