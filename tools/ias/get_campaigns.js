$("#adv_list").change(function(){
	update_campaign_list($(this).val());
});

<<<<<<< HEAD
$("#active_camp").change(function(){
	update_campaign_list($("#adv_list").val());
});

$("#inactive_camp").change(function(){
	update_campaign_list($("#adv_list").val());
});

$("#all_camp").change(function(){
	update_campaign_list($("#adv_list").val());
});

=======
>>>>>>> b9b35f8b2200c79d520123d4d58aa7169a3d2830
function update_campaign_list(adv_ids)
{
	var options = [];
	var aggregate_pages_promises = [];
	var entities = [];
<<<<<<< HEAD
	
	var active_camp = $('#active_camp').is(':checked');
	console.log(active_camp);
	var inactive_camp = $('#inactive_camp').is(':checked');
	console.log(inactive_camp);
=======
>>>>>>> b9b35f8b2200c79d520123d4d58aa7169a3d2830

	console.log("empty campaign list..");
	$("#campaign_list").empty(); 

	if(!adv_ids){
		console.log("no adv");
		$("#campaign_list").empty();
		$("#campaign_list").multipleSelect({
			placeholder: "Choose Campaigns",
			filter: true
		});	
	}

	else{
		for(var i=0; i<adv_ids.length; i++){
<<<<<<< HEAD
			if(active_camp == true){
			url = "https://adroit-tools.mediamath.com/t1/api/v2.0/campaigns/limit/advertiser="+adv_ids[i]+"?sort_by=name&q=status%3D%3D1";
			}
			else if(inactive_camp == true){
			url = "https://adroit-tools.mediamath.com/t1/api/v2.0/campaigns/limit/advertiser="+adv_ids[i]+"?sort_by=name&q=status%3D%3D0";
			}
			else{
			url = "https://adroit-tools.mediamath.com/t1/api/v2.0/campaigns/limit/advertiser="+adv_ids[i]+"?sort_by=name";
			}
=======
			url = "https://adroit-tools.mediamath.com/t1/api/v2.0/campaigns/limit/advertiser="+adv_ids[i]+"?sort_by=name";
>>>>>>> b9b35f8b2200c79d520123d4d58aa7169a3d2830
			console.log(url);
			aggregate_pages_promises.push(aggregate_pages(url));
		}
		Promise.all(aggregate_pages_promises).then(function(xml){
			push_entities_to_multiselect(xml.join(), "#campaign_list");
		});
	}	
}