'use strict' 

//returns array of all selected strategies
function get_selected_strats() {

	var strat_id = [];
	
	//get all selected strat ids
	$("#strat_list").each(function(){
		strat_id.push($(this).val());
	});
	
	//print all strats	
	// for (i=0; i<strat_id.length; i++) {
		// console.log(strat_id[i]);
	// }
	 
	return strat_id;
}

function get_version(strat, callback){
	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat,
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {
			var version = $(xml).find('entity').attr('version');
			console.log(version);
		
			callback(strat, version);
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
}	

function set_targeting(strat_id, ver, callback)
{		
		var s_s = $("#site_selectiveness").val();

		var transparent = $('input:radio[name=add_remove]:checked').val();
		console.log("add_remove:", transparent);	
		
		if( $('input:radio[name=add_remove]:checked').is(":not(:checked)")) {transparent = 0};
		console.log(transparent);
		
		if (typeof transparent === 'undefined') { transparent = 0};
		console.log(transparent);

		var to_post = "version="+ ver +"&site_selectiveness="+s_s+"&site_restriction_transparent_urls="+transparent;

		var request = $.ajax({
			url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat_id,
			type: "POST",
			cache: false,
			dataType: "xml",
			data: to_post,
			success: function(data,textStatus, jqXHR) { 
				var success = 1;
				callback(success);
				console.log("success", success);
				console.log("updated " + strat_id);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(jqXHR, textStatus, errorThrown)
			}
		})
}


function update_dataPixel_targeting() {
	var feedback = "";
	var count = 0;
	
	var strat_list = get_selected_strats();
	strat_list = strat_list[0]; 
	console.log("strat list:", strat_list);
	
		console.log("starting to loop through strats and update data pixels");
		for(var i=0; i<strat_list.length; i++) {
		
	 		//get list of current supplies attached to strat
			console.log("updating this strat:",strat_list[i]);
			var current_strat = strat_list[i];

				get_version(current_strat, function(current_strat, v) 
				{
					set_targeting(current_strat, v, function(success)
					{			
						if (success == 1) {
							count = count +1;
							$("#counter").html(count + "/" + strat_list.length);
							
							move(Math.round((count/strat_list.length)*100));
							feedback = feedback + "<p>Updated "+current_strat+". Check changes <a target=\"_blank\" href=\"https://t1.mediamath.com/app/#strategy/edit/"+current_strat+"/targeting/siteList\">here</a></p>";								
							$("#feedback").html(feedback); 
						}
						else{
							var error = "ERROR: ";
							feedback = feedback + "<p>" + error.fontcolor("red")+current_camp+". Check changes <a target=\"_blank\" href=\"https://t1.mediamath.com/app/#strategy/edit/"+current_strat+"/targeting/siteList\">here</a></p>";								
							$("#feedback").html(feedback); 
						}
					});	
					
				});
					
				};
			};

function move(width) {
console.log(width);
  var elem = document.getElementById("myBar");
  elem.style.width = width + '%';
}			
			
$("#punch").click(function() {
	console.log("hit!");
	update_dataPixel_targeting();
})	