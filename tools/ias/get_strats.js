<<<<<<< HEAD
=======

>>>>>>> b9b35f8b2200c79d520123d4d58aa7169a3d2830
$("#campaign_list").change(function(){
	update_strat_list($(this).val());
});

$("#active").change(function(){
	update_strat_list($("#campaign_list").val());
});

<<<<<<< HEAD
$("#inactive").change(function(){
	update_strat_list($("#campaign_list").val());
});

$("#all").change(function(){
	update_strat_list($("#campaign_list").val());
});

=======
>>>>>>> b9b35f8b2200c79d520123d4d58aa7169a3d2830
function update_strat_list(camp_ids)
{
	var options = [];
	var aggregate_pages_promises = [];
	var entities = [];
<<<<<<< HEAD
	var active = $('#active').is(':checked');
	console.log(active);
	var inactive = $('#inactive').is(':checked');
	console.log(inactive);
=======
>>>>>>> b9b35f8b2200c79d520123d4d58aa7169a3d2830

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
<<<<<<< HEAD
			
			if(active == true){
			url = "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/limit/campaign="+camp_ids[i]+"?sort_by=name&q=status%3D%3D1";
			}
			else if(inactive == true){
			url = "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/limit/campaign="+camp_ids[i]+"?sort_by=name&q=status%3D%3D0";
			}
=======
			var active = $('#active').is(':checked');
			if($('#active').is(':checked')){
			url = "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/limit/campaign="+camp_ids[i]+"?sort_by=name&q=status%3D%3D1";
			}
>>>>>>> b9b35f8b2200c79d520123d4d58aa7169a3d2830
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

<<<<<<< HEAD

=======
>>>>>>> b9b35f8b2200c79d520123d4d58aa7169a3d2830
