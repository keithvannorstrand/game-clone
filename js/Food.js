function Food(width,height){
  this.positionX = Math.random()*width;
  this.positionY = Math.random()*height;
  this.radius = Math.random()*2+4;
  this.color = 'black';
}

Food.prototype.update = function(context){
  circle(this,context);
};