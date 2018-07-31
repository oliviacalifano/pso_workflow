'use strict' 

//returns array of all selected strategies
function get_selected_strats() {

	var strat_id = [];
	
	//get all selected strat ids
	$("#strat_list").each(function(){
		strat_id.push($(this).val());
	});
	return strat_id;
}

//get selected tech segments
function get_selected_tech() 
{
	var tech_id = []; 
	$("#technology").each(function() { 
		tech_id.push($(this).val()); 
	});
	console.log(tech_id);
	return tech_id[0];
}

//get current technology targeting
function get_current_targets(strat_id, target_dimension_id, callback){
	
	console.log("getting tech for: ",strat_id);
	
	var include_array = [];	
	var exclude_array = [];
	var final_list = {};

	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat_id+"/target_dimensions/"+target_dimension_id,
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {
			var include = $(xml).find('include').find('entity');
			var exclude = $(xml).find('exclude').find('entity');
			
			include.each(function(){ include_array.push((this.id)) });
			exclude.each(function(){ exclude_array.push((this.id)) });
			
			final_list['include'] = include_array;
			final_list['exclude'] = exclude_array;
			
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
	for(var i = 0; i < mod_list.length; i++){
		if(final_list.indexOf(mod_list[i]) == -1){
			final_list.push(mod_list[i]);
		}
	}

	for(var j = 0; j < mod_list.length; j++){
		if(final_list2.indexOf(mod_list[j]) != -1){
			final_list2.remove(mod_list[j]);
			console.log(final_list2);
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

function set_targeting(strat_id, final_list, target_dimension_id, callback)
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
			url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat_id+"/target_dimensions/"+target_dimension_id,
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
				success = 0;
				callback(success);
			}
		})
}


function update_tech_targeting() {

	var strat_list = [];
	var mod_tech = [];
	var feedback = "";
	var success = 0; 
	var final_list = {};
	var count = 0;

	//check if adding or removing technologies
	var add_remove = $('input[name=add_remove]:checked', '#add_remove').val();
	console.log("add_remove:", add_remove);	
	
	var include_exclude = $('input[name=include_exclude]:checked', '#include_exclude').val();
	console.log("include_exclude:", include_exclude);	
	
	if (include_exclude == "include") {var notChecked = "exclude"};
	if (include_exclude == "exclude") {var notChecked = "include"};
	
	console.log("checked: " + include_exclude);
	console.log("notchecked: "+notChecked);	
	
	var tech_id = $("#target_values").val()[0];
	if (tech_id == "dvce") {var target_dimension_id = "24"};
	if (tech_id == "bser") {var target_dimension_id = "4"};
	if (tech_id == "cspd") {var target_dimension_id = "2"};
	if (tech_id == "ispx") {var target_dimension_id = "3"};
	if (tech_id == "invt") {var target_dimension_id = "25"};
	
	//alerts
	if (typeof add_remove === 'undefined') { 
	alert("Please choose add or remove");
	return; }
	
	if (typeof include_exclude === 'undefined') { 
	alert("Please choose include or exclude");
	return; }

	else {
		
		strat_list = get_selected_strats();
		strat_list = strat_list[0]; 
		console.log("strat list:", strat_list);
		
		mod_tech = get_selected_tech();
		console.log("list of dv targets", mod_tech);
		
		console.log(mod_tech);

		console.log("starting to loop through strats and update tech");
		for(var i=0; i<strat_list.length; i++) {
			console.log("updating this strat:",strat_list[i]);
			var current_strat = strat_list[i];
			
			if(mod_tech !== null){
				get_current_targets(current_strat, target_dimension_id, function(current_strat, final_list) 
				{
					if(add_remove == 'add'){
						var temp = add_to_final_list(final_list[include_exclude], final_list[notChecked], mod_tech);
						final_list[include_exclude] = temp[0];
						final_list[notChecked] = temp[1];
						
					}
					if(add_remove == 'remove'){
						final_list[include_exclude] = remove_from_final_list(final_list[include_exclude], mod_tech);
					}
					
					set_targeting(current_strat, final_list, target_dimension_id, function(success)
					{			
						if (success == 1 && mod_tech.length!=0) {
							count = count +1;
							$("#counter").html(count + "/" + strat_list.length);
							
							move(Math.round((count/strat_list.length)*100));
							feedback = feedback + "<p>Updated technology targeting for "+current_strat+". Check changes <a target=\"_blank\" href=\"https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+current_strat+"/target_dimensions/"+target_dimension_id+"?full=*\">here</a></p>";							
							$("#feedback").html(feedback); 
						}
						else{
							var error = "ERROR: ";
							feedback = feedback + "<p>" + error.fontcolor("red")+current_camp+". Check changes <a target=\"_blank\" href=\"https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+current_strat+"/target_dimensions/"+target_dimension_id+"?full=*\">here</a></p>";							
							$("#feedback").html(feedback); 
						}
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