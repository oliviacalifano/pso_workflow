$(function(){
	get_orgs();
});


function get_orgs()
{
	$("#org_list").empty(); 


	aggregate_pages("https://adroit-tools.mediamath.com/t1/api/v2.0/organizations?sort_by=name")
		.then(function(xml) { push_entities_to_multiselect(xml, "#org_list")});
}



