$("#org_dropdown").change(function(){
	console.log("ok");
	update_adv_list($(this).val());

});

function update_adv_list(org_id)
{
	
	$("#adv_list").empty(); 

	console.log("getting advs for org", org_id);

	aggregate_pages("https://adroit-tools.mediamath.com/t1/api/v2.0/advertisers/limit/agency.organization="+org_id+"?sort_by=name")
		.then(function(xml) { push_entities_to_multiselect(xml, "#adv_list")});
	
}