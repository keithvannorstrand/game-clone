
var Game = function(){
  var canvas = document.getElementById('game');
  this.width = canvas.width = 1200;
  this.height = canvas.height = 700;
  this.context = canvas.getContext('2d');
  this.actors = [];
  this.food = [];
  this.animationFrame;
  this.foodInterval;
  this.frameInterval;
  this.paused = false;
  this.init();
};

Game.prototype.init = function(){
  // initializes the game
  // this.addActor(new Enemy(this.width,this.height,20));
  for(var i=0;i<6;i++){
    this.addActor(new Enemy(this.width,this.height));
  }

  for(var j=0;j<30;j++){
    this.addFood(new Food(this.width,this.height));
  }

  var self = this;
  this.foodInterval = window.setInterval(function(){self.addFood(new Food(self.width,self.height));},500);
};

Game.prototype.addActor = function(body){
  this.actors.push(body);
  // var moveInterval = window.setInterval(this.move)
};


Game.prototype.addFood = function(food){
  this.food.push(food);
};


Game.prototype.drawCanvas = function(){
  var self = this;
  function frame(){
    // self.checkWinner();
    //clears the canvas to then be redrawn
    self.context.clearRect(0, 0, self.width, self.height);
    //creates border
    self.context.strokeRect(0,0,self.width,self.height);
    //calls the update function of every body in the canvas
    self.updateAll();
    //tests for collisions across the canvas
    self.allCollisions();
    self.animationFrame = requestAnimationFrame(frame);
    // self.frameInterval = window.setInterval(frame, 1000);
  }
  frame();
};

// Game.prototype.checkWinner = function(){
//   if(this.actors.length===1){
//     this.endLevel();
//     // display
//   }
// }
//
// Game.prototype.endLevel = function(){
//   window.cancelAnimationFrame(this.animationFrame);
// }


// pause and unpause
Game.prototype.pause = function(){
  if(this.paused){
    // if the game is paused restart food interval and animationFrame
    var self = this;
    this.drawCanvas();
    this.foodInterval = window.setInterval(function(){self.addFood(new Food(self.width,self.height));},500);
    this.paused = false;
  } else {
    // to pause cancel animationFrame and remove the foodInterval
    window.cancelAnimationFrame(this.animationFrame);
    clearInterval(this.foodInterval);
    this.paused = true;
  }
}

// calls update function on all
Game.prototype.updateAll = function(){
  // call each actor's update function
  for(var i=0; i<this.actors.length; i++){
    this.actors[i].update(this.context, this.food, this.actors);
  }
  //call each food's update function
  this.food.forEach(function(food){
    food.update(this.context);
  },this);
};

Game.prototype.allCollisions = function(){
  //if non of the actors collide with eachother check if they collide with the food
  //potentially stops anyone from eating food if there are 2 actors colliding who are similar size
  if(!this.actorCollisions()){
    this.foodCollisions();
  }

};

//checks if any actors are colliding with eachother
Game.prototype.actorCollisions = function(){
  for(var i=0;i<this.actors.length-1;i++){
    for(var j=i+1;j<this.actors.length;j++){
      if(this.collision(this.actors[i],this.actors[j])){
        // test if one of the actors' radius is 10% larger
        // then make the larger actor grow and remove the smaller
        if(this.actors[i].radius > this.actors[j].radius){
          this.actors[i].grow(this.actors[j]);
          this.actors.splice(j,1);
          return true;
        } else if(this.actors[j].radius > this.actors[i].radius){
          this.actors[j].grow(this.actors[i]);
          this.actors.splice(i,1);
          return true;
        }
      }
    }
  }
  return false;
};

//checks if any actor is colliding food and makes the actor eat the food
Game.prototype.foodCollisions = function(){
  for(var i=0;i<this.actors.length;i++){
    for(var j=0;j<this.food.length;j++){
      if(this.collision(this.actors[i],this.food[j])){
        if(this.actors[i].radius>this.food[j].radius){
          this.actors[i].grow(this.food[j]);
          this.food.splice(j,1);
          return true;
        }
      }
    }
  }
  return false;
};



// tests for collision between 2 circles
Game.prototype.collision = function(body1, body2){
  //this if statement 'should' never be triggered but it is there for a failsafe
  if(body1===body2)
    return false;
  //finds distance between circles using pythagorian theorum
  var distanceX = body1.position.x - body2.position.x;
  var distanceY = body1.position.y - body2.position.y;
  var squareDistance = distanceX*distanceX+distanceY*distanceY;
  return squareDistance <= (body1.radius+body2.radius)*(body1.radius+body2.radius);
};




        /////////////////
        // Iteration 1 //
        /////////////////

// Game.prototype.allCollisions = function(){
//   //reference variables
//   var numActors = this.actors.length;
//   var body = this.actors;

//   for (var j=0;j<numActors;j++){
//     for (var k=j+1;k<numFood;k++){
//       if(this.collision(body[j],body[k])){
//         // if there is a collision remove the smaller body
//         if(body[j].radius>body[k].radius){
//           //if the winner is an enemy or player then make it grow
//           if(body[j] instanceof Player || body[j] instanceof Enemy){
//             body[j].grow(body[k]);
//           }
//           body.splice(k,1);
//           return;
//         } else {
//           if(body[k] instanceof Player || body[k] instanceof Enemy){
//             body[k].grow(body[j]);
//           }
//           body.splice(j,1);
//           return;
//         }
//         //update variables to ensure we aren't skipping any actors
//         numActors = body.length;
//       }
//     }
//   }
// };
