var Enemy = function(width,height) {
  this.positionX = width/4;
  this.positionY = height/4;
  this.velocityX = 0;
  this.velocityY = 0;
  this.cursorX = this.positionX;
  this.cursorY = this.positionY;
  this.speed = 10;
  this.radius = 10;
  this.color = randomColor();
};

Enemy.prototype.move = function(){

};

Enemy.prototype.update = function(context){
  this.move();
  circle(this,context);
};

Enemy.prototype.grow = function(body){
  var myArea = this.radius*this.radius*3.14;
  var bodyRadius = body.radius*body.radius*3.14;
  myArea+=bodyRadius;
  this.radius = Math.sqrt(myArea/3.14);
  this.speed = 100/this.radius;
};

