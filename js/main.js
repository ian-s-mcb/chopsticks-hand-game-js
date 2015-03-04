// creates psuedo-namespace
var CHOP = {};


// starts game
// no heavy lifting inside this function
// just function calls
$(document).ready(function() {

	"use strict";

	// creates global variables
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

	// STATE 0
	// if playerNum == 1
	// 	add 'selected' class to caller
	//    set STATE = 1
	if (CHOP.state == 0 && playerNum == 1) {

		caller.addClass("selected");
		CHOP.state = 1;
	}

	// STATE 1
	// if playerNum == 1 and isSelected
	//		remove 'selected' class from caller
	//		set STATE = 0
	// else if playerNum == 1 and !isSelected
	//		set STATE = 2
	//		add 'selected' class to caller
	//		call split callback
	// else if playerNum == 2
	//		set amount = value of p1's selected hand
	//		remove 'selected' class from p1 hands
	//		call attack callback
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
			var attackAmount = Number(attackingHand.html());

			if (attackAmount != 0) {

				attackingHand.removeClass("selected");
				CHOP.attack(attackAmount, caller);
				CHOP.switchTurnIndicator();
			}

		}
	}

	// STATE 3
	// if playerNum == 2
	// 	add 'selected' class to caller
	//    set STATE = 4
	else if (CHOP.state == 3 && playerNum == 2) {

		caller.addClass("selected");
		CHOP.state = 4;
	}

	// STATE 4
	// if playerNum == 2 and isSelected
	//		remove 'selected' class from caller
	//		set STATE = 3
	// else if playerNum == 2 and !isSelected
	//		set STATE = 5
	//		add 'selected' class to caller
	//		call split callback
	// else if playerNum == 1
	//		set amount = value of p2's selected hand
	//		remove 'selected' class from p2 hands
	//		call attack callback
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
			var attackAmount = Number(attackingHand.html());

			if (attackAmount != 0) {

				attackingHand.removeClass("selected");
				CHOP.attack(attackAmount, caller);
				CHOP.switchTurnIndicator();
			}
		}
	}

	console.log("Changed state to: " + CHOP.state);
};


// switches style of `region` elements to indicate which whose turn it is
CHOP.switchTurnIndicator = function() {

	CHOP.p1Region.toggleClass("currentTurn");
	CHOP.p2Region.toggleClass("currentTurn");
};


// STATEs 2 + 5
CHOP.prepareSplit = function() {

	console.log("Entering split mode");

	// if STATE == 2
	//		display text areas on p1 hands
	//		display apply button below p1 hands
	// 	add anonymouse callback to apply button
	// 	inside callback:
	//			if text areas are unchanged
	//				set STATE = 0
	//			else
	//				update p1 hand values
	//				set STATE = 3
	//				call switchTurnIndicator
	//			remove 'selected' class from p1 hands
	//			remove text areas and button

	// if STATE == 5 
	//		display text areas on p2 hands
	//		display apply button below p2 hands
	// 	add anonymouse callback to apply button
	// 	inside callback:
	//			if text areas are unchanged
	//				set STATE = 3
	//			else
	//				update p2 hand values
	//				set STATE = 0
	//				call switchTurnIndicator
	//			remove 'selected' class from p2 hands
	//			remove text areas and button

	// prepares variables so that this function is "player agnostic"
	var handTop, handBottom, button;
	if (CHOP.state == 2) {

		handTop = CHOP.p1HandTop;
		handBottom = CHOP.p1HandBottom;
		button = $(".p1 .split-btn");
	}
	else if (CHOP.state == 5) {

		handTop = CHOP.p2HandTop;
		handBottom = CHOP.p2HandBottom;
		button = $(".p2 .split-btn");
	}
	else { console.log("Error in split mode"); }

	// backs up original points
	var ptsOrig = [
		Number(handTop.html()),
		Number(handBottom.html())
	];

	// displays text areas to allow point adjustment
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


CHOP.applySplit = function(handTop, handBottom, ptsOrig, button) {

	// backs up new points
	var ptsNew = [
		Number($("#split-area-top").val()),
		Number($("#split-area-bottom").val())
	];

	// if split is legal
	if (CHOP.isLegalSplit(ptsOrig, ptsNew)) {

		// applies new points
		handTop.html(ptsNew[0]);
		handBottom.html(ptsNew[1]);

		// switches turn
		CHOP.state = CHOP.state == 2 ? 3 : 0;
		CHOP.switchTurnIndicator();
	}

	// otherwise, restarts turn
	else {

		// restores original points
		handTop.html(ptsOrig[0]);
		handBottom.html(ptsOrig[1]);

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


/*
Returns true if
	- points are changed, and
	- point change is fair, and
	- new points are non-negative
Otherwise returns false.

Initial tests:
CHOP.isLegalSplit([1,1], [1,1]); # false
CHOP.isLegalSplit([1,1], [1,3]); # false
CHOP.isLegalSplit([1,1], [3,1]); # false
CHOP.isLegalSplit([1,1], [-1,3]); # false
CHOP.isLegalSplit([1,1], [0,2]); # true
*/
CHOP.isLegalSplit = function(ptsOrig, ptsNew) {

	var changed = (ptsOrig[0] != ptsNew[0]) && (ptsOrig[1] != ptsNew[1]);
	var fair = (ptsOrig[0] - ptsNew[0]) == -1 * (ptsOrig[1] - ptsNew[1]);
	var nonNeg = (ptsNew[0] >= 0) && (ptsNew[1] >= 0);

	return changed && fair && nonNeg;
};


CHOP.attack = function(amount, target) {
	
	console.log("Attacked '"+ target.attr("class") + "' with " + amount + " points");
	
	var targetValue = Number(target.html());

	// deducts amount from target hand's value
	if (targetValue + amount > 4) { 
		target.html(0);
	}
	else { target.html(targetValue + amount); }
	
	// if gameover condition is met
	//		set STATE = 6
	//		display gameover screen
	// else if STATE == 1
	//		set STATE = 3
	// else if STATE == 4
	//		set STATE = 0
	if (CHOP.state == 1) {
		if ($(CHOP.p2Hands[0]).html() == 0 && $(CHOP.p2Hands[1]).html() == 0) {
			console.log("Game Over p1 wins");
			CHOP.state = 6;
		}
		else { CHOP.state = 3; }
	}
	else if (CHOP.state == 4) {
		if ($(CHOP.p1Hands[0]).html() == 0 && $(CHOP.p1Hands[1]).html() == 0) {
			console.log("Game Over p2 wins");
			CHOP.state = 6;
		}
		else { CHOP.state = 0; }
	}
};
