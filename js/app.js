
$(function() {
  // object stores DOM elements
  var domElements = {
    // the game board section
    $gameBoard: $('#game-board'),
    // the fox img
    $fox: $('#fox'),
    $health: $('#health'),
    $turn: $('#turn'),
    $eggs: $('#eggs'),
    $bush: $('#bush')
  };

  // object holding functions relevant to the game logic
  var gameLogic = {
    // function gets the current position of the element that is passed in as a parameter
    getCurrentPos: function(element) {
      // returns object with current coordinates for left and top of element
      return element.offset();
    },
    // function compares coordinates of fox and hiding spot
    compareCoordinates: function() {
      // objects with left and top coordinates of fox and bush elements stored in variables
      var coordinateFox = this.getCurrentPos(domElements.$fox);
      var coordinateBush = this.getCurrentPos(domElements.$bush);
      // if fox is within 100px +/- of hiding spot, fox is considered hidden
      if (coordinateFox.left >= coordinateBush.left - 100 && coordinateFox.left <= coordinateBush.left + 100) {
        console.log('FOX IS HIDDEN');
      }
    }
  };

  // object holding functions that update elements in the view
  var viewUpdates = {
    // updates status bar to reflect current health points
    updateHealth: function() {
      for (var i = fox.points; i>=1; i--) {
        domElements.$health.append($('<span>').html('&#x2764;'));
      }
    },
    // updates status bar to reflect current # of eggs in barn
    updateEggs: function() {
      for (var i = farmer.points; i>=1; i--) {
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
      domElements.$fox.css('left', fox.pos + 'px');

      // currently just for testing: logs current position of fox and compares them
      console.log('fox');
      console.log(gameLogic.getCurrentPos(domElements.$fox));
      console.log('bush');
      console.log(gameLogic.getCurrentPos(domElements.$bush));
      gameLogic.compareCoordinates();
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
    numOfTurn = 1;

// player objects
var farmer = {
  points: 10,
  rousable: false,
  throwShoe: function() {
    // returns random number that will determine if farmer has scared fox off
    return Math.round(Math.random());
  }
}

// player objects
var fox = {
  points: 10,
  pos: 20,
  isHidden: false,
  inDangerZone: false
}

// movement functions
var movementFunctionality = {
  // function increases global position variable by 10
  moveForward: function() {
    pos += 10;
    fox.pos += 11;
  }
};

var checkStatus = function() {
  var thisShot = farmer.throwShoe();
  if (fox.isHidden) {
    //chance to scare off = 0;
  } else if (fox.inDangerZone) {
    //chance to scare off <= .9
  } else {
    //chance to scare off <= .5
  }
}
