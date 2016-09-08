$(function(){
	get_supply_sources();
});


function get_supply_sources()
{
	$("#supply_list").empty(); 


	aggregate_pages("https://adroit-tools.mediamath.com/t1/api/v2.0/supply_sources?sort_by=name")
		.then(function(xml) { push_entities_to_multiselect(xml, "#supply_list")});
}
