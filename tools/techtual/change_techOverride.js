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
//returns selected devices
function get_selected_dev() 
{

	var dev_id = []; 
	
	//get selected device ids
	$("#devices_list").each(function() { 
		dev_id.push($(this).val()); 
	});
	
	return dev_id[0];

}

//returns selected inventory types
function get_selected_inv() 
{

	var inv_id = []; 
	
	//get selected inv ids
	$("#inv_list").each(function() { 
		inv_id.push($(this).val()); 
	});
	
	return inv_id[0];

}

//returns selected connection speeds
function get_selected_cspd() 
{

	var cspd_id = []; 
	
	//get selected cspd ids
	$("#cspd_list").each(function() { 
		cspd_id.push($(this).val()); 
	});
	
	return cspd_id[0];

}

//returns selected browsers
function get_selected_brwsrs() 
{

	var brwsr_id = []; 
	
	//get selected browser ids
	$("#brwsr_list").each(function() { 
		brwsr_id.push($(this).val()); 
	});
	
	return brwsr_id[0];

}

//returns selected isps
function get_selected_isps() 
{

	var isp_id = []; 
	
	//get selected isp ids
	$("#ispx_list").each(function() { 
		isp_id.push($(this).val()); 
	});
	
	return isp_id[0];

}

function get_dev_targets(strat_id, callback){
	
	console.log("getting dev for: ",strat_id);
	
	var include_array = [];
	var exclude_array = [];
	var final_list = {};

	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat_id+"/target_dimensions/24",
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


			console.log(final_list);


			callback(strat_id, final_list);
		
			
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
}	

function get_inv_targets(strat_id, callback){
	
	console.log("getting inv for: ",strat_id);
	
	var include_array = [];
	var exclude_array = [];
	var final_list = {};

	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat_id+"/target_dimensions/25",
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


			console.log(final_list);


			callback(strat_id, final_list);
		
			
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
}	

function get_cspd_targets(strat_id, callback){
	
	console.log("getting cspd for: ",strat_id);
	
	var include_array = [];
	var exclude_array = [];
	var final_list = {};

	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat_id+"/target_dimensions/2",
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


			console.log(final_list);


			callback(strat_id, final_list);
		
			
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
}	

function get_brwsr_targets(strat_id, callback){
	
	console.log("getting brwsr for: ",strat_id);
	
	var include_array = [];
	var exclude_array = [];
	var final_list = {};

	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat_id+"/target_dimensions/4",
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


			console.log(final_list);


			callback(strat_id, final_list);
		
			
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
}	

function get_ispx_targets(strat_id, callback){
	
	console.log("getting isp for: ",strat_id);
	
	var include_array = [];
	var exclude_array = [];
	var final_list = {};

	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat_id+"/target_dimensions/3",
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


			console.log(final_list);


			callback(strat_id, final_list);
		
			
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
}	


function add_to_final_list(final_list, final_list2, mod_list)
{
	console.log(final_list);100
	console.log(mod_list);
	for(var i = 0; i < mod_list.length; i++){
		if(final_list.indexOf(mod_list[i] == -1)){
			final_list.push(mod_list[i]);
		}
		
		if(final_list2.indexOf(mod_list[i] != -1)){
			final_list2.splice(final_list2.indexOf(mod_list[i]),1);
		}
	}

	return [final_list, final_list2];

}

function remove_from_final_list(final_list, mod_list)
{	
	console.log(final_list);
	console.log(mod_list);
	for(var i = 0; i < mod_list.length; i++){
		final_list.remove(mod_list[i]);
	}
	return final_list;
}

function set_targeting(strat_id, tech_id, final_list, callback)
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
			url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat_id+"/target_dimensions/"+tech_id,
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


