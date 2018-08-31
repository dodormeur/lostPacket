

function loadMap(which)
{
	spawnPosition = [];
	levelScale = 400;

	if(which == 0)
	{

		level = [
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,1,0,1,0,0,0],
			[0,0,0,0,2,0,0,0,0],
			[0,0,0,1,0,1,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0]];
		positionX=700;
		positionY=700;
		rotationZ = 45;
	}
	else if(which == 1)
	{

		level = [
			[3,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0],
			[3,0,0,0,0,0,1,1,1,0,0,0],
			[0,0,0,0,0,0,1,0,0,0,0,0],
			[3,0,0,0,0,0,1,2,0,0,0,0],
			[0,0,0,0,0,0,1,0,0,0,0,0],
			[3,0,0,0,0,0,1,1,1,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0],
			[3,0,0,0,0,0,0,0,0,0,0,0]];
		positionX=1800;
		positionY=4200;
		rotationZ = 180;
	}

	else if(which == 2)
	{

		level = [
			[0,0,0,0,2],
			[0,0,0,0,0],
			[0,0,0,0,0],
			[0,0,0,0,0],
			[3,0,0,0,0]];
		positionX=1800;
		positionY=1800;
		rotationZ = 180;
	}
	ennemies = [];
	loadFlowMap(which);
	createFromTilemap(level,levelScale);
}


function loadFlowMap(which)
{
	var oldFlowMap = [
		[3,3,3,3,3,3,3,3,3,2,1,1],
		[6,6,6,6,6,6,6,6,6,2,1,1],
		[9,9,9,9,9,8,0,0,0,2,1,1],
		[9,9,9,9,9,8,0,2,1,1,4,4],
		[9,9,9,9,9,8,0,5,4,4,4,4],
		[3,3,3,3,3,2,0,8,7,7,7,7],
		[3,3,3,3,3,2,0,0,0,8,7,7],
		[6,6,6,6,6,6,6,6,6,8,7,7],
		[9,9,9,9,9,9,9,9,9,8,7,7]]


	flowMap = [];

	var todo = [];
	for(var i = 0;i<level.length;i++)
	{
		flowMap.push([]);
		for(var j = 0;j<level[0].length;j++)
		{
			if(level[i][j] == 2)
				todo.push([i,j,5,0]);
			flowMap[i].push(-1);
		}
	}

	while(todo.length>0)
	{
		todo.sort(function(a, b) {
		  return a[3] - b[3];
		});
		var actual = todo[0];
		todo.splice(0,1);
		var x = actual[0];
		var y = actual[1];
		var dist = actual[3];
		if(x>=0 && x<level.length && y>=0 && y<level[0].length)
		{
			if(level[x][y] == 1)flowMap[x][y] = 0;
			else
			{
				if(flowMap[x][y] == -1)
				{
					todo.push([x+1,y,2,dist+2]);
					todo.push([x-1,y,8,dist+2]);
					todo.push([x,y+1,6,dist+2]);
					todo.push([x,y-1,4,dist+2]);

					if(isTileValid(x+1,y) && isTileValid(x,y+1))
						todo.push([x+1,y+1,7,dist+3]);

					if(isTileValid(x-1,y) && isTileValid(x,y-1))
						todo.push([x-1,y-1,3,dist+3]);

					if(isTileValid(x-1,y) && isTileValid(x,y+1))
						todo.push([x-1,y+1,1,dist+3]);

					if(isTileValid(x+1,y) && isTileValid(x,y-1))
						todo.push([x+1,y-1,9,dist+3]);

					flowMap[x][y] = actual[2];
				}
			}
		}
	}
	console.log(flowMap);
}


function getFlow(x,y)
{
	if(x<0 || y<0 || x>=flowMap.length*levelScale || y>=flowMap[0].length*levelScale)return 0;
	return flowMap[Math.floor(x/levelScale)][Math.floor(y/levelScale)];
}


var isTileValid = function(x,y)
{
	if(x<0 || y<0 || x>=level.length || y>=level[0].length)return false;
	return level[x][y] != 1;
}

var isPointValid = function(x,y)
{
	if(x<0 || y<0 || x>=level.length*levelScale || y>=level[0].length*levelScale)return false;
	return level[Math.floor(x/levelScale)][Math.floor(y/levelScale)] != 1;
}
var isPositionValid = function(x,y,pad)
{
	return isPointValid(x-pad,y-pad) && isPointValid(x+pad,y-pad) && isPointValid(x-pad,y+pad) && isPointValid(x+pad,y+pad);
}


function createFromTilemap(map,scale)
{
	world.removeAllPlanes();
	var w = map.length*scale;
	var h = map[0].length*scale;
	world.addPlane( new Plane("floor", w, h, 0, h, 53, 180, 0, 0));
	world.addPlane( new Plane("ceil", w, h, 0, 0, -447, 0, 0, 0));

	for(var i = 0;i<map.length;i++)
	{
		for(var j = 0;j<map[i].length;j++)
		{
			if(map[i][j] == 1)
				addCube(world,i*scale,j*scale,scale,"div");
			if(map[i][j] == 2)
				addCube(world,i*scale+scale/4,j*scale+scale/4,scale/2,"data");
			if(map[i][j] == 3)
			{
				spawnPosition.push({x:i*scale+scale/2,y:j*scale+scale/2});
			}
		}
	}



	world.addPlane( new Plane("background", h, 500, 0, 0, -447, 270, 90, 180));
	world.addPlane( new Plane("background", w, 500, w, 0, -447, 270, 0,180));
	world.addPlane( new Plane("background", w, 500, 0, h, -447, 270, 180, 180));
	world.addPlane( new Plane("background", h, 500, w, h, -447, 270, 270,180));
}
