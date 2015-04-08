// creates psuedo-namespace
var CHOP = {};


//###################
//#   ENTRY POINT   #
//###################
/**
 * Sets global variables, adds click listener to hands, and starts game
 * off with player-1's turn.
*/
$(document).ready(function() {

	"use strict";

	// creates global variables
	CHOP.game = $(".game");
	CHOP.state = 0;

	CHOP.p1Region = $(".region.p1");
	CHOP.p1Hands = $(".hand.p1");
	CHOP.p1HandTop = $(".p1.top");
	CHOP.p1HandBottom = $(".p1.bottom");

	CHOP.p2Region = $(".region.p2");
	CHOP.p2Hands = $(".hand.p2");
	CHOP.p2HandTop = $(".p2.top");
	CHOP.p2HandBottom = $(".p2.bottom");

	// adds click listeners to hands
	CHOP.p1Hands.on("click", CHOP.onHandClick);
	CHOP.p2Hands.on("click", CHOP.onHandClick);

	// indicates player-1's turn
	CHOP.p1Region.addClass("currentTurn");

	console.log("jQuery works");
});


//###################
//#   onHandClick   #
//###################
/**
 * Applies game behavior depending upon game state and click info. Gets
 * called by whenever the user clicks a hand.
 *
*/
CHOP.onHandClick = function() {

	// identify the caller by:
	// set playerNum = 1 or 2
	// set isSelected = true or false
	var caller = $(this);
	var playerNum = caller.hasClass("p1") ? 1 : 2;
	var isSelected = caller.hasClass("selected");

	console.log(
		"Current state: " + CHOP.state +
		"\nClicked hand belonging to player #: " + playerNum +
		"\nThis hand was previously " + (isSelected ? "selected" : "unselected")
		);

	// ### STATE 0 ###
	if (CHOP.state == 0 && playerNum == 1) {

		caller.addClass("selected");
		CHOP.state = 1;
	}

	// ### STATE 1 ###
	else if (CHOP.state == 1) {

		if (playerNum == 1 && isSelected) {

			caller.removeClass("selected");
			CHOP.state = 0;
		}
		else if (playerNum == 1 && !isSelected) {

			caller.addClass("selected");
			CHOP.state = 2;
			CHOP.prepareSplit();
		}
		else if (playerNum == 2) {

			var attackingHand = CHOP.p1HandTop.hasClass("selected") ?
				CHOP.p1HandTop : CHOP.p1HandBottom;
			var attackAmount = Number(attackingHand.attr("points"));

			if ((attackAmount != 0) && (caller.attr("points") != 0)) {

				attackingHand.removeClass("selected");
				CHOP.attack(attackAmount, caller);
				CHOP.switchTurnIndicator();
			}
		}
	}

	// ### STATE 3 ###
	else if (CHOP.state == 3 && playerNum == 2) {

		caller.addClass("selected");
		CHOP.state = 4;
	}

	// ### STATE 4 ###
	else if (CHOP.state == 4) {

		if (playerNum == 2 && isSelected) {	

			caller.removeClass("selected");
			CHOP.state = 3;
		}
		else if (playerNum == 2 && !isSelected) {

			caller.addClass("selected");
			CHOP.state = 5;
			CHOP.prepareSplit();
		}
		else if (playerNum == 1) {

			var attackingHand = CHOP.p2HandTop.hasClass("selected") ?
				CHOP.p2HandTop : CHOP.p2HandBottom;
			var attackAmount = Number(attackingHand.attr("points"));

			if ((attackAmount != 0) && (caller.attr("points") != 0)) {

				attackingHand.removeClass("selected");
				CHOP.attack(attackAmount, caller);
				CHOP.switchTurnIndicator();
			}
		}
	}

	console.log("Changed state to: " + CHOP.state);
};


//############################
//#   switchTurnIndictator   #
//############################
/**
 * Switches style of `region` elements to indicate which whose turn it is. 
*/
CHOP.switchTurnIndicator = function() {

	CHOP.p1Region.toggleClass("currentTurn");
	CHOP.p2Region.toggleClass("currentTurn");
};


//####################
//#   prepareSplit   #
//####################
/**
 * Displays split mode elements (text boxes and apply split button) and
 * passes split mode info to the applySplit method.
*/
CHOP.prepareSplit = function() {

	console.log("Entering split mode");

	// prepares variables so that this function is "player agnostic"
	var handTop, handBottom, button;
	// ### STATE 2 ###
	if (CHOP.state == 2) {

		handTop = CHOP.p1HandTop;
		handBottom = CHOP.p1HandBottom;
		button = $(".p1 .split-btn");
	}
	// ### STATE 5 ###
	else if (CHOP.state == 5) {

		handTop = CHOP.p2HandTop;
		handBottom = CHOP.p2HandBottom;
		button = $(".p2 .split-btn");
	}
	else { console.log("Error in split mode"); }

	// backs up original points
	var ptsOrig = [
		Number(handTop.attr("points")),
		Number(handBottom.attr("points"))
	];

	// displays text areas to allow point adjustment
// TODO switch from .html() to .attr()
	handTop.html(
		"<input id='split-area-top' type='text' size=1 value='" +
		ptsOrig[0] + "'>");
	handBottom.html(
		"<input id='split-area-bottom' type='text' size=1 value='" +
		ptsOrig[1] + "'>");

	// configures apply button
	button
		.css("display", "block")
		.on("click", function() {
			CHOP.applySplit(handTop, handBottom, ptsOrig, $(this));
	});
};


