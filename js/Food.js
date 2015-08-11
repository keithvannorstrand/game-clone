function Food(width,height){
  this.positionX = Math.random()*width;
  this.positionY = Math.random()*height;
  this.radius = 5;
}

Food.prototype.update = function(context){

  circle(this,context);
};