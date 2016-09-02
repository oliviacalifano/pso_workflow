var holder = {};

$("#ven_dropdown").change(function(){
	get_ctxl($(this).val(),function(arr){
		
		console.log("again");
			push_entities_to_multiselect_array(arr, "#aud_dropdown");
		});
});

function get_ctxl(parentId, callback){

	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/audience_segments?sort_by=id&full=*&parent="+ parentId,
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {
			
		var entities = $(xml).find('entity');

			for (var i=0; i<entities.length; i++) {
				$(entities[i]).each(function(result) {
					var id = $(this).attr("id");
					var children = $(this).find("prop[name=child_count]").attr("value");
					var full = $(this).find("prop[name=full_path]").attr("value");
					console.log(id);

					if(children!="0"){
							get_ctxl(id, callback);
					}
					else {
						holder[full]= id;
					}
						})
			}
			
			callback(holder)	
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
}	