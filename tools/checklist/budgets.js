'use strict' 

var feedback, feedback2;
var spend = {};
var currentDate = new Date().toISOString().slice(0,-5);

jQuery.extend({
    percentage: function(a, b) {
        var p = Math.round((a / b) * 100);
		return p + "%";
    }
});

function check_strategyBudget(s, callback){
	var shell = strategy1[String(s)];

	var cStartDate = camp['start_date']
	var cEndDate = camp['end_date']
			
	var sStartDate = 0;
			
	if (shell['use_campaign_start'] == 1) sStartDate = cStartDate;  
	else 
	{	if (shell['start_date'] >= currentDate) sStartDate = currentDate;
		else sStartDate = shell['start_date'];
	}
	
	
	var u = "https://adroit-tools.mediamath.com/t1/reporting/v1/std/performance?dimensions=strategy_name&metrics=total_spend&filter=strategy_id=" + s + "&time_rollup=all&start_date=" + sStartDate + "&end_date=" + currentDate;
	
	var request = $.ajax({
		url: u,
		type: "GET",
	
		success: function(csv) {
			var data = csv.split('\n');
			data = data[1].split(',');
			data = data[3];
			//spend[sId] = data;
			console.log(data);
			
			callback(s, data);
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}	
	});
}	

$("#budgets").one('click', function(){	
	clear('feedback');
	feedback = "";
	
	var count = 0;
	console.log("starting to loop through strats and update geo");
	for(var i=0; i<selectedStrats.length; i++) {
	
		//get list of current supplies attached to strat
		console.log("updating this strat:",selectedStrats[i]);
		var current_strat = selectedStrats[i];
		
			check_strategyBudget(current_strat, function(current_strat, spend) 
			{
				var shell = strategy1[String(current_strat)];
				var budget = shell['budget'];	
				
				if (spend >= 0.75*budget)
				{		
					feedback = feedback + "<p> " + current_strat + ": You have spent over 75% of your strategy budget! Edit <a target=\"_blank\" href=\"https://t1.mediamath.com/app/#strategy/edit/"+ current_strat +"/details\">here</a></p>";
					$("#feedback").html(feedback);
				}
				else 
				{
					feedback = feedback + "<p> " + current_strat + ": &#10003 </p>"; 
					$("#feedback").html(feedback);
				}
				count = count+1;
				feedback2 = $.percentage(count, selectedStrats.length); 
				$("#feedback2").html(feedback2);
				
			})

			
	}
});



