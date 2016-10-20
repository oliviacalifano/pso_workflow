$("#deals_list").change(function(){
	$('#d_name').attr("value","");
	$('#d_id').attr("value","");
	$('#d_pub').attr("value","");
	$("#active").prop("checked", false);
	$("#inactive").prop("checked", false);
	var value = $(this).val();
	get_deal_info(value);

});

function get_deal_info(deal){
	console.log("getting deal info");
	
		
	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/deals/"+deal,
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {
		console.log(xml);
			var entity = $(xml).find('entity');
			console.log(entity);
			var name = $(xml).find('prop[name="name"]').attr('value');
			var stat = $(xml).find('prop[name="status"]').attr('value');
			var put = $(xml).find('prop[name="deal_identifier"]').attr('value');
			var pub = $(xml).find('prop[name="supply_source_id"]').attr('value');
			
			
			console.log(put);
			console.log(stat);
			console.log(pub);
			$('#d_id').attr("value",put);
			$('#d_name').attr("value",name);
			$('#sup_list').multipleSelect("setSelects", [pub]);

			$('#d_pub').attr("value",pub);
			if(stat == 1){
			$("#active").prop("checked", true);
			}
			if(stat == 0){
			$("#inactive").prop("checked", true);
			}
		
		}
	})
}