var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../../lib/temple/core/Destructible'], function (require, exports, Destructible) {
    var Kaleidoscope = (function (_super) {
        __extends(Kaleidoscope, _super);
        function Kaleidoscope(container, position) {
            _super.call(this);
            this.x = 0;
            this.y = 0;
            this.auto_x = 0;
            this.auto_y = 0;
            this.s = 3;
            this.n = 3;
            this.mode = 2;
            this.element = container;
            this.initialize(position);
        }
        Kaleidoscope.prototype.initialize = function (position) {
            var _this = this;
            var tiles = '';
            if (this.n) {
                for (var i = 0; i <= this.n * 2; i++) {
                    tiles += ['<div class="tile t', i, '"><div class="image ', position, '"></div></div>'].join('');
                }
            }
            var $kaleidescope = this.element.addClass('n' + this.n).append(tiles).width($(window).width());
            /*if(position == 'right')
            {
                $kaleidescope.css('left', -Math.round($(window).width()/2));
            }*/
            this.$image = $kaleidescope.find('.image');
            $(document).on('mousemove' + this.eventNamespace, function (e) {
                _this.x++;
                _this.y++;
                var nx = e.pageX, ny = e.pageY;
                switch (_this.mode) {
                    case 1:
                        nx = -_this.x;
                        ny = e.pageY;
                        break;
                    case 2:
                        nx = e.pageX;
                        ny = -_this.y;
                        break;
                    case 3:
                        nx = _this.x;
                        ny = e.pageY;
                        break;
                    case 4:
                        nx = e.pageX;
                        ny = _this.y;
                        break;
                    case 5:
                        nx = _this.x;
                        ny = _this.y;
                        break;
                }
                _this.move(nx, ny);
                _this.auto = _this.auto_throttle = false;
            });
            /*$kaleidescope.mousemove( ( e )=>
            {
                this.x++;
                this.y++;
    
                var nx = e.pageX, ny = e.pageY;
                switch ( this.mode ) {
                    case 1:
                        nx = -this.x;
                        ny = e.pageY;
                        break;
                    case 2:
                        nx = e.pageX;
                        ny = -this.y;
                        break;
                    case 3:
                        nx = this.x;
                        ny = e.pageY;
                        break;
                    case 4:
                        nx = e.pageX;
                        ny = this.y;
                        break;
                    case 5:
                        nx = this.x;
                        ny = this.y;
                        break;
                }
    
                this.move( nx, ny );
                this.auto = this.auto_throttle = false;
            });*/
            window['requestAnimFrame'] = (function () {
                return window['requestAnimationFrame'] || window['webkitRequestAnimationFrame'] || window['mozRequestAnimationFrame'] || window['oRequestAnimationFrame'] || window['msRequestAnimationFrame'] || function (callback, element) {
                    return window.setTimeout(callback, 1000 / 60);
                };
            })();
        };
        Kaleidoscope.prototype.animate = function () {
            var time = new Date().getTime(); // * [ '.0000', this.s ].join( '' );
            this.auto_x = Math.sin(time) * document.body.clientWidth;
            this.auto_y++;
            this.move(this.auto_x, this.auto_y);
            if (this.auto)
                requestAnimFrame(this.animate);
        };
        Kaleidoscope.prototype.move = function (x, y) {
            this.$image.css('background-position', [x + "px", y + "px"].join(' '));
        };
        Kaleidoscope.prototype.timer = function () {
            var _this = this;
            setTimeout(function () {
                _this.timer();
                if (_this.auto && !_this.auto_throttle) {
                    _this.animate();
                    _this.auto_throttle = true;
                }
                else {
                    _this.auto = true;
                }
            }, 5000);
        };
        Kaleidoscope.prototype.destruct = function () {
            $(document).off(this.eventNamespace);
            _super.prototype.destruct.call(this);
        };
        return Kaleidoscope;
    })(Destructible);
    return Kaleidoscope;
});
