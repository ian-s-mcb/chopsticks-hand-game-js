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
			CHOP.split();
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
			CHOP.split();
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
CHOP.split = function() {

	console.log("Preparing split mode");

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
