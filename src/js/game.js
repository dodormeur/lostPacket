var maxSpeed = 10;
var accel = 0.2;
var forwardSpeed = 0;
var strafeSpeed = 0;
var upSpeed = 0;
var survivedFrames = 0;

var rotationX=270,rotationY=0,rotationZ=0;
var positionX=1000,positionY=1000,positionZ=150;

var level;
var flowMap;
var levelScale;
var ennemies;
var spawnPosition = [];

var scores = [];
var levelReached = 0;
var attackLoadingFrame = 0;
var frameNeededAttack = [20.0,100.0,300.0];

var laserbeam = 0;

var UP_KEY = 87;
var DOWN_KEY = 83;
var LEFT_KEY = 65;
var RIGHT_KEY = 68;
var actualKeyboard = 0;

/** @constructor */
function Game()
{
	loadMap(0);
	this.started = false;


	this.startGame = function()
	{
		loadMap(1);
		this.started = true;
		survivedFrames = 0;
	}
	this.frame = function()
	{
		survivedFrames++;
		document.getElementById("frameAlive").innerHTML = Math.floor(survivedFrames/100);

		if(this.started)
		{
			if (pressed[DOWN_KEY]) {
				if (forwardSpeed > -maxSpeed) forwardSpeed -= accel;
			} else if (pressed[UP_KEY]) {
				if (forwardSpeed < maxSpeed) forwardSpeed += accel;
			}  else if (Math.abs(forwardSpeed) < 0.4) {
				forwardSpeed = 0;
			} else {
				forwardSpeed /= 1.1;
			}

			if (pressed[LEFT_KEY]) {
				if (strafeSpeed > -maxSpeed) strafeSpeed -= accel;
			} else if (pressed[RIGHT_KEY]) {
				if (strafeSpeed < maxSpeed) strafeSpeed += accel;
			} else if (Math.abs(strafeSpeed) < 0.4) {
				strafeSpeed = 0;
			} else {
				strafeSpeed /= 1.1;
			}
		}
		else
		{
			strafeSpeed = 3;
			rotationZ -= 0.12;
		}

		/*if(positionZ>150)upSpeed-=0.5;
		else upSpeed = 0;

		if(pressed[32] && positionZ == 150)
		{
			upSpeed = 10;
		}*/


		var xo = Math.sin(rotationZ * 0.0174532925);
		var yo = Math.cos(rotationZ * 0.0174532925);

		var oldX = positionX;
		var oldY = positionY;


		positionX += xo * forwardSpeed;
		positionY += yo * forwardSpeed;
		positionZ += upSpeed;


		positionY -= xo * strafeSpeed;
		positionX += yo * strafeSpeed;

		var padding = 80;
		if(!isPositionValid(positionX,positionY,padding))
		{
			if(isPositionValid(oldX,positionY,padding))positionX = oldX;
			else if(isPositionValid(positionX,oldY,padding))positionY = oldY;
			else if(!isPositionValid(oldX,oldY,padding))console.log("error !");
			else
			{
				positionX = oldX;
				positionY = oldY;
			}
		}

		if(laserbeam>0)laserbeam--;
		if(mouseDown)attackLoadingFrame++;
		else
		{
			for(var i = frameNeededAttack.length-1;i>=0;i--)
			{
				if(attackLoadingFrame>frameNeededAttack[i]){
					this.launchAttack(i);
					break;
				}
			}
			attackLoadingFrame = 0;
		}

		var flag = false;


		for(var i = 0;i<ennemies.length;i++)
		{
			if(ennemies[i].frame(positionX,positionY))
			{
				flag = true;
				ennemies[i].mustRemove = true;
			}

			if(laserbeam > 0)
			{
				ennemies[i].checkLaserbeam(positionX,positionY,rotationZ)
			}
			else if(ennemies[i].collide(positionX,positionY,100))
			{
				console.log("dead");
				ennemies[i].mustRemove = true;
			}
		}

		for(var i = ennemies.length-1;i>=0;i--)
		{
			if(ennemies[i].mustRemove)
			{
				ennemies[i].delete();
				ennemies.splice(i,1);
			}
		}

		if(flag)
		{
			this.gameOver();
		}

		if((survivedFrames%10000) == 1 && this.started)
		{
			if(spawnPosition && spawnPosition.length>0)
			{
				var pos = spawnPosition[Math.floor(spawnPosition.length*Math.random())];
				ennemies.push(new Ennemy(pos.x,pos.y));
			}
		}

	}

	this.launchAttack = function(which)
	{
		switch(which)
		{
			case 0: //small bullet going to an ennemy
			console.log("basic attack")
			break;

			case 1: // shockwave
			console.log("middle attack")
			break;
			case 2: // laserbeam
			console.log("strong attack")
			laserbeam = 180;
			break;
		}
	}
	this.gameOver = function()
	{
		console.log("data corrupted !");
	}

	this.rotate = function(x,y,z)
	{
		rotationX+=x;
		rotationZ+=z;
		if(rotationX<230)rotationX = 230;
		if(rotationX>320)rotationX = 320;
	}
}
