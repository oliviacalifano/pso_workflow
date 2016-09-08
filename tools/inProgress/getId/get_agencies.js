$("#org_dropdown").change(function(){
	console.log("ok");
	update_agency_list($(this).val());

});

function update_agency_list(org_id)
{
	var options = [];
	var aggregate_pages_promises = [];
	var entities = [];

	console.log("empty agency list..");
	$("#agency_list").empty(); 

	if(!org_id){
		console.log("no org");
		$("#agency_list").empty();
		$("#agency_list").multipleSelect({
			placeholder: "Choose Agency",
			filter: true
		});	
	}

	else{
		for(var i=0; i<org_id.length; i++){
			url = "https://adroit-tools.mediamath.com/t1/api/v2.0/agencies/limit/organization="+org_id[i]+"?sort_by=name";
			console.log(url);
			aggregate_pages_promises.push(aggregate_pages(url));
		}
		Promise.all(aggregate_pages_promises).then(function(xml){
			push_entities_to_multiselect(xml.join(), "#agency_list");
		});
	}	
}