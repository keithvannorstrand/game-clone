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