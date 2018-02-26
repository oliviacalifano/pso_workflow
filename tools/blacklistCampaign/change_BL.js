'use strict' 

//returns array of all selected campegies
function get_selected_camps() {
	var camp_id = [];
	//var camp = "191279,191281,191282,191283,191285,191286,191407,191409,191413,191414,193409,193411,193412,193413,193422,193424,193637,193943,193945,194443,194476,194481,194508,195057,195060,199075,199095,199096,199097,199099,199100,199213,200493,202802,205052,205782,205894,208545,208549,208634,210561,210567,212575,212580,212631,212633,214087,214584,214858,214859,214867,214868,216345,219129,219138,219234,219501,219526,219532,219942,219948,220720,225037,225053,225059,225061,225063,225065,225066,225068,225073,225074,225096,225390,225400,225634,225638,225644,225660,225663,225667,227917,227919,227921,227923,227925,228044,228091,228095,228096,228098,228099,228452,230948,230976,234339,236475,236479,236759,237709";
	//var camp_id = camp.split(",");
	//console.log(camp_id);
	//get all selected camp ids
 	$("#campaign_list").each(function(){
		camp_id.push($(this).val());
	});
	 
	//print all camps	
	// for (i=0; i<camp_id.length; i++) {
		// console.log(camp_id[i]);
	// }
	 
	return camp_id;
}
//returns selected blices
function get_selected_bl() 
{

	var bl_id = []; 
	
	//get selected blice ids
	$("#bl_list").each(function() { 
		bl_id.push($(this).val()); 
	});
	
	return bl_id[0];

}

function get_bl_targets(camp_id, callback){
	
	console.log("getting bl for: ",camp_id);
	
	var include_array = [];
	//var exclude_array = [];
	var final_list = {};

	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/campaigns/" + camp_id + "/site_lists?q=assigned%3D%3D1&full=*&sort_by=id",
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {
			
			//var exclude = $(xml).find('exclude').find('entity');
			var include = $(xml).find('entity');


			//exclude.each(function(){ exclude_array.push((this.id)) });
			include.each(function(){ include_array.push((this.id)) });

			//final_list['exclude'] = exclude_array;
			//final_list['include'] = include_array;


			console.log(include_array);


			callback(camp_id, include_array);
		
			
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
}	

function add_to_final_list(include_array, mod_list)
{
	console.log(include_array);100
	console.log(mod_list);
	for(var i = 0; i < mod_list.length; i++){
		if(include_array.indexOf(mod_list[i] == -1)){
			include_array.push(mod_list[i]);
		}
	}

	return include_array;

}

function remove_from_final_list(include_array, mod_list)
{	
	console.log(include_array);
	console.log(mod_list);
	for(var i = 0; i < mod_list.length; i++){
		include_array.remove(mod_list[i]);
	}
	return include_array;
}

function set_targeting(camp_id, include, callback)
{		
		console.log(include);
		var include_array = [];
		var exclude_array = [];
		var final_list;
		var include_list = "";
		var exclude_list = "";
		var success = 0; 

		console.log(include_array);
		console.log(include_array.length);
		
		for(var i = 0; i<include.length; i++){
			include_array.push("site_lists." + (i+1) +".id="+include[i]);
		}
 		for(var i = 0; i<include.length; i++){
			exclude_array.push("site_lists." + (i+1) + ".assigned=1");
		}
		include_list = include_array.join("&");
		exclude_list = exclude_array.join("&");

		include_list = include_array.join("&");
		exclude_list = exclude_array.join("&");

		final_list = include_list + "&" + exclude_list;
		console.log(final_list);

		var request = $.ajax({
			url: "https://adroit-tools.mediamath.com/t1/api/v2.0/campaigns/" + camp_id +"/site_lists",
			type: "POST",
			cache: false,
			dataType: "xml",
			data: final_list,
			success: function(data,textStatus, jqXHR) { 
				success = 1;
				callback(success);
				console.log("success", success);
				console.log("updated " + camp_id);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(jqXHR, textStatus, errorThrown)
				success = 0;
				callback(success);
			}
		})
}

function update_bl_targeting() {

	var camp_list = [];
	var mod_bl = [];
	var feedback = "";
	var success = 0; 
	var final_list = {};

	//check if adding or removing technologies
	var add_remove = $('input[name=add_remove]:checked', '#add_remove').val();
	console.log("add_remove:", add_remove);	
	
	//if no supply source targeting selected, end function 
	if (typeof add_remove === 'undefined') { return; }

	else {
		
		camp_list = get_selected_camps();
		camp_list = camp_list[0]; 
		console.log("camp list:", camp_list);
		
		mod_bl = get_selected_bl(); 
		console.log("list of blice targets", mod_bl);
		
		console.log(mod_bl);

		console.log("starting to loop through camps and update geo");
		for(var i=0; i<camp_list.length; i++) {
		
	 		//get list of current supplies attached to camp
			console.log("updating this camp:",camp_list[i]);
			var current_camp = camp_list[i];
			
			if(mod_bl !== null){
				get_bl_targets(current_camp, function(current_camp, final_list) 
				{
					console.log("bl list for current_camp.  Include: ", final_list);
					if(add_remove == 'add'){
						final_list = add_to_final_list(final_list, mod_bl);
					}
					if(add_remove == 'remove'){
						final_list = remove_from_final_list(final_list, mod_bl);
					}
					console.log("After..bl list for current_camp.  Include: ", final_list);
					
					set_targeting(current_camp, final_list, function(success)
					{			
						if (success == 1 && mod_bl.length!=0) {
							if (add_remove == 'add') {
							feedback = feedback + "<p> Added the blacklists/whitelists for "+current_camp+". Check changes <a target=\"_blank\" href=\"https://adroit-tools.mediamath.com/t1/api/v2.0/campaigns/"+ current_camp +"/site_lists?q=assigned%3D%3D1&sort_by=id\">here</a></p>";								
							$("#feedback").html(feedback); 
							}
							if (add_remove == 'remove') {
							feedback = feedback + "<p> Removed the blacklists/whitelists for "+current_camp+". Check changes <a target=\"_blank\" href=\"https://adroit-tools.mediamath.com/t1/api/v2.0/campaigns/"+ current_camp +"/site_lists?q=assigned%3D%3D1&sort_by=id\">here</a></p>";									
							$("#feedback").html(feedback); 
							}
						}
   
						else{
							var error = "ERROR: ";
							feedback = feedback + "<p>" + error.fontcolor("red")+current_camp+". Check changes <a target=\"_blank\" href=\"https://adroit-tools.mediamath.com/t1/api/v2.0/campaigns/"+ current_camp +"/site_lists?q=assigned%3D%3D1&sort_by=id\">here</a></p>";									
							$("#feedback").html(feedback);
						}
					});	
					
				});
			};
			
		}
	}
}


$("#punch").click(function() {

	console.log("hit!");
	update_bl_targeting(); 
	
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