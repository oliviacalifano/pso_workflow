$("#organizations_list").change(function(){
	console.log("ok");
	update_advertisers_list($(this).val());

});

function update_advertisers_list(org_id)
{
	var options = [];
	var aggregate_pages_promises = [];
	var entities = [];

	console.log("empty adv list..");
	$("#advertisers_list").empty(); 

	if(!org_id){
		console.log("no org");
		$("#advertisers_list").empty();
		$("#advertisers_list").multipleSelect({
			placeholder: "Choose Advertiser",
			filter: true
		});	
	}

	else{
		for(var i=0; i<org_id.length; i++){
			url = "https://adroit-tools.mediamath.com/t1/api/v2.0/advertisers/limit/agency.organization="+org_id[i]+"?sort_by=name";
			console.log(url);
			aggregate_pages_promises.push(aggregate_pages(url));
		}
		Promise.all(aggregate_pages_promises).then(function(xml){
			push_entities_to_multiselect(xml.join(), "#advertisers_list");
		});
	}	
}