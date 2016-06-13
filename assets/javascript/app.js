var database = firebase.database();


// Makes the jumbotron background image scroll
var backgroundScroll = function(params) {
	params = $.extend({
		scrollSpeed: 70,
		imageWidth: $('#bg').width(),
		imageHeight: $('#bg').height()
	}, params);
	
	var step = 1,
		current = 0,
		restartPosition = - (params.imageWidth - params.imageHeight);
	
	var scroll = function() {
		current -= step;
		if (current == restartPosition){
			current = 0;
		}	
		$('#bg').css('backgroundPosition', current + 'px 0');
	
	};
	
	this.init = function() {
		setInterval(scroll, params.scrollSpeed);
	
	};
};

var scroll = new backgroundScroll();
scroll.init();

//update list: 
//add reset 
//add win/lose counter
//dynamically add buttons and prompts 
//add actual name to results label
// - add timer before logic starts?
//only use one form to get name
//when disconnect bring form back
//add chat box

var playerNum;

$("#submitName1").on("click", function() {
	var name = $('#nameinput1').val().trim();
	database.ref('player1').set({
    	name: name
	});
	playerNum = 1;
	$(".user1wait").removeClass("hide");
	return false;
});

$("#submitName2").on("click", function() {
	var name2 = $('#nameinput2').val().trim();
	database.ref('player2').set({
    	name2: name2
	});
	playerNum = 2;
	$(".user2wait").removeClass("hide");
	return false;
});

// Checks to see if there is a player one
database.ref("player1").on('value', function(snapshot) {
		var checkName = snapshot.child("name").exists();
		if (checkName === true){
  			$(".p1name").html(snapshot.val().name);
			$("#nameinput1").addClass("hide");
			$("#nameinput2").removeClass("hide");
			$("#submitName1").addClass("hide");
			$("#submitName2").removeClass("hide");
		}
});

// Checks to see if there is a player two, if there is: Starts game by running checkForPicks
database.ref("player2").on('value', function(snapshot) {
		var checkName2 = snapshot.child("name2").exists();
		if (checkName2 === true){
    		$(".p2name").html(snapshot.val().name2);
			$("#submitName2").addClass("hide");
			$("#nameinput2").addClass("hide");
			$(".nameinputlabel").addClass("hide");
			checkForPicks();
		}
});

// Starts the game by checking if player 1 has made a selection.
function checkForPicks(){
	database.ref("playerpicks").on('value', function(snapshot) {	
		var checkPick = snapshot.child("pick").exists();
		var checkPick2 = snapshot.child("pick2").exists();
		if (playerNum == 1 && !checkPick){
			$(".user1wait").addClass("hide");
			$(".user1picks").removeClass("hide");
		} else if (checkPick === true && playerNum == 2 && !checkPick2){
			$(".user2wait").addClass("hide");
			$(".user2picks").removeClass("hide");
		} else if (checkPick === true && checkPick2 === true){
			comparePicks();
		}
	});
}

$(".rock").on("click", function() {

	var text = ("<div class='choice'>" + "You chose: Rock" + "</div>");
	var wait = ("<div class='wait'>" + "Waiting for other player..." + "</div>");

	if (playerNum == 1){
		var user1choice = "rock";
		database.ref('playerpicks').set({
    		pick: user1choice
		});
		$(".user1picks").html(text);
		$(".user1picks").append(wait);
		checkForPicks();
	} else if (playerNum == 2){
		var user2choice = "rock";
		var updates = {};
		var key = "pick2";
		updates['/playerpicks/' + key] = user2choice;
		database.ref().update(updates);
		$(".user2picks").html(text);
		$(".user2picks").append(wait);
		checkForPicks();
	}

});

$(".paper").on("click", function() {

	var text = ("<div class='choice'>" + "You chose: Paper" + "</div>");
	var wait = ("<div class='wait'>" + "Waiting for other player..." + "</div>");

	if (playerNum == 1){
		var user1choice = "paper";
		database.ref('playerpicks').set({
    		pick: user1choice
		});
		$(".user1picks").html(text);
		$(".user1picks").append(wait);
		checkForPicks();
	} else if (playerNum == 2){
		var user2choice = "paper";
		var updates = {};
		var key = "pick2";
		updates['/playerpicks/' + key] = user2choice;
		database.ref().update(updates);
		$(".user2picks").html(text);
		$(".user2picks").append(wait);
		checkForPicks();
	}

});

$(".scissors").on("click", function() {

	var text = ("<div class='choice'>" + "You chose: Scissors" + "</div>");
	var wait = ("<div class='wait'>" + "Waiting for other player..." + "</div>");

	if (playerNum == 1){
		var user1choice = "scissors";
		database.ref('playerpicks').set({
    		pick: user1choice
		});
		$(".user1picks").html(text);
		$(".user1picks").append(wait);
		checkForPicks();
	} else if (playerNum == 2){
		var user2choice = "scissors";
		var updates = {};
		var key = "pick2";
		updates['/playerpicks/' + key] = user2choice;
		database.ref().update(updates);
		$(".user2picks").html(text);
		$(".user2picks").append(wait);
		checkForPicks();
	}

});

function comparePicks() {
	database.ref("playerpicks").on('value', function(snapshot) {	
		var user1pick = snapshot.val().pick;
		var user2pick = snapshot.val().pick2;
		var p1winText = ("<div class='resultText'>" + "Player 1 wins!" + "</div>");
		var p2winText = ("<div class='resultText'>" + "Player 2 wins!" + "</div>");
		var drawText = ("<div class='resultText'>" + "It's a draw!" + "</div>");

		if (user1pick == "rock" && user2pick == "rock") {
			$(".result").html(drawText);

		} else if (user1pick == "rock" && user2pick == "paper") {
			$(".result").html(p2winText);

		} else if (user1pick == "rock" && user2pick == "scissors") {
			$(".result").html(p1winText);

		} else if (user1pick == "paper" && user2pick == "paper") {
			$(".result").html(drawText);

		} else if (user1pick == "paper" && user2pick == "rock") {
			$(".result").html(p1winText);

		} else if (user1pick == "paper" && user2pick == "scissors") {
			$(".result").html(p2winText);

		} else if (user1pick == "scissors" && user2pick == "scissors") {
			$(".result").html(drawText);

		} else if (user1pick == "scissors" && user2pick == "paper") {
			$(".result").html(p1winText);

		} else if (user1pick == "scissors" && user2pick == "rock") {
			$(".result").html(p2winText);
		}
	});
}