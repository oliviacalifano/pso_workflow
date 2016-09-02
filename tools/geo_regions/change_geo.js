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

//returns array of geo targets
function get_selected_geo() 
{

	var geo_id = []; 
	
	//get selected supply ids
	$("#geo_dropdown").each(function() { 
		geo_id.push($(this).val()); 
	});
	
	return geo_id[0];

}


function get_regn_geo_targets(strat_id, callback){
	
	console.log("getting geo for: ",strat_id);
	
	var include_array = [];
	var exclude_array = [];
	var final_list = {};

	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat_id+"/target_dimensions/7",
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {
			
			var exclude = $(xml).find('exclude').find('entity');
			var include = $(xml).find('include').find('entity');


			exclude.each(function(){ exclude_array.push((this.id)) });
			include.each(function(){ include_array.push((this.id)) });

			final_list['exclude'] = exclude_array;
			final_list['include'] = include_array;


			//console.log(final_list);


			callback(strat_id, final_list);
		
			
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
}	

function add_to_final_list(final_list, mod_list)
{
	for(var i = 0; i < mod_list.length; i++){
		if(final_list.indexOf(mod_list[i] == -1)){
			final_list.push(mod_list[i]);
		}
	}

	return final_list;
}

function remove_from_final_list(final_list, mod_list)
{	
	for(var i = 0; i < mod_list.length; i++){
		final_list.remove(mod_list[i]);
	}
	return final_list;
}

function set_targeting(strat_id, regn_dma, final_list, callback)
{		
		var include_array = [];
		var exclude_array = [];
		var include_list = "";
		var exclude_list = "";
		var success = 0; 

		for(var i = 0; i<final_list['include'].length; i++){
			include_array.push("include="+final_list['include'][i]);
		}
		for(var i = 0; i<final_list['exclude'].length; i++){
			exclude_array.push("exclude="+final_list['exclude'][i]);
		}
		include_list = include_array.join("&");
		exclude_list = exclude_array.join("&");

		final_list = include_list + "&" + exclude_list;
		console.log(final_list);


		var request = $.ajax({
			url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat_id+"/target_dimensions/"+regn_dma,
			type: "POST",
			cache: false,
			dataType: "xml",
			data: final_list,
			success: function(data,textStatus, jqXHR) { 
				success = 1;
				callback(success);
				console.log("success", success);
				console.log("updated " + strat_id);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(jqXHR, textStatus, errorThrown)
			}
		})
}


function update_geo_targeting() {

	var strat_list = [];
	var mod_geo = [];
	var mod_regn = [];
	var feedback = "";
	var success = 0; 
	var final_list = {};

	//check if adding or removing supplies
	var add_remove = $('input[name=add_remove]:checked', '#add_remove').val();
	console.log("add_remove:", add_remove);	
	
	var include_exclude = $('input[name=include_exclude]:checked', '#include_exclude').val();
	console.log("include_exclude:", include_exclude);	
	
	

	//if no supply source targeting selected, end function 
	if (typeof add_remove === 'undefined') { return; }
	if (typeof include_exclude === 'undefined') { return; }

	else {		
		strat_list = get_selected_strats();
		strat_list = strat_list[0]; 
		console.log("strat list:", strat_list);
		
		mod_geo = get_selected_geo(); 
		console.log("list of geo targets", mod_geo);

		

		for(var i=0; i<mod_geo.length; i++){
			console.log(mod_geo[i]);
			
			if (mod_geo[i][0] == 'R'){
				mod_regn.push(mod_geo[i].substring(1));
			}
		}

		console.log("regns: ", mod_regn);

		console.log("starting to loop through strats and update geo");
		for(var i=0; i<strat_list.length; i++) {
		
	 		//get list of current supplies attached to strat
			console.log("updating this strat:",strat_list[i]);
			var current_strat = strat_list[i];

			get_regn_geo_targets(current_strat, function(current_strat, final_list) 
			{
				console.log("REGN list for current_strat.  Include: ", final_list['include'], " Exclude: ", final_list['exclude']);
				if(add_remove == 'add'){
					final_list[include_exclude] = add_to_final_list(final_list[include_exclude], mod_regn);
				}
				if(add_remove == 'remove'){
					final_list[include_exclude] = remove_from_final_list(final_list[include_exclude], mod_regn);
				}
				console.log("After..REGN list for current_strat.  Include: ", final_list['include'], " Exclude: ", final_list['exclude']);
				
				set_targeting(current_strat, '7', final_list, function(success)
				{			
					if (success == 1 && mod_regn.length!=0) {
						feedback = feedback + "<p>Updated region targeting for "+current_strat+". Check changes <a target=\"_blank\" href=\"https://adroit-tools.mediamath.com/t1/api/strategies/"+current_strat+"/target_dimensions/7\">here</a></p>";								
						$("#feedback").html(feedback); 
					}
					else{
							var error = "ERROR: ";
							feedback = feedback + "<p>" + error.fontcolor("red")+current_camp+". Check changes <a target=\"_blank\" href=\"https://adroit-tools.mediamath.com/t1/api/strategies/"+current_strat+"/target_dimensions/7\">here</a></p>";								
						$("#feedback").html(feedback); 
						}
				});	
				
			});
		}
	}
}


$("#punch").click(function() {

	console.log("hit!");
	update_geo_targeting(); 
	
})	



Object.defineProperty(Array.prototype, "remove", {
    enumerable: false,
    value: function (item) {
        var removeCounter = 0;

        for (var index = 0; index < this.length; index++) {
            if (this[index] === item) {
                this.splice(index, 1);
                removeCounter++;
                index--;
            }
        }
        return removeCounter;
    }
});
