
var holder = {};
$("#ctxl_pre").change(function(){
	holder = {};
	console.log($("#ctxl_pre").val());
	$("#ctxl_list").empty();
	get_sub($(this).val(), function(arr){
			
			push_entities_to_multiselect_array(arr, "#ctxl_list");
		});
});

function get_sub(parentId, callback){

var url = "https://adroit-tools.mediamath.com/t1/api/v2.0/targeting_segments?full=*&parent="+ parentId;
	aggregate_pages(url)
		.then(function(xml) { 
				var entities = $(xml).find('entity');

			for (var i=0; i<entities.length; i++) {
				$(entities[i]).each(function(result) {
					var id = $(this).attr("id");
					var children = $(this).find("prop[name=child_count]").attr("value");
					var full = $(this).find("prop[name=full_path]").attr("value");
					console.log(id);

					if(children!="0"){
						holder[full]= id;
						get_sub(id, callback);
					}
					else {
						holder[full]= id;
					}
						})
			}
			
			callback(holder)
		})
};