//##################
//#   applySplit   #
//##################
/**
 * If the user-specified split is legal, then the new points are applied
 * to the user's hand and split mode is exited. If not, the user's turn is
 * restarted.
*/
CHOP.applySplit = function(handTop, handBottom, ptsOrig, button) {

	// backs up new points
	var ptsNew = [
		Number($("#split-area-top").attr("points")),
		Number($("#split-area-bottom").attr("points"))
	];

	// if split is legal
	if (CHOP.isLegalSplit(ptsOrig, ptsNew)) {

		// applies new points
		CHOP.updateHand(handTop, ptsNew[0]);
		CHOP.updateHand(handBottom, ptsNew[1]);

		// switches turn
		CHOP.state = CHOP.state == 2 ? 3 : 0;
		CHOP.switchTurnIndicator();
	}

	// otherwise, restarts turn
	else {

		// restores original points
		CHOP.updateHand(handTop, ptsOrig[0]);
		CHOP.updateHand(handBottom, ptsOrig[1]);

		// retains turn
		CHOP.state = CHOP.state == 2 ? 0 : 3;
	}

	// exits split mode
	button
		.css("display", "none")
		.off();
	CHOP.p1Hands.removeClass("selected");
	CHOP.p2Hands.removeClass("selected");

	console.log(
		"Exiting split mode" +
		"\nChanged state to: " + CHOP.state
	);
};



//##################
//#   updateHand   #
//##################
/**
 * Updates hand by assigning the given points and swapping in the
 * corresponding hand image.
*/
CHOP.updateHand = function(hand, points) {

	hand.attr("points", points);
	hand.attr("src", "media/number-sm-" + String(points) + ".png");
}


//####################
//#   isLegalSplit   #
//####################
/**
 * Checks the legality of a given split, and returns true if:
 *		- points are changed, and
 *		- point change is fair, and
 *		- new points are non-negative,
 * otherwise returns false.
*/
CHOP.isLegalSplit = function(ptsOrig, ptsNew) {

	var changed = (ptsOrig[0] != ptsNew[0]) && (ptsOrig[1] != ptsNew[1]);
	var fair = (ptsOrig[0] - ptsNew[0]) == -1 * (ptsOrig[1] - ptsNew[1]);
	var nonNeg = (ptsNew[0] >= 0) && (ptsNew[1] >= 0);

	return changed && fair && nonNeg;
};


//##############
//#   attack   #
//##############
/**
 * Deals an amount of damage to a target hand and changes game state,
 * depending upon game over condition.
*/
CHOP.attack = function(amount, target) {
	
	console.log("Attacked '"+ target.attr("class") + "' with " + amount +
		" points"
	);
	
	var targetValue = Number(target.attr("points"));

	// deducts amount from target hand's value
	if (targetValue + amount > 4)
		CHOP.updateHand(target, 0);
	else
		CHOP.updateHand(target, targetValue + amount);

	// changes state depending upon whether game over occured
	// ### STATE 1 ###
	if (CHOP.state == 1) {

		if (CHOP.p2HandTop.attr("points") == 0 && CHOP.p2HandBottom.attr("points") == 0) {

			console.log("Game Over p1 wins");

			// apply game over screen after a brief delay
			window.setTimeout(function() { CHOP.gameOver(1); }, 500);

			CHOP.state = 6;
		}
		else { CHOP.state = 3; }
	}
	// ### STATE 4 ###
	else if (CHOP.state == 4) {

		if (CHOP.p1HandTop.attr("points") == 0 && CHOP.p1HandBottom.attr("points") == 0) {

			console.log("Game Over p2 wins");

			// apply game over screen after a brief delay
			window.setTimeout(function() { CHOP.gameOver(2); }, 500);

			CHOP.state = 6;
		}
		else { CHOP.state = 0; }
	}
};


//################
//#   gameOver   #
//################
/**
 * Replaces the normal game screen with a game over message, depending
 * upon which player won
*/
CHOP.gameOver = function(playerNumber) {

	CHOP.game
		.html("Game Over</br>Player " + playerNumber + " Wins")
		.addClass("gameOver");
};
