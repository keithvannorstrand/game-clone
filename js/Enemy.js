var Enemy = function(width,height) {
  this.positionX = Math.random()*width;
  this.positionY = Math.random()*height;
  this.velocityX = 0;
  this.velocityY = 0;
  this.direction = {x: this.positionX+100, 
                    y: this.positionY-100};
  this.speed = 10;
  this.radius = 10;
  this.color = randomColor();
  // var turnInterval = setInterval(this.setDirection,3000);
};

Enemy.prototype.move = function(){
  // randomly moving AI
  var dx = this.direction.x - this.positionX;
  var dy = this.direction.y - this.positionY;
  var distance = Math.sqrt(dx*dx + dy*dy);
  // change direction when enemy gets close to its direction coordinates
  if(distance<5){
    this.changeDirection();
  }
  //updates enemy position
  this.velocityX = (dx/distance)*this.speed;
  this.velocityY = (dy/distance)*this.speed;
  this.positionX+=this.velocityX;
  this.positionY+=this.velocityY;
};

//changes the direction the enemy is moving
Enemy.prototype.changeDirection = function(){
  this.direction.x = Math.random()*1200;
  this.direction.y = Math.random()*700;
};

//redraws itself and moves towards its goal
Enemy.prototype.update = function(context){
  circle(this,context);
  this.move();
};

// adds the enemies 
Enemy.prototype.grow = function(body){
  var myArea = this.radius*this.radius*3.14;
  var bodyRadius = body.radius*body.radius*3.14;
  myArea+=bodyRadius;
  this.radius = Math.sqrt(myArea/3.14);
  this.speed = 100/this.radius;
};

