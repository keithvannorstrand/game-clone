var Enemy = function(width,height,radius) {
  if(radius===undefined)
    radius = 10;
  this.position = {x: Math.random()*width, 
                   y: Math.random()*height};
  this.velocity = {x: 0,
                   y: 0};
  this.direction = {x: this.position.x+10, 
                    y: this.position.y-10};
  this.speed = 10;
  this.radius = radius;
  this.color = randomColor();
};

Enemy.prototype.move = function(food, actors){
  // sides of a right triangle joining 2 points
  var dx = this.direction.x - this.position.x;
  var dy = this.direction.y - this.position.y;
  var distance = Math.sqrt(dx*dx + dy*dy);

  //changes the direction of the enemy to the closest viable target
  this.findDirection(food,actors);

  // moves towards the direction point
  this.velocity.x = (dx/distance)*this.speed;
  this.velocity.y = (dy/distance)*this.speed;
  this.position.x+=this.velocity.x;
  this.position.y+=this.velocity.y;
};

// main AI function that finds where this Enemy should be going
Enemy.prototype.findDirection = function(food, actors){

  var closestActor = this.findClosestBody(actors);
  var closestFood = this.findClosestBody(food);
  var distToActor,distToFood;

  // if there is no food or only 1 actor end function
  if(closestActor!==undefined && closestFood!==undefined){
    distToActor = this.distance(this.position,closestActor.position);
    distToFood = this.distance(this.position,closestFood.position);

    //only chase the closest actor if you are 30% larger AND
    //the distance to the closest food is twice as far
    if(closestActor.radius*1.3<this.radius && distToActor<distToFood*2){
      this.setDirection(closestActor);
    } else {
      if(closestFood!==undefined)
        this.setDirection(closestFood);
    }
  }
};

//finds the closest body in the given array
//returns that body
Enemy.prototype.findClosestBody = function(bodyArray){
  var closestDistance=Number.MAX_SAFE_INTEGER;
  var closestBody;
  for(var i=0;i<bodyArray.length;i++){
    if(this===bodyArray[i])
      continue;
    var sqDistance = this.sqDistance(this.position,bodyArray[i].position);
    if(sqDistance<closestDistance){
      closestBody = bodyArray[i];
      closestDistance = sqDistance;
    }
  }
  return closestBody;
};

Enemy.prototype.closerBody = function(body1,body2){
  var sqDist1 = this.sqDistance(this.position,body1.position);
  var sqDist2 = this.sqDistance(this.position,body2.position);
  if(sqDist1>sqDist2)
    return body1;
  return body2;
};
//finds the true distance
Enemy.prototype.distance = function(pointA,pointB){
  var sqDist = this.sqDistance(pointA,pointB);
  return Math.sqrt(sqDist);
};
// finds the distance squared
Enemy.prototype.sqDistance = function(pointA,pointB){
  var dx = pointA.x - pointB.x;
  var dy = pointA.y - pointB.y;
  return dx*dx + dy*dy;
};

// sets this.direction to another bodies position
Enemy.prototype.setDirection = function(body){
  this.direction.x = body.position.x;
  this.direction.y = body.position.y;
};

//redraws itself and moves towards its goal
Enemy.prototype.update = function(context,food,actors){
  circle(this,context);
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

  //-----Old code-----
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
