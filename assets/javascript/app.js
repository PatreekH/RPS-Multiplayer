// Rock Paper Scissor Multiplayer by Patrick Hernandez

//How it works:
//---

//---

//style cols to fit better
//style chat box
//show each choice in result box
//add timer before result?
//show form on disconnect
//clear chat on both disconnect

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

// Runs chat box
  var messageField = $('#messageInput');
  var nameField = $('#chatNameInput');
  var messageList = $('.messages');

  // Listen for the form submit
$('.chat').on('submit', function(e) {

    // Stops the form from submitting
    e.preventDefault();

    // Create a message object
    var message = {
      name : $('#nameinput').val().trim(),
      text : messageField.val()
    }

    // Save data to firebase with unique reference key
  	var newMessageKey = firebase.database().ref().child('messages').push().key;
  	var messageUpdates = {};
  	messageUpdates['/messages/' + newMessageKey] = message;
  	database.ref().update(messageUpdates);


    // Clear message field after sending message
    messageField.val('');
});

// Pulls data from firebase and runs addMessage
database.ref("messages").on('child_added', function(snapshot) {
  addMessage(snapshot.val());
});

// Adds data from firebase to page
function addMessage(data) {
	var username = data.name || 'anonymous';
	var message = data.text;

	// Create an element
	var nameElement = $('<strong>').text(username);
	var messageElement = $('<li>').text(message).prepend(nameElement);

	// Add the message to the DOM
	messageList.append(messageElement);

	// Scroll to the bottom of the message list
	messageList[0].scrollTop = messageList[0].scrollHeight;
}


// Global vars
var playerNum;
var user1choice;
var user2choice;
var updates = {};
var key = "pick2";
var status;
var wait = ("<div class='wait'>" + "Waiting for other player to make a selection..." + "</div>");

// Sends the player's name to the database based on the order they joined the game
// Sets the first player to join the game as PlayerNum 1 and the second to PlayerNum 2
database.ref("playerInfo").on('value', function(snapshot) {
	var player1Name = snapshot.child("name").exists();
	var player2Name = snapshot.child("name2").exists();
		if (!player1Name){
			$("#submitName").on("click", function() {
				var name = $('#nameinput').val().trim();
				database.ref("playerInfo").set({
					name: name
				});
				playerNum = 1;
				$(".user1wait").removeClass("hide");
				$(".user1wait").html("Waiting for other player to join...");
				return false;
			});
		} else if (player1Name === true && !player2Name){
			$("#submitName").on("click", function() {
				var name2 = $('#nameinput').val().trim();
				var updateName = {};
				var namekey = "name2";
				updateName['/playerInfo/' + namekey] = name2;
				database.ref().update(updateName);
				playerNum = 2;
				$(".user2wait").removeClass("hide");
				return false;
			});
		}
});

// Checks to see if there is a player one
// Checks to see if there is a player two, if there is: Starts game by running checkForPicks
database.ref("playerInfo").on('value', function(snapshot) {
		var checkName = snapshot.child("name").exists();
		if (checkName === true){
  			$(".p1name").html(snapshot.val().name);
		}
});
database.ref("playerInfo").on('value', function(snapshot) {
		var checkName2 = snapshot.child("name2").exists();
		if (checkName2 === true){
  			$(".p2name").html(snapshot.val().name2);
    		hideForm();
    		setCounts();
			checkForPicks();
		}
});

// Hides name form after player two has entered the game
function hideForm() {
	$("#submitName").addClass("hide");
	$("#nameinput").addClass("hide");
	$(".nameinputlabel").addClass("hide");
}

// Sets the counts to 0 in firebase if there isn't an already existing count set
function setCounts() {
var p1winCount = 0;
var p2winCount = 0;
var drawCount = 0;
	database.ref("counts").on('value', function(snapshot){
		var resetCheck = snapshot.child("drawCount").exists();
		if (!resetCheck){
			database.ref('counts').set({
    			drawCount: drawCount,
    			p1wins: p1winCount,
    			p2wins: p2winCount
			});
		}
	})
}

// Starts the game by checking if player 1 has made a selection.
// If player 1 has made a choice, asks for and checks player 2's selection.
// If both players have made a choice, run comparePicks
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

// Sends 'rock' to the database as the players choice if rock is chosen.
$(".rock").on("click", function() {

	var text = ("<div class='choice'>" + "You chose: Rock" + "</div>");

	if (playerNum == 1){
		user1choice = "rock";
		database.ref('playerpicks').set({
    		pick: user1choice
		});
		$(".user1picks").addClass("hide");
		$(".user1wait").removeClass("hide");
		$(".user1wait").html(text);
		$(".user1wait").append(wait);
		checkForPicks();
	} else if (playerNum == 2){
		user2choice = "rock";
		updates['/playerpicks/' + key] = user2choice;
		database.ref().update(updates);
		$(".user2picks").addClass("hide");
		checkForPicks();
	}
});