function update_tech_targeting() {

	var strat_list = [];
	var mod_dev = [];
	var mod_inv = [];
	var mod_cspd = [];
	var mod_brwsr = [];
	var mod_ispx = [];
	var feedback = "";
	var success = 0; 
	var final_list = {};

	//check if adding or removing technologies
	var add_remove = $('input[name=add_remove]:checked', '#add_remove').val();
	console.log("add_remove:", add_remove);	
	
	var include_exclude = $('input[name=include_exclude]:checked', '#include_exclude').val();
	console.log("include_exclude:", include_exclude);	
	
	if (include_exclude == "include") {var notChecked = "exclude"};
	if (include_exclude == "exclude") {var notChecked = "include"};

	//if no supply source targeting selected, end function 
	if (typeof add_remove === 'undefined') { return; }
	if (typeof include_exclude === 'undefined') { return; }

	else {
		//GET SELECTED STRATS FROM SIMON-----------------------------------------------------------------------------------------------------------
		strat_list = get_selected_strats();
		//-----------------------------------------------------------------------------------------------------------------------------------------
		strat_list = strat_list[0]; 
		console.log("strat list:", strat_list);
		
		mod_dev = get_selected_dev(); 
		console.log("list of device targets", mod_dev);
		
		mod_inv = get_selected_inv();
		console.log("list of inventory targets", mod_inv);
		
		mod_cspd = get_selected_cspd();
		console.log("list of conn speed targets", mod_cspd);
		
		mod_brwsr = get_selected_brwsrs();
		console.log("list of browser targets", mod_brwsr);
		
		mod_ispx = get_selected_isps();
		console.log("list of isp targets", mod_ispx);

		console.log(mod_inv);

		console.log("starting to loop through strats and update geo");
		for(var i=0; i<strat_list.length; i++) {
		
	 		//get list of current supplies attached to strat
			console.log("updating this strat:",strat_list[i]);
			var current_strat = strat_list[i];
			
			if(mod_dev !== null){
				get_dev_targets(current_strat, function(current_strat, final_list) 
				{
					console.log("DEV list for current_strat.  Include: ", final_list['include'], " Exclude: ", final_list['exclude']);
					if(add_remove == 'add'){
						var tempDev = add_to_final_list(final_list[include_exclude], final_list[notChecked], mod_dev);
						final_list[include_exclude] = tempDev[0];
						final_list[notChecked] = tempDev[1];
					}
					if(add_remove == 'remove'){
						final_list[include_exclude] = remove_from_final_list(final_list[include_exclude], mod_dev);
					}
					console.log("After..DEV list for current_strat.  Include: ", final_list['include'], " Exclude: ", final_list['exclude']);
					
					set_targeting(current_strat, '24', final_list, function(success)
					{			
						if (success == 1 && mod_dev.length!=0) {
							feedback = feedback + "<p>Updated device targeting for "+current_strat+". Check changes <a target=\"_blank\" href=\"https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+current_strat+"/target_dimensions/24\">here</a></p>";								
							$("#feedback").html(feedback); 
						}
						else{
							var error = "ERROR: ";
							feedback = feedback + "<p>" + error.fontcolor("red")+current_camp+". Check changes <a target=\"_blank\" href=\"https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+current_strat+"/target_dimensions/24\">here</a></p>";								
							$("#feedback").html(feedback); 
						}
					});	
					
				});
			};
			
			if(mod_inv !== null){
				get_inv_targets(current_strat, function(current_strat, final_list) 
				{
					console.log("INV list for current_strat.  Include: ", final_list['include'], " Exclude: ", final_list['exclude']);			
					if(add_remove == 'add'){
						var tempInv = add_to_final_list(final_list[include_exclude], final_list[notChecked], mod_inv);
						final_list[include_exclude] = tempInv[0];
						final_list[notChecked] = tempInv[1];
					}
					if(add_remove == 'remove'){
						final_list[include_exclude] = remove_from_final_list(final_list[include_exclude], mod_inv);
					}
					console.log("After..INV list for current_strat.  Include: ", final_list['include'], " Exclude: ", final_list['exclude']);
					
					set_targeting(current_strat, '25', final_list, function(success)
					{			
						if (success == 1 && mod_inv.length!=0) {
							feedback = feedback + "<p>Updated device targeting for "+current_strat+". Check changes <a target=\"_blank\" href=\"https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+current_strat+"/target_dimensions/25\">here</a></p>";								
							$("#feedback").html(feedback); 
						}
						else{
							var error = "ERROR: ";
							feedback = feedback + "<p>" + error.fontcolor("red")+current_camp+". Check changes <a target=\"_blank\" href=\"https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+current_strat+"/target_dimensions/25\">here</a></p>";								
							$("#feedback").html(feedback);
						}
					});	
					
				});
			};
			
			if(mod_cspd !== null){
				get_cspd_targets(current_strat, function(current_strat, final_list) 
				{
					console.log("CSPD list for current_strat.  Include: ", final_list['include'], " Exclude: ", final_list['exclude']);
					if(add_remove == 'add'){
						var tempCspd = add_to_final_list(final_list[include_exclude], final_list[notChecked], mod_cspd);
						final_list[include_exclude] = tempCspd[0];
						final_list[notChecked] = tempCspd[1];
					}
					if(add_remove == 'remove'){
						final_list[include_exclude] = remove_from_final_list(final_list[include_exclude], mod_cspd);
					}
					console.log("After..CSPD list for current_strat.  Include: ", final_list['include'], " Exclude: ", final_list['exclude']);
					
					set_targeting(current_strat, '2', final_list, function(success)
					{			
						if (success == 1 && mod_cspd.length!=0) {
							feedback = feedback + "<p>Updated device targeting for "+current_strat+". Check changes <a target=\"_blank\" href=\"https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+current_strat+"/target_dimensions/2\">here</a></p>";								
							$("#feedback").html(feedback); 
						}
						else{
							var error = "ERROR: ";
							feedback = feedback + "<p>" + error.fontcolor("red")+current_camp+". Check changes <a target=\"_blank\" href=\"https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+current_strat+"/target_dimensions/2\">here</a></p>";								
							$("#feedback").html(feedback);
						}
					});	
					
				});	
			};
			
			if(mod_brwsr !== null){
				get_brwsr_targets(current_strat, function(current_strat, final_list) 
				{
					console.log("BRWSR list for current_strat.  Include: ", final_list['include'], " Exclude: ", final_list['exclude']);
					if(add_remove == 'add'){
						var tempBrwsr = add_to_final_list(final_list[include_exclude], final_list[notChecked], mod_brwsr);
						final_list[include_exclude] = tempBrwsr[0];
						final_list[notChecked] = tempBrwsr[1];
					}
					if(add_remove == 'remove'){
						final_list[include_exclude] = remove_from_final_list(final_list[include_exclude], mod_brwsr);
					}
					console.log("After..BRWSR list for current_strat.  Include: ", final_list['include'], " Exclude: ", final_list['exclude']);
					
					set_targeting(current_strat, '4', final_list, function(success)
					{			
						if (success == 1 && mod_brwsr.length!=0) {
							feedback = feedback + "<p>Updated device targeting for "+current_strat+". Check changes <a target=\"_blank\" href=\"https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+current_strat+"/target_dimensions/4\">here</a></p>";								
							$("#feedback").html(feedback); 
						}
						else{
							var error = "ERROR: ";
							feedback = feedback + "<p>" + error.fontcolor("red")+current_camp+". Check changes <a target=\"_blank\" href=\"https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+current_strat+"/target_dimensions/4\">here</a></p>";								
							$("#feedback").html(feedback);
						}
					});	
					
				});
			};
			
			if(mod_ispx !== null){
				get_ispx_targets(current_strat, function(current_strat, final_list) 
				{
					console.log("ISP list for current_strat.  Include: ", final_list['include'], " Exclude: ", final_list['exclude']);
					if(add_remove == 'add'){
						var tempIspx = add_to_final_list(final_list[include_exclude], final_list[notChecked], mod_ispx);
						final_list[include_exclude] = tempIspx[0];
						final_list[notChecked] = tempIspx[1];
					}
					if(add_remove == 'remove'){
						final_list[include_exclude] = remove_from_final_list(final_list[include_exclude], mod_ispx);
					}
					console.log("After..ISP list for current_strat.  Include: ", final_list['include'], " Exclude: ", final_list['exclude']);
					
					set_targeting(current_strat, '3', final_list, function(success)
					{			
						if (success == 1 && mod_ispx.length!=0) {
							feedback = feedback + "<p>Updated device targeting for "+current_strat+". Check changes <a target=\"_blank\" href=\"https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+current_strat+"/target_dimensions/3\">here</a></p>";								
							$("#feedback").html(feedback); 
						}
						else{
							var error = "ERROR: ";
							feedback = feedback + "<p>" + error.fontcolor("red")+current_camp+". Check changes <a target=\"_blank\" href=\"https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+current_strat+"/target_dimensions/3\">here</a></p>";								
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
	update_tech_targeting(); 
	
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