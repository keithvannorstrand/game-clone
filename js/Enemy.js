var Enemy = function(width,height,radius,color) {
  if(radius===undefined)
    radius = 10;
  this.position = {x: Math.random()*width,
                   y: Math.random()*height};
  this.velocity = {x: 0,
                   y: 0};
  this.goalPoint = {x: this.position.x+10,
                    y: this.position.y-10};
  this.radius = radius;
  this.speed = 100/this.radius;
  if(color===undefined)
    this.color = randomColor();
};

//redraws itself and moves towards its goal
Enemy.prototype.update = function(context, food, actors){
  circle(this,context);
  this.move(context, food, actors);
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
Enemy.prototype.determineState = function(context, food, actors){

  // sense
  var orderActorsRadius = this.orderByRadius(actors);
  var orderActorsDistance = this.orderByDistance(actors);

  // think
  // if I am the largest actor then set state to largestState
  if(isEqual(orderActorsRadius[orderActorsRadius.length-1],this)){
    this.largestState(food,actors);
  } else if (this.distance(orderActorsDistance[1].position,this.position)<200
             && orderActorsDistance[1].radius>this.radius){
    this.fleeState(context, food, actors);
  } else {
    this.feedState(food, actors);
  }
};

        ///////////
        // Think //
        ///////////

// sets the enemy's state to attack the closest body
Enemy.prototype.largestState = function(food, actors){
  var closestActor = this.findClosestBody(actors);
  this.setGoalPointToBody(closestActor);
};

// sets the Enemy's state to run from the 'attacking' body
// currently VERY unstable
Enemy.prototype.fleeState = function(context, food, actors){
  var closestActor = this.findClosestBody(actors);
  var distance = this.distance(this.position,closestActor.position);
  var runPoint = this.findSafeRunPoint(context, actors);
  // if(this.distance(runPoint,this.goalPoint)>10){
    this.setGoalPointToPoint(runPoint);
  // }
};

// sets the Enemy's state to find food and eat it to grow
Enemy.prototype.feedState = function(food){
  var closestFood = this.findClosestBody(food);
  this.setGoalPointToBody(closestFood);
};

        /////////
        // Act //
        /////////

Enemy.prototype.move = function (context, food, actors){

  //determines the state this should be in
  this.determineState(context, food, actors);

  var dx = this.goalPoint.x - this.position.x;
  var dy = this.goalPoint.y - this.position.y;
  var distance = Math.sqrt(dx*dx + dy*dy);

  // moves towards the goalPoint
  this.velocity.x = (dx/distance)*this.speed;
  this.velocity.y = (dy/distance)*this.speed;

  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;
};

        //////////////////////
        // Helper Functions //
        //////////////////////


Enemy.prototype.findSafeRunPoint = function(context, actors, numAngles){
  var furthestRunPoint = this.findPoint(1,1);
  var longestTime = 0;
  if(numAngles === undefined)
    numAngles = 8;
  // a for loop determines angle we are testing
  for (var a=numAngles;a>=1;a--){
    //alpha is an angle in radians
    var alpha = ((2*Math.PI)/numAngles)*a;
    // t = time
    for (var t=1; t<=20; t++){
      if(this.isDangerous(alpha, t, actors)){
        break;
      } else {
        if(t > longestTime){
          longestTime = t;
          furthestRunPoint = this.findPoint(alpha, t);
        }
      }
      if(t===20){
        return this.findPoint(alpha, t);
      }
    }
  }
  // if(isEqual(furthestRunPoint,this.findPoint(2*Math.PI,1))){
  if(furthestRunPoint.x<0 ||
     furthestRunPoint.y<0 ||
     furthestRunPoint.x > 1200 ||
     furthestRunPoint.y > 700){
       return {x:350,y:350};
     }
  return furthestRunPoint;
};

  //finds a point based on a direction angle and a given time

Enemy.prototype.findPoint = function(alpha, time){
  // console.log('alpha', alpha);
  // console.log('cos', Math.cos(alpha));
  var myVelocity = {x: this.speed*time*Math.cos(alpha),
                    y: this.speed*time*Math.sin(alpha)};
  // console.log('velocity', myVelocity);
  return {x: this.position.x + myVelocity.x*time,
          y: this.position.y + myVelocity.y*time,
          // alpha: alpha,
          // time: time
        };
};


// returns true if the direction is dangerous
// returns false if it is safe
Enemy.prototype.isDangerous = function(alpha, time, actors, dangerRadius){
  if(dangerRadius===undefined){
    dangerRadius = 100;
  }
  var myProjectedPosition = this.findPoint(alpha, time);
  // if I would be moving off the map consider it dangerous
  if(
      0 > myProjectedPosition.x ||
      myProjectedPosition.x > 1200 ||
      0 > myProjectedPosition.y ||
      myProjectedPosition.y > 700){
    return true;
  }
  //find their position at time and see if its is 'dangerously' close
  for (var i=0; i<actors.length; i++){
    if(actors[i]===this){
      continue;
    }
    var projectedActorPosition = {x: actors[i].position.x + actors[i].velocity.x*time,
                                  y: actors[i].position.y + actors[i].velocity.y*time};
    if(this.distance(myProjectedPosition,projectedActorPosition)<dangerRadius){
      return true;
    }
  }
  return false;
}

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
    var distance = this.distance(this.position,bodyArray[i].position);
    if(distance<closestDistance){
      closestBody = bodyArray[i];
      closestDistance = distance;
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
Enemy.prototype.setGoalPointToBody = function(body){
  this.setGoalPointToPoint(body.position);
};

//sets this.direction based on the given point
Enemy.prototype.setGoalPointToPoint = function(point){
  this.goalPoint.x = point.x;
  this.goalPoint.y = point.y;
};

// module.exports = Enemy;


    ///////////////////
    // Iteration 2.5 //
    ///////////////////

//checks if your goalPoint will cross any other actor's path
// Enemy.prototype.isDangerous = function(goalPoint, actors){
//   for(var i=0; i<actors.length;i++){
//     if(!this.willIntersectWith(goalPoint,actors[i]))
//       return false;
//   }
// };

//find safe direction
// Enemy.prototype.findSafeRunPoint = function(actors){
//   runPoints = shuffle(runPoints);
//   for (var i=0;i<runPoints.length;i++){
//     if(!this.isDangerous(runPoints[i],actors)){
//       return runPoints[i];
//     }
//   }
// };

//returns true if your goalPoint will interesect with the other body
// Enemy.prototype.willIntersectWith = function(goalPoint, body){
//   var denomP1 = (body.position.y-body.goalPoint.y)*(this.position.x-goalPoint.x);
//   var denomP2 = (body.position.x-body.goalPoint.x)*(this.position.y-goalPoint.y);
//   var denom = denomP1 - denomP2;
//   return denom!==0;
// };

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
