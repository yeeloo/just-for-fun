var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../CustomAbstractController', 'app/component/Kaleidoscope/Kaleidoscope'], function (require, exports, CustomAbstractController, Kaleidoscope) {
    var HomeController = (function (_super) {
        __extends(HomeController, _super);
        function HomeController() {
            _super.call(this);
        }
        HomeController.prototype.init = function () {
            _super.prototype.init.call(this);
            this.initCanvas();
            /*
             this.collideCanvas = new ColliderCanvas(
             this.element, DataManager.getInstance().userModel.image_src
             );
             */
            this.kaleidoscopeLeft = new Kaleidoscope($('#kaleidoContainer'), 'left');
            this.kaleidoscopeRight = new Kaleidoscope($('#kaleidoContainer2'), 'right');
        };
        HomeController.prototype.initCanvas = function () {
            var _this = this;
            var $body = $('body');
            TweenLite.set($('.mainWrapper'), { width: $(window).width(), height: $(window).width(), ease: Power4.easeInOut });
            TweenLite.to($body, 1, { height: '100%', ease: Power4.easeInOut });
            TweenLite.to($body, 0.5, { delay: 1, width: '100%', ease: Power4.easeInOut });
            var startDragY = 0;
            var $dot = $('#dragBtn', this.element);
            var $dotWrap = $("#dragContainer", this.element);
            Draggable.create($dot[0], {
                type: "top",
                edgeResistance: 1,
                bounds: $dotWrap,
                lockAxis: true,
                throwProps: true,
                snap: [0, 100, 200],
                maxY: 200,
                minY: 0,
                minDuration: 0.2,
                maxDuration: 0.2,
                onDragStart: function (e) {
                    startDragY = e.y;
                },
                onDragEnd: function (e) {
                    console.log(e.y > startDragY);
                    if (e.y >= startDragY) {
                        _this.animationMover('down');
                    }
                    else {
                        _this.animationMover('up');
                    }
                }
            });
            $('#dragBtn', this.element).css('top', 100);
            Draggable.create("#spinThis", {
                type: "rotation",
                trigger: $("#spinner"),
                throwProps: true,
                minDuration: 0.2,
                maxDuration: 0.4,
                snap: function (endValue) {
                    return Math.round(endValue / 90) * 90;
                },
                onThrowUpdate: function () {
                    console.log(_this.getCurrentRotation('spinThis'));
                    var angle = _this.getCurrentRotation('spinThis');
                    TweenLite.set($('#leftText'), { rotation: -angle });
                    TweenLite.set($('#rightText'), { rotation: -angle });
                    //TweenLite.set($('#kaleidoContainer'), {rotation:-angle});
                    if (angle == 90 || angle == -90) {
                        TweenLite.to($('.mainWrapper'), 0.5, { width: $(window).height(), ease: Power4.easeInOut, overwrite: true });
                    }
                    else {
                        TweenLite.to($('.mainWrapper'), 0.5, { width: $(window).width(), ease: Power4.easeInOut, overwrite: true });
                    }
                }
            });
        };
        HomeController.prototype.animationMover = function (direction) {
            if (!$('.leftPanel .mover', this.element).hasClass('filled')) {
                $('.leftPanel .mover', this.element).addClass('filled');
                $('.rightPanel .mover', this.element).addClass('filled');
            }
            else {
                $('.leftPanel .mover', this.element).removeClass('filled');
                $('.rightPanel .mover', this.element).removeClass('filled');
            }
            /*var startPos:number=0;
            var endPos:number=0;
    
            if(direction === "down"){
                startPos = -15;
                endPos = 115;
            }else{
                startPos = 115;
                endPos = -15;
            }
             TweenLite.fromTo($('.leftPanel .mover', this.element), 1.5, {
                css:{top:startPos + '%'}
            },{
                css:{top:endPos + '%'},
                overwrite: true,
                ease: Power4.easeInOut
            });
            TweenLite.fromTo($('.rightPanel .mover', this.element), 1.5, {
                css:{bottom:startPos + '%'}
            },{
                css:{bottom:endPos + '%'},
                overwrite: true,
                ease: Power4.easeInOut
            });*/
        };
        HomeController.prototype.getCurrentRotation = function (elid) {
            var el = document.getElementById(elid);
            var st = window.getComputedStyle(el, null);
            var tr = st.getPropertyValue("-webkit-transform") || st.getPropertyValue("-moz-transform") || st.getPropertyValue("-ms-transform") || st.getPropertyValue("-o-transform") || st.getPropertyValue("transform") || "fail...";
            if (tr !== "none") {
                var values = tr.split('(')[1];
                values = values.split(')')[0];
                values = values.split(',');
                var a = values[0];
                var b = values[1];
                var c = values[2];
                var d = values[3];
                var scale = Math.sqrt(a * a + b * b);
                var radians = Math.atan2(b, a);
                var angle = Math.round(radians * (180 / Math.PI));
            }
            else {
                var angle = 0;
            }
            return angle;
        };
        /*transitionIn()
        {
            var $body = $('body');
            TweenLite.to($body, 1, {height:'100%'});
            TweenLite.to($body, 0.5, {delay:1, width:'100%', onComplete:()=>{super.transitionIn()}});
    
            //TweenLite.to($('.leftPanel', this.element), 0.5, {height:'100%'});
    
        }*/
        HomeController.prototype.initKaleidoscopeBg = function (obj) {
        };
        HomeController.prototype.destruct = function () {
            _super.prototype.destruct.call(this);
        };
        return HomeController;
    })(CustomAbstractController);
    return HomeController;
});
