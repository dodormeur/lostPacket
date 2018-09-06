
var CssUtils = (function() {
	var s = document.documentElement.style;
 	var vendorPrefix =
		(s.WebkitTransform !== undefined && "-webkit-") ||
		(s.MozTransform !== undefined && "-moz-") ||
		(s.msTransform !== undefined && "-ms-") || "";

	return {
		translate: function( x, y, z, rx, ry, rz ) {
			return vendorPrefix + "transform:" +
				"translate3d(" + x + "px," + y + "px," + z + "px)" +
				"rotateX(" + rx + "deg)" +
				"rotateY("  +ry + "deg)" +
				"rotateZ(" + rz + "deg);"
		},
		origin: function( x, y, z ) {
			return vendorPrefix + "transform-origin:" + x + "px " + y + "px " + z + "px;";
		},
		texture: function( colour ) {
			return "background:"+ colour + ";";
		}
	}
}());


var elementFacingCamera = [];

/** @constructor */
function Triplet( a, b, c ) {
	this.x = a || 0;
	this.y = b || 0;
	this.z = c || 0;
}

/** @constructor */
function Camera() {
	this.world = null;
	this.position = new Triplet(0,0,0);
	this.rotation = new Triplet(0,0,0);
	this.fov = 700;
}
Camera.prototype = {
	update: function()
	{
		if (this.world)
		{
			this.world.node.style.cssText=
				CssUtils.origin( -this.position.x, -this.position.y, -this.position.z) +
				CssUtils.translate( this.position.x, this.position.y, this.fov, this.rotation.x, this.rotation.y, this.rotation.z)

			var temp = this;
			elementFacingCamera.forEach(function(e){ //TODO : correct facing camera
				if(e.active)
				{
					var angle = -Math.atan2(-temp.position.y-(e.y),-temp.position.x-(e.x))*180/Math.PI;
					e.node.style.cssText = CssUtils.translate( e.x, e.y, -e.z, 270, 90+angle,180)+"width:" + e.width + "px;" +
						"height:" + e.height + "px;";
					//console.log(e.node.style.cssText);
				}
			});
		}
	}
}

/** @constructor */
function Plane( colour, w,h,x,y,z,rx,ry,rz) {
	if(colour == "div")
	{
		this.node = document.createElement("div")
		this.node.className="plane wall"
	}
	else if(colour == "ceil")
	{
		this.node = document.createElement("div")
		this.node.className="plane ceil"
	}
	else if(colour == "floor")
	{
		this.node = document.createElement("div")
		this.node.className="plane floor"
	}
	else if(colour == "background")
	{
		this.node = document.createElement("canvas")
		this.node.className="plane background"
		this.node.height = h/4;
		this.node.width = w/4
	}
	else if(colour == "glitch")
	{
		this.node = document.createElement("canvas")
		this.node.className="plane glitch"
	}
	else if(colour == "data")
	{
		this.node = document.createElement("canvas")
		this.node.className="plane data"
	}
	else if(colour == "shockwave")
	{
		this.node = document.createElement("div")
		this.node.className="plane shockwave"
		this.node.id ="shockwave"
	}
	else if(colour == "bullet")
	{
		this.node = document.createElement("div")
		this.node.className="plane bullet"
	}
	this.width = w;
	this.height = h;
	this.position = new Triplet(x, y, z);
	this.rotation = new Triplet(rx, ry, rz);

	this.update = function() {
		this.node.style.cssText +=
			"width:" + this.width + "px;" +
			"height:" + this.height + "px;" +
			// CssUtils.texture(this.colour, this.rotation.x, this.rotation.y, this.rotation.z) +
			//'background:url("https://keithclark.co.uk/labs/css-fps/old/wall.jpg?3");'+
			CssUtils.translate( this.position.x, this.position.y, this.position.z, this.rotation.x, this.rotation.y, this.rotation.z)
	};

	this.update();
}


/** @constructor */
function World( viewport ) {
	this.node = document.createElement("div")
	this.node.className = "world"
	viewport.node.appendChild(this.node)
	viewport.camera.world = this;
	this.addPlane = function( plane ) {
		this.node.appendChild(plane.node)
	}
	this.removeAllPlanes = function()
	{
		this.node.innerHTML = "";
	}
}

/** @constructor */
function Viewport( node ) {
	this.node = document.createElement("div")
	this.node.className = "viewport"
	this.camera = new Camera()
	node.appendChild(this.node)
}
