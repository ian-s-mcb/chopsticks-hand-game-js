// create psuedo-namespace
var CHOP = {};


// no heavy lifting inside this function
// just function calls
$(document).ready(function() {

	"use strict";

	// create global variables
	CHOP.state = 0;
	CHOP.p1Hands = $(".p1");
	CHOP.p2Hands = $(".p2");

	console.log("jQuery works");
});


CHOP.onHandClick = function() {

	// identify the caller by:
	// set playerNum = 1 or 2
	// set isSelected = true or false

	// STATE 0
	// if playerNum == 1
	// 	add 'selected' class to caller
	//    set STATE = 1

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

	// STATE 3
	// if playerNum == 2
	// 	add 'selected' class to caller
	//    set STATE = 4

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
};


// STATEs 2 + 5
CHOP.split = function() {

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
	//			remove 'selected' class from p2 hands
	//			remove text areas and button
};


CHOP.attack = function(amount, target) {

	// deduct amount from target hand's value

	// if gameover condition is met
	//		set STATE = 6
	//		display gameover screen
	// else if STATE == 1
	//		set STATE = 3
	// else if STATE == 4
	//		set STATE = 0
};
