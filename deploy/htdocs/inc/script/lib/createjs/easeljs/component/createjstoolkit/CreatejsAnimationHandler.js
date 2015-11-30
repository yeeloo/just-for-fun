var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'lib/createjs/easeljs/component/DisplayObject', 'lib/createjs/easeljs/component/enum/ComponentType'], function (require, exports, DisplayObject, ComponentType) {
    /**
     * @author Mient-jan Stelling
     * @todo needs a refactoring job.
     */
    var CreatejsAnimationHandler = (function (_super) {
        __extends(CreatejsAnimationHandler, _super);
        function CreatejsAnimationHandler(moduleObject, className, width, height, x, y, regX, regY) {
            if (width === void 0) { width = '100%'; }
            if (height === void 0) { height = '100%'; }
            if (x === void 0) { x = '50%'; }
            if (y === void 0) { y = '50%'; }
            if (regX === void 0) { regX = '50%'; }
            if (regY === void 0) { regY = '50%'; }
            _super.call(this, width, height, x, y, regX, regY);
            this.moduleObject = moduleObject;
            /**
             * @protected
             */
            this._animationList = [];
            this._isRunning = false;
            this._onTickIsRunning = false;
            this._startPosition = -1;
            this._stopPosition = -1;
            this.type = 1 /* CONTAINER */;
            this.view = new moduleObject[className]();
            var instances = this.getInstanceByObject(createjs.MovieClip);
            for (var i = 0; i < instances.length; i++) {
                instances[i].stop();
            }
            this._onTick = this.onTick.bind(this);
            this.view.stop();
            this._labels = this.view.getLabels();
        }
        /**
         *
         * @param lib
         * @param classInstance
         * @param name
         * @returns {*[]}
         */
        CreatejsAnimationHandler.getInstancesByName = function (lib, classInstance, name) {
            if (!lib[name]) {
                throw 'unknown ' + name;
            }
            return this.getInstancesByObject(lib[name], classInstance);
        };
        /**
         *
         * @param lib
         * @param classInstance
         * @param name
         * @returns {*}
         */
        CreatejsAnimationHandler.getInstanceByName = function (lib, classInstance, name) {
            if (!lib[name]) {
                throw 'unknown ' + name;
            }
            return this.getInstancesByObject(lib[name], classInstance)[0];
        };
        /**
         *
         * @param object
         * @param classInstance
         * @returns {Array}
         */
        CreatejsAnimationHandler.getInstancesByObject = function (object, classInstance, foundInstances) {
            if (foundInstances === void 0) { foundInstances = []; }
            for (var obj in classInstance) {
                if (classInstance.hasOwnProperty(obj)) {
                    if (classInstance[obj] instanceof object) {
                        foundInstances.push(classInstance[obj]);
                    }
                    else if (classInstance[obj] instanceof createjs.Container) {
                        this.getInstanceByContainer(classInstance[obj], object, foundInstances);
                    }
                }
            }
            return foundInstances;
        };
        /**
         * Returns all children from a object in a array.
         *
         * @param classInstance
         * @returns {Array}
         */
        CreatejsAnimationHandler.getChildrenFromObject = function (classInstance) {
            var arr = [];
            for (var obj in classInstance) {
                if (classInstance.hasOwnProperty(obj)) {
                    arr.push(classInstance[obj]);
                }
            }
            return arr;
        };
        /**
         * Returns all instances of specific type from the container tree.
         *
         * @param container
         * @param object
         * @param arr
         */
        CreatejsAnimationHandler.getInstanceByContainer = function (container, object, arr) {
            if (container.children) {
                for (var i = 0; i < container.children.length; i++) {
                    if (container.children[i] instanceof object) {
                        arr.push(container.children[i]);
                    }
                    if (container.children[i] instanceof createjs.Container) {
                        this.getInstanceByContainer(container.children[i], object, arr);
                    }
                }
            }
        };
        CreatejsAnimationHandler.prototype.getInstanceByName = function (name) {
            return CreatejsAnimationHandler.getInstancesByName(this.moduleObject, this.view, name);
        };
        CreatejsAnimationHandler.prototype.getInstanceByObject = function (object) {
            return CreatejsAnimationHandler.getInstancesByObject(object, this.view);
        };
        CreatejsAnimationHandler.prototype.getLabels = function () {
            var labels = this.view.getLabels(), arr = [];
            for (var i = 0; i < labels.length; i++) {
                arr.push(labels[i].label);
            }
            return arr;
        };
        CreatejsAnimationHandler.prototype.setStage = function (stage) {
            this._stage = stage;
        };
        CreatejsAnimationHandler.prototype.getPositionByLabel = function (label) {
            var ret = [];
            for (var i = 0; i < this._labels.length; i++) {
                if (this._labels[i].label == label) {
                    // start position
                    ret.push(this._labels[i].position);
                    if (typeof this._labels[i + 1] != 'undefined') {
                        // end position
                        ret.push(this._labels[i + 1].position - 1);
                    }
                    else {
                        // end position
                        ret.push(this.view.timeline.duration);
                    }
                }
            }
            if (ret.length == 0) {
                throw 'can not find label ' + (label) + ' (' + this.getLabels().join(',') + ') ';
            }
            return ret;
        };
        CreatejsAnimationHandler.prototype.gotoAndPlay = function (label, fn, reset) {
            if (reset === void 0) { reset = false; }
            if (reset) {
                this._animationList.length = 0;
                this.pause();
            }
            var position;
            if (typeof label == 'number') {
                position = [label, this.view.timeline.duration];
                this._animationList.push(position);
                if (fn) {
                    this.addEventListener('complete_' + position[1], fn, true);
                }
            }
            else if (typeof label != 'string') {
                for (var i = 0; i < label.length; i++) {
                    position = this.getPositionByLabel(label[i]);
                    this._animationList.push(position);
                }
                if (fn) {
                    this.addEventListener('complete_' + position[1], fn, true);
                }
            }
            else {
                position = this.getPositionByLabel(label);
                this._animationList.push(position);
                if (fn) {
                    this.addEventListener('complete_' + position[1], fn, true);
                }
            }
            this._play();
        };
        CreatejsAnimationHandler.prototype.gotoAndStop = function (label) {
            if (typeof label == 'number') {
                this.view.gotoAndStop(label);
            }
            else {
                throw 'string labels not implemented yet. Only frame numbers';
            }
        };
        CreatejsAnimationHandler.prototype._play = function () {
            if (!this._isRunning && this._animationList.length > 0) {
                this.view.visible = true;
                this._isRunning = true;
                var position = this._animationList.shift();
                this._startPosition = position[0];
                this._stopPosition = position[1];
                this.view.gotoAndPlay(this._startPosition);
                if (!this._onTickIsRunning) {
                    this._onTickIsRunning = true;
                    createjs.Ticker.addEventListener('tick', this._onTick);
                }
            }
        };
        CreatejsAnimationHandler.prototype.onTick = function () {
            //		if(this._onTickIsRunning){
            this.dispatchEvent('progress', this.view.currentFrame / this.view.timeline.duration);
            if (this.view.currentFrame >= this._stopPosition) {
                this.dispatchEvent('complete_' + this._stopPosition);
                this._isRunning = false;
                if (this._animationList.length > 0) {
                    this._play();
                }
                else {
                    this._onTickIsRunning = false;
                    this.view.stop();
                    createjs.Ticker.removeEventListener('tick', this._onTick);
                }
            }
            //		}
        };
        CreatejsAnimationHandler.prototype.addEventListenerToAssetCollection = function (arr, name, fn) {
            for (var i = 0; i < arr.length; i++) {
                arr[i].addEventListener(name, fn);
            }
        };
        /**
         * Get first label and start playing there. Animation will stop when the next label is found.
         */
        CreatejsAnimationHandler.prototype.play = function (callback) {
            var labels = this.getLabels();
            if (labels.length > 0) {
                this.gotoAndPlay(labels[0], callback);
            }
            else {
                // no labels where defined in the animation.
                this._animationList.push([0, this.view.timeline.duration]);
                if (callback)
                    this.addEventListener('complete_' + this.view.timeline.duration, callback);
                this._play();
            }
        };
        /**
         * Pause animation, use resume(); to resume the paused animation.
         */
        CreatejsAnimationHandler.prototype.pause = function () {
            this.view.stop();
            this._isRunning = false;
            if (this._onTickIsRunning) {
                this._onTickIsRunning = false;
                createjs.Ticker.removeEventListener('tick', this._onTick);
            }
        };
        /**
         * Resume paused animation, only use with paused animations.
         */
        CreatejsAnimationHandler.prototype.resume = function () {
            if (!this._onTickIsRunning) {
                this._onTickIsRunning = true;
                createjs.Ticker.addEventListener('tick', this._onTick);
            }
            this._isRunning = true;
            this.view.play();
        };
        /**
         * Get first label and start playing. Animation will stop when it reaches the position of the next label / end of animation.
         */
        CreatejsAnimationHandler.prototype.playAll = function (callback) {
            var labels = this.getLabels();
            if (labels.length > 0) {
                this.gotoAndPlay(labels, callback);
            }
            else {
                this.play(callback);
            }
        };
        /**
         * Animation is paused and animation qui is clearen
         */
        CreatejsAnimationHandler.prototype.clearAnimationList = function () {
            this._animationList.length = 0;
            this.pause();
        };
        /**
         * Hide animation
         * @returns {CreatejsAnimationHandler}
         */
        CreatejsAnimationHandler.prototype.hide = function () {
            this.view.visible = false;
            return this;
        };
        /**
         * Show animation
         * @returns {CreatejsAnimationHandler}
         */
        CreatejsAnimationHandler.prototype.show = function () {
            this.view.visible = true;
            return this;
        };
        /**
         * Cache a single frame of the animation. Animation will not be shown un till clearCache() is called.
         * @param size
         * @returns {CreatejsAnimationHandler}
         */
        CreatejsAnimationHandler.prototype.cache = function (size) {
            if (size === void 0) { size = 1; }
            this.view.cache(0, 0, this.width, this.height, size);
            return this;
        };
        /**
         * Cache is cleared
         * @returns {CreatejsAnimationHandler}
         */
        CreatejsAnimationHandler.prototype.clearCache = function () {
            this.view.uncache();
            return this;
        };
        CreatejsAnimationHandler.prototype.onResize = function (e) {
            _super.prototype.onResize.call(this, e);
            this.view.x = this.x;
            this.view.y = this.y;
            this.view.regX = this.regX;
            this.view.regY = this.regY;
            this.view.scaleX = this.scaleX;
            this.view.scaleY = this.scaleY;
        };
        CreatejsAnimationHandler.prototype.destruct = function () {
            this.pause();
            this.view.visible = false;
            this.view.removeAllChildren();
            this.view.removeAllEventListeners();
            this.view.uncache();
            this.removeAllEventListeners();
            while (this._animationList.length > 0) {
                this._animationList.pop();
            }
            _super.prototype.destruct.call(this);
        };
        return CreatejsAnimationHandler;
    })(DisplayObject);
    return CreatejsAnimationHandler;
});
