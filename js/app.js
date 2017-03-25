
$(function() {
  // object stores DOM elements
  var domElements = {
    // the game board section
    $gameBoard: $('#game-board'),
    // the fox img
    $fox: $('#fox'),
    $health: $('#health'),
    $turn: $('#turn'),
    $eggs: $('#eggs')
  };

  // object holding functions relevant to the game logic
  var gameLogic = {
          // function gets the current position of the element that is passed in as a parameter
    getCurrentPos: function(element) {
      return element.offset();
    }
  };

  // object holding functions that update elements in the view
  var viewUpdates = {
    // updates status bar to reflect current health points
    updateHealth: function() {
      for (var i = healthPoints; i>=1; i--) {
        domElements.$health.append($('<span>').html('&#x2764;'));
      }
    },
    // updates status bar to reflect current # of eggs in barn
    updateEggs: function() {
      for (var i = numOfEggs; i>=1; i--) {
        domElements.$eggs.append($('<span>').html('&#x2b2e;'));
      }
    },
    // updates status bar to reflect current turn #
    updateTurn: function() {
      domElements.$turn.append($('<span>').html('night ' + numOfTurn));
    }
  };

  // object stores event handlers
  var eventHandlers = {
    // function moves background behind fox from right to left when right arrow is pressed --> fox moves in opposite direction in order to ensure that fox always remains visible --> gives impression that fox moves forward
    moveFox: function() {
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
      // currently just for testing: logs current position of fox
      console.log(gameLogic.getCurrentPos(domElements.$fox));
    }
  };

  //eventListeners
  $(document).keydown(eventHandlers.moveFox);

  // eventually move into start game func
  viewUpdates.updateHealth();
  viewUpdates.updateEggs();
  viewUpdates.updateTurn();


});

// global variables
// initializes position for move functionality
var pos = 0,
    posFox = 20,
    healthPoints = 10,
    numOfEggs = 10,
    numOfTurn = 1;

// movement functions
var movementFunctionality = {
  // function increases global position variable by 10
  moveForward: function() {
    pos += 10;
    posFox += 11;
  }
};
