$(document).on('ready',function(){
  var game = new Game();
  // var player = new Player(game.width,game.height);
  // game.addActor(player);
    var foodInterval = window.setInterval(function(){game.addFood(new Food(game.width,game.height));},500);
  game.drawCanvas();
  // $('body').on('mousemove',function(e){
  //   player.setCursorLocation(e);
  // });
});