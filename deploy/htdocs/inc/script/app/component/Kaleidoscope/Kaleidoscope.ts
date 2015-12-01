import refdef = require('../../../lib/ReferenceDefinitions');
import Destructible = require('../../../lib/temple/core/Destructible');

class Kaleidoscope extends Destructible
{
	public element:JQuery;
	private x = 0;
	private y = 0;

	private auto;
	private auto_x = 0;
	private auto_y = 0;
	private auto_throttle;

	private s:number=3;
	private n:number=3;
	private mode:number = 2;
	private $image:JQuery;

	constructor(container:JQuery, position: string)
	{
		super();

		this.element = container;
		this.initialize(position);
	}

	public initialize(position:string)
	{
		var tiles = '';

		if ( this.n ) {
			for ( var i = 0; i <= this.n * 2; i++ ) {
				tiles += [ '<div class="tile t', i, '"><div class="image ', position, '"></div></div>' ].join( '' );
			}
		}
		var $kaleidescope = this.element.addClass( 'n' + this.n ).append( tiles ).width($(window).width());
		/*if(position == 'right')
		{
			$kaleidescope.css('left', -Math.round($(window).width()/2));
		}*/
		this.$image = $kaleidescope.find( '.image' );

		$(document).on('mousemove' + this.eventNamespace, (e)=>{
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

		window['requestAnimFrame'] = (function() {
			return window['requestAnimationFrame'] ||
				window['webkitRequestAnimationFrame'] ||
				window['mozRequestAnimationFrame'] ||
				window['oRequestAnimationFrame'] ||
				window['msRequestAnimationFrame'] ||
				function( callback, element) {
					return window.setTimeout(callback, 1000/60);
				};
		})();
	}

	private animate() {
		var time = new Date().getTime();// * [ '.0000', this.s ].join( '' );
		this.auto_x = Math.sin( time ) * document.body.clientWidth;
		this.auto_y++;

		this.move( this.auto_x, this.auto_y );
		if ( this.auto ) requestAnimFrame( this.animate );
	}

	private move( x, y ) {
		this.$image.css( 'background-position', [ x + "px", y + "px" ].join( ' ' ) );
	}

	private timer()
	{
		setTimeout(()=>
		{
			this.timer();
			if(this.auto && !this.auto_throttle)
			{
				this.animate();
				this.auto_throttle = true;
			}
			else
			{
				this.auto = true;
			}
		}, 5000);
	}

	public destruct():void
	{
		$(document).off(this.eventNamespace);
		super.destruct();
	}
}

export = Kaleidoscope;