
var pressed={};
window.onkeydown=function(e){
     e = e || window.event;
     pressed[e.keyCode] = true;
}

window.onkeyup=function(e){
     e = e || window.event;
     delete pressed[e.keyCode];
}

var mouseDown = 0;

function addCube(world,x,y,w,what)
{
	world.addPlane( new Plane(what, w, 500, x+w, y, -447, 270, 90, 180));
	world.addPlane( new Plane(what, w, 500, x+w, y+w, -447, 270, 0,180));
	world.addPlane( new Plane(what, w, 500, x, y, -447, 270, 180, 180));
	world.addPlane( new Plane(what, w, 500, x, y+w, -447, 270, 270,180));
}



var world

window.onload = function() {

//	setCookie("save","tesmp",365);
//	getCookie("save")
	//save();


	document.body.onmousedown = function() {
	  ++mouseDown;
	}
	document.body.onmouseup = function() {
	  --mouseDown;
	}



	load();
	var viewport = new Viewport( document.body );
	world = new World( viewport );
	var game = new Game();
	var keyState = {
		forward: false,
		backward: false,
		strafeLeft: false,
		strafeRight: false
	};




	viewport.camera.position.x=0
	viewport.camera.position.y=0
	viewport.camera.position.z=150
	viewport.camera.rotation.x=270
	viewport.camera.rotation.y=0
	viewport.camera.rotation.z=0
	viewport.camera.update();


	var input = function(ev) {
		var speed = 0.5;
		game.rotate(-ev.movementY*speed,0,ev.movementX/2)
	}


	document.getElementById("statButton").onclick=function(e)
	{
		document.getElementById("stats").className="stats";
	}
	/*document.getElementById("quitButton").onclick=function(e)
	{
		document.getElementById("stats").className="hidden";
		document.getElementById("quit").className="quit";
	}*/

	var canvas = document.getElementsByTagName("BODY")[0];
	canvas.requestPointerLock = canvas.requestPointerLock;


	document.getElementById("survivalButton").onclick=function(e)
	{
		canvas.onclick = function() {
			canvas.requestPointerLock();
		}
		canvas.requestPointerLock();
		document.getElementById("ingame").className="";
		game.startGame();

		document.getElementById("menu").classList.add("hidden");
	}



	document.addEventListener('pointerlockchange', lockChangeAlert, false);
	function lockChangeAlert() {
  		if(document.pointerLockElement === canvas)
		{
    		document.addEventListener("mousemove", input, false);
  		}
		else
		{
    		document.removeEventListener("mousemove", input, false);
  		}
	}
	// Game Loop
	var frame = function()
	{

		game.frame();


		viewport.camera.position.x = -positionX;
		viewport.camera.position.y = -positionY;
		viewport.camera.position.z = positionZ;
		viewport.camera.rotation.x = rotationX;
		viewport.camera.rotation.y = rotationY;
		viewport.camera.rotation.z = rotationZ;
		viewport.camera.update();
	};



	var time = 0;
	var delta = 0;
	var timing = function(timestamp)
	{
		if(timestamp-time>1000)
		{
			window.requestAnimationFrame(timing);
			time = timestamp;
			return;
		}
		delta+= timestamp-time;
		time = timestamp;
		while(delta>=16)
		{
			frame();
			delta -= 16;

		}
		drawLoadingAttack();
		window.requestAnimationFrame(timing);
	}

	timing(0);
	drawBackground();
	drawGlitches();
	drawData();
}
