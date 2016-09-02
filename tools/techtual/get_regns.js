$(function(){
	get_regns();
	get_sub_regns(60, "CAN");
	get_sub_regns(124, "IN");
	get_sub_regns(53, "BRAZ");
	get_sub_regns(99, "UK");
	get_sub_regns(243, "TRKY");
	get_sub_regns(161, "MEX");
	get_sub_regns(251, "USA");

	get_dmas();
});

function get_regns()
{
	console.log("getting regions");;

	aggregate_pages("https://adroit-tools.mediamath.com/t1/api/v2.0/target_values?dimension=REGN&sort_by=name")
		.then(function(xml) { push_entities_to_multiselect_with_name_prefix(xml, "#geo_dropdown", "REGN", "R")});
}


function get_sub_regns(regn_id, regn_name)
{
	console.log("getting regions");;

	aggregate_pages("https://adroit-tools.mediamath.com/t1/api/v2.0/target_values?dimension=REGN&parent="+regn_id+"&sort_by=name")
		.then(function(xml) { push_entities_to_multiselect_with_name_prefix(xml, "#geo_dropdown", regn_name, "R")});
}


function get_dmas()
{
	console.log("getting dmas");;

	aggregate_pages("https://adroit-tools.mediamath.com/t1/api/v2.0/target_values?dimension=DMAX&sort_by=name")
		.then(function(xml) { push_entities_to_multiselect_with_name_prefix(xml, "#geo_dropdown", "DMA", "D")});
}

