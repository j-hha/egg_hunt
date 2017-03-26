
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
        playerOne.isHidden = true;
      } else {
        playerOne.isHidden = false;
      }
    }
  };

  // object holding functions that update elements in the view
  var viewUpdates = {
    // updates status bar to reflect current health points
    updateHealth: function() {
      var currentHealth = playerOne.getPoints();
      for (var i = currentHealth; i>=1; i--) {
        domElements.$health.append($('<span>').html('&#x2764;'));
      }
    },
    // updates status bar to reflect current # of eggs in barn
    updateEggs: function() {
      for (var i = playerTwo.getPoints(); i>=1; i--) {
        domElements.$eggs.append($('<span>').html('&#x2b2e;'));
      }
    },
    // updates status bar to reflect current turn #
    updateTurn: function() {
      domElements.$turn.append($('<span>').html('night ' + game.numOfTurn));
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
      domElements.$gameBoard.css('right', movementFunctionality.pos + 'px');
      // updates position of fox in css using value update from moveForward function
      domElements.$fox.css('left', playerOne.getPos() + 'px');

      // currently just for TESTING: logs current position of fox and compares them
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

// Goodbye jQuery
});

// Hello Vanilla JavaScript

// player object
var Player = {
  basicPlayer: function() {
    // private property stores initial # health points or eggs, is inherited by fox and farmer
    var points = 10,
    // sets var self equal to this
        self = this;

    // public method returns current # of points
    self.getPoints = function() {
      return points;
    };

    // public method reduces # of points when called
    self.updatePoints = function() {
      points--;
    };
  },

  // the fox
  fox: function() {
    // inherits from basicPlayer
    Player.basicPlayer.call(this);

    // sets var self equal to this
    var self = this;

    // initial starting position on screen
    var pos = 20;

    // public method returns current # of points
    self.getPos = function() {
      return pos;
    };
    // public method reduces # of points when called
    self.updatePos = function() {
      pos += 11;
    };

    // tracks if fox is hidden (true) or not (false)
    self.isHidden = false;
    // tracks if fox is in a danger zone (true) or not (false)
    self.inDangerZone = false;
  },

  // the farmer
  farmer: function(points) {
    // inhertis from basicPlayer
    Player.basicPlayer.call(this);

    // sets var self equal to this
    var self = this;

    // tracks if farmer can be awoken (true) or not (false)
    self.rousable = false;
    // method returns random number that represents a show throw
    self.throwShoe = function() {
      return Math.random();
    };

    // method determines chances of scaring fox off
    self.chanceToScareOff = function() {
      if (fox.isHidden) {
        // if fox is hidden, chance to scare off is zero
        return 0;
      } else if (fox.inDangerZone) {
        // if fox is in a danger zone, chance to scare off is 90%
        return Math.random() * .9;
      }
      // in all other cases, chance to scare off is 50%
      return Math.random() * .5;
    }
  }
}

// object stores variables and methods necessary for fox's movement
var movementFunctionality = {
  // initializes position of background with 0
  pos: 0,
  // method updates pos for background and fox
  moveForward: function() {
    // background pos is increased by ten
    this.pos += 10;
    // fox's pos is increased by eleven
    console.log(playerOne.getPos());
    playerOne.updatePos();
    console.log(playerOne.getPos());
  }
};

// game object holds variables and methods essential to the game flow
var game = {
  // current turn #
  numOfTurn: 1,
  // method checks if farmer has managed to scare fox off
  checkStatus: function() {
    // gets random Number representing farmers shot
   var thisShot = playerTwo.throwShoe(),
   // gets chances for hit depending on current position of fox
       thisChance = playerTwo.chanceToScareOff();
  // compares farmers shot to chance current chance to hit and logs result
   if (thisShot < thisChance) {
     console.log('HIT ' + thisShot);
     playerOne.updatePoints();
   } else {
     console.log('MISS ' + thisShot);
   }
 }
};

// TESTING: MOVE TO START GAME FUNC EVENTUALLY!
var playerOne = new Player.fox();
var playerTwo = new Player.farmer();
