
function distPointLine(lx,ly,rotation,x,y)
{
    
    
    return distPointLineTwoPoint(lx,ly,lx+Math.sin(rotation*0.0174532925)*100,ly+Math.cos(rotation* 0.0174532925)*100,x,y);
}

function distPointLineEq(a,b,c,x,y)
{
    return Math.abs(a*x+b*y+c)/Math.sqrt(a*a+b*b);
}

function distPointLineTwoPoint(x1,y1,x2,y2,x,y)
{
    console.log(x1+" "+y1+" "+x2+" "+y2);
    return Math.abs((y2-y1)*x - (x2-x1)*y +x2*y1 -y2*x1)/Math.sqrt((y2-y1)*(y2-y1)+(x2-x1)*(x2-x1));
}