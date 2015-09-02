// helper functions
// creates the circle on the canvas for a given body
function circle(body,context){
  context.beginPath();
  context.fillStyle=body.color;
  context.arc(body.position.x,body.position.y,body.radius,0,6.28);
  context.fill();
}

var colors = ['blue','green','orange','purple','yellow','brown','cadetblue','cyan','gold','greenyellow','navy','slategray','springgreen'];

function randomColor(){
  return colors[Math.floor(Math.random()*colors.length)];
}

// a psuedo deepequals between bodies
var isEqual = function(body,body2){
  if(body2===body) return true;
  if(body2===null||body2===undefined) return false;
  if(!(body2 instanceof Enemy)) return false;
  var keys = Object.keys(body2);
  for (var i=0;i<keys.length;i++){
    if(!isEqual(body[keys[i]],body2[keys[i]]))
      return false;
  }
  return true;
};

var showModal = function(message, won){
  if(won){
    $('#myModal').modal();
    $('.modal-title').text(message);
    $('#nextLevel').text('Next Level');
  } else {
    $('#myModal').modal();
    $('.modal-title').text(message);
    $('#nextLevel').text('Play Again?');
  }
};
