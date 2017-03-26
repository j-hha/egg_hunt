
$(function() {
  // *** Hello jQuery ***

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
        fox.isHidden = true;
      } else {
        fox.isHidden = false;
      }
    }
  };

  // object holding functions that update elements in the view
  var viewUpdates = {
    // updates status bar to reflect current health points
    updateHealth: function() {
      var currentHealth = fox.getPoints();
      for (var i = currentHealth; i>=1; i--) {
        domElements.$health.append($('<span>').html('&#x2764;'));
      }
    },
    // updates status bar to reflect current # of eggs in barn
    updateEggs: function() {
      for (var i = farmer.getPoints(); i>=1; i--) {
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
      domElements.$gameBoard.css('right', movementFunctionality.pos + '%');
      // updates position of fox in css using value update from moveForward function
      domElements.$fox.css('left', fox.getPos() + '%');

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

// *** Goodbye jQuery ***
});
// *** Hello Vanilla JavaScript ***

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
    var pos = 0;

    // public method returns current # of points
    self.getPos = function() {
      return pos;
    };
    // public method reduces # of points when called
    self.updatePos = function() {
      pos += .4;
    };

    // tracks if fox is hidden (true) or not (false)
    self.isHidden = false;
    // tracks if fox is in a danger zone (true) or not (false)
    self.inDangerZone = false;
  },

  // the farmer
  farmer: function(typeOfPlayer) {
    // inhertis from basicPlayer
    Player.basicPlayer.call(this);

    // sets var self equal to this
    var self = this,
        // private property stores info if farmer is played by human player or computer
        player = typeOfPlayer,
        // private property tracks if farmer can be awoken (true) or not (false)
        canBeWokenUp = true;
    self.throwShoe = function() {
      if (canBeWokenUp) {
        // random number representing shoe throw accuracy
        var accuracyOfThrow = Math.round(Math.random() * (10-1) + 1),
            chance;
        // chances of scaring fox off
        if (fox.isHidden) {
          // if fox is hidden, chance to scare off is zero
          chance = 0;
        } else if (fox.inDangerZone) {
          // if fox is in a danger zone, chance to scare off is 90%
          chance = 9;
        } else {
          // in all other cases, chance to scare off is 50%
          chance = 5;
        }
        // compares farmers shot to chance current chance to hit and logs result
         if (accuracyOfThrow <= chance) {
           console.log('HIT ' + accuracyOfThrow + ' hidden: ' + fox.isHidden + ' danger: ' + fox.inDangerZone);
           fox.updatePoints();
         } else {
           console.log('MISS ' + accuracyOfThrow + ' hidden: ' + fox.isHidden + ' danger: ' + fox.inDangerZone);
         }
      } else {
        console.log('Sorry! Farmer is fast asleep!');
      }
    };

    self.wakeFarmerUp = function() {
      if (player === 'human') {
        // if human player:
        // farmer can be awakened every 10 sec (true)
        // user has two seconds to hit key to throw shoe
        // farmer goes back to sleep (false)
        if (canBeWokenUp) {
          self.throwShoe();
          canBeWokenUp = false;
          setTimeout(function() {canBeWokenUp=true;}, 10000);
        }
      } else {
        // if player === computer: farmer awaken every 10 secs and throws show automatically
        var automatic = setInterval(self.throwShoe, 10000);
      }
    };
  }
}

// object stores variables and methods necessary for fox's movement
var movementFunctionality = {
  // initializes position of background with 0
  pos: 0,
  // method updates pos for background and fox
  moveForward: function() {
    // background pos is increased by ten
    this.pos += 1;
    // fox's pos is increased by eleven
    console.log(fox.getPos());
    fox.updatePos();
    console.log(fox.getPos());
  }
};

// game object holds variables and methods essential to the game flow
var game = {
  // current turn #
  numOfTurn: 1,
  // method checks if farmer has managed to scare fox off
};

// TESTING: MOVE TO START GAME FUNC EVENTUALLY!
var fox = new Player.fox();
var farmer = new Player.farmer();
