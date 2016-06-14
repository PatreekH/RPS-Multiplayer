// Rock Paper Scissor Multiplayer by Patrick Hernandez

//win/lose counter
//show name in result box
//show each choice in result box
//add timer before result?
//add chat box
//show form on disconnect

// Firebase ref.
var database = firebase.database();

// Makes the title background image scroll
var backgroundScroll = function(params) {
	params = $.extend({
		scrollSpeed: 35,
		imageWidth: $('.bg').width(),
		imageHeight: $('.bg').height()
	}, params);
	
	var step = 1,
		current = 0,
		restartPosition = - (params.imageWidth - params.imageHeight);
	
	var scroll = function() {
		current -= step;
		if (current == restartPosition){
			current = 0;
		}	
		$('.bg').css('backgroundPosition', current + 'px 0');
	
	};
	
	this.init = function() {
		setInterval(scroll, params.scrollSpeed);
	
	};
};

var scroll = new backgroundScroll();
scroll.init();


// Sends the player's name to firebase based on the order they joined the game
// Sets the first player to join the game as PlayerNum 1 and the second to PlayerNum 2
var playerNum;
database.ref("playerNames").on('value', function(snapshot) {
	var player1Name = snapshot.child("name").exists();
	var player2Name = snapshot.child("name2").exists();
		if (!player1Name){
			$("#submitName1").on("click", function() {
				var name = $('#nameinput1').val().trim();
				database.ref("playerNames").set({
					name: name
				});
				playerNum = 1;
				$(".user1wait").removeClass("hide");
				$(".user1wait").html("Waiting for other player to join...");
				return false;
			});
		} else if (player1Name === true && !player2Name){
			$("#submitName1").on("click", function() {
				var name2 = $('#nameinput1').val().trim();
				var updateName = {};
				var namekey = "name2";
				updateName['/playerNames/' + namekey] = name2;
				database.ref().update(updateName);
				playerNum = 2;
				$(".user2wait").removeClass("hide");
				return false;
			});
		}
});

// Checks to see if there is a player one
database.ref("playerNames").on('value', function(snapshot) {
		var checkName = snapshot.child("name").exists();
		if (checkName === true){
  			$(".p1name").html(snapshot.val().name);
		}
});

// Checks to see if there is a player two, if there is: Starts game by running checkForPicks
database.ref("playerNames").on('value', function(snapshot) {
		var checkName2 = snapshot.child("name2").exists();
		if (checkName2 === true){
    		$(".p2name").html(snapshot.val().name2);
    		hideForm();
			checkForPicks();
		}
});

// Hides name form
function hideForm() {
	$("#submitName1").addClass("hide");
	$("#nameinput1").addClass("hide");
	$(".nameinputlabel").addClass("hide");
}

// Starts the game by checking if player 1 has made a selection.
function checkForPicks(){
	database.ref("playerpicks").on('value', function(snapshot) {	
		var checkPick = snapshot.child("pick").exists();
		var checkPick2 = snapshot.child("pick2").exists();
		if (playerNum == 1 && !checkPick){
			$(".user1wait").addClass("hide");
			$(".user1picks").removeClass("hide");
		} else if (playerNum == 2 && !checkPick){
			$(".user2wait").html("Waiting for other player to make a selection...");
		} else if (checkPick === true && playerNum == 2 && !checkPick2){
			$(".user2wait").addClass("hide");
			$(".user2picks").removeClass("hide");
		} else if (checkPick === true && checkPick2 === true){
			comparePicks();
		}
	});
}

// Sends 'rock' to the firebase as the players choice if rock is chosen.
$(".rock").on("click", function() {

	var text = ("<div class='choice'>" + "You chose: Rock" + "</div>");
	var wait = ("<div class='wait'>" + "Waiting for other player..." + "</div>");

	if (playerNum == 1){
		var user1choice = "rock";
		database.ref('playerpicks').set({
    		pick: user1choice
		});
		$(".user1picks").addClass("hide");
		$(".user1wait").removeClass("hide");
		$(".user1wait").html(text);
		$(".user1wait").append(wait);
		checkForPicks();
	} else if (playerNum == 2){
		var user2choice = "rock";
		var updates = {};
		var key = "pick2";
		updates['/playerpicks/' + key] = user2choice;
		database.ref().update(updates);
		$(".user2picks").addClass("hide");
		$(".user2wait").removeClass("hide");
		$(".user2wait").html(text);
		$(".user2wait").append(wait);
		checkForPicks();
	}

});

