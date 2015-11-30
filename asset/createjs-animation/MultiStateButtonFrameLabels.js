(function (lib, img, cjs) {

var p; // shortcut to reference prototypes

// stage content:
(lib.MultiStateButtonFrameLabels = function(mode,startPosition,loop) {
if (loop == null) { loop = false; }	this.initialize(mode,startPosition,loop,{up:0,"in":4,over:16,out:21,press:34,down:46,release:52});

	// timeline functions:
	this.frame_34 = function() {
		playSound("button_press");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(34).call(this.frame_34).wait(30));

	// Layer 10
	this.text = new cjs.Text("1", "19px Arial");
	this.text.lineHeight = 21;
	this.text.lineWidth = 45;
	this.text.setTransform(8,105.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.text,p:{text:"1"}}]}).to({state:[{t:this.text,p:{text:"2"}}]},4).to({state:[{t:this.text,p:{text:"3"}}]},12).to({state:[{t:this.text,p:{text:"4"}}]},5).to({state:[{t:this.text,p:{text:"5"}}]},13).to({state:[{t:this.text,p:{text:"6"}}]},12).to({state:[{t:this.text,p:{text:"7"}}]},6).wait(13));

	// mcHitArea
	this.mcHitArea = new lib.HitArea();
	this.mcHitArea.setTransform(97,55,1,1,0,0,0,90,50);
	this.mcHitArea.alpha = 0.012;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.mcHitArea}]}).wait(65));

	// Indicator
	this.instance = new lib.Indicator();
	this.instance.setTransform(31.1,55,1,1,0,0,0,0,0.1);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({x:31.5},4).to({x:62,y:25.5},6,cjs.Ease.get(-0.99)).to({x:92,y:54.5},6,cjs.Ease.get(1)).wait(5).to({x:59,y:85},6,cjs.Ease.get(-0.99)).to({x:31,y:55.5},6,cjs.Ease.get(1)).to({x:92,y:54.5},1).to({x:121.6,y:25},6,cjs.Ease.get(-0.99)).to({x:151,y:55.5},6,cjs.Ease.get(1)).wait(6).to({x:121,y:85.5},6,cjs.Ease.get(-0.99)).to({rotation:360,x:91.3,y:54.7},6,cjs.Ease.get(1)).wait(1));

	// Text
	this.text_1 = new cjs.Text("release", "10px Arial", "#333333");
	this.text_1.textAlign = "center";
	this.text_1.lineHeight = 12;
	this.text_1.setTransform(117.9,92,1,1.004);

	this.text_2 = new cjs.Text("in", "10px Arial", "#333333");
	this.text_2.textAlign = "center";
	this.text_2.lineHeight = 12;
	this.text_2.setTransform(58.6,2,1,1.004);

	this.text_3 = new cjs.Text("press", "10px Arial", "#333333");
	this.text_3.textAlign = "center";
	this.text_3.lineHeight = 12;
	this.text_3.setTransform(119.1,2,1,1.004);

	this.text_4 = new cjs.Text("out", "10px Arial", "#333333");
	this.text_4.textAlign = "center";
	this.text_4.lineHeight = 12;
	this.text_4.setTransform(56.4,92,1,1.004);

	this.text_5 = new cjs.Text("down", "10px Arial", "#333333");
	this.text_5.textAlign = "center";
	this.text_5.lineHeight = 12;
	this.text_5.lineWidth = 29;
	this.text_5.setTransform(173.3,47);

	this.text_6 = new cjs.Text("over", "10px Arial", "#333333");
	this.text_6.textAlign = "center";
	this.text_6.lineHeight = 12;
	this.text_6.lineWidth = 29;
	this.text_6.setTransform(108.4,47);

	this.text_7 = new cjs.Text("up", "10px Arial", "#333333");
	this.text_7.textAlign = "center";
	this.text_7.lineHeight = 12;
	this.text_7.lineWidth = 16;
	this.text_7.setTransform(11.8,47);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.text_7},{t:this.text_6},{t:this.text_5},{t:this.text_4},{t:this.text_3},{t:this.text_2},{t:this.text_1}]}).wait(65));

	// Dots
	this.instance_1 = new lib.dot();
	this.instance_1.setTransform(31,55,1,1,0,0,0,5,5);

	this.instance_2 = new lib.dot();
	this.instance_2.setTransform(121,85,1,1,0,0,0,5,5);

	this.instance_3 = new lib.dot();
	this.instance_3.setTransform(59,85,1,1,0,0,0,5,5);

	this.instance_4 = new lib.dot();
	this.instance_4.setTransform(151,55,1,1,0,0,0,5,5);

	this.instance_5 = new lib.dot();
	this.instance_5.setTransform(121,25,1,1,0,0,0,5,5);

	this.instance_6 = new lib.dot();
	this.instance_6.setTransform(91,55,1,1,0,0,0,5,5);

	this.instance_7 = new lib.dot();
	this.instance_7.setTransform(61,25,1,1,0,0,0,5,5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_7},{t:this.instance_6},{t:this.instance_5},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1}]}).wait(65));

	// Circles
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("rgba(0,0,0,0.498)").ss(1,1,1,3,true).p("AAMBPQgMgpAAgsQAAgqAKgmQAAgDACgDQAXhCA0g1QBYhYB9AAQB8AABXBYQBZBZAAB6QAAB8hZBYQhXBYh8AAQh9AAhYhYQg3g3gUhGAhWDUQhYBYh9AAQh8AAhYhYQhYhYAAh8QAAhvBIhTQAIgIAIgJQAcgcAggTQBEgpBUAAQB9AABYBYQBWBZAAB6QAAB8hWBYg");
	this.shape.setTransform(91,55);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape}]}).wait(65));

	// Image
	this.instance_8 = new lib.gradiantimage();
	this.instance_8.setTransform(0,0,0.25,0.25);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_8}]}).wait(65));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,333.8,136.8);


// symbols:
(lib.gradiantimage = function() {
	this.initialize(img.gradiantimage);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,1335,547);


(lib.Indicator = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#E5ECF9").s("#6B90DA").ss(1,1,1,3,true).de(-7.9,-7.9,16,16);
	this.shape.setTransform(0,0,0.875,0.875);

	this.addChild(this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-6.9,-6.9,14,14);


(lib.HitArea = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#CCCCCC").s().p("Au1ImIAAxLIdrAAIAARLg");
	this.shape.setTransform(90,50);

	this.addChild(this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-4.9,-4.9,190,110);


(lib.dot = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s("#333333").ss(1,1,1,3,true).de(-6.9,-6.9,14,14);
	this.shape.setTransform(5,5,0.714,0.714);

	this.addChild(this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(0,0,10,10);

})(lib = lib||{}, images = images||{}, createjs = createjs||{});
var lib, images, createjs;