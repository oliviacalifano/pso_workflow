$(function(){
	get_supply_sources();
});


function get_supply_sources()
{
	$("#supply_list").empty(); 


	aggregate_pages("https://adroit-tools.mediamath.com/t1/api/v2.0/supply_sources?sort_by=name&q=has_video%3D%3D1%26rtb_enabled%3D%3D1")
		.then(function(xml) { push_entities_to_multiselect(xml, "#supply_list")});
}
