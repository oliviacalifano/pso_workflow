
$("#campaign_list").change(function(){
	update_strat_list($(this).val());
});

$("#active").change(function(){
	update_strat_list($("#campaign_list").val());
});

function update_strat_list(camp_ids)
{
	var options = [];
	var aggregate_pages_promises = [];
	var entities = [];

	console.log("empty strat list..");
	$("#strat_list").empty(); 

	if(!camp_ids){
		console.log("no camps");
		$("#strat_list").empty();
		$("#strat_list").multipleSelect({
			placeholder: "Choose Campaigns",
			filter: true
		});	
	}

	else{
		for(var i=0; i<camp_ids.length; i++){
			var active = $('#active').is(':checked');
			if($('#active').is(':checked')){
			url = "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/limit/campaign="+camp_ids[i]+"?sort_by=name&q=status%3D%3D1";
			}
			else {
			url = "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/limit/campaign="+camp_ids[i]+"?sort_by=name";	
			}
			console.log(url);
			aggregate_pages_promises.push(aggregate_pages(url));
		}
		Promise.all(aggregate_pages_promises).then(function(xml){
			push_entities_to_multiselect(xml.join(), "#strat_list");
		});
	}	
}



/* 
$("#campaign_list").change(function(){
	update_strat_list($(this).val());
});

function update_strat_list(camp_ids)
{
	var options = [];
	var aggregate_pages_promises = [];
	var entities = [];

	$("#strat_list").empty(); 

	if(!camp_ids){
		console.log("no camps");
		$("#strat_list").empty();
		$("#strat_list").multipleSelect({
			placeholder: "Choose Campaigns",
			filter: true
		});	
	}

	else{
		for(var i=0; i<camp_ids.length; i++){
			url = "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/limit/campaign="+camp_ids[i]+"?sort_by=name&q=status%3D%3D1"
			//url = "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/limit/campaign="+camp_ids[i]+"?sort_by=name"
			//console.log(url);
			aggregate_pages_promises.push(aggregate_pages(url));
		}
		
		Promise.all(aggregate_pages_promises).then(function(xml){
			push_entities_to_multiselect(xml.join(), "#strat_list");
		});
	}	
}
 */
