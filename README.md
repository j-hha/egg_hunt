# egg_hunt

- Browser game, first project for GA WDIR course

*Premise:* A hungry fox is looking for dinner. Can he make it to a barn to steal eggs without being caught by the farmer?

*Players:*
- The Fox (user)
- The Farmer (computer)

*Game flow:*
- Fox starts out with 3 health points, position is on left hand side of screen, fox moves to right hand side of screen on key down
- Barn with 3 eggs positioned on the right hand side of screen
- Between barn and fox are several hiding spots for the fox, eg bush, tree
- Fox has to make it to the barn to steal his dinner
- BUT farmer regularly wakes up and throws shoes to scare fox off
- additional difficulty: include 'danger zones' where farmer has a higher likelihood to hit
- If fox has found cover when this happens, fox may move on
- Else if fox has not taken cover, fox has a high random chance to be scared off by farmer, loses health point (HP) and loses the round
- If fox makes it to the barn, farmer loses one egg and fox wins the round

*Rounds to play:*  3 - 6 rounds
- One round = one night
- Night ends when fox is caught (round lost) or manages to steal an egg (round won)
- If eggs && HP > 0 → fox gets a new chance the next night (→ new round)

*Win state:*
- Fox wins when he has stolen all the eggs (eggs = 0)

*Lose state:*
- Fox loses when he has been caught three times (HP = 0)

*Implementation:*
- HTML, CSS and JQuery to visualize and animate the game flow in the browser
- Javascript for the game logic and to keep track of game state, etc
- How to read the current position of an element on the page: https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect

*Upgrades:*
If time permits, I am planning to look into adding additional functionality:
- two players!
- getting game to work on hand held devices
- improving responsive design
