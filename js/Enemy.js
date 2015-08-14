var Enemy = function(width,height,radius,color) {
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
  if(color===undefined)
    this.color = randomColor();
};

//redraws itself and moves towards its goal
Enemy.prototype.update = function(context,food,actors){
  circle(this,context);
  this.move(food,actors);
};

// grows the body and slows speed
Enemy.prototype.grow = function(body){
  var myArea = this.radius*this.radius*3.14;
  var bodyRadius = body.radius*body.radius*3.14;
  myArea+=bodyRadius;
  this.radius = Math.sqrt(myArea/3.14);
  this.speed = 100/this.radius;
};

        ///////////////////////
        // Main AI Functions //
        ///////////////////////

          ///////////
          // Sense //
          ///////////

// determines and sets the state of the AI
Enemy.prototype.determineState = function(food,actors){

  // sense
  var orderActorsRadius = this.orderByRadius(actors);
  var orderActorsDistance = this.orderByDistance(actors);
  // think
  // if I am the largest actor then set state to largestState
  if(isEqual(orderActorsRadius[orderActorsRadius.length-1],this)){
    this.largestState(food,actors);
  } else if (this.distance(orderActorsDistance[1].position,this.position)<300
             && orderActorsDistance[1].radius>this.radius){
    this.fleeState(food,actors);
  } else {
    this.feedState(food,actors);
  }
};

        ///////////
        // Think //
        ///////////
Enemy.prototype.largestState = function(food, actors){
  var closestActor = this.findClosestBody(actors);
  this.setDirectionToBody(closestActor);
};

Enemy.prototype.fleeState = function(food, actors){
  var closestActor = this.findClosestBody(actors);
  var distance = this.distance(this.position,closestActor.position);
  if(250<distance && distance<300 ||
    //  150<distance && distance<200 ||
     50 <distance && distance<100){
    var runPoint = this.findSafeRunPoint(actors);
    this.setDirectionToPoint(runPoint);
  }
};

Enemy.prototype.feedState = function(food, actors){
  // -----sense-----
  var orderFood = this.orderByDistance(food);

  // -----think-----
  var goalPoint = orderFood[0].position;
  if(!this.isDangerous(goalPoint, actors)){
    this.setDirectionToPoint(goalPoint);
  } else {
    var runPoint = this.findSafeRunPoint(actors);
    this.setDirectionToPoint(runPoint);
  }

};

        /////////
        // Act //
        /////////

Enemy.prototype.move = function (food, actors){

  //determines the state this should be in
  this.determineState(food, actors);

  var dx = this.direction.x - this.position.x;
  var dy = this.direction.y - this.position.y;
  var distance = Math.sqrt(dx*dx + dy*dy);

  // moves towards the direction point
  this.velocity.x = (dx/distance)*this.speed;
  this.velocity.y = (dy/distance)*this.speed;
  this.position.x+=this.velocity.x;
  this.position.y+=this.velocity.y;
};

        //////////////////////
        // Helper Functions //
        //////////////////////



Enemy.prototype.findSafeRunPoint = function(actors){
  runPoints = shuffle(runPoints);
  for (var i=0;i<runPoints.length;i++){
    if(!this.isDangerous(runPoints[i],actors)){
      return runPoints[i];
    }
  }
};

//checks if your goalPoint will cross any other actor's path
Enemy.prototype.isDangerous = function(goalPoint, actors){
  actors.forEach(function(actor){
    if(!this.willIntersectWith(goalPoint,actor)){
      return false;
    }
  },this);
};

//returns true if your goalPoint will interesect with the other body
Enemy.prototype.willIntersectWith = function(goalPoint, body){
  var denomP1 = (body.position.y-body.direction.y)*(this.position.x-goalPoint.x);
  var denomP2 = (body.position.x-body.direction.x)*(this.position.y-goalPoint.y);
  var denom = denomP1 - denomP2;
  return denom!==0;
};

