$("#adv_list").change(function(){
	update_concept_list($(this).val());
});

function update_concept_list(adv_ids)
{
	var options = [];
	var aggregate_pages_promises = [];
	var entities = [];

	console.log("empty campaign list..");
	$("#concept_list").empty(); 

	if(!adv_ids){
		console.log("no adv");
		$("#concept_list").empty();
		$("#concept_list").multipleSelect({
			placeholder: "Choose Concepts",
			filter: true
		});	
	}

	else{
		for(var i=0; i<adv_ids.length; i++){
			url = "https://adroit-tools.mediamath.com/t1/api/v2.0/concepts/limit/advertiser="+adv_ids[i]+"?sort_by=name";
			console.log(url);
			aggregate_pages_promises.push(aggregate_pages(url));
		}
		Promise.all(aggregate_pages_promises).then(function(xml){
			push_entities_to_multiselect(xml.join(), "#concept_list");
		});
	}	
}