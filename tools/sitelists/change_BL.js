'use strict' 

//returns array of all selected strategies
function get_selected_strats() {
	var strat_id = [];

 	$("#strat_list").each(function(){
		strat_id.push($(this).val());
	});
	 
	return strat_id;
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

function get_bl_targets(strat_id, callback){
	
	console.log("getting bl for: ",strat_id);
	
	var array = [];
	var final_list = {};

	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/" + strat_id + "/site_lists?q=assigned%3D%3D1&full=*&sort_by=id",
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {
			var entity = $(xml).find('entity');
			entity.each(function(){ array.push((this.id)) });
			console.log(array);
			callback(strat_id, array);
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
}

function get_campaign(current_strat, callback){

	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/" + current_strat,
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {
			var camp = $(xml).find('prop[name=campaign_id]').attr("value");
			console.log(camp);
			callback(current_strat, camp);
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
}	

function add_to_final_list(array, mod_list)
{
	console.log(array);
	console.log(mod_list);
	for(var i = 0; i < mod_list.length; i++){
		if(array.indexOf(mod_list[i] == -1)){
			array.push(mod_list[i]);
		}
	}
	return array;

}

function remove_campaign(strat_id, camp_id, list, bl, a_r, callback)
{		
	if(a_r == "remove"){
		console.log(list);
		var include_array = [];
		var exclude_array = [];
		var final_list;
		var include_list = "";
		var exclude_list = "";
		var success = 0; 

		console.log(bl);
		
		for(var i = 0; i<list.length; i++){
			include_array.push("site_lists." + (i+1) +".id="+list[i]);
		}
 		for(var j = 0; j<list.length; j++){
			if(bl.indexOf(list[j] == -1) && a_r == "remove"){
				console.log(list[j])
				exclude_array.push("site_lists." + (j+1) + ".assigned=0");
			}
			else {
				exclude_array.push("site_lists." + (j+1) + ".assigned=1");
			}
		}
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
				console.log("success", success);
				console.log("updated " + strat_id);
				callback(strat_id);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				callback(success);
				console.log(jqXHR, textStatus, errorThrown)
			}
		})
	}
	else{
		callback(strat_id);
	}
}


function set_targeting(strat_id, list, bl, a_r, callback)
{		
		console.log(list);
		var include_array = [];
		var exclude_array = [];
		var final_list;
		var include_list = "";
		var exclude_list = "";
		var success = 0; 

		console.log(include_array);
		console.log(include_array.length);
		console.log(bl);
		console.log(list);
		
		
		for(var i = 0; i<list.length; i++){
			include_array.push("site_lists." + (i+1) +".id="+list[i]);
		}
 		for(var j = 0; j<list.length; j++){
			if(bl.indexOf(list[j] == -1) && a_r == "remove"){
				console.log(list[j])
				exclude_array.push("site_lists." + (j+1) + ".assigned=0");
			}
			else {
				exclude_array.push("site_lists." + (j+1) + ".assigned=1");
			}
		}
		include_list = include_array.join("&");
		exclude_list = exclude_array.join("&");

		final_list = include_list + "&" + exclude_list;
		console.log(final_list);

		var request = $.ajax({
			url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/" + strat_id +"/site_lists",
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
				callback(success);
				console.log(jqXHR, textStatus, errorThrown)
			}
		})
}

function update_bl_targeting() {

	var strat_list = [];
	var mod_bl = [];
	var feedback = "";
	var success = 0; 
	var final_list = {};
	var count = 0;
	
	//check if adding or removing technologies
	var add_remove = $('input[name=add_remove]:checked', '#add_remove').val();
	console.log("add_remove:", add_remove);	
	
	//if no supply source targeting selected, end function 
	if (typeof add_remove === 'undefined') { return; }

	else {
		
		strat_list = get_selected_strats();
		strat_list = strat_list[0]; 
		console.log("strat list:", strat_list);
		
		mod_bl = get_selected_bl(); 
		console.log("list of blice targets", mod_bl);
		
		console.log(mod_bl);

		console.log("starting to loop through strats and update geo");
		for(var i=0; i<strat_list.length; i++) {
		
	 		//get list of current supplies attached to strat
			console.log("updating this strat:",strat_list[i]);
			var current_strat = strat_list[i];
			
			if(mod_bl !== null){
				get_bl_targets(current_strat, function(current_strat, final_list) 
				{
					console.log("bl list for current_strat.  Include: ", final_list);
					if(add_remove == 'add'){
						final_list = add_to_final_list(final_list, mod_bl);
					}
					console.log("After..bl list for current_strat.  Include: ", final_list);
					
					get_campaign(current_strat,function(current_strat, camp){
						remove_campaign(current_strat,camp,final_list, mod_bl, add_remove, function(current_strat){
							set_targeting(current_strat, final_list, mod_bl, add_remove, function(success)
							{			
								if (success == 1 && mod_bl.length!=0) {
									if (add_remove == 'add') {	
									feedback = feedback + "<p> Added the blacklists/whitelists for "+current_strat+". Check changes <a target=\"_blank\" href=\"https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+ current_strat +"/site_lists?q=assigned%3D%3D1&sort_by=id\">here</a></p>";								
									$("#feedback").html(feedback); 
									}
									if (add_remove == 'remove') {
									feedback = feedback + "<p> Removed the blacklists/whitelists for "+current_strat+". Check changes <a target=\"_blank\" href=\"https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+ current_strat +"/site_lists?q=assigned%3D%3D1&sort_by=id\">here</a></p>";									
									$("#feedback").html(feedback); 
									}
									count = count +1;
									$("#counter").html(count + "/" + strat_list.length);
									
									move(Math.round((count/strat_list.length)*100));
								}
								
							else{
									var error = "ERROR: ";
									feedback = feedback + "<p>" + error.fontcolor("red")+current_camp+". Check changes <a target=\"_blank\" href=\"https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+ current_strat +"/site_lists?q=assigned%3D%3D1&sort_by=id\">here</a></p>";	
									$("#feedback").html(feedback);
							}	
								
							});	
						});
					});
					
				});
			};
			
		}
	}
}

function move(width) {
console.log(width);
  var elem = document.getElementById("myBar");
  elem.style.width = width + '%';
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