var holder = {};

$(function(){
	get_ias("1", function(arr){
		
		console.log("again");
			push_entities_to_multiselect_array(arr, "#ias_list");
		});
});

function get_ias(parentId, callback){

	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/targeting_segments?full=*&parent="+ parentId,
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
							get_ias(id, callback);
					}
					else {
						holder[full]= id;
					}
						})
			}
			
			callback(holder)
/* 			var concepts = {};

			xmlDoc.find("entity[type=strategy_targeting_segment]").each(function() {
				if()
				
				concepts[$(this).attr("id")] = $(this).attr("name");
			});
			

			entities.each(function(){ exclude_array.push((this.id)) });
			
			
			include.each(function(){ include_array.push((this.id)) });

			final_list['exclude'] = exclude_array;
			final_list['include'] = include_array;


			console.log(final_list); */

		
			
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
}	