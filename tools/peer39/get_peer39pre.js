$(function(){
	$("#ctxl_pre").empty();	
	get($(this).val());
});

function get(sub)
{
	aggregate_pages("https://adroit-tools.mediamath.com/t1/api/v2.0/targeting_segments?full=*&parent="+ 119)
		.then(function(xml) { push_entities_to_multiselect(xml, "#ctxl_pre")});
	
}