// Sends 'paper' to the database as the players choice if paper is chosen.
$(".paper").on("click", function() {

	var text = ("<div class='choice'>" + "You chose: Paper" + "</div>");

	if (playerNum == 1){
		user1choice = "paper";
		database.ref('playerpicks').set({
    		pick: user1choice
		});
		$(".user1picks").addClass("hide");
		$(".user1wait").removeClass("hide");
		$(".user1wait").html(text);
		$(".user1wait").append(wait);
		checkForPicks();
	} else if (playerNum == 2){
		user2choice = "paper";
		updates['/playerpicks/' + key] = user2choice;
		database.ref().update(updates);
		$(".user2picks").addClass("hide");
		checkForPicks();
	}
});

// Sends 'scissors' to the database as the players choice if scissors is chosen.
$(".scissors").on("click", function() {

	var text = ("<div class='choice'>" + "You chose: Scissors" + "</div>");

	if (playerNum == 1){
		user1choice = "scissors";
		database.ref('playerpicks').set({
    		pick: user1choice
		});
		$(".user1picks").addClass("hide");
		$(".user1wait").removeClass("hide");
		$(".user1wait").html(text);
		$(".user1wait").append(wait);
		checkForPicks();
	} else if (playerNum == 2){
		user2choice = "scissors";
		updates['/playerpicks/' + key] = user2choice;
		database.ref().update(updates);
		$(".user2picks").addClass("hide");
		checkForPicks();
	}
});

// After the users have each picked this function will run, comparing both picks and determining who wins the match
// Also removes both user picks from the database after they are compared, this sets up the reset for later.
function comparePicks() {
	database.ref("playerpicks").once('value').then(function(snapshot) {	
		var user1pick = snapshot.val().pick;
		var user2pick = snapshot.val().pick2;
		var p1winText = ("<div class='resultText'>" + "Player 1 wins!" + "</div>");
		var p2winText = ("<div class='resultText'>" + "Player 2 wins!" + "</div>");
		var drawText = ("<div class='resultText'>" + "It's a draw!" + "</div>");
		if (user1pick == user2pick) {
			$(".result").html(drawText);
			database.ref("playerpicks").remove();
			status = "draw";
			updateCounts();
		}
		else if (user1pick == "rock" && user2pick == "scissors" || 
			user1pick == "paper" && user2pick == "rock" || 
			user1pick == "scissors" && user2pick == "paper") {
			$(".result").html(p1winText);
			database.ref("playerpicks").remove();
			status = "p1win";
			updateCounts();
		}
		else if (user1pick == "rock" && user2pick == "paper" || 
			user1pick == "paper" && user2pick == "scissors" || 
			user1pick == "scissors" && user2pick == "rock") {
			$(".result").html(p2winText);
			database.ref("playerpicks").remove();
			status = "p2win";
			updateCounts();
		}
	});
}

// Updates counts in the database based on the comparison outcome via "status".
function updateCounts() {
	database.ref("counts").once('value').then(function(snapshot) {
		var currDrawCount = snapshot.val().drawCount;
		var currP1winCount = snapshot.val().p1wins;
		var currP2winCount = snapshot.val().p2wins;
		if (status == "draw"){
			var drawUpdates = {};
			var newDrawCount = currDrawCount += 1;
			var drawKey = "drawCount";
			drawUpdates['/counts/' + drawKey] = newDrawCount;
			database.ref().update(drawUpdates);
			postCounts();

		} else if (status == "p1win"){
			var p1winUpdates = {};
			var newp1Count = currP1winCount += 1;
			var p1winKey = "p1wins";
			p1winUpdates['/counts/' + p1winKey] = newp1Count;
			database.ref().update(p1winUpdates);
			postCounts();

		} else if (status == "p2win"){
			var p2winUpdates = {};
			var newp2Count = currP2winCount += 1;
			var p2winKey = "p2wins";
			p2winUpdates['/counts/' + p2winKey] = newp2Count;
			database.ref().update(p2winUpdates);
			postCounts();
		}
	});
};

// Posts updated counts to UI, 
// Resets game so player 1 can choose again, prompting an automatic rematch
function postCounts() {
	database.ref("counts").once('value').then(function(snapshot) {
		var p1WinsNum = snapshot.val().p1wins;
		var p2WinsNum = snapshot.val().p2wins;
		var drawCountNum = snapshot.val().drawCount;
		$(".p1wins").html("Player 1 wins: " + p1WinsNum);
		$(".p2wins").html("Player 2 wins: " + p2WinsNum);
		$(".draws").html("Draws: " + drawCountNum);
		if (playerNum == 2){
			$(".user2wait").html(wait);
			$(".user2wait").removeClass("hide");
		}
		checkForPicks();
	});
}