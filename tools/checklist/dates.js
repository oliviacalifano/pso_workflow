'use strict' 

var feedback = "";

function check_campaignDate(c, cId){

	var camp = c;
	var campaign_id = cId;

	var cStartDate = camp['start_date']
	var cEndDate = camp['end_date']
	var currentDate = new Date().toISOString().slice(0,-5);
	
	if (currentDate >= cStartDate && currentDate <= cEndDate)
	{
		console.log("current date between campaign start and end date");
		feedback = feedback + "<p> C " + cId + ": &#10003 </p>"; 
		$("#feedback").html(feedback);
	}
	else
		feedback = feedback + "<p> C " + cId + ": The current date is not between the campaign start and end dates. Edit <a target=\"_blank\" href=\"https://t1.mediamath.com/app/#campaign/edit/"+ cId +"/details\">here</a></p>";
		$("#feedback").html(feedback);	
		
	
	console.log(cStartDate);
	console.log(cEndDate);
	console.log(currentDate);

}	


function check_dates(s, sI, c){
	
	var strat = sI;
	var stratId = s;
	var camp = c;

	var cStartDate = camp['start_date']
	var cEndDate = camp['end_date']
	var currentDate = new Date().toISOString().slice(0,-5);
	
	var sStartDate = 0;
	var sEndDate = 0;
	
	if (strat['use_campaign_start'] == 1) sStartDate = cStartDate;  
	else sStartDate = strat['start_date'];
		
	if (strat['use_campaign_end'] == 1) sEndDate = cEndDate;  
	else sEndDate = strat['end_date'];				
		
	if (currentDate >= sStartDate && currentDate <= sEndDate)
	{		
		//console.log("current date between strategy start and end date");
		feedback = feedback + "<p> S " + stratId + ": &#10003 </p>"; 
		$("#feedback").html(feedback);
	}
	else 
	{
		feedback = feedback + "<p> S " + stratId + ": The current date is not between the strategy start and end dates. Edit <a target=\"_blank\" href=\"https://t1.mediamath.com/app/#strategy/edit/"+ stratId +"/details\">here</a></p>";
		$("#feedback").html(feedback);
	}
	//console.log("current date is not between strategy start and end date");
	
	console.log(sStartDate);
	console.log(sEndDate);
	console.log(currentDate);
			
	//check budget
	//feedback = feedback + "<p>Updated supply targeting for "+strat+"</p>"; 
			//$("#feedback").html(feedback);		
	}	
	
function clear()
{
    document.getElementById('feedback').innerHTML = "";
	document.getElementById('feedback2').innerHTML = "";
}

$("#dates").click(function(){
	
	clear();
	feedback = "";
	
	console.log("hit!");
	console.log(strategy1);
	console.log(camp);
	
	check_campaignDate(camp, campaignId);
	for (var i = 0; i < selectedStrats.length; i++){
	var strat = selectedStrats[i];
	var stratInfo = strategy1[String(strat)];
	//console.log("B" + strategy1.strat[]);
	console.log(selectedStrats[i]);
	check_dates(strat, stratInfo, camp);
	}
	
})	


