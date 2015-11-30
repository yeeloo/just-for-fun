var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "lib/temple/utils/Browser", "lib/createjs/easeljs/component/Container"], function (require, exports, Browser, Container) {
    /**
     * @author Mient-jan Stelling
     */
    var Stage = (function (_super) {
        __extends(Stage, _super);
        function Stage(element, width, height, x, y, regX, regY) {
            var _this = this;
            if (width === void 0) { width = '100%'; }
            if (height === void 0) { height = '100%'; }
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (regX === void 0) { regX = 0; }
            if (regY === void 0) { regY = 0; }
            _super.call(this, width, height, x, y, regX, regY);
            this._fps = 120;
            this._isRunning = false;
            /**
             * used as reusable object when triggering resize.
             * @protected
             */
            this._globalSize = {
                width: 0,
                height: 0
            };
            this.stage = null;
            this.ctx = null;
            this.onUpdate = function () {
                _this.stage.update();
            };
            /**
             * shows mouseover.
             */
            this.setMouseOver = function () {
                _this.setCursor('pointer');
            };
            /**
             * hides mouseover.
             */
            this.setMouseOut = function () {
                _this.setCursor('');
            };
            switch (element.tagName) {
                case 'CANVAS':
                    {
                        this.canvas = element;
                        this.holder = $(element).parent().get(0);
                        this._globalSize.width = $(this.canvas).width();
                        this._globalSize.height = $(this.canvas).height();
                        this.onResize(this._globalSize);
                        break;
                    }
                case 'DIV':
                    {
                        var canvas = document.createElement('canvas');
                        element.appendChild(canvas);
                        this.canvas = canvas;
                        this.holder = element;
                        window.addEventListener('resize', function () {
                            _this._globalSize.width = _this.holder.offsetWidth;
                            _this._globalSize.height = _this.holder.offsetHeight;
                            _this.onResize(_this._globalSize);
                        });
                        setTimeout(function () {
                            _this._globalSize.width = _this.holder.offsetWidth;
                            _this._globalSize.height = _this.holder.offsetHeight;
                            _this.onResize(_this._globalSize);
                        }, 200);
                        break;
                    }
                default:
                    {
                        throw new Error('unsupported element used "' + element.tagName + '"');
                        break;
                    }
            }
            this.setStage(this);
            this.stage = new createjs.Stage(this.canvas);
            this.ctx = this.canvas.getContext("2d");
            this.setFps(this._fps);
            createjs.Ticker.timingMode = createjs.Ticker.RAF;
            createjs.Ticker.addEventListener('tick', this.onUpdate);
            if (Browser.Platform.name == 'android' || Browser.Platform.name == 'ios') {
                createjs.Touch.enable(this.stage);
            }
            this.stage.addChild(this.view);
        }
        /**
         * Start the update loop.
         *
         * @returns {boolean}
         */
        Stage.prototype.start = function () {
            if (!this._isRunning) {
                this.stage.update();
                createjs.Ticker.addEventListener('tick', this.onUpdate);
                this._isRunning = true;
                return true;
            }
            return false;
        };
        /**
         * Will stop all animation and updates to the stage.
         *
         * @returns {boolean}
         */
        Stage.prototype.stop = function () {
            if (this._isRunning) {
                createjs.Ticker.removeEventListener('tick', this.onUpdate);
                // update stage for a last tick, solves rendering
                // issues when having slowdown. Last frame is sometimes not rendered. When using createjsAnimations
                setTimeout(this.onUpdate, 1000 / this._fps);
                this._isRunning = false;
                return true;
            }
            return false;
        };
        /**
         * Check if stage is running
         *
         * @returns {boolean}
         */
        Stage.prototype.isRunning = function () {
            return this._isRunning;
        };
        /**
         * So you can specify the fps of the animation. This operation sets
         * the fps for all createjs operations and tweenlite.
         * @param value
         */
        Stage.prototype.setFps = function (value) {
            this._fps = value;
            createjs.Ticker.setFPS(value);
            TweenLite.ticker.fps(value);
        };
        /**
         * Return the current fps of this stage.
         *
         * @returns {number}
         */
        Stage.prototype.getFps = function () {
            return this._fps;
        };
        /**
         * Sets the timing mode of the ticker
         * @param value The timing mode. Valid values are createjs.Ticker.RAF, createjs.Ticker.RAF_SYNCHED and createjs.Ticker.TIMEOUT.
         */
        Stage.prototype.setTimingMode = function (value) {
            if (value != createjs.Ticker.RAF && value != createjs.Ticker.RAF_SYNCHED && value != createjs.Ticker.TIMEOUT) {
                throw new Error("timingMode is invalid. Valid values are createjs.Ticker.RAF, createjs.Ticker.RAF_SYNCHED and createjs.Ticker.TIMEOUT.");
            }
            createjs.Ticker.timingMode = value;
        };
        /**
         * Get the current timing mode of the ticker
         * @returns {string}
         */
        Stage.prototype.getTimingMode = function () {
            return createjs.Ticker.timingMode;
        };
        /**
         * Is triggerd when the stage (canvas) is resized.
         * Will give this new information to all children.
         *
         * @param e IResize
         */
        Stage.prototype.onResize = function (e) {
            // anti-half pixel
            e.width = Math.floor(e.width / 2) * 2;
            e.height = Math.floor(e.height / 2) * 2;
            if (this._globalSize.width != e.width || this._globalSize.height != e.height) {
                this._globalSize.width = e.width;
                this._globalSize.height = e.height;
                this.canvas.width = e.width;
                this.canvas.height = e.height;
                _super.prototype.onResize.call(this, e);
                if (!this.isRunning) {
                    this.stage.update();
                }
            }
        };
        /**
         * Enable mouse over, be carefull these type's of operations are considered heavy.
         *
         * @param frequency
         */
        Stage.prototype.enableMouseOver = function (frequency) {
            if (frequency === void 0) { frequency = 20; }
            this.stage.enableMouseOver(frequency);
        };
        Stage.prototype.disableMouseOver = function () {
            clearInterval(this.stage['_mouseOverIntervalID']);
            this.stage['_mouseOverIntervalID'] = null;
        };
        /**
         * Sets cursor on parent element so a cursor is shown scross-platform.
         *
         * @param value
         */
        Stage.prototype.setCursor = function (value) {
            $(this.canvas).parent().get(0).style.cursor = value;
        };
        /**
         * hide stage
         */
        Stage.prototype.hide = function () {
            $(this.canvas).css('display', 'none');
            this.stop();
        };
        /**
         * show stage
         */
        Stage.prototype.show = function () {
            $(this.canvas).css('display', 'block');
        };
        return Stage;
    })(Container);
    return Stage;
});
