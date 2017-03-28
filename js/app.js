
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
    $moon: $('#moon'),
    $start: $('#start'),
    $shoe: $('#shoe'),
    $henHouse: $('#hen-house')
  };

  // object holding functions relevant to the game logic
  var gameLogic = {
    // function gets the current position of the element that is passed in as a parameter
    getCurrentPos: function(element) {
      // returns object with current coordinates for left and top of element
      return element.offset();
    },
    currentIndexOfBush: 0,
    // function compares coordinates of fox and hiding spot
    compareCoordinates: function() {
      // objects with left and top coordinates of fox and bush elements stored in variables
      var $nearestBush = $('.bush').eq(this.currentIndexOfBush),
          coordinateFox = this.getCurrentPos(domElements.$fox),
          coordinateBush = this.getCurrentPos($nearestBush);

      if(coordinateFox.left > coordinateBush.left + 5
        && this.currentIndexOfBush < 5) {
        this.currentIndexOfBush++
      }

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
    // updates status bar to reflect current health points, takes player object as parameter
    updateStatusBar: function(loser) {
      // calls getPoints method on player object (fox or farmer) and saves result to currentPoints variable
      var currentPoints = loser.getPoints(),
      // declare element and symbol variable
          element,
          symbol;
      // conditional sets element and symbol variable to the correct values for either fox ($health and heart) and farmer ($eggs and ellipsis)
      if (loser === fox) {
        element = domElements.$health;
        symbol = '&#x2764;'
      } else if (loser === farmer) {
        element = domElements.$eggs;
        symbol = '&#x2b2e;'
      }
      // clears html (necessary since append will not overwrite previous content --> the following would just add more symbols each time it is called, if not cleared)
      element.html('');
      // loop appends one symbol each time it runs to the respective table cell (element), currentPoints  = number of iterations
      for (var i = currentPoints; i>=1; i--) {
        element.append($('<span>').html(symbol));
      }
    },
    // updates status bar to reflect current turn #
    updateTurn: function() {
      domElements.$turn.html('');

      domElements.$turn.append($('<span>').html('night ' + game.numOfTurn));
    },
    generateSafeZones: function() {
      for (var i = 1; i <= 5; i++) {
        $newBush = $('<div>').addClass('bush');
        domElements.$gameBoard.append($newBush);
      }
      $bush = $('.bush');
      var left = 0;
      for (var i = 0; i < $bush.length; i++) {
        left += 33;
        $bush.eq(i).css('left', left + '%');
      }
    },
    animateShoeThrow: function(success) {
      domElements.$shoe.css('left', '150%');
      domElements.$shoe.show();
      if (success === 'success') {
        domElements.$shoe.animate(
          {left: fox.getPos() + '%',
          top: 14 + 'em'},
          {duration: 2000});
      } else {
        domElements.$shoe.animate(
          {left: fox.getPos() + '%',
          top: 0},
          {duration: 2000});
      }
      domElements.$shoe.hide('slow');
    },
    foxAnimation: function() {
      // updates position of background in css using value update from moveForward function
      domElements.$gameBoard.css('right', movementFunctionality.pos + '%');
      // updates position of fox in css using value update from moveForward function
      domElements.$fox.css('left', fox.getPos() + '%');
      domElements.$moon.css('left', fox.getPos() + '%');
    },
    camouflageFox: function() {
      if (fox.isHidden) {
        domElements.$fox.css('opacity', '.3');
      } else {
        domElements.$fox.css('opacity', '1');
      }
    },
    resetViewForNewTurn: function() {
      gameLogic.currentIndexOfBush = 0;
      fox.resetPos();
      movementFunctionality.pos = 0;
      viewUpdates.foxAnimation();
    },
    handleRoundUpdates: function(roundLoser) {
      roundLoser.updatePoints();
      game.updateNumOfTurn();
      viewUpdates.updateStatusBar(roundLoser);
      viewUpdates.updateTurn();
      viewUpdates.resetViewForNewTurn();
      viewUpdates.foxAnimation();
    },
    displaySuccessMessage:  function() {
      var whereIsHenHouse = gameLogic.getCurrentPos(domElements.$henHouse);
      // BUG FIND!!!
      if (fox.getPos() >= whereIsHenHouse.left-50) {
        console.log('DINNER TIME!');
        this.handleRoundUpdates(farmer);
      }
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
      // calls function that updates view accordingly
      viewUpdates.foxAnimation();
      // currently just for TESTING: logs current position of fox and compares them
      gameLogic.compareCoordinates();
      viewUpdates.camouflageFox();
      viewUpdates.displaySuccessMessage();
    },


    //START GAME FUNCTION!
    //CAREFUL! CURRENTLY FARMER FUNCTION EXECUTES TWICE IF START IS DOUBLE-CLICKED! FIX!!!
    startGame: function() {
      ///GET PLAYER INFO
        // if (player === 'human') {
        //   // CREATE SPECIAL EVENT HANDLER
        // } else {
          farmer.wakeUp();
        // }
    }
  };

  //eventListeners
  $(document).keydown(eventHandlers.moveFox);
  domElements.$start.on('click', eventHandlers.startGame);


  // eventually move into start game func
  viewUpdates.updateStatusBar(fox);
  viewUpdates.updateStatusBar(farmer);
  viewUpdates.updateTurn();
  viewUpdates.generateSafeZones();

  // stores jquery functions that need to be available in vanilla JS part too
  window.app = {};
  window.app.handleRoundUpdates = viewUpdates.handleRoundUpdates;
  window.app.animateShoeThrow = viewUpdates.animateShoeThrow;

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
    var pos = 3;

    // public method returns current # of points
    self.getPos = function() {
      return pos;
    };
    // public method resets fox's position
    self.resetPos = function() {
      pos = 3;
    };
    // public method reduces # of points when called
    self.updatePos = function() {
      pos += .3;
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
           console.log('HIT ' + accuracyOfThrow + ' hidden: ' + fox.isHidden + ' , danger: ' + fox.inDangerZone);
           window.app.animateShoeThrow('success');
           setTimeout(function(){window.app.handleRoundUpdates(fox)}, 3000);
         } else {
           console.log('MISS ' + accuracyOfThrow + ' hidden: ' + fox.isHidden + ' , danger: ' + fox.inDangerZone);
           window.app.animateShoeThrow();
         }
      }
    };

    self.wakeUp = function() {
      if (player === 'human') {
        // if human player:
        // farmer can be awakened every 10 sec (true)
        // user has two seconds to hit key to throw shoe
        // farmer goes back to sleep (false)
        if (canBeWokenUp) {
          self.throwShoe();
          canBeWokenUp = false;
          setTimeout(function() {canBeWokenUp = true;}, 10000);
        } else {
          console.log('Sorry! Farmer is fast asleep!');
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
    this.pos += .6;
    // fox's pos is increased by eleven
    // console.log(fox.getPos());
    fox.updatePos();
    // console.log(fox.getPos());
  }
};

// game object holds variables and methods essential to the game flow
var game = {
  // current turn #
  numOfTurn: 1,
  updateNumOfTurn: function() {
    this.numOfTurn++;
  }
};

// TESTING: MOVE TO START GAME FUNC EVENTUALLY!
var fox = new Player.fox();
var farmer = new Player.farmer();
