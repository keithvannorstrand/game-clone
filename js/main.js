$(document).on('ready',function(){
  var game = new Game();
  // var player = new Player(game.width,game.height);
  // game.addActor(player);
  game.drawCanvas();

  // $('canvas').on('mousemove',function(e){
  //   player.setCursorLocation(e);
  // });

  $(document).on('keypress',function(e){
    e.preventDefault();
    if(e.keyCode===32){
      game.pause();
    }
  });
});
