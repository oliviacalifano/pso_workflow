$(function(){
	get_dmas();
});

function get_dmas()
{
	console.log("getting dmas");;

	aggregate_pages("https://adroit-tools.mediamath.com/t1/api/v2.0/target_values?dimension=DMAX&sort_by=name")
		.then(function(xml) { push_entities_to_multiselect_with_name_prefix(xml, "#geo_dropdown", "DMA", "D")});
}

