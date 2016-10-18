'use strict' 

//returns array of all selected strategies
function get_selected_strats() {

	var strat_id = [];
	
	//get all selected strat ids
	$("#strat_list").each(function(){strat_id.push($(this).val());});
	
	//print all strats	
	// for (i=0; i<strat_id.length; i++) {
		// console.log(strat_id[i]);
	// }
	
	return strat_id;
}

//returns array of selected supply sources
function get_selected_supply() {

	var supply_id = []; 
	
	//get selected supply ids
	$("#supply_list").each(function() {supply_id.push($(this).val());});
	
	return supply_id;

}

//returns all supply sources assigned to a particular strat id
function get_supply_list(strat_id, callback){
	
	console.log("getting supply sources for: ",strat_id);
	
	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat_id+"/supplies",
		type: "GET",
		cache: false,
		dataType: "xml",
		success: function(xml) {
			var entity = $(xml).find('entity');
			var prop = $(xml).find('prop');
			var all_exchanges ="0"; 

		//if strat is running on all exchanges, assign 1 and end function
			for (var i=0; i<prop.length; i++) {
				$(prop[i]).each(function(result) {
					var supply_id = $(this).attr('value');
					var supply_name = $(this).attr('name');
					if (supply_name == "run_on_all_exchanges" && supply_id == "1") {
							// console.log("RUNNING ON ALL");
							all_exchanges = "1";	
							// console.log(all_exchanges);
							// return all_exchanges; 
							callback(strat_id,all_exchanges);
					}
				})
			}
		//if not running on all exchanges, make list of supply sources	
			if (all_exchanges == "0") {
				var supply_list = [];

				// console.log('reached loop');
				for (i=0; i<entity.length; i++) {
						$(entity[i]).each(function(result) {
						var supply_id = $(this).attr('id');
						var supply_name = $(this).attr('name');
						// console.log(supply_name, supply_id); 
						supply_list.push(supply_id);
					})
				}
				
				//remove strat info and just return list of supply sources
				supply_list.splice(0,1);
				// console.log(supply_list); 
				// return supply_list; 
				callback(strat_id,supply_list);
			}
			
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
}	

//adds supply sources from the input list of exchanges, returns updated list
function add_supply(supply_list, mod_supplies) {
	
	//if running on all exchanges, do nothing
	if (supply_list == '1') {
		console.log("running on all - don't add anything");
		return supply_list;
	}
	//if supply source not in current list, add it
	else {
		for (var i=0; i<mod_supplies.length; i++) {
			if (supply_list.indexOf(mod_supplies[i])==-1) {			
				supply_list.push(mod_supplies[i]);
			}	
		}
		
		// for (i=0; i<supply_list.length; i++) {console.log(supply_list[i]);}
		
		return supply_list;
	}	
}

//removes supply sources from the input list of exchanges, returns updated list
function remove_supply(supply_list, mod_supplies, callback) {

	//if strategy currently running on all exchanges, get full list of supplies and remove selected
	if (supply_list == '1') {
	
		var request = $.ajax({
			url: "https://adroit-tools.mediamath.com/t1/api/v2.0/supply_sources?sort_by=name&q=rtb_type%21%3DBATCH%26has_display%3D%3D1",
			type: "GET",
			cache: false,
			dataType: "xml",
			success: function(xml) {
			
			//get full list of current supply sources from api
				var all_supplies = []; 
			
				$(xml).find('entity').each(function(result) {
					var s_id = $(this).attr('id')
					var s_name = $(this).attr('name')
					all_supplies.push(s_id); 
				})
				
				//print full list
				console.log("full supply list", all_supplies); 
				console.log(all_supplies.length); 
				
				//if supply source exists in current list, remove it and update supply list
				for (var i=0; i<mod_supplies.length; i++) {	
					var index=all_supplies.indexOf(mod_supplies[i].toString());
					if (index != "-1") {
						all_supplies.splice(index,1);
					}	
				}
				
				console.log("mod supply list",all_supplies); 
				console.log(all_supplies.length);
				callback(supply_list, mod_supplies, all_supplies); 	
				
			},
			error: function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR, textStatus, errorThrown)
			}
		})
	}	

	//if strat NOT running on all exchanges, remove selected
	else {
		for (var i=0; i<mod_supplies.length; i++) {
			var index = supply_list.indexOf(mod_supplies[i]);
			if (index != -1) {
				supply_list.splice(index,1);	
			}
	}
	
	console.log("not running on all ex ",supply_list);
	console.log(supply_list, mod_supplies, supply_list);	


	callback(supply_list, mod_supplies, supply_list);	
	}
}

