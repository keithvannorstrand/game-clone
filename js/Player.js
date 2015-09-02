var Player = function(width,height) {
  this.position = {x: width/2,
                   y: height/2};
  this.velocity = {x: 0,
                   y: 0};
  this.cursor = {x: this.position.x,
                 y: this.position.y};
  this.speed = 7;
  this.radius = 10;
  this.color = 'red';
  var self = this;
  window.onmousemove = function(e){
    self.cursor.x = e.pageX;
    self.cursor.y = e.pageY;
  };
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
  }
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
  this.speed = 200/(this.radius+20);
};