//returns an array of the radii of each other body in the array
Enemy.prototype.radiusOfOtherBodies = function(bodyArray){
    var radii = bodyArray.filter(function(body){
      if(body!==this)
        return body;
    });
    radii = radii.map(function(body){
      return body.radius;
    });
    return radii;
};

//returns a sorted body array based on the distance from this
Enemy.prototype.orderByDistance = function(bodyArray){
  var arrayCopy = bodyArray.slice();
  var sortedArray = [];
  var self = this;
  sortedArray = bodyArray.sort(function(a,b){
    return self.sqDistance(self.position,a.position)-self.sqDistance(self.position,b.position);
  });
  return sortedArray;
};

Enemy.prototype.orderByRadius = function(bodyArray){
  var arrayCopy = bodyArray.slice();
  var sortedArray = [];
  var self = this;
  sortedArray = arrayCopy.sort(function(a,b){
    return a.radius-b.radius;
  });
  return sortedArray;
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

//finds which of 2 bodies are closer to this
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

// finds the distance squared for comparisons
Enemy.prototype.sqDistance = function(pointA,pointB){
  var dx = pointA.x - pointB.x;
  var dy = pointA.y - pointB.y;
  return dx*dx + dy*dy;
};

// sets this.direction to another bodies position
Enemy.prototype.setDirectionToBody = function(body){
  this.setDirectionToPoint(body.position);
};

//sets this.direction based on the given point
Enemy.prototype.setDirectionToPoint = function(point){
  this.direction.x = point.x;
  this.direction.y = point.y;
};

// module.exports = Enemy;



/////////////////
// Iteration 2 //
/////////////////

// Enemy.prototype.move = function(food, actors){
//   // sides of a right triangle joining 2 points
//   var dx = this.direction.x - this.position.x;
//   var dy = this.direction.y - this.position.y;
//   var distance = Math.sqrt(dx*dx + dy*dy);

//   //changes the direction of the enemy to the closest viable target
//   this.findDirection(food,actors);

//   // moves towards the direction point
//   this.velocity.x = (dx/distance)*this.speed;
//   this.velocity.y = (dy/distance)*this.speed;
//   this.position.x+=this.velocity.x;
//   this.position.y+=this.velocity.y;
// };

// // main AI function that finds where this Enemy should be going
// var iter=0;
// Enemy.prototype.findDirection = function(food, actors){

//   var closestActor = this.findClosestBody(actors);
//   var closestFood = this.findClosestBody(food);
//   var distToActor,distToFood;

//   // if there is no food or only 1 actor end function
//   if(closestActor!==undefined && closestFood!==undefined){
//     iter++;
//     distToActor = this.distance(this.position,closestActor.position);
//     distToFood = this.distance(this.position,closestFood.position);
//     if(iter<100 && closestActor.radius>this.radius && distToActor < 200){
//       this.runFrom(closestActor);

//       iter = 0;

//     } else if(distToActor<100 && closestActor.radius*1.1<this.radius){
//       this.setDirectionToBody(closestActor);

//     } else if(closestActor.radius*1.2<this.radius && distToActor<distToFood*2){
//       this.setDirectionToBody(closestActor);

//     } else {
//       this.setDirectionToBody(closestFood);
//     }
//   }
// };

// //runs in a random direction away from the body
// Enemy.prototype.runFrom = function(body){
//   var random = Math.ceil(Math.random()*3);
//   var dx = this.position.x - body.position.x;
//   var dy = this.position.y - body.position.y;
//   var distance = this.distance(this.position,body.position);

//   // I only want to change directions occasionally, not every frame
//   switch(random){
//     // case 1: this.direction.x= this.direction.x;
//     //         this.direction.y=-this.direction.y;
//     //         break;
//     // case 2: this.direction.x= -this.direction.x;
//     //         this.direction.y= this.direction.y;
//     //         break;
//     // case 3: this.direction.x= -this.direction.x;
//     //         this.direction.y= -this.direction.y;
//     //         break;
//     default: this.direction.x*= -1;
//              this.direction.y*= -1;
//   }

// };


  /////////////////
  // Iteration 1 //
  /////////////////


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