//posts the updated supply list to a strategy 
function update_supply(strat_id, supply_list,callback) {
var success =0;
	//if strat is running on all supply sources, ignore
	if (supply_list=='1') { return '0'; }

	//otherwise, update strat with modified list
	else {
	
		//create dictionary of all supply source ids
		var supply_dict = {}; 
		


		for (i=0; i<supply_list.length; i++) {
			supply_dict['supply_source.'+(i+1).toString()+'.id']=supply_list[i];
		}
		
		console.log(supply_dict);
		
		var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat_id+"/supplies",
		type: "POST",
		cache: false,
		dataType: "xml",
		data: supply_dict, 
		success: function(data,textStatus, jqXHR) {
			success =1;
			console.log("updated " + strat_id); 
			callback(success,strat_id);
		},
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
		})
		return "updated supply successfully";
	}
}

//posts run_on_all_exchanges to strategy 
function run_on_all_ex(strat_id,callback) {
var success =0;
	var request = $.ajax({
	url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat_id+"/supplies",
	type: "POST",
	cache: false,
	dataType: "xml",
	data: {all_exchanges:'1'},
	success: function(data,textStatus, jqXHR) {
		success =1;
		console.log("updated " + strat_id);
		callback(success,strat_id);		
	},
	error: function(jqXHR, textStatus, errorThrown) {
	console.log(jqXHR, textStatus, errorThrown)
	}
	})
	return "updated supply successfully";	
}

function update_fold_position(s_id, fold_position,callback) {
var success = 0;

	if (fold_position.length == 1) {
		if(fold_position == 0){
		var position = " ";
		}
		else {
		var position = "include="+fold_position[0];
		}
		console.log("only one fold", fold_position[0]);
	}

	else {	

		var position = ""; 
			
			for (i=0; i<fold_position.length; i++) {
				position = position + "include="+fold_position[i]+"&";
			}
			
		position = position.substring(0, position.length - 1);
		console.log("multiple fold", position);
	}
	
	console.log("fold_positions are", position);	
	
	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+s_id+"/target_dimensions/19",
		type: "POST",
		cache: false,
		dataType: "xml",
		data: position,
		success: function(data,textStatus, jqXHR) {
			success = 1;
			console.log("fold updated " + s_id); 
			callback(success,s_id);
		},
		error: function(jqXHR, textStatus, errorThrown) {
		success = 0;
		callback(success,s_id);
		console.log(jqXHR, textStatus, errorThrown)
		}
		})
		
		return "updated fold position successfully";	
}

