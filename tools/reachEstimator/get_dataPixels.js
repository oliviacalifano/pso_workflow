
$("#adv_list").change(function(){
	$("#dataPixels_list").empty();
	get_eventPixels($(this).val());

});

function get_eventPixels(adv){
	console.log("getting event pixels");
	
	
	aggregate_pages("https://adroit-tools.mediamath.com/t1/api/v2.0/pixel_bundles/limit/advertiser="+adv+"?sort_by=name&q=pixel_type%3D%3Devent%26eligible%3D%3D1")
	//aggregate_pages("https://adroit-tools.mediamath.com/t1/api/v2.0/pixel_bundles/limit/agency.organization="+ag+"?with=pixel_bundle_urls&pixel_type=data&q=eligible%3D%3D1"")
		.then(function(xml) { push_entities_to_multiselect_with_name_prefix(xml, "#dataPixels_list")});
} 