var rps = new Firebase("https://myrpsgame.firebaseio.com/");


var name = "";
var name2 = "";

$("#submitName1").on("click", function() {

	name = $('#nameinput1').val().trim();

	rps.push({
		name: name
	})

	playerNum = 1;

	showPicks();

	return false;
});

$("#submitName2").on("click", function() {

	name2 = $('#nameinput2').val().trim();

	rps.push({
		name2: name2
	})

	playerNum = 2;

	showPicks();

	return false;
});



rps.on("child_added", function(snapshot) {

	var checkName = snapshot.child("name").exists();
	var checkName2 = snapshot.child("name2").exists();

	if (checkName == true){
		$(".p1name").html(snapshot.val().name);
		$("#nameinput1").addClass("hide");
		$("#nameinput2").removeClass("hide");
		$("#submitName1").addClass("hide");
		$("#submitName2").removeClass("hide");
	}
	else if (checkName2 == true){
		$(".p2name").html(snapshot.val().name2);
		$("#submitName2").addClass("hide");
		$("#nameinput2").addClass("hide");
		$(".nameinputlabel").addClass("hide");
	}

});



function showPicks(){

	if (playerNum == 1){
		$(".user1picks").removeClass("hide");
	}
	else if (playerNum == 2){
		$(".user2picks").removeClass("hide");
	}

}

var user1choice;
var user2choice;
var pick1;
var pick2;


$(".rock").on("click", function() {

var text = ("<div class='choice'>" + "You chose: Rock" + "</div>");
var wait = ("<div class='wait'>" + "Waiting for other player..." + "</div>");

$(".user1picks").html(text);
$(".user1picks").append(wait);

user1choice = "rock";

rps.push({
	user1choice: user1choice
});

userPickCheck();

});

$(".paper").on("click", function() {

var text = ("<div class='choice'>" + "You chose: Paper" + "</div>");
var wait = ("<div class='wait'>" + "Waiting for other player..." + "</div>");

$(".user1picks").html(text);
$(".user1picks").append(wait);


});

$(".scissors").on("click", function() {

var text = ("<div class='choice'>" + "You chose: Scissors" + "</div>");
var wait = ("<div class='wait'>" + "Waiting for other player..." + "</div>");

$(".user1picks").html(text);
$(".user1picks").append(wait);


});

$(".rock2").on("click", function() {

var text = ("<div class='choice'>" + "You chose: Rock" + "</div>");
var wait = ("<div class='wait'>" + "Waiting for other player..." + "</div>");

$(".user2picks").html(text);
$(".user2picks").append(wait);


});

$(".paper2").on("click", function() {

var text = ("<div class='choice'>" + "You chose: Paper" + "</div>");
var wait = ("<div class='wait'>" + "Waiting for other player..." + "</div>");

$(".user2picks").html(text);
$(".user2picks").append(wait);

user2choice = "paper";

rps.push({
	user2choice: user2choice
});

userPickCheck();

});

$(".scissors2").on("click", function() {

var text = ("<div class='choice'>" + "You chose: Scissors" + "</div>");
var wait = ("<div class='wait'>" + "Waiting for other player..." + "</div>");

$(".user2picks").html(text);
$(".user2picks").append(wait);


});

//Player 1 is not reciving what user2choice is and visa versa

function userPickCheck() {
	rps.on("child_added", function(snapshot) {

		var checkpick = snapshot.child("user1choice").exists();
		var checkpick2 = snapshot.child("user2choice").exists();
		pick1 = snapshot.val().user1choice;
		pick2 = snapshot.val().user2choice;

		if (checkpick == true && checkpick2 == true){
			runGame();
		}

	});

}


function runGame() {
	if (pick1 == "rock" || pick2 == "paper"){
		var resultText = ("<div class='resultText'>" + "Player 2 wins!" + "</div>")
		$(".result").html(resultText);
	}
}
