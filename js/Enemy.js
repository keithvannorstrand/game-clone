var Enemy = function(width,height) {
  this.position = {x: Math.random()*width, 
                   y: Math.random()*height};
  this.velocity = {x: 0,
                   y: 0};
  this.direction = {x: this.position.x+10, 
                    y: this.position.y-10};
  this.speed = 10;
  this.radius = 10;
  this.color = randomColor();
};

Enemy.prototype.move = function(food, actors){
  // sides of a right triangle joining 
  var dx = this.direction.x - this.position.x;
  var dy = this.direction.y - this.position.y;
  var distance = Math.sqrt(dx*dx + dy*dy);

  //updates player position
  // if(distance<5){
    this.findDirection(food,actors);
  // }
    this.velocity.x = (dx/distance)*this.speed;
    this.velocity.y = (dy/distance)*this.speed;
    this.position.x+=this.velocity.x;
    this.position.y+=this.velocity.y;
};

Enemy.prototype.findDirection = function(food, actors){
  // if(player.radius<this.radius){
  //   this.direction.x = player.position.x;
  //   this.direction.y = player.position.y;
  // }
  var closestFood = this.findClosestBody(food);
  this.setDirection(closestFood);
};

//finds the closest body in the given array
//returns that body
Enemy.prototype.findClosestBody = function(body){
  var closestDistance=1000000;
  var closestBody;
  for(var i=0;i<body.length;i++){
    var dx = this.position.x - body[i].position.x;
    var dy = this.position.y - body[i].position.y;
    var sqDistance = dx*dx + dy*dy;
    if(sqDistance<closestDistance){
      closestBody = body[i];
      closestDistance = sqDistance;
    }
  }
  return closestBody;
};

Enemy.prototype.setDirection = function(body){
  this.direction.x = body.position.x;
  this.direction.y = body.position.y;
};

// Enemy.prototype.moveRandom = function(){
//   // randomly moving AI
//   var dx = this.direction.x - this.position.x;
//   var dy = this.direction.y - this.position.y;
//   var distance = Math.sqrt(dx*dx + dy*dy);
//   // change direction when enemy gets close to its direction coordinates
//   if(distance<5){
//     this.changeDirection();
//   }
//   //updates enemy position
//   this.velocity.x = (dx/distance)*this.speed;
//   this.velocity.y = (dy/distance)*this.speed;
//   this.position.x+=this.velocity.x;
//   this.position.y+=this.velocity.y;
// };

// //changes the direction the enemy is moving
// Enemy.prototype.changeDirection = function(){
//   this.direction.x = Math.random()*1200;
//   this.direction.y = Math.random()*700;
// };

//redraws itself and moves towards its goal
Enemy.prototype.update = function(context,food,actors){
  circle(this,context);
  // this.moveRandom();
  this.move(food,actors);
};

// adds the enemies 
Enemy.prototype.grow = function(body){
  var myArea = this.radius*this.radius*3.14;
  var bodyRadius = body.radius*body.radius*3.14;
  myArea+=bodyRadius;
  this.radius = Math.sqrt(myArea/3.14);
  this.speed = 100/this.radius;
};

