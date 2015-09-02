$(document).on('ready',function(){
  var game = new Game();
  game.startLevel();
  $('#nextLevel').on('click', function(e){
    console.log('click');
    game.startLevel();
  });
  $(document).on('keypress',function(e){
    e.preventDefault();
    if(e.keyCode===32){
      game.pause();
    }
  });
});
