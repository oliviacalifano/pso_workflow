'use strict' 

var feedback = "";
var conceptIds = [];
var date = new Date().toISOString().slice(0, -5);

function get_selected_strats() {

	var strat_id = [];
	
	//get all selected strat ids
	$("#strat_list").each(function(){
		strat_id.push($(this).val());
	});
	
	//print all strats	
	// for (i=0; i<strat_id.length; i++) {
		// console.log(strat_id[i]);
	// }
	
	return strat_id;
}

//check if any concepts assigned, count != 0

function get_creatives(strat){
	var u = "https://adroit-tools.mediamath.com/t1/api/v2.0/atomic_creatives/limit/concept.strategies="+strat+"?q=status%3D%3D1%26end_date%3E%3D" + date + "%26start_date%3C%3D" + date;
	console.log(u);
	
	var request = $.ajax({
		url: u,
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {

			var numConcepts = $(xml).find('result').children('entities').attr('count');
			if (numConcepts == 0)
			{
				feedback = feedback + "<p>" + strat + ": No active creatives assigned within concept. Edit <a target=\"_blank\" href=\"https://t1.mediamath.com/app/#strategy/edit/"+ strat +"/creatives\">here</a></p>";
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

function clear(elementID)
{
    document.getElementById(elementID).innerHTML = "";
}


$("#creatives").click(function(){

clear('feedback');
feedback = "";

var selectedStrats = get_selected_strats();
selectedStrats = selectedStrats[0];

for(var i = 0; i < selectedStrats.length; i++){
	console.log(selectedStrats[i]);
	get_creatives(selectedStrats[i]);
}

});