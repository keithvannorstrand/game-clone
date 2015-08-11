

$(document).on('ready',function(){
  var game = new Game();
  var player = new Player(game.width,game.height);
  game.addBody(player);
  var foodInterval = window.setInterval(function(){game.addBody(new Food(game.width,game.height));},500);
  game.drawCanvas();
  $('body').on('mousemove',function(e){
    player.setCursorLocation(e);
  });
});


var Game = function(){
  var canvas = document.getElementById('game');
  var context = canvas.getContext('2d');
  this.width = canvas.width = 1200;
  this.height = canvas.height = 700;
  this.context = context;
  this.bodies = [];
  this.init();
};

Game.prototype.init = function(){
  for(var i=0;i<4;i++){
    this.addBody(new Enemy(this.width,this.height));
  }
  for(var j=0;j<15;j++){
    this.addBody(new Food(this.width,this.height));
  }
};

Game.prototype.addBody = function(body){
  this.bodies.push(body);
};

Game.prototype.drawCanvas = function(){
  var self = this;
  function frame(){
    //clears the canvas to then be redrawn
    self.context.clearRect(0, 0, self.width, self.height);
    //creates border
    self.context.strokeRect(0,0,self.width,self.height);
    //calls the update function of every body in the canvas
    self.updateAll();
    //tests for collisions across the canvas
    self.allCollisions();
    requestAnimationFrame(frame);
  }
  frame();
};

Game.prototype.allCollisions = function(){
  //reference variables
  var numBodies = this.bodies.length;
  var body = this.bodies;
  for (var j=0;j<numBodies;j++){
    for (var k=j+1;k<numBodies;k++){
      if(this.collision(body[j],body[k])){
        // if there is a collision remove the smaller body
        if(body[j].radius>body[k].radius){
          //if the winner is an enemy or player then make it grow
          if(body[j] instanceof Player || body[j] instanceof Enemy){
            body[j].grow(body[k]);
          }
          body.splice(k,1);
          k--;
        } else {
          if(body[k] instanceof Player || body[k] instanceof Enemy){
            body[k].grow(body[j]);
          }
          body.splice(j,1);
          if(j!==0)
            j--;
        }
        //update variables to ensure we aren't skipping any bodies
        numBodies = body.length;
      }
    }
  }
};

// calls update function on all
Game.prototype.updateAll = function(){
  for (var i=0;i<this.bodies.length;i++){
      this.bodies[i].update(this.context);
    }
};

// tests for collision between 2 circles
Game.prototype.collision = function(body1, body2){
  //this if statement 'should' never be triggered but it is there for a failsafe
  if(body1===body2)
    return false;
  //finds distance between circles using pythagorian theorum
  var distanceX = body1.positionX - body2.positionX;
  var distanceY = body1.positionY - body2.positionY;
  var squareDistance = distanceX*distanceX+distanceY*distanceY;
  return squareDistance <= (body1.radius+body2.radius)*(body1.radius+body2.radius);
};


// helper functions
// creates the circle on the canvas for a given body
function circle(body,context){
  context.beginPath();
  context.fillStyle=body.color;
  context.arc(body.positionX,body.positionY,body.radius,0,6.28);
  context.fill();
}

var colors = ['red','blue','green','orange','purple','yellow'];
function randomColor(){
  return colors[Math.floor(Math.random()*colors.length)];
}