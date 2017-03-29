
$(function() {
  // *** Hello jQuery ***

  // object stores DOM elements
  var domElements = {
    // the game board section
    $gameBoard: $('#game-board'),
    // the fox img
    $fox: $('#fox'),
    // fox's health points in status bar
    $health: $('#health'),
    // current num of turn in status bar
    $turn: $('#turn'),
    // remaining eggs in status bar
    $eggs: $('#eggs'),
    // moon div
    $moon: $('#moon'),
    // start button
    $start: $('#start'),
    // boot img
    $shoe: $('#shoe'),
    // hen house img
    $henHouse: $('#hen-house'),
    // article below game board containing instructions and game options
    $article: $('article'),
    // main section of the page (game board and status bar)
    $main: $('main'),
    // creates a div to hold Fiona fox's comments (pops up if boot is thrown or if hen house reached)
    $message: $('<div>').attr('id', 'message'),
    // win / lose message, pops up at end of game
    $gameEnd: $('<div>').attr('id', 'gameEnd'),
  };

  // object holding functions relevant to the game logic
  var gameLogic = {
    // function gets the current position of the element that is passed in as a parameter
    getCurrentPos: function(element) {
      // returns object with current coordinates for left and top of element
      return element.offset();
    },
    // initializes the key currentIndexOfBush and sets it to zero --> needed for compare method below
    currentIndexOfBush: 0,
    // function compares coordinates of fox and nearest hiding spot
    compareCoordinates: function() {
      // first element of the bush class array is stored in nearestBush variable
      var $nearestBush = $('.bush').eq(this.currentIndexOfBush),
          // objects with left and top coordinates of fox and bush elements stored in variables
          coordinateFox = this.getCurrentPos(domElements.$fox),
          coordinateBush = this.getCurrentPos($nearestBush);
      // compares current left position of fox to left position of nearest bush and increases the current index that is used to grab an element from the bush class array by one - UNLESS it is the last item in the bush array
      // --> as soon as fox has passed the nearest bush, the next bush is set to $nearestBush
      if (coordinateFox.left > coordinateBush.left + 5
        && this.currentIndexOfBush < ($('.bush').length - 1)){
          this.currentIndexOfBush++
            console.log('fox left current hiding spot, next bush (element at index ' + this.currentIndexOfBush + ') is now being defined the nearest bush');
      }

      // compares current left position of fox to left position of nearest bush and if fox is within 100px +/- of hiding spot, fox is considered hidden (true)
      if (coordinateFox.left >= coordinateBush.left - 100 && coordinateFox.left <= coordinateBush.left + 100) {
        console.log('fox is HIDDEN');
        fox.isHidden = true;
      } else {
        fox.isHidden = false;
        console.log('fox is NOT hidden');
      }
    },
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
      // clears html
      domElements.$turn.html('');
      // appends current num of round
      domElements.$turn.append($('<span>').html('night ' + game.numOfTurn));
    },
    // generates 5 bushes for fox to hide in
    generateSafeZones: function() {
      // iterates 5 times
      for (var i = 1; i <= 5; i++) {
        //creates a new div with the class name bush each time
        $newBush = $('<div>').addClass('bush');
        //appends div to game board
        domElements.$gameBoard.append($newBush);
      }
      // stores array of all elements with class name bush in variable $bush
      var $bush = $('.bush'),
      // initializes variable left with 0
          left = 0;
      // iterates over $bush array
      for (var i = 0; i < $bush.length; i++) {
        // sets left to 33
        left += 33;
        // positions bushes within 33% of each other
        $bush.eq(i).css('left', left + '%');
      }
    },
    // method handles displaying foxes comments on hits/misses when farmer throws shoe and when fox has reached hen house, takes the respective message as a parameter
    displayMessage: function(content) {
      // fills previously created message div with text from parameter
      domElements.$message.text(content);
      // places message div 10% left of fox's current position
      domElements.$message.css('left', fox.getPos() + 10 + '%');
      // appends message to game board
      domElements.$gameBoard.append(domElements.$message);
    },
    // removes fox's comment from board again
    removeMessage: function() {
      domElements.$message.remove();
    },
    // animation of farmer throwing a boot, takes a parameter to determin if farmer has hit or missed fox
    animateShoeThrow: function(success) {
      // puts boot img 47% left of fox's current position
      domElements.$shoe.css('left', fox.getPos() + 47 + '%');
      // makes image visible
      domElements.$shoe.show();
      // conditional: determins what will happen if fox is hit
      if (success === 'success') {
        // removes event listener for moving --> signals to user that round has ended, if game can continue, event listener will be reattched once reset for new round has happend
        $(document).off('keydown', eventHandlers.moveFox);
        // calls displayMessage method with fox' retreat message as parameter
        viewUpdates.displayMessage('Oh oh! I better retreat!');
        // moves boot to foxes current position
        domElements.$shoe.animate(
          {left: fox.getPos() + '%',
          top: 14 + 'em'},
          {duration: 1500});
          // foxes message is removed after animation as ended
          setTimeout(viewUpdates.removeMessage, 2000);
      } else { /* if farmer missed ... */
        // calls displayMessage method with fox' message that farmer has missed as parameter
        viewUpdates.displayMessage('Ha! Not even close!');
        // moves boot to top of screen above fox
        domElements.$shoe.animate(
          {left: fox.getPos() + '%',
          top: 0},
          {duration: 1500});
          // foxes message is removed after animation as ended
          setTimeout(viewUpdates.removeMessage, 2000);
      }
      //boot img is then set to display:none again
      domElements.$shoe.hide('slow');
    },
    // animates fox's movement
    foxAnimation: function() {
      // updates position of background in css using value update from moveForward function
      domElements.$gameBoard.css('right', movementFunctionality.pos + '%');
      // updates position of fox in css using value update from moveForward function
      domElements.$fox.css('left', fox.getPos() + '%');
      domElements.$moon.css('left', fox.getPos() + '%');
    },
    // method adds visible effect indicating that fox.isHidden is set to true
    camouflageFox: function() {
      //puts an opacity on fox img when fox is hiding in a bush
      if (fox.isHidden) {
        domElements.$fox.css('opacity', '.3');
      } else /* removes opacity from fox img when fox has left hiding spot */ {
        domElements.$fox.css('opacity', '1');
      }
    },
    // method resets game state for new turn but NOT the points
    resetViewForNewTurn: function() {
      // nearest bush is set back to bush at index 0
      gameLogic.currentIndexOfBush = 0;
      // fox and background are set back to starting positions
      fox.resetPos();
      movementFunctionality.pos = 0;
      viewUpdates.foxAnimation();
      // event listener for moving fox is reattached
      $(document).on('keydown', eventHandlers.moveFox);
      // farmer is set back to active
      farmer.wakeUp();
    },
    // method displays final win/lose message when called, takes parameter winner to make sure correct message gets displayed
    displayGameEndMessage: function(winner) {
      //appends message div to the main section on the page
      domElements.$main.append(domElements.$gameEnd);
      // conditional handles which message to display based on winner parameter
      if (winner === 'fox') {
        domElements.$gameEnd.text('Wooohooo! Fiona managed to get all the eggs. The little fox won this time!');
      } else if (winner === 'farmer') {
        domElements.$gameEnd.text('Farmer Firmus has succeeded! Fiona will look for dinner elsewhere.');
      } else { /* technically, the case tie shouldn't exist given my game logic ... */
        domElements.$gameEnd.text('A tie?? How did that happen?! You should not be seeing this!');
      }
    },
    handleRoundUpdates: function(roundLoser) {
      roundLoser.updatePoints();
      viewUpdates.updateStatusBar(roundLoser);
      clearInterval(farmer.automatic);
      var gameOver = game.checkStatus();
      if (gameOver) {
        foxPoints = fox.getPoints(),
        farmerPoints = farmer.getPoints();
        if (foxPoints > farmerPoints) {
          viewUpdates.displayGameEndMessage('fox');
        } else if (farmerPoints > foxPoints) {
          viewUpdates.displayGameEndMessage('farmer');
        }
      } else {
        game.updateNumOfTurn();
        viewUpdates.updateTurn();
        viewUpdates.resetViewForNewTurn();
      }
    },
    evaluateEggHunt:  function() {
      var whereIsHenHouse = gameLogic.getCurrentPos(domElements.$henHouse);
      var whereIsFox = gameLogic.getCurrentPos(domElements.$fox);
      if (whereIsFox.left >= whereIsHenHouse.left-200) {
        $(document).off('keydown', eventHandlers.moveFox);
        viewUpdates.displayMessage('DINNER TIME!');
        setTimeout(viewUpdates.removeMessage, 2000);
        setTimeout(function(){viewUpdates.handleRoundUpdates(farmer);}, 2000);      }
    },
//     toggleArticleText: function() {
//       $(this).
//       $article.html('');
//       if($(this).text() === 'about') {
// //
//       } else if($(this).text() === 'instructions') {
// //
//       } else if($(this).text() === 'options') {
//         //
//       }
//     },
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
      viewUpdates.evaluateEggHunt();
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
        $(document).on('keydown', eventHandlers.moveFox);
        $(this).text('reset');
        $(this).off('click', eventHandlers.startGame);
        $(this).on('click', eventHandlers.resetAll);

    },
    resetAll: function() {
      clearInterval(farmer.automatic);
      farmer.resetPoints();
      fox.resetPoints();
      viewUpdates.updateStatusBar(fox);
      viewUpdates.updateStatusBar(farmer);
      game.numOfTurn = 1;
      viewUpdates.updateTurn();
      viewUpdates.resetViewForNewTurn();
      domElements.$gameEnd.remove();
    }
  };

  //eventListeners
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
    var points = 3,
    // sets var self equal to this
        self = this;

    // public method returns current # of points
    self.getPoints = function() {
      return points;
    };

    self.resetPoints = function() {
      points = 3;
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

    self.automatic;

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
           setTimeout(function(){window.app.handleRoundUpdates(fox)}, 2000);
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
          setTimeout(function() {canBeWokenUp = true;}, 12000);
        } else {
          console.log('Sorry! Farmer is fast asleep!');
        }
      } else {
        // if player === computer: farmer awaken every 10 secs and throws show automatically
        self.automatic = setInterval(self.throwShoe, 12000);
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
  },
  checkStatus: function() {
    var foxPoints = fox.getPoints(),
        farmerPoints = farmer.getPoints();
        if(foxPoints === 0 || farmerPoints === 0) {
          return true;
        }
        else {
          return false;
        }
  }
};

// TESTING: MOVE TO START GAME FUNC EVENTUALLY!
var fox = new Player.fox();
var farmer = new Player.farmer();
