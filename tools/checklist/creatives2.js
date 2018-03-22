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

function get_creatives(strat, callback){
	var u = "https://adroit-tools.mediamath.com/t1/api/v2.0/atomic_creatives/limit/concept.strategies="+strat+"?q=status%3D%3D1%26start_date%3C%3D" + date + "&full=atomic_creative";
	console.log(u);
	var count = 0;
	var c = {};
	
	var request = $.ajax({
		url: u,
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {

			var numConcepts = $(xml).find('result').children('entities').attr('count');
			//console.log(numConcepts);
			if (numConcepts == 0)
			{
				count = 0;
			}
			else
			{
				var creativeIds = $(xml).find('entity');
			
				for (var i = 0; i < creativeIds.length; i++){
					var id = creativeIds[i]['id'];
					console.log(id);
					var creative = $(xml).find('entity#' + id).children('prop');
					console.log(creative);
					creative.each(function(){
					c[this.getAttribute('name')] = this.getAttribute('value')});
					console.log(c);
					if ('end_date' in c) {
						console.log(date);
						console.log(c['end_date']);
						if (c['end_date'] > date) {
							console.log(c['end_date']);
							count = count +1;
						}	
					}
					else {
						count = count + 1;
					}
			console.log(count)
			}		
			}
		callback(strat, count)
		}
	});	
};

//are there cases when a creatives (not concepts) are assigned?

function clear()
{
    document.getElementById('feedback').innerHTML = "";
	document.getElementById('feedback2').innerHTML = "";
}


$("#creatives").click(function(){

clear();
feedback = "";

var selectedStrats = get_selected_strats();
selectedStrats = selectedStrats[0];

	for(var i=0; i<selectedStrats.length; i++) {
	
		//get list of current supplies attached to strat
		console.log("updating this strat:",selectedStrats[i]);
		var current_strat = selectedStrats[i];

		get_creatives(current_strat, function(current_strat, count) 
			{
				if (count > 0)
				{		
					feedback = feedback + "<p> " + current_strat + ": &#10003 </p>"; 
					$("#feedback").html(feedback);
				}
				else 
				{
					feedback = feedback + "<p>" + current_strat + ": No active creatives assigned within concept. Edit <a target=\"_blank\" href=\"https://t1.mediamath.com/app/#strategy/edit/"+ current_strat +"/creatives\">here</a></p>";
					$("#feedback").html(feedback);	
				}				
			})		
	}
});