define(["require", "exports", "lib/gaia/core/SiteModel"], function (require, exports, SiteModel) {
    var BranchIterator = (function () {
        function BranchIterator() {
        }
        BranchIterator.init = function (branch) {
            var branchArray = branch.split("/");
            var page = SiteModel.getTree();
            BranchIterator.items.length = 0;
            BranchIterator.index = -1;
            BranchIterator.addPage(page);
            for (var i = 1; i < branchArray.length; i++) {
                BranchIterator.addPage(page = page.pages[branchArray[i]]);
            }
            return BranchIterator.items.length;
        };
        BranchIterator.next = function () {
            if (++BranchIterator.index < BranchIterator.items.length) {
                return BranchIterator.items[BranchIterator.index];
            }
            return null;
        };
        BranchIterator.addPage = function (page) {
            if (page.assets != null) {
            }
            BranchIterator.items.push(page);
        };
        BranchIterator.items = [];
        BranchIterator.index = -1;
        return BranchIterator;
    })();
    return BranchIterator;
});
