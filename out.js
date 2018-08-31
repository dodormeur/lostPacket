function Triplet(a,c,b){this.x=a||0;this.y=c||0;this.z=b||0}function Camera(a,c,b,f,e,d,g){this.world=a;this.position=new Triplet(c,b,f);this.rotation=new Triplet(e,d,g);this.fov=700}function Plane(a,c,b,f,e,d,g,h,k){this.node=document.createElement("div");this.node.className="plane";this.colour=a;this.width=c;this.height=b;this.position=new Triplet(f,e,d);this.rotation=new Triplet(g,h,k);this.update()}
function World(a){this.node=document.createElement("div");this.node.className="world";a.node.appendChild(this.node);a.camera.world=this}function Viewport(a){this.node=document.createElement("div");this.node.className="viewport";this.camera=new Camera;a.appendChild(this.node)}
var CssUtils=function(){var a=document.documentElement.style,c=void 0!==a.WebkitTransform&&"-webkit-"||void 0!==a.MozTransform&&"-moz-"||void 0!==a.msTransform&&"-ms-"||"";return{translate:function(b,a,e,d,g,h){return c+"transform:translate3d("+b+"px,"+a+"px,"+e+"px)rotateX("+d+"deg)rotateY("+g+"deg)rotateZ("+h+"deg);"},origin:function(b,a,e){return c+"transform-origin:"+b+"px "+a+"px "+e+"px;"},texture:function(b,a,e,d){a=Math.abs(e/180-.5)/1.5;return 0!==d&&(a/=1.75),"background:"+c+"linear-gradient(rgba(0,0,0,"+
a+"),rgba(0,0,0,"+a+")),"+b+";"}}}();Camera.prototype={update:function(){this.world&&(this.world.node.style.cssText=CssUtils.origin(-this.position.x,-this.position.y,-this.position.z)+CssUtils.translate(this.position.x,this.position.y,this.fov,this.rotation.x,this.rotation.y,this.rotation.z))}};
Plane.prototype={update:function(){this.node.style.cssText+="width:"+this.width+"px;height:"+this.height+"px;"+CssUtils.texture(this.colour,this.rotation.x,this.rotation.y,this.rotation.z)+CssUtils.translate(this.position.x,this.position.y,this.position.z,this.rotation.x,this.rotation.y,this.rotation.z)}};World.prototype={addPlane:function(a){this.node.appendChild(a.node)}};var pressed={};window.onkeydown=function(a){a=a||window.event;pressed[a.keyCode]=!0};
window.onkeyup=function(a){a=a||window.event;delete pressed[a.keyCode]};
window.onload=function(){function a(){document.pointerLockElement===d||document.mozPointerLockElement===d?document.addEventListener("mousemove",e,!1):document.removeEventListener("mousemove",e,!1)}var c=0,b=new Viewport(document.body),f=new World(b);f.addPlane(new Plane("url(https://keithclark.co.uk/labs/css-fps/old/wall.jpg?3)",800,800,-400,400,53,180,0,0));f.addPlane(new Plane("url(https://keithclark.co.uk/labs/css-fps/old/wall.jpg?3)",800,500,400,-400,-447,270,0,180));f.addPlane(new Plane("url(https://keithclark.co.uk/labs/css-fps/old/wall.jpg?3)",
800,500,-400,-400,-447,270,90,180));f.addPlane(new Plane("url(https://keithclark.co.uk/labs/css-fps/old/wall.jpg?3)",800,500,-400,400,-447,90,0,0,0));f.addPlane(new Plane("url(https://keithclark.co.uk/labs/css-fps/old/wall.jpg?3)",800,500,400,400,-447,90,270,0));b.camera.position.x=-250;b.camera.position.y=180;b.camera.position.z=150;b.camera.rotation.x=270;b.camera.rotation.y=0;b.camera.rotation.z=-60;b.camera.update();var e=function(a){b.camera.rotation.x-=a.movementY/2;b.camera.rotation.z+=a.movementX/
2;200>b.camera.rotation.x&&(b.camera.rotation.x=200);340<b.camera.rotation.x&&(b.camera.rotation.x=340)},d=document.getElementsByTagName("BODY")[0];d.requestPointerLock=d.requestPointerLock||d.mozRequestPointerLock;d.onclick=function(){d.requestPointerLock()};"onpointerlockchange"in document?document.addEventListener("pointerlockchange",a,!1):"onmozpointerlockchange"in document&&document.addEventListener("mozpointerlockchange",a,!1);var g=function(){pressed[83]?-5<c&&(c-=.2):pressed[90]?5>c&&(c+=
.2):c=0<c?Math.max(c-.2,0):0>c?Math.max(c+.2,0):0;var a=Math.cos(.0174532925*b.camera.rotation.z);b.camera.position.x-=Math.sin(.0174532925*b.camera.rotation.z)*c;b.camera.position.y-=a*c;b.camera.update();setTimeout(g,16)};g()};
