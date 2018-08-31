var b_numberX = [Math.random(),Math.random(),Math.random(),Math.random(),Math.random(),Math.random(),Math.random(),Math.random()];
var b_numberY = [-20,20,60,100,140,180,220,260];
var b_ctx = [];
var b_w;
var b_h;
var b_canvases;
var d_displacement = 0;

var drawBackground = function()
{
	b_canvases = document.getElementsByClassName('background')

	if(Math.random()<0.3)
	{
		b_numberX.push(Math.random());
		b_numberY.push(-20);
	}
	for(var c = 0;c<b_canvases.length;c++)
	{
		var canvas = b_canvases[c];
		b_ctx[c] = canvas.getContext('2d');
		b_ctx[c].font="10px monospace";

		b_w = canvas.width;
		b_h = canvas.height;
		b_ctx[c].clearRect(0, 0, b_w, b_h);
		for(var i = 0;i<b_numberX.length;i++)
		{
			for(var j = 0;j<7;j++)
			{
				b_ctx[c].fillStyle = 'rgba(0,255,0,0.'+(7-j)+')';
				b_ctx[c].fillText(Math.floor(Math.random()*9),b_numberX[i]*b_w,b_numberY[i]-10*j);
			}
		}
	}

	for(var i = 0;i<b_numberX.length;i++)
	{
		b_numberY[i]+=4;
		if(b_numberY[i]>b_h+20*8)
		{
			b_numberY.splice(i, 1);
			b_numberX.splice(i, 1);
			i--;
		}
	}
	setTimeout(drawBackground, 100);
}

var drawGlitches = function()
{
	var glitches = document.getElementsByClassName('glitch')
	var colors = ["6,7,96","222,236,6","235,236,237","6,24,114","12,11,11"];
	for(var c = 0;c<glitches.length;c++)
	{

		var canvas = glitches[c];
		var ctx = canvas.getContext("2d");
		var width = canvas.width;
		var height = canvas.height;
		ctx.clearRect(0, 0, width, height);

		ctx.beginPath();
		ctx.fillStyle="darkGreen";
		if(glitches[c].classList.contains("targeting"))ctx.fillStyle="red";
		ctx.rect(width/4,height/4,width/2,height/2);
		ctx.fill();
		for(var i = 0;i<5;i++)
		{
			ctx.beginPath();
			ctx.fillStyle="rgba("+colors[Math.floor(Math.random()*colors.length)]+","+(parseInt(glitches[c].classList[0],10)+0.0)/100+")";
			var x = Math.random()*width;
			var y = Math.random()*height;
			var x1 = Math.random()*width;
			var y1 = Math.random()*height;
			ctx.rect(Math.min(x,x1),Math.min(y,y1),Math.abs(x-x1),Math.abs(y-y1));
			ctx.fill();
		}

	}
	setTimeout(drawGlitches, 150);
}


var drawData = function()
{
	var glitches = document.getElementsByClassName('data')
	d_displacement+=10;
	if(d_displacement>200)d_displacement = 10;
	for(var c = 0;c<glitches.length;c++)
	{

		var canvas = glitches[c];
		var ctx = canvas.getContext("2d");
		var width = canvas.width;
		var height = canvas.height;
		ctx.clearRect(0, 0, width, height);
		canvas.width  = 200;
		canvas.height = 500;

		ctx.font="20px monospace";
		ctx.fillStyle = 'white';
		ctx.fillText("Protect me",-d_displacement,height/2);
		ctx.fillText("Protect me",width-d_displacement,height/2);

		for(var i = 0;i<100;i++)
		{
			ctx.fillText(Math.floor(Math.random()*9),width*Math.random(),height-((height/2-50)*Math.random()));
		}
		for(var i = 0;i<100;i++)
		{
			ctx.fillText(Math.floor(Math.random()*9),width*Math.random(),((height/2-50)*Math.random()));
		}

	}
	setTimeout(drawData, 150);
}

var drawLoadingAttack = function()
{
	var canvas = document.getElementById('attackLoader');
	var ctx = canvas.getContext("2d");
	var w = canvas.offsetWidth;
	var h = canvas.offsetHeight;
	var ratio = w/h;
	var division = 10;
	var frameLoadingStage = 60;
	var minPixel = 800;
	ctx.clearRect(0, 0, w, h);
	if(ratio < 1)
	{
		canvas.width  = minPixel;
		canvas.height  = minPixel/ratio;
		w = minPixel;
		h = minPixel/ratio;
	}
	else
	{
		canvas.width  = minPixel*ratio;
		canvas.height  = minPixel;
		w = minPixel*ratio;
		h = minPixel;
	}



	ctx.strokeStyle = "rgba(255,255,255,0.4)";
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.arc(w/2,h/2,5,0,2*Math.PI);
	ctx.stroke();

	ctx.strokeStyle = "rgba(255,255,255,1)";
	if(attackLoadingFrame>0)
	{
		var adv = attackLoadingFrame/frameNeededAttack[0];
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.arc(w/2,h/2,5,0,2.0*Math.PI*adv);
		ctx.stroke();
	}

	if(attackLoadingFrame>frameNeededAttack[0])
	{
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.arc(w/2,h/2,5,0,2.0*Math.PI);
		ctx.stroke();

		ctx.strokeStyle = "rgba(255,255,255,0.7)";
		var adv = (attackLoadingFrame-frameNeededAttack[0])/(frameNeededAttack[1]-frameNeededAttack[0]);
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.arc(w/2,h/2,10,0,2.0*Math.PI*adv);
		ctx.stroke();
	}

	if(attackLoadingFrame>frameNeededAttack[1])
	{
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.arc(w/2,h/2,10,0,2.0*Math.PI);
		ctx.stroke();

		ctx.strokeStyle = "rgba(255,255,255,0.7)";
		var adv = (attackLoadingFrame-frameNeededAttack[1])/(frameNeededAttack[2]-frameNeededAttack[1]);
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.arc(w/2,h/2,15,0,2.0*Math.PI*adv);
		ctx.stroke();
	}

	if(attackLoadingFrame>frameNeededAttack[2])
	{
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.arc(w/2,h/2,15,0,2.0*Math.PI);
		ctx.stroke();

	}


}
