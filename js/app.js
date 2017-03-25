
$(function() {
  // object stores DOM elements
  var domElements = {
    // the game board section
    $gameBoard: $('#game-board'),
    // the fox img
    $fox: $('#fox')
  };

  // object stores event handlers
  var eventHandlers = {
    // function moves background behind fox from right to left when right arrow is pressed --> fox moves in opposite direction in order to ensure that fox always remains visible --> gives impression that fox moves forward
    moveFox: function() {
          console.log('eventHandlers.moveFox is being called');
      // binds event to right arrow key
      if (event.which == 38) {
        event.preventDefault();
      }
      // calls function that increases position
      movementFunctionality.moveForward();
      // updates position of background in css using value update from moveForward function
      domElements.$gameBoard.css('right', pos + 'px');
      // updates position of fox in css using value update from moveForward function
      domElements.$fox.css('left', posFox + 'px');
    }
  };

  //eventListeners
  $(document).keydown(eventHandlers.moveFox);
});

// global variables
// initializes position for move functionality
var pos = 0,
    posFox = 20;

// movement functions
var movementFunctionality = {
  // function increases global position variable by 10
  moveForward: function() {
    pos += 10;
    posFox += 11;
  }
}
