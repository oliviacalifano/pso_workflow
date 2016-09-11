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
//returns selected ctxlices
function get_selected_dataPixels() 
{

	var dataPixels_id = []; 
	
	//get selected ctxlice ids
	$("#dataPixels_list").each(function() { 
		dataPixels_id.push($(this).val()); 
	});
	console.log(dataPixels_id);
	
	return dataPixels_id[0];

}

function get_dataPixel_targets(strat, operation, pool, log, opPixels, callback){
	
	//console.log("getting data pixels for: ",strat_id);
	console.log(operation+pool);
	var pixels_array = {};
	
	var returnVal="";
	var pixels="";
	var pixelSplit=""
	var andOr='';
	var includePixels="";
	var excludePixels="";
	var includeFinal="";
	var excludeFinal="";
	var logic='OR';

	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat,
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {
			
			var version = $(xml).find('entity').attr('version');
			
			var pixels = $(xml).find('prop');
			pixels.each(function(){ pixels_array[this.getAttribute('name')] = this.getAttribute('value')});
			if("pixel_target_expr" in pixels_array){
			var expression = pixels_array["pixel_target_expr"];
			
			console.log(version);
			console.log(pixels_array);
			console.log(expression);

				//console.log(tag[i].getAttribute('name'));
				if(expression.indexOf("AND NOT")!= -1)
				{
					console.log("Found AND NOT");
					pixelSplit=expression.split("AND NOT");
					includePixels=pixelSplit[0];
					excludePixels=pixelSplit[1];
				}
				else if(expression.indexOf("NOT")!= -1)
				{
					console.log("Exclude pixels only");
					excludePixels=expression;
				}
				else if(expression.indexOf("[")!= -1)
				{
					console.log("Include pixels only");
					includePixels=expression;
				}
				else
				{
					console.log("No pixels");
				}
				
			includePixels=includePixels.replace(/[\]\[\(\)]/g,"");
			excludePixels=excludePixels.replace(/[\]\[\(\)]/g,"");

			includePixels=includePixels.trim();
			excludePixels=excludePixels.trim();

			console.log(includePixels);
			console.log(excludePixels);
			}

			if(operation=='add')
			{
				if(pool=='include')
				{
					console.log("adding "+opPixels+" to inclusion");
					if(includePixels.indexOf("AND")!= -1)
					{
						logic='AND';
					}
					else
					{
						logic='OR';
					}
					includePixels=includePixels.replace(/[\]\[\(\)A-Z]/g,"");
					excludePixels=excludePixels.replace(/[\]\[\(\)A-Z]/g,"");
					includePixels=includePixels.split("  ");
					excludePixels=excludePixels.split("  ");
					for(var z=0;z<opPixels.length;z++)
					{
						if(!includePixels.includes(opPixels[z]))
						{
							includePixels.push(opPixels[z]);
						}
						if(excludePixels.includes(opPixels[z]))
						{
							excludePixels.splice(excludePixels.indexOf(opPixels[z]),1);
						}
					}
					console.log("include"+includePixels);
					console.log("exclude"+excludePixels);
					
				}
				if(pool=='exclude')
				{
					console.log("adding "+opPixels+" to exclusion");
					if(includePixels.indexOf("AND")!= -1)
					{
						logic='AND';
					}
					else
					{
						logic='OR';
					}
					includePixels=includePixels.replace(/[\]\[\(\)A-Z]/g,"");
					excludePixels=excludePixels.replace(/[\]\[\(\)A-Z]/g,"");
					includePixels=includePixels.split("  ");
					excludePixels=excludePixels.split("  ");
					for(var z=0;z<opPixels.length;z++)
					{
						if(!excludePixels.includes(opPixels[z]))
						{
							excludePixels.push(opPixels[z]);
						}
						if(includePixels.includes(opPixels[z]))
						{
							includePixels.splice(includePixels.indexOf(opPixels[z]),1);
						}						
					}
					console.log(includePixels);
					console.log(excludePixels);
					
				}
		
			}
			
			console.log("ok");
			if(operation=='remove')
			{
				if(pool=='include')
				{
					console.log("remove from inclusion");
					includePixels=includePixels.replace(/[\]\[\(\)A-Z]/g,"");
					excludePixels=excludePixels.replace(/[\]\[\(\)A-Z]/g,"");
					includePixels=includePixels.split("  ");
					excludePixels=excludePixels.split("  ");
					console.log(includePixels);
					console.log(excludePixels);
					for(var z=0;z<includePixels.length;z++)
					{
						if(opPixels.includes(includePixels[z]))
						{
							console.log('opPixels');
							delete includePixels[z];
						}
					}
				}
				if(pool=='exclude')
				{
					console.log("remove from exclusion"+opPixels);
					includePixels=includePixels.replace(/[\]\[\(\)A-Z]/g,"");
					excludePixels=excludePixels.replace(/[\]\[\(\)A-Z]/g,"");
					includePixels=includePixels.split("  ");
					excludePixels=excludePixels.split("  ");
					console.log(includePixels);
					console.log(excludePixels);
					for(var z=0;z<excludePixels.length;z++)
					{
						console.log("checking if "+excludePixels[z]+" in "+ opPixels);
						
						if(opPixels.includes(excludePixels[z]))
						{
							console.log('deleting');
							delete excludePixels[z];
						}
					}
					
				}
			}
			
		console.log("Cleaning.");
		includePixels = cleanArray(includePixels);
		excludePixels = cleanArray(excludePixels);

		console.log(includePixels);
		console.log(excludePixels);
		console.log("Constructing the API Call.");
		//reconstructing the api call
		
		for(var x=0;x<includePixels.length;x++)
		{
			includePixels[x]="["+includePixels[x]+"]";
		}
		//includeFinal=includePixels.join(" "+logic+" ");
		includeFinal=includePixels.join(" "+log+" ");
		console.log(includeFinal);
		
		for(var x=0;x<excludePixels.length;x++)
		{
			excludePixels[x]="["+excludePixels[x]+"]";
		}
		excludeFinal=excludePixels.join(" OR ");
		
		if(excludeFinal.length>1){
			excludeFinal="NOT ( "+excludeFinal+" )";
		}
		
		if(includeFinal.length>1){
			if(excludeFinal.length>1)
				excludeFinal=" AND "+ excludeFinal;
			includeFinal="( "+includeFinal+" )";
		}
		console.log(includeFinal+excludeFinal);
		var payload = includeFinal+excludeFinal;
		callback(strat, version, payload);	
			
/* 			var exclude = $(xml).find('exclude').find('entity');
			var include = $(xml).find('include').find('entity');


			exclude.each(function(){ var ver = this.version)) });
			include.each(function(){ include_array.push((this.id)) });

			final_list['exclude'] = exclude_array;
			final_list['include'] = include_array; */


			//console.log(final_list);


			//callback(strat_id, final_list);
		
			
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
}	

function cleanArray(actual){
  var newArray = new Array();
  for(var i = 0; i<actual.length; i++){
      if (actual[i]){
        newArray.push(actual[i]);
    }
  }
  return newArray;
}

function set_targeting(strat_id, ver, final_list, callback)
{		
		var to_post = "version="+ ver +"&pixel_target_expr="+final_list;

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

	var strat_list = [];
	var change = [];
	var feedback = "";
	var success = 0; 

	//check if adding or removing technologies
	var add_remove = $('input[name=add_remove]:checked', '#add_remove').val();
	console.log("add_remove:", add_remove);	
	
	var include_exclude = $('input[name=include_exclude]:checked', '#include_exclude').val();
	console.log("include_exclude:", include_exclude);

	var and_or = $('input[name=and_or]:checked', '#and_or').val();
	console.log("and_or:", and_or);	
	
	if (include_exclude == "include") {var notChecked = "exclude"};
	
	if (include_exclude == "exclude") {var notChecked = "include"};
	
	console.log(include_exclude);
	console.log(notChecked);

	//if no supply source targeting selected, end function 
	if (typeof add_remove === 'undefined') { return; }
	if (typeof include_exclude === 'undefined') { return; }

	else {
		
		strat_list = get_selected_strats();
		strat_list = strat_list[0]; 
		console.log("strat list:", strat_list);
		
		change = get_selected_dataPixels(); 
		console.log("list of data pixel targets", change);

		console.log("starting to loop through strats and update data pixels");
		for(var i=0; i<strat_list.length; i++) {
		
	 		//get list of current supplies attached to strat
			console.log("updating this strat:",strat_list[i]);
			var current_strat = strat_list[i];
			
			if(change !== null){
				get_dataPixel_targets(current_strat, add_remove, include_exclude, and_or, change, function(current_strat, v, update) 
				{
					set_targeting(current_strat, v, update, function(success)
					{			
						if (success == 1 && change.length!=0) {
							feedback = feedback + "<p>Updated data pixel targeting for "+current_strat+". Check changes <a target=\"_blank\" href=\"https://t1.mediamath.com/app/#strategy/edit/"+current_strat+"/targeting/myData\">here</a></p>";								
							$("#feedback").html(feedback); 
						}
						else{
							var error = "ERROR: ";
							feedback = feedback + "<p>" + error.fontcolor("red")+current_camp+". Check changes <a target=\"_blank\" href=\"https://t1.mediamath.com/app/#strategy/edit/"+current_strat+"/targeting/myData\">here</a></p>";								
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
	update_dataPixel_targeting();
})	