$("#org_dropdown").change(function(){
	get_dataPixels($(this).val());

});

function get_dataPixels(org){
	console.log("getting data pixels");
	$("#dataPixels_list").empty(); 
	
	//aggregate_pages("https://adroit-tools.mediamath.com/t1/api/v2.0/pixel_bundles/limit/agency=101286?sort_by=name&q=pixel_type%3D%3Ddata%26eligible%3D%3D1")
	aggregate_pages("https://adroit-tools.mediamath.com/t1/api/v2.0/pixel_bundles/limit/agency.organization="+org+"?sort_by=name&q=pixel_type%3D%3Ddata%26eligible%3D%3D1")
		.then(function(xml) { push_entities_to_multiselect(xml, "#dataPixels_list")});
}