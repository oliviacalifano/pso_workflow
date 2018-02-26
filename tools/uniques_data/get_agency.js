$(function(){
	get_agency();
});


function get_agency()
{
	$("#agency_dropdown").empty(); 


	aggregate_pages("https://adroit-tools.mediamath.com/t1/api/v2.0/agencies?sort_by=name")
		.then(function(xml) { push_entities_to_multiselect(xml, "#agency_dropdown")});
}





