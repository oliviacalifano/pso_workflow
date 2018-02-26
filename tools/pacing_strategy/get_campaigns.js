function yesterdayDate(){
	today = new Date();
	yesterday = new Date(today);
	yesterday.setDate(today.getDate() - 1);

	var dd = yesterday.getDate();
	var mm = yesterday.getMonth()+1;

	var yyyy = yesterday.getFullYear();
	if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} yesterday = yyyy+'-'+mm+'-'+dd;

	return yesterday;	
}


$("#adv_list").change(function(){
	update_campaign_list($(this).val());
});

function update_campaign_list(adv_ids)
{
	var date = yesterdayDate();
	var options = [];
	var aggregate_pages_promises = [];
	var entities = [];

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
			url = "https://adroit-tools.mediamath.com/t1/api/v2.0/campaigns/limit/advertiser="+adv_ids[i]+"?sort_by=name&q=status%3D%3D1";
			
			
			console.log(url);
			aggregate_pages_promises.push(aggregate_pages(url));
		}
		Promise.all(aggregate_pages_promises).then(function(xml){
			push_entities_to_multiselect(xml.join(), "#campaign_list");
		});
	}	
}