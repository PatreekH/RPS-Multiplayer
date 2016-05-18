var rps = new Firebase("https://myrpsgame.firebaseio.com/");


var name = "";
var name2 = "";

$("#submitName1").on("click", function() {

	name = $('#nameinput1').val().trim();

	rps.push({
		name: name
	})

	$("#nameinput1").addClass("hide");
	$("#nameinput2").removeClass("hide");
	$("#submitName1").addClass("hide");
	$("#submitName2").removeClass("hide");

	return false;
});

$("#submitName2").on("click", function() {

	name2 = $('#nameinput2').val().trim();

	rps.push({
		name2: name2
	})

	return false;
});



rps.on("child_added", function(snapshot) {

	$(".p1name").html(snapshot.val().name);
	$(".p2name").html(snapshot.val().name2);

});