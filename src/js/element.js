
/** @constructor */
function Ennemy(x,y)
{
	this.x = x;
	this.y = y;
	this.z = 100;
	this.hp = 100;
	this.regenRate = 0.01;
	this.speed = 2;
	this.width = 300;
	this.height = 300;
	this.targeting = false;
	this.targetRange = 0;
	this.mustRemove = false;
	this.plane = new Plane("glitch", 300, 300, this.x, this.y, this.z, 270, 270,180)
	this.node = this.plane.node;
	world.addPlane(this.plane);
	elementFacingCamera.push(this);

	this.frame = function(playerX,playerY)
	{
		//if(this.x<4000)this.x ++;
		var angle = 0;
		var flag = true;
		var flow = getFlow(this.x,this.y);
		this.hp+= this.regenRate;
		if(this.hp>100)this.hp = 100;
		if(this.collide(playerX,playerY,this.targetRange))
		{
			angle = Math.atan2(playerY-this.y,playerX-this.x)
			this.targeting = true;
			this.node.className = this.hp+" plane glitch targeting";
		}
		else
		{
			if(flow == 0 || flow == 5)flag =false;
			var angles = [-1,
				45,270,135,
				180 , 0,0,
				295,90,225
			];
			angle = (270+angles[flow])*Math.PI/180;
			this.node.className = this.hp+" plane glitch";
		}
		if(flag)
		{

			this.x+=this.speed*Math.cos(angle);
			this.y+=this.speed*Math.sin(angle);
		}
		if(flow == 5)return true;
		return false;
	}

	this.collide = function(x,y,padding)
	{
		return (this.x-x)*(this.x-x) + (this.y-y)*(this.y-y) <padding*padding;
	}
	this.delete = function()
	{
		this.node.remove();
		for( var i = 0; i < elementFacingCamera.length; i++){
		   if ( elementFacingCamera[i] === this) {
		     elementFacingCamera.splice(i, 1);
		   }
		}
	}
	this.takeDamage = function(much)
	{
		this.hp -= much;
		if(this.hp <=0)this.mustRemove = true;
	}
	
	this.checkLaserbeam = function(x,y,rot)
	{
		var dist = distPointLine(x,y,rot,this.x,this.y);
		console.log(dist);
		if(dist<100)this.takeDamage(1.5);
	}
}
