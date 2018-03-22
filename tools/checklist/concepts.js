'use strict' 

var feedback = "";
var conceptIds = [];

//check if any concepts assigned, count != 0

function get_concepts(strat){

	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/concepts/limit/strategies=" + strat +"/?q=status%3D%3D1",
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {
			var numConcepts = $(xml).find('result').children('entities').attr('count');
			if (numConcepts == 0)
			{
				feedback = feedback + "<p>" + strat + ": No Active Concepts Assigned. Edit <a target=\"_blank\" href=\"https://t1.mediamath.com/app/#strategy/edit/"+ strat +"/creatives\">here</a></p>";
				$("#feedback").html(feedback);	
			}
			else
			{
				feedback = feedback + "<p>" + strat + ": &#10003 </p>"; 
				$("#feedback").html(feedback);	
			}
			
			console.log(numConcepts);
		}
	});	
};

//are there cases when a creatives (not concepts) are assigned?

function clearFeed()
{
    document.getElementById('feedback').innerHTML = "";
	document.getElementById('feedback2').innerHTML = "";
}


$("#concepts").click(function(){

clearFeed();
feedback="";

for(var i = 0; i < selectedStrats.length; i++){
	console.log(selectedStrats[i]);
	get_concepts(selectedStrats[i]);
}

});