import CustomAbstractController = require('../CustomAbstractController');
import HomeViewModel = require('./HomeViewModel');
import ColliderCanvas = require('app/component/Collider-Canvas/ColliderCanvas');
import Kaleidoscope = require('app/component/Kaleidoscope/Kaleidoscope');

class HomeController extends CustomAbstractController
{
	viewModel:HomeViewModel;
	private collideCanvas:ColliderCanvas;
	private kaleidoscopeLeft:Kaleidoscope;
	private kaleidoscopeRight:Kaleidoscope;

	constructor()
	{
		super();
	}

	init()
	{
		super.init();

		this.initCanvas();
		/*
		 this.collideCanvas = new ColliderCanvas(
		 this.element, DataManager.getInstance().userModel.image_src
		 );
		 */
		this.kaleidoscopeLeft = new Kaleidoscope($('#kaleidoContainer'), 'left');
		this.kaleidoscopeRight = new Kaleidoscope($('#kaleidoContainer2'), 'right');

	}

	private initCanvas()
	{
		var $body = $('body');
		TweenLite.set($('.mainWrapper'), {width: $(window).width(), height:$(window).width(), ease:Power4.easeInOut});

		TweenLite.to($body, 1, {height:'100%', ease:Power4.easeInOut});
		TweenLite.to($body, 0.5, {delay:1, width:'100%', ease:Power4.easeInOut});

		var startDragY:number=0;

		var $dot = $('#dragBtn', this.element);
		var $dotWrap = $("#dragContainer", this.element);

		Draggable.create($dot[0], {
			type:"top",
			edgeResistance:1,
			bounds:$dotWrap,
			lockAxis:true,
			throwProps:true,
			snap: [0, 100, 200],
			maxY:200,
			minY:0,
			minDuration:0.2,
			maxDuration:0.2,

			onDragStart:(e:any)=>{

				startDragY = e.y;
			},
			onDragEnd:(e:any)=>{

				console.log(e.y > startDragY);
				if(e.y >= startDragY)
				{
					this.animationMover('down');
				}else{
					this.animationMover('up');
				}
			}
		});

		$('#dragBtn', this.element).css('top', 100);

		Draggable.create("#spinThis", {
			type:"rotation",
			trigger:$("#spinner"),
			throwProps:true,
			minDuration:0.2,
			maxDuration:0.4,
			snap:(endValue)=>{
				return Math.round(endValue / 90) * 90;
			},
			onThrowUpdate :()=>{
				console.log(this.getCurrentRotation('spinThis'));

				var angle:number = this.getCurrentRotation('spinThis');

				TweenLite.set($('#leftText'), {rotation:-angle});
				TweenLite.set($('#rightText'), {rotation:-angle});
				//TweenLite.set($('#kaleidoContainer'), {rotation:-angle});


				if(angle == 90 || angle == -90)
				{

					TweenLite.to($('.mainWrapper'), 0.5, {width: $(window).height(), ease: Power4.easeInOut, overwrite: true});
				}else{
					TweenLite.to($('.mainWrapper'), 0.5, {width: $(window).width(), ease: Power4.easeInOut, overwrite: true});
				}
			}
		});

	}


	private animationMover(direction:string)
	{
		if(!$('.leftPanel .mover', this.element).hasClass('filled')){
			$('.leftPanel .mover', this.element).addClass('filled');
			$('.rightPanel .mover', this.element).addClass('filled');
		}else{
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

	}

	private getCurrentRotation( elid ) {
		var el = document.getElementById(elid);
		var st = window.getComputedStyle(el, null);
		var tr = st.getPropertyValue("-webkit-transform") ||
			st.getPropertyValue("-moz-transform") ||
			st.getPropertyValue("-ms-transform") ||
			st.getPropertyValue("-o-transform") ||
			st.getPropertyValue("transform") ||
			"fail...";

		if( tr !== "none") {
			var values:any = tr.split('(')[1];
			values = values.split(')')[0];
			values = values.split(',');
			var a = values[0];
			var b = values[1];
			var c = values[2];
			var d = values[3];

			var scale = Math.sqrt(a*a + b*b);

			var radians = Math.atan2(b, a);
			var angle = Math.round( radians * (180/Math.PI));

		} else {
			var angle = 0;
		}

		return angle;
	}

	/*transitionIn()
	{
		var $body = $('body');
		TweenLite.to($body, 1, {height:'100%'});
		TweenLite.to($body, 0.5, {delay:1, width:'100%', onComplete:()=>{super.transitionIn()}});

		//TweenLite.to($('.leftPanel', this.element), 0.5, {height:'100%'});

	}*/

	private initKaleidoscopeBg(obj)
	{

	}

	public destruct()
	{
		super.destruct();
	}
}

export = HomeController;