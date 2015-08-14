function Food(width,height){
  this.position = {x: Math.random()*width,
                   y: Math.random()*height};
  this.radius = Math.random()*2+4;
  this.color = 'black';
}

Food.prototype.update = function(context){
  circle(this,context);
};

// module.exports = Food;