# egg_hunt

*Short Description:*

This is a 1 - 2 player browser game built as an assignment for General Assembly's WDIR course. The user commands a hungry fox, who is trying to steal eggs from a hen house while being attacked by the farmer. In two player mode, the second player can take on the role of the farmer.


![alt text](img/egg_hunt_screenshot.png?raw=true "Egg Hunt screenshot")

*Technologies used:*
- HTML 5
- CSS 3
- Vanilla JavaScript
- JQuery

*Approach:*

The game follows a Mario Bros style flow: The fox can only move from left to right. To animate this motion, I used two nested html sections. The outer section takes up 100% of the browser width and I added a style overflow: hidden; the inner section (the game board) is twice as wide. But only part of it are visible. When the right pointing arrow key is pressed, the game board is being moved from right to left, while the fox (a positioned vector graphic nested inside the inner section) is being moved from left to right. This creates the impression that the fox is in motion while always remaining in the visible area.

The foxes current position is then compared to the position of various elements on the game board (bushes, the hen house), to evaluate the current state of the game (Is the fox hidden? Has the fox reached the hen house?).

The farmer's attacks are based on a random number that is generated each time, the attack function executes. However, the chances of hitting the fox, are based on the foxes current position on the game board (50% in the open field, 0% if the fox is hidden). In one player mode, the attacks are repeated automatically every 12 seconds. In two player mode, the user can trigger an attack at any point - however, each time the farmer throws a shoe, the user has to wait at least 12 seconds before they can strike again.

The game consits of rounds (3-6). The opponents start out with three points each (health points for the fox, number of eggs in the hen house for the farmer). The points are decreased each time the fox is hit or steals an egg. If one player loses all points, the other player has one the game.

*Players:*
- The Fox (user)
- The Farmer (computer or second user)

*Link to the Game*
https://j-hha.github.io/egg_hunt/

*Taking it further*
If I had more time, I would have attempted to include the following
- a version for handheld devices
  --> the theme of the site is responsive, the game, however, relies on using the keyboard
- levels instead of rounds
  --> right now, the game flow of each round always stays the same; with more time, I would have looked into ways to increase the difficulty each time a new level starts (e.g. by increasing the distance between the hiding spots)
- more movement and attack options for the users (e.g. ducking, running)
