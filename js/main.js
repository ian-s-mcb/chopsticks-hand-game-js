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

	CHOP.p1UpBtn = $(".split-btn.p1.up");
	CHOP.p1DownBtn = $(".split-btn.p1.down");
	CHOP.p1ApplyBtn = $(".split-btn.p1.apply");
	CHOP.p1CancelBtn = $(".split-btn.p1.cancel");

	CHOP.p2Region = $(".region.p2");
	CHOP.p2Hands = $(".hand.p2");
	CHOP.p2HandTop = $(".p2.top");
	CHOP.p2HandBottom = $(".p2.bottom");

	CHOP.p2UpBtn = $(".split-btn.p2.up");
	CHOP.p2DownBtn = $(".split-btn.p2.down");
	CHOP.p2ApplyBtn = $(".split-btn.p2.apply");
	CHOP.p2CancelBtn = $(".split-btn.p2.cancel");

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
	var handTop, handBottom, upBtn, downBtn, applyBtn, cancelBtn;
	// ### STATE 2 ###
	if (CHOP.state == 2) {

		handTop = CHOP.p1HandTop;
		handBottom = CHOP.p1HandBottom;
		upBtn = CHOP.p1UpBtn;
		downBtn = CHOP.p1DownBtn;
		applyBtn = CHOP.p1ApplyBtn;
		cancelBtn = CHOP.p1CancelBtn;
	}
	// ### STATE 5 ###
	else if (CHOP.state == 5) {

		handTop = CHOP.p1HandTop;
		handBottom = CHOP.p1HandBottom;
		upBtn = CHOP.p2UpBtn;
		downBtn = CHOP.p2DownBtn;
		applyBtn = CHOP.p2ApplyBtn;
		cancelBtn = CHOP.p2CancelBtn;
	}
	else { 
	
		console.log("Error in split mode");
		return;
	}

	// backs up original points
	var ptsOrig = [
		Number(handTop.attr("points")),
		Number(handBottom.attr("points"))
	];

	// show given players split buttons
	$(CHOP.state == 2 ? ".split-btn.p1" : ".split-btn.p2").css("display", "unset");

	//upBtn

	//downBtn

	// configures apply button
	applyBtn
		.on("click", function() {
			CHOP.applySplit(handTop, handBottom, ptsOrig, true, applyBtn, cancelBtn);
	});

	// configures cancel button
	cancelBtn
		.on("click", function() {
			CHOP.applySplit(handTop, handBottom, ptsOrig, false, applyBtn, cancelBtn);
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
CHOP.applySplit = function(handTop, handBottom, ptsOrig, toBeApplied, applyBtn, cancelBtn) {

	// if user requests split to be applied
	if (toBeApplied) {

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
	applyBtn.off();
	cancelBtn.off();
	$(".split-btn").css("display", "none");
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
