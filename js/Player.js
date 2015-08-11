var Player = function(width,height) {
  this.positionX = width/2;
  this.positionY = height/2;
  this.velocityX = 0;
  this.velocityY = 0;
  this.cursorX = this.positionX;
  this.cursorY = this.positionY;
  this.speed = 10;
  this.radius = 10;
  // this.width = 10;
  // this.height = 10;
};

Player.prototype.move = function(){
  // sides of a right triangle joining 
  var dx = this.cursorX - this.positionX;
  var dy = this.cursorY - this.positionY;
  var distance = Math.sqrt(dx*dx + dy*dy);

  //updates player position
  if(distance>5){
    this.velocityX = (dx/distance)*this.speed;
    this.velocityY = (dy/distance)*this.speed;
    this.positionX+=this.velocityX;
    this.positionY+=this.velocityY;
  }
};

// sets the position of the cursor
Player.prototype.setCursorLocation = function(e){
  this.cursorX = e.pageX;
  this.cursorY = e.pageY;
};

Player.prototype.update = function(context){
  this.move();
  circle(this,context);
};

Player.prototype.grow = function(body){
  var myArea = this.radius*this.radius*3.14;
  var bodyRadius = body.radius*body.radius*3.14;
  myArea+=bodyRadius;
  this.radius = Math.sqrt(myArea/3.14);
  this.speed = 100/this.radius;
  console.log('radius',this.radius);
  console.log('speed',this.speed);
};
