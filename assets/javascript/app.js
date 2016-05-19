var rps = new Firebase("https://myrpsgame.firebaseio.com/");


var name = "";
var name2 = "";

$("#submitName1").on("click", function() {

	name = $('#nameinput1').val().trim();

	rps.push({
		name: name
	})

	playerNum = 1;

	$("#nameinput1").addClass("hide");
	$("#nameinput2").removeClass("hide");
	$("#submitName1").addClass("hide");
	$("#submitName2").removeClass("hide");

	playGame();

	return false;
});

$("#submitName2").on("click", function() {

	name2 = $('#nameinput2').val().trim();

	rps.push({
		name2: name2
	})

	playerNum = 2;

	$("#submitName2").addClass("hide");
	$("#nameinput2").addClass("hide");
	$(".nameinputlabel").addClass("hide");

	playGame();

	return false;
});



rps.on("child_added", function(snapshot) {

	$(".p1name").html(snapshot.val().name);
	$(".p2name").html(snapshot.val().name2);

});



function playGame(){

	var cTitleDiv = ("<div class='cTitle'>" + "Please make a choice:" + "</div>");
	var rockDiv = ("<div class='rock'>"  + "Rock" + "</div>");
	var paperDiv = ("<div class='paper'>"  + "Paper" + "</div>");
	var scissorsDiv = ("<div class='scissors'>" + "Scissors" + "</div>");

	if (playerNum == 1){
		$(".user1picks").append(cTitleDiv);
		$(".user1picks").append(rockDiv);
		$(".user1picks").append(paperDiv);
		$(".user1picks").append(scissorsDiv);

		//$(".user2picks").hide();
	}
	else if (playerNum == 2){
		$(".user2picks").append(cTitleDiv);
		$(".user2picks").append(rockDiv);
		$(".user2picks").append(paperDiv);
		$(".user2picks").append(scissorsDiv);

		$(".user1picks").hide();
	}

}


