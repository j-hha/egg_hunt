
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
        game.fox.isHidden = true;
      } else {
        game.fox.isHidden = false;
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
      if (loser === game.fox) {
        element = domElements.$health;
        symbol = '&#x2764;'
      } else if (loser === game.farmer) {
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
      domElements.$message.css('left', game.fox.getPos() + 10 + '%');
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
      domElements.$shoe.css('left', game.fox.getPos() + 47 + '%');
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
          {left: game.fox.getPos() + '%',
          top: 14 + 'em'},
          {duration: 1500});
          // foxes message is removed after animation as ended
          setTimeout(viewUpdates.removeMessage, 2000);
      } else { /* if farmer missed ... */
        // calls displayMessage method with fox' message that farmer has missed as parameter
        viewUpdates.displayMessage('Ha! Not even close!');
        // moves boot to top of screen above fox
        domElements.$shoe.animate(
          {left: game.fox.getPos() + '%',
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
      domElements.$fox.css('left', game.fox.getPos() + '%');
      domElements.$moon.css('left', game.fox.getPos() + '%');
    },
    // method adds visible effect indicating that fox is hidden is set to true
    camouflageFox: function() {
      //puts an opacity on fox img when fox is hiding in a bush
      if (game.fox.isHidden) {
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
      game.fox.resetPos();
      movementFunctionality.pos = 0;
      viewUpdates.foxAnimation();
      // event listener for moving fox is reattached
      $(document).on('keydown', eventHandlers.moveFox);
      // farmer is set back to active
      game.farmer.wakeUp();
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
      } else { /* the case tie is very unlikely given my game logic ... */
        domElements.$gameEnd.text('A tie?? How did that happen?! You should not be seeing this!');
      }
    },
    // handles updating and resetting for each new round, takes parameter of round loser
    handleRoundUpdates: function(roundLoser) {
      // decreases round losers points
      roundLoser.updatePoints();
      // updates status bar to reflect lost points
      viewUpdates.updateStatusBar(roundLoser);
      // stops farmer shoe throwing function
      clearInterval(game.farmer.automatic);
      // checks if game should continue (points > 0) or if one of the players has lost all points (=== 0)
      // stores return value (boolean) from checkStatus method in game over variable
      var gameOver = game.checkStatus();
      // if game over variable is set to true
      if (gameOver) {
        // points of fox and farmer are compared and the win or lose message method is called with the winner as a parameter
        foxPoints = game.fox.getPoints(),
        farmerPoints = game.farmer.getPoints();
        if (foxPoints > farmerPoints) {
          viewUpdates.displayGameEndMessage('fox');
        } else if (farmerPoints > foxPoints) {
          viewUpdates.displayGameEndMessage('farmer');
        }
      } else /* if game over is false, points and round number are updated and the player gets to play a new round*/ {
        game.updateNumOfTurn();
        viewUpdates.updateTurn();
        viewUpdates.resetViewForNewTurn();
      }
    },
    // method checks if fox has reached the hen house
    evaluateEggHunt:  function() {
      // variables hold current position of hen house and fox
      var whereIsHenHouse = gameLogic.getCurrentPos(domElements.$henHouse);
      var whereIsFox = gameLogic.getCurrentPos(domElements.$fox);
      // conditional compares positions and if fox is within 200px of henhouse ...
      if (whereIsFox.left >= whereIsHenHouse.left-200) {
        // the event listener for moving fox is removed (--> signalling user, fox has won round)
        $(document).off('keydown', eventHandlers.moveFox);
        // message is displayed signalling that fox has won round
        viewUpdates.displayMessage('DINNER TIME!');
        // message is removed again after 2 seconds
        setTimeout(viewUpdates.removeMessage, 2000);
        // game is reset for new round after 2 seconds
        setTimeout(function(){viewUpdates.handleRoundUpdates(game.farmer);}, 2000);      }
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
      // calls method that increases position
      movementFunctionality.moveForward();
      // calls method that updates view accordingly
      viewUpdates.foxAnimation();
      // method compares coordinates to determin if fox is currently hidden
      gameLogic.compareCoordinates();
      // method puts opacity on fox if isHidden is true and removes it if it is false
      viewUpdates.camouflageFox();
      // method checks if fox has reached hen house
      viewUpdates.evaluateEggHunt();
    },
    //method starts the game
    startGame: function() {
      // fox object is generated
      game.fox = new Player.fox();
      // gets user input to determin if user wants to play against computer or a friend
      var userInput = $('input[type=radio][name=player]:checked').val();
      console.log(userInput);
      // conditional determins if farmer is played by computer or human based on user input
        if (userInput === 'human') {
          // CREATE EVENT LISTENER AND HANDLER
          game.farmer = new Player.farmer(userInput);
          console.log(game.farmer);
        } else {
          game.farmer = new Player.farmer();
          // method for farmer throwing shoes is called
          game.farmer.wakeUp();
        }
        // creates an event listener for moving the fox on key down
        $(document).on('keydown', eventHandlers.moveFox);
        // status bar is being set to initial values for points and round #
        viewUpdates.updateStatusBar(game.fox);
        viewUpdates.updateStatusBar(game.farmer);
        viewUpdates.updateTurn();
        // bushes are generated
        viewUpdates.generateSafeZones();
        // text of button is changed from start to reset
        $(this).text('reset');
        // start game event listener is removed to button
        $(this).off('click', eventHandlers.startGame);
        // reset game event listener is attached to button
        $(this).on('click', eventHandlers.resetAll);
    },
    // method resets entire game to initial state
    resetAll: function() {
      // method that lets farmer throw shoes is stopped
      clearInterval(game.farmer.automatic);
      // points and round # are reset to initial values
      game.farmer.resetPoints();
      game.fox.resetPoints();
      viewUpdates.updateStatusBar(game.fox);
      viewUpdates.updateStatusBar(game.farmer);
      game.numOfTurn = 1;
      viewUpdates.updateTurn();
      // fox is set back to initial position
      viewUpdates.resetViewForNewTurn();
      // win / lose message is removed (in case user hits reset after winning or losing the game)
      domElements.$gameEnd.remove();
    }
  };

  // initial event listener for the start button, starts game if button is pressed
  domElements.$start.on('click', eventHandlers.startGame);


  // attaches jquery functions that need to be available in vanilla JS part too to the window object to make them gobally available
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
    // public method resets current # of points
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
    // declares public property called automatic to be used later for clearing interval of method that makes farmer throw shoe
    self.automatic;
    // method with logic for throwing boot
    self.throwShoe = function() {
      // action only happens if privat key canBeWokenUp is set to true
      if (canBeWokenUp) {
        // random number representing shoe throw accuracy
        var accuracyOfThrow = Math.round(Math.random() * (10-1) + 1),
            chance;
        // chances of scaring fox off
        if (game.fox.isHidden) {
          // if fox is hidden, chance to scare off is zero
          chance = 0;
        } else if (game.fox.inDangerZone) {
          // if fox is in a danger zone, chance to scare off is 90%
          chance = 9;
        } else {
          // in all other cases, chance to scare off is 50%
          chance = 5;
        }
        // compares farmers shot to chance current chance to hit, logs result and runs respective animation
         if (accuracyOfThrow <= chance) {
           console.log('HIT ' + accuracyOfThrow + ' hidden: ' + game.fox.isHidden + ' , danger: ' + game.fox.inDangerZone);
           window.app.animateShoeThrow('success');
           setTimeout(function(){window.app.handleRoundUpdates(game.fox)}, 2000);
         } else {
           console.log('MISS ' + accuracyOfThrow + ' hidden: ' + game.fox.isHidden + ' , danger: ' + game.fox.inDangerZone);
           window.app.animateShoeThrow();
         }
      }
    };
    // method handles boot throwing based on boolean value of canBeWokenUp
    self.wakeUp = function() {
      // if human player:
      if (player === 'human') {
        // farmer can be awakened every 12 sec (true)
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
        // if player === computer: farmer awaken every 12 secs and throws show automatically
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
    game.fox.updatePos();
  }
};

// game object holds variables and methods essential to the game flow
var game = {
  // initializes keys for farmer and fox objects, will be filled with correct object when start button is being pressed
  fox: {},
  farmer: {},
  // current turn #
  numOfTurn: 1,
  // method updates # of turn
  updateNumOfTurn: function() {
    this.numOfTurn++;
  },
  // method checks if one of the players has won
  checkStatus: function() {
    // compares fox's points and farmer's points
    var foxPoints = game.fox.getPoints(),
        farmerPoints = game.farmer.getPoints();
        // if one or the other player has lost all points, method returns true and win/lose message will be displayed (handled in jQuery part)
        if(foxPoints === 0 || farmerPoints === 0) {
          return true;
        }
        else {
          // if points > 0, method returns false and game can continue
          return false;
        }
  }
};
