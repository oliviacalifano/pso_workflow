'use strict' 

var feedb = "";

var recencies = {};


function check_recencies(s, n, r){
	var name = n.toUpperCase();
	var recencyNew = r.substring(8);
	//recencyNew = recencyNew.slice(0,-2);
	console.log(recencyNew);

	
	if (n.indexOf(recencyNew) > -1) {
		feedb = feedb + "<p>" + s + " &#10003 </p><p> Name: " + n + "</p><p> Description: " + r + " </p><br></br>"; 
		$("#feedback").html(feedb);
	}
	else if (name.includes('ARCA') || name.includes('MODEL'))
	{
		if(recencyNew == "0-36"){
		feedb = feedb + "<p>" + s + " &#10003 </p><p> Name: " + n + "</p><p> Description: " + r + " </p><br></br>"; 
		$("#feedback").html(feedb);
		}
		else {
		feedb = feedb + "<p>" + s + " ***ARCA Models should have a 0-36 recency. Edit <a target=\"_blank\" href=\"https://t1.mediamath.com/app/#strategy/edit/"+ s +"/details\">here</a></p>" + "<p> Name: " + n + "</p><p> Description: " + r + " </p><br></br>"; 
		$("#feedback").html(feedb);
		}
	}
	else if (n.includes('+'))
	{
		var hold = n.split("_").join(" ");
		hold = hold.split(" ");
		console.log("hold" + hold);
		var plus;
		for (var x in hold){
			console.log(hold[x]);
			if (hold[x].includes("+")) {
				plus = hold[x].slice(0,-1);
				console.log(plus);
			}
		}
		var rec = recencyNew.split('-');
		console.log(rec);
		console.log(plus);
		if (plus == rec[0] && rec[1] >= 200) {
			feedb = feedb + "<p>" + s + " &#10003 </p><p> Name: " + n + "</p><p> Description: " + r + " </p><br></br>"; 
			$("#feedback").html(feedb);
		}
		else {
		feedb = feedb + "<p>" + s + " Edit <a target=\"_blank\" href=\"https://t1.mediamath.com/app/#strategy/edit/"+ s +"/details\">here</a></p>" + "<p> Name: " + n + "</p><p> Description: " + r + " </p><br></br>"; 
		$("#feedback").html(feedb);
		}
	}
	else {
		feedb = feedb + "<p>" + s + " Edit <a target=\"_blank\" href=\"https://t1.mediamath.com/app/#strategy/edit/"+ s +"/details\">here</a></p>" + "<p> Name: " + n + "</p><p> Description: " + r + " </p><br></br>"; 
		$("#feedback").html(feedb);
	}

}

function clearFeed()
{
    document.getElementById('feedback').innerHTML = "";
	document.getElementById('feedback2').innerHTML = "";
}
	
$("#recencies").click(function(){
	clearFeed();
	feedb = "";
	
	//console.log(selectedStrats);
	for (var i = 0; i < selectedStrats.length; i++)
	{
		var strat = selectedStrats[i];
		var shell = strategy1[String(strat)];
		var recency = "";
		if ('description' in shell)
		{
			var recencyTemp = shell['description'].split("##");
			for(var j = 0; j < recencyTemp.length; j++)
			{
				var r = recencyTemp[j];
				//console.log(r.includes('RECENCY'));
				//console.log(r);
				if (r.includes('RECENCY')) {
					recency = r;
				}
			}
		}
		else 
		{
			recency = "";
		}
		
		var name = shell['name'];
		console.log("name " + name);
		console.log("recency " + recency);
		//recencies[name] = recency;
		check_recencies(strat, name, recency);
	}
});
	