$(function(){
	get_vendors();
});


function get_vendors()
{
	$("#ven_dropdown").empty(); 


	aggregate_pages("https://adroit-tools.mediamath.com/t1/api/v2.0/audience_segments?sort_by=id")
		.then(function(xml) { push_entities_to_multiselect(xml, "#ven_dropdown")});
}





