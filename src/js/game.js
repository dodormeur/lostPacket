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
var frameNeededAttack = [20.0,80.0,200.0];


var laserbeam = 0;

var shockWaveX = 0;
var shockWaveY = 0;
var shockWaveSize = -1;
var shockWaveFrame = 0;
var shockWaveMaxSize = 2000;
var framesToNextEnnemy = 500;
var difficultyEnnemy = 0;

var UP_KEY = 87;
var DOWN_KEY = 83;
var LEFT_KEY = 65;
var RIGHT_KEY = 68;
var SPACE_KEY = 32;
var actualKeyboard = 0;

/** @constructor */
function Game()
{
	loadMap(0);
	this.started = false;
	this.mainMenu = true;


	this.startGame = function()
	{
		loadMap(1);
		this.started = true;
		this.mainMenu = false;
		survivedFrames = 0;
		difficultyEnnemy = 0;
		framesToNextEnnemy = 500;
	}
	this.frame = function()
	{
		shockWaveFrame++;
		document.getElementById("frameAlive").innerHTML = Math.floor(survivedFrames/100);

		if(this.started)
		{
			survivedFrames++;
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
		else if(this.mainMenu)
		{
			strafeSpeed = 3;
			rotationZ -= 0.12;
		}


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

		if(laserbeam == 1)
		{
			document.getElementById("laserbeam").classList.remove("laserbeamActive");
		}
		if(laserbeam>0)laserbeam--;

		if(shockWaveSize != -1)
		{
			shockWaveSize+= 30;
			if(shockWaveSize >= shockWaveMaxSize)shockWaveSize = -1;
		}
		frameBullet();

		if((mouseDown || pressed[SPACE_KEY]) && this.started)attackLoadingFrame++;
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
			else if(ennemies[i].collide(positionX,positionY,100))
			{
				this.gameOver();
				ennemies[i].mustRemove = true;
			}

			if(laserbeam > 0)
			{
				ennemies[i].checkLaserbeam(positionX,positionY,rotationZ)
			}
			if(shockWaveSize != -1)
			{
				ennemies[i].checkShockWave(shockWaveX,shockWaveY,shockWaveSize,shockWaveFrame)
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

		if((survivedFrames%framesToNextEnnemy) == 1 && this.started)
		{
			console.log('spawning '+framesToNextEnnemy);
			if(framesToNextEnnemy>400)framesToNextEnnemy-=5;
			if(framesToNextEnnemy>300)framesToNextEnnemy-=5;
			if(framesToNextEnnemy>200)framesToNextEnnemy-=5;
			if(framesToNextEnnemy>150)framesToNextEnnemy-=3;
			if(framesToNextEnnemy>100)framesToNextEnnemy--;
			if(framesToNextEnnemy>50)framesToNextEnnemy--;
			difficultyEnnemy++;
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
			shootBullet()
			break;

			case 1: // shockwave
			shockWaveX = positionX;
			shockWaveY = positionY;
			shockWaveFrame = 0;
			shockWaveSize = 0;

			break;
			case 2: // laserbeam
			laserbeam = 180;
			document.getElementById("laserbeam").classList.add("laserbeamActive");
			break;
		}
	}


	this.gameOver = function()
	{
		if(!this.started)return;
		forwardSpeed= 0;
		strafeSpeed = 0;
		var scoreT = Math.floor(survivedFrames/100);
		document.exitPointerLock();
		document.getElementsByTagName("BODY")[0].onclick = function(){return false;}
		this.started = false;
		document.getElementById("gameOver").classList.remove("hidden");
		document.getElementById("ingame").classList.add("hidden");
		document.getElementById("score").innerHTML = scoreT;

		var flag = true;
		for(var i = 0;i<scores.length;i++)
		{
			if(scoreT>=scores[i])
			{
				scores.splice(i, 0, scoreT);
				document.getElementById("scorePosition").innerHTML = "you are number "+(i+1)+" in the leaderboard !";
				flag = false;
				break;
			}
		}

		if(scores.length<10 && flag){
			document.getElementById("scorePosition").innerHTML = "you are number "+(scores.length+1)+" in the leaderboard !";
			scores.push(scoreT);
		}

		if(scores.length>=10)scores.splice(-1,1)
		save();
		document.getElementById("gameOver").onclick = function()
		{
			showMainMenu();
		}
	}


	this.rotate = function(x,y,z)
	{
		rotationX+=x;
		rotationZ+=z;
		if(rotationX<230)rotationX = 230;
		if(rotationX>320)rotationX = 320;
	}
}
