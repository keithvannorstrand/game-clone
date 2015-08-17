var Player = function(width,height) {
  this.position = {x: width/2,
                   y: height/2};
  this.velocity = {x: 0,
                   y: 0};
  this.cursor = {x: this.position.x,
                 y: this.position.y};
  this.speed = 10;
  this.radius = 10;
  this.color = 'red';
};

Player.prototype.move = function(){
  // sides of a right triangle joining
  var dx = this.cursor.x - this.position.x;
  var dy = this.cursor.y - this.position.y;
  var distance = Math.sqrt(dx*dx + dy*dy);

  //updates player position
  if(distance>5){
    this.velocity.x = (dx/distance)*this.speed;
    this.velocity.y = (dy/distance)*this.speed;
    this.position.x+=this.velocity.x;
    this.position.y+=this.velocity.y;
    // console.log('x: '+this.position.x+', y: '+this.position.y);
  }
};

// sets the position of the cursor
Player.prototype.setCursorLocation = function(e){
  this.cursor.x = e.pageX;
  this.cursor.y = e.pageY;
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
};
