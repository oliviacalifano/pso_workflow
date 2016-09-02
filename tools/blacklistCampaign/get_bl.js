$("#org_dropdown").change(function(){
	console.log("ok");
	update_bl_list($(this).val());

});

function update_bl_list(org_id)
{
	
	$("#bl_list").empty(); 

	console.log("getting bl for org", org_id);

	aggregate_pages("https://adroit-tools.mediamath.com/t1/api/v2.0/site_lists/limit/organization=" + org_id + "?sort_by=name")
		.then(function(xml) { push_entities_to_multiselect(xml, "#bl_list")});	
}
