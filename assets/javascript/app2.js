var database = firebase.database();

var turn = 0;

$("#submitName1").on("click", function() {

	var name = $('#nameinput1').val().trim();

	firebase.database().ref('player1Name').set({
    	name: name
	});

	turn = 1;

	return false;
});

$("#submitName2").on("click", function() {

	var name2 = $('#nameinput2').val().trim();

	firebase.database().ref('player2Name').set({
    	name2: name2
	});

	turn = 2;

	return false;
});



firebase.database().ref("player1Name").on('value', function(snapshot) {

		var checkName = snapshot.child("name").exists();

		if (checkName == true){
  			$(".p1name").html(snapshot.val().name);
			$("#nameinput1").addClass("hide");
			$("#nameinput2").removeClass("hide");
			$("#submitName1").addClass("hide");
			$("#submitName2").removeClass("hide");
		}
});


firebase.database().ref("player2Name").on('value', function(snapshot) {

		var checkName2 = snapshot.child("name2").exists();

		if (checkName2 == true){
    		$(".p2name").html(snapshot.val().name2);
			$("#submitName2").addClass("hide");
			$("#nameinput2").addClass("hide");
			$(".nameinputlabel").addClass("hide");
			runGame();
		}
});


function runGame(){

}