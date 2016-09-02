'use strict' 

//doesn't overwrite DV

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

//returns selected iasices
function get_selected_dv() 
{

	var dv_id = []; 
	
	//get selected iasice ids
	$("#dv_list").each(function() { 
		dv_id.push($(this).val()); 
	});
	console.log(dv_id);
	
	return dv_id[0];

}

function get_dv_targets(strat_id, callback){
	
	console.log("getting ias for: ",strat_id);
	
	var include_array_dv = [];
	var include_array_pe = [];
	var include_array_ia = [];
	var op_dv = "";
	var op_pe = "";
	var op_ia = "";
	var exclude_array = [];
	var final_list = {};

	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat_id+"/targeting_segments?full=*",
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {
			
		var entities = $(xml).find('entity');
		var prop = $(xml).find('prop');

		//if strat is running on all exchanges, assign 1 and end function
			for (var i=0; i<entities.length; i++) {
				$(entities[i]).each(function(result) {
					var id = $(this).find("prop[name=targeting_segment_id]").attr("value");
					console.log(id);
					var restriction = $(this).find("prop[name=restriction]").attr("value");
					var group = $(this).find("prop[name=group_identifier]").attr("value");
					var op = $(this).find("prop[name=operator]").attr("value");
					if(restriction=="INCLUDE" && group=="tsg1_dv"){
						include_array_dv.push(id);
						op_dv = op;
						console.log(op_dv);
					}
					if(restriction=="INCLUDE" && group=="tsg1_pe"){
						include_array_pe.push(id);
						op_pe = op;
					}
					if(restriction=="INCLUDE" && group=="tsg1_ia"){
						include_array_ia.push(id);
						op_ia = op;
					}
					if(restriction=="EXCLUDE"){
						exclude_array.push(id);
					}					
				})
			}
			console.log(include_array_dv);
			console.log(include_array_pe);
			console.log(include_array_ia);
			console.log(exclude_array);
			
			final_list['include_dv'] = include_array_dv;
			final_list['include_pe'] = include_array_pe;
			final_list['include_ia'] = include_array_ia;
			final_list['exclude'] = exclude_array;

			console.log(final_list);
			
			
			callback(strat_id,final_list,op_dv,op_pe,op_ia)
			
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

function add_to_final_list(final_list, final_list2, mod_list)
{
	console.log(final_list);
	console.log(final_list2);
	console.log(mod_list);
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

function set_targeting(strat_id, final_list, dv, pe, ia, callback)
{		
		var include_array = [];
		var exclude_array = [];
		var include_list = "";
		var exclude_list = "";
		var success = 0;
		
		var in_dv_length = final_list['include_dv'].length;
		var in_pe_length = final_list['include_pe'].length;
		var in_ia_length = final_list['include_ia'].length;
		var ex_dv_length = final_list['exclude'].length;
	
		var sum = in_dv_length + in_pe_length + in_ia_length+ ex_dv_length;
		console.log("sum: " + sum);
		
		
		//segments.1.id
		//segments.1.restriction
		//segments.1.operation
		
		
		for(var i = 0; i<final_list['include_dv'].length; i++){
			include_array.push("segments." +sum+".id="+final_list['include_dv'][i]+"&segments."+sum+".restriction=INCLUDE"+"&segments."+sum+".operator="+dv);
			sum = sum -1;
		}
		for(var j = 0; j<final_list['include_pe'].length; j++){
			include_array.push("segments." +sum+".id="+final_list['include_pe'][j]+"&segments."+sum+".restriction=INCLUDE"+"&segments."+sum+".operator="+pe);
			sum = sum -1;
		}
		for(var k = 0; k<final_list['include_ia'].length; k++){
			include_array.push("segments." +sum+".id="+final_list['include_ia'][k]+"&segments."+sum+".restriction=INCLUDE"+"&segments."+sum+".operator="+ia);
			sum = sum -1;
		}
		for(var l = 0; l<final_list['exclude'].length; l++){
			exclude_array.push("segments." +sum+".id="+final_list['exclude'][l]+"&segments."+sum+".restriction=EXCLUDE"+"&segments."+sum+".operator=OR");
			sum = sum -1;
		}
		include_list = include_array.join("&");
		exclude_list = exclude_array.join("&");

		final_list = "include_op=OR&exclude_op=OR&" + include_list + "&" + exclude_list;
		console.log(final_list);


		var request = $.ajax({
			url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat_id+"/targeting_segments",
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


function update_dv_targeting() {

	var strat_list = [];
	var mod_dv = [];
	var feedback = "";
	var success = 0; 
	var final_list = {};
	var dv_op = "";
	var pe_op = "";
	var ia_op = "";

	//check if adding or removing technologies
	var add_remove = $('input[name=add_remove]:checked', '#add_remove').val();
	console.log("add_remove:", add_remove);	
	
	var include_exclude = $('input[name=include_exclude]:checked', '#include_exclude').val();
	console.log("include_exclude:", include_exclude);

	var logic_dv = $('input[name=logic_dv]:checked', '#logic_dv').val();
	console.log("logic_dv:", logic_dv);
	
	if (include_exclude == "include") {
		include_exclude = "include_dv";
		var notChecked = "exclude"};
	
	if (include_exclude == "exclude") {var notChecked = "include_dv"};
	
	console.log("checked: " + include_exclude);
	console.log("notchecked: "+notChecked);	
	
	//if no supply source targeting selected, end function 
	if ($("#org_dropdown").val() == null) { 
	alert("Please choose an organization");
	return; }
	
	if (typeof add_remove === 'undefined') { 
	alert("Please choose add or remove");
	return; }
	
	if (typeof include_exclude === 'undefined') { 
	alert("Please choose include or exclude");
	return; }
	
	if (typeof logic_dv === 'undefined') { 
	alert("Please choose DV Inclusion Logic");
	return; }

	else {
		
		strat_list = get_selected_strats();
		strat_list = strat_list[0]; 
		console.log("strat list:", strat_list);
		
		mod_dv = get_selected_dv(); 
		console.log("list of dv targets", mod_dv);
		
		console.log(mod_dv);

		console.log("starting to loop through strats and update geo");
		for(var i=0; i<strat_list.length; i++) {
		
	 		//get list of current supplies attached to strat
			console.log("updating this strat:",strat_list[i]);
			var current_strat = strat_list[i];
			
			if(mod_dv !== null){
				get_dv_targets(current_strat, function(current_strat, final_list, dv_op, pe_op, ia_op) 
				{
					console.log(dv_op);
					if(logic_dv != "CURRENT"){
						dv_op = logic_dv;
						console.log("logic_dv:", logic_dv, dv_op);
	
					}
					if(dv_op == ""){
						dv_op = "OR";
						console.log("logic_dv:", logic_dv, dv_op);
					}
					if(pe_op == ""){
						pe_op = "OR";
						console.log("logic_pe:", pe_op);
					}
					if(ia_op == ""){
						ia_op = "OR";
						console.log("logic_ia:", ia_op);
					}						
					console.log("dvs list for current_strat.  Include: ", final_list['include_dv'], " Exclude: ", final_list['exclude']);
					if(add_remove == 'add'){
						var temp = add_to_final_list(final_list[include_exclude], final_list[notChecked], mod_dv);
						final_list[include_exclude] = temp[0];
						final_list[notChecked] = temp[1];
						
					}
					if(add_remove == 'remove'){
						final_list[include_exclude] = remove_from_final_list(final_list[include_exclude], mod_dv);
					}
					console.log("After..ias list for current_strat.  Include: ", final_list['include_dv'], " Exclude: ", final_list['exclude']);
					
					set_targeting(current_strat, final_list, dv_op, pe_op, ia_op, function(success)
					{			
						if (success == 1 && mod_dv.length!=0) {
							feedback = feedback + "<p>Updated contextual targeting for "+current_strat+". Check changes <a target=\"_blank\" href=\"https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+current_strat+"/targeting_segments?full=*\">here</a></p>";								
							$("#feedback").html(feedback); 
						}
						else{
							var error = "ERROR: ";
							feedback = feedback + "<p>" + error.fontcolor("red")+current_camp+". Check changes <a target=\"_blank\" href=\"https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+current_strat+"/targeting_segments?full=*\">here</a></p>";								
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
	update_dv_targeting(); 	
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