function update_supply_sources() {
	var feedback = ""; 
	var count1 = 0;
	//check if adding or removing supplies
	var choice = $('input[name=choice]:checked', '#add_remove').val();
	console.log("choice", choice);	
	
	//if no supply source targeting selected, end function 
	if (typeof choice === 'undefined') { return; }
	
	else {		
		//get selected strat and supply ids
		var strat_list = get_selected_strats();
		strat_list = strat_list[0]; 
		console.log("strat list:", strat_list);
		var mod_exchanges = get_selected_supply(); 
		mod_exchanges = mod_exchanges[0];
		
		console.log("list of exchanges to mod ",mod_exchanges);
		

		console.log("starting to loop through strats and update supply");
		for(var i=0; i<strat_list.length; i++) {
		
			//get list of current supplies attached to strat
			console.log("updating this strat:",strat_list[i]);
			var current_strat = strat_list[i];
			console.log(strat_list[i], current_strat);
				
				// s_list = get_supply_list(current_strat); 
				get_supply_list(current_strat, function(current_strat, s_list)
				{
					console.log("Strat ID and supply list: ", current_strat, s_list);
					console.log(strat_list[i], current_strat);
					
					//add selected supplies to list and post new list
					if (choice == "Add") {
						var updated_list = add_supply(s_list, mod_exchanges);
						update_supply(current_strat,updated_list,function(success,current_strat){	
						if(success == 1){
						count1 = count1 +1;	
						feedback = feedback + "<p>Updated supply targeting for "+current_strat+"</p>"; 
						print(count1, strat_list.length,current_strat,feedback);		
						console.log("added" + updated_list + " to " + current_strat);
						}
						});
					}
					
					//remove supplies and update
					else if (choice == "Remove") {
						remove_supply(s_list, mod_exchanges, function(s_list, mod_exchanges, updated_list){
							update_supply(current_strat,updated_list,function(success,current_strat){
								if(success == 1){
								count1 = count1 +1;
								feedback = feedback + "<p>Updated supply targeting for "+current_strat+"</p>"; 
								print(count1, strat_list.length,current_strat,feedback);
								console.log("removed " + updated_list + " from " + current_strat);
								}
							})							
						});	
					}
					
					else if (choice =="AllEx") {
						$("#supply_list").multipleSelect("disable");	
						run_on_all_ex(current_strat,function(success,current_strat){
							if(success == 1){
							count1 = count1 +1;
							feedback = feedback + "<p>Updated supply targeting for "+current_strat+"</p>"; 
							print(count1, strat_list.length,current_strat,feedback);
							console.log(current_strat + " is running on all exchanges");	
							}
						});						
					}	
					
					else {
						console.log("select add/remove to update supplies");
					}		
				
				});	
	
		}
	}
}

function print(count1, length,current_strat,feed){
	console.log(feed);
	$("#counter1").html(count1 + "/" + length);
	move1(Math.round((count1/length)*100));
	$("#feedback").html(feed);		
	
}

function update_fold_targeting() {	
	var feedback = "";
	var count2 = 0;
	//check if fold targeting is included 
	var fold_position = [];
	
	$('input:checkbox:checked', '#fold_targeting').each(function() {
			fold_position.push($(this).val());
		});
		
	console.log("fold", fold_position, fold_position.length);	
	
	// skip if no fold targeting
	if (typeof fold_position === 'undefined' || fold_position == "") { return; }
	
	else {		
		//get list of selected strats
		var strat_list = get_selected_strats();
		strat_list = strat_list[0]; 
		console.log("strat list:", strat_list);
		
		// //if fold position targeting is selected, then update
		for (var i=0; i<(strat_list.length); i++) {
			
			console.log("in for loop", strat_list[i]);
			update_fold_position(strat_list[i], fold_position, function(success,strat){
			if(success == 1){
			count2 = count2 +1;
			$("#counter2").html(count2 + "/" + strat_list.length);
			
			move2(Math.round((count2/strat_list.length)*100));
			feedback = feedback + "<p>Updated fold targeting for "+strat+"</p>"; 
	
			$("#fold_feedback").html(feedback);	
			}
			
			else{
			var error = "ERROR: ";
			feedback = feedback + "<p>"+ error.fontcolor("red")+strat+".</p>";								
			$("#feedback").html(feedback);
			}
			})
		}		
	}	
		
	console.log("fold:", fold_position);
}	

function move1(width) {
console.log(width);
  var elem = document.getElementById("myBar1");
  elem.style.width = width + '%';
}

function move2(width) {
console.log(width);
  var elem = document.getElementById("myBar2");
  elem.style.width = width + '%';
}

$("#punch").click(function() {
	console.log("goin");
	update_supply_sources(); 
	update_fold_targeting(); 
	
})	