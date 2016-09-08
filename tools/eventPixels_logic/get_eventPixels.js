$("#adv_list").change(function(){
	get_eventPixels($(this).val());

});

function get_eventPixels(ad){
	console.log("getting event pixels");
	$("#eventPixels_list").empty(); 
	
	//aggregate_pages("https://adroit-tools.mediamath.com/t1/api/v2.0/pixel_bundles/limit/agency=101286?sort_by=name&q=pixel_type%3D%3Devent%26eligible%3D%3D1")
	//"https://adroit-tools.mediamath.com/t1/api/v2.0/pixel_bundles/limit/advertiser="+ad+"?sort_by=name&q=pixel_type%3D%3Devent%26eligible%3D%3D1"
	aggregate_pages("https://adroit-tools.mediamath.com/t1/api/v2.0/pixel_bundles/limit/advertiser="+ad+"?sort_by=name&q=eligible%3D%3D1")
		.then(function(xml) { push_entities_to_multiselect(xml, "#eventPixels_list")});
}