// Sends 'paper' to the firebase as the players choice if rock is chosen.
$(".paper").on("click", function() {

	var text = ("<div class='choice'>" + "You chose: Paper" + "</div>");
	var wait = ("<div class='wait'>" + "Waiting for other player..." + "</div>");

	if (playerNum == 1){
		var user1choice = "paper";
		database.ref('playerpicks').set({
    		pick: user1choice
		});
		$(".user1picks").addClass("hide");
		$(".user1wait").removeClass("hide");
		$(".user1wait").html(text);
		$(".user1wait").append(wait);
		checkForPicks();
	} else if (playerNum == 2){
		var user2choice = "paper";
		var updates = {};
		var key = "pick2";
		updates['/playerpicks/' + key] = user2choice;
		database.ref().update(updates);
		$(".user2picks").addClass("hide");
		$(".user2wait").removeClass("hide");
		$(".user2wait").html(text);
		$(".user2wait").append(wait);
		checkForPicks();
	}

});

// Sends 'scissors' to the firebase as the players choice if rock is chosen.
$(".scissors").on("click", function() {

	var text = ("<div class='choice'>" + "You chose: Scissors" + "</div>");
	var wait = ("<div class='wait'>" + "Waiting for other player..." + "</div>");

	if (playerNum == 1){
		var user1choice = "scissors";
		database.ref('playerpicks').set({
    		pick: user1choice
		});
		$(".user1picks").addClass("hide");
		$(".user1wait").removeClass("hide");
		$(".user1wait").html(text);
		$(".user1wait").append(wait);
		checkForPicks();
	} else if (playerNum == 2){
		var user2choice = "scissors";
		var updates = {};
		var key = "pick2";
		updates['/playerpicks/' + key] = user2choice;
		database.ref().update(updates);
		$(".user2picks").addClass("hide");
		$(".user2wait").removeClass("hide");
		$(".user2wait").html(text);
		$(".user2wait").append(wait);
		checkForPicks();
	}

});

// After the users have picked this function will run, comparing both picks and determining who wins
// After comparing, this will reset the game so player 1 can pick again, prompting an automatic rematch
function comparePicks() {
	database.ref("playerpicks").on('value', function(snapshot) {	
		var user1pick = snapshot.val().pick;
		var user2pick = snapshot.val().pick2;
		var p1winText = ("<div class='resultText'>" + "Player 1 wins!" + "</div>");
		var p2winText = ("<div class='resultText'>" + "Player 2 wins!" + "</div>");
		var drawText = ("<div class='resultText'>" + "It's a draw!" + "</div>");

		if (user1pick == "rock" && user2pick == "rock") {
			$(".result").html(drawText);
			database.ref("playerpicks").remove();
			checkForPicks()

		} else if (user1pick == "rock" && user2pick == "paper") {
			$(".result").html(p2winText);
			database.ref("playerpicks").remove();
			checkForPicks()

		} else if (user1pick == "rock" && user2pick == "scissors") {
			$(".result").html(p1winText);
			database.ref("playerpicks").remove();
			checkForPicks()

		} else if (user1pick == "paper" && user2pick == "paper") {
			$(".result").html(drawText);
			database.ref("playerpicks").remove();
			checkForPicks()

		} else if (user1pick == "paper" && user2pick == "rock") {
			$(".result").html(p1winText);
			database.ref("playerpicks").remove();
			checkForPicks()

		} else if (user1pick == "paper" && user2pick == "scissors") {
			$(".result").html(p2winText);
			database.ref("playerpicks").remove();
			checkForPicks()

		} else if (user1pick == "scissors" && user2pick == "scissors") {
			$(".result").html(drawText);
			database.ref("playerpicks").remove();
			checkForPicks()

		} else if (user1pick == "scissors" && user2pick == "paper") {
			$(".result").html(p1winText);
			database.ref("playerpicks").remove();
			checkForPicks()

		} else if (user1pick == "scissors" && user2pick == "rock") {
			$(".result").html(p2winText);
			database.ref("playerpicks").remove();
			checkForPicks()
		}
	});
}