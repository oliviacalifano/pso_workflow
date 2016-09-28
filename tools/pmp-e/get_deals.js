$("#adv_list").change(function(){
	get_deals($(this).val());

});

function get_deals(ad){
	console.log("getting deals");
	$("#deals_list").empty(); 
	
	aggregate_pages("https://adroit-tools.mediamath.com/t1/api/v2.0/deals/limit/advertiser="+ad+"?sort_by=name")
		.then(function(xml) { push_entities_to_multiselect(xml, "#deals_list")});
}