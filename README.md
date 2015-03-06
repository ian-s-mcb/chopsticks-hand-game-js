# Chopstick Hand Game JS

## About
Never heard of the Chopsticks game? It's a simple, turn-based hand game where two players transfer points, as indicated by the number of extended fingers, from hand to hand.

## Game Rules
The game begins with one point per hand, and the game ends when a player loses all their points. The player with no points left loses.

During a turn, a player can either **attack** or **split**. Attacking adds the all points from the attacking hand to the attacked hand, but leaves the attacking hand unchanged. Splitting redistributes points between the current player's hands. Each hand is limited to at most four points. When a hand reaches more than four points, that hand is reduced to zero points. A hand with zero points can't be attacked, but can be involved in a split.

Still not clear? Check out [this wikipedia article][wiki game] for a full explanation of the game.

## Development Notes
[This sketch][state diagram] shows the state machine that we used to handle our game logic.

## Contributors
* [Enan Rahman][gh enan]
* [Ian S. McBride][gh ian]

[wiki game]: http://en.wikipedia.org/wiki/Chopsticks_%28hand_game%29
[state diagram]: http://s6.postimg.org/rz8iqi4eo/chopsticks_state_diagram_2014_12_12.jpg
[gh enan]: https://github.com/enan789
[gh ian]: https://github.com/ian-s-mcb
