'use strict' 
//overrides if run on all day parts is turned on


//returns array of all selected strategies
function get_selected_strats() {
	var strat_id = [];
 	$("#strat_list").each(function(){
		strat_id.push($(this).val());
	});

	return strat_id;
}
//returns selected days
function get_selected_days() 
{
	var days = []; 
	
	$("#days").each(function() { 
		days.push($(this).val()); 
	});
	
	return days[0];
}

function get_version(strat_id, callback)
{		
		var request = $.ajax({
			url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/" + strat_id,
			type: "GET",
			cache: false,
			dataType: "xml",
			success: function(xml) { 
				var version = $(xml).find('entity').attr('version')
				console.log(version);
				callback(strat_id,version)
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(jqXHR, textStatus, errorThrown)
			}
		})
}

function get_daypart(s){
	var num = s +1;
	var user_time = $('input[name=user_time]:checked', '#user_time').val();
	console.log("user_time:", user_time);	
	
	var start_hour = $("#daypart_start").val();
	var end_hour = $("#daypart_end").val();
	var days = get_selected_days().join(""); 
	
	var add = "day_parts."+ num + ".user_time="+user_time+"&day_parts."+ num + ".start_hour="+start_hour+"&day_parts."+ num + ".end_hour="+end_hour+"&day_parts."+ num + ".days="+days;	
	console.log(add);
	return add;
	}



function get_current_daypart(strat_id, callback){
	
	console.log("getting dayparts for: ",strat_id);
	
	var info = [];
	var options=[];
	var ids = [];
	var current = "";

	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/" + strat_id + "/day_parts",
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {
			
			//var exclude = $(xml).find('exclude').find('entity');
			var include = $(xml).find('entity')
			include.each(function(result){
				ids.push($(this).attr('id'));
			});
			console.log(ids);
			console.log(include.length);
			for(var i = 0; i < include.length; i++){
				info.push(include[i]);
			}
			
			for(var i=0; i <ids.length; i++)
			{
				var holder = [];
				var num = i+1;
				var x = $(xml).find('entity#' + ids[i]).children('prop');
				x.each(function(result) {
					name = $(this).attr('name');
					item_id = $(this).attr('value');
					if(name == "user_time") holder.push("day_parts."+ num + ".user_time="+item_id);
					if(name == "start_hour") holder.push("day_parts."+ num + ".start_hour="+item_id);
					if(name == "end_hour") holder.push("day_parts."+ num + ".end_hour="+item_id);
					if(name == "days") holder.push("day_parts."+ num + ".days="+item_id);
			});
			console.log(holder);
			var hold = holder.join("&");
			console.log(hold);
			var test = "day_parts."+num+".user_time=1&day_parts."+num+".start_hour=0&day_parts."+num+".end_hour=23&day_parts."+num+".days=MTWRFSU";
			console.log(test);
			if(hold == test)
			{
				console.log("yes");
			}
			else{
				options.push(hold);
			}
			
			}
			

			current = options.join("&");
			console.log(current);

			callback(strat_id, current, num);
			
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
}	

function set_targeting(strat_id, include, callback)
{		
		var request = $.ajax({
			url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/" + strat_id +"/day_parts",
			type: "POST",
			cache: false,
			dataType: "xml",
			data: include,
			success: function(data,textStatus, jqXHR) { 
				var success = 1;
				callback(strat_id, success);
				console.log("success", success);
				console.log("updated " + strat_id);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(jqXHR, textStatus, errorThrown)
			}
		})
}

function update_daypart_targeting() {
	
	var allparts = $("#allday").is(":checked");
	console.log("allday:", allparts);	
	var add_remove = $("#add_remove").is(":checked");
	console.log("add_remove:", add_remove);	
	
	var strat_list = [];
	//var mod_daypart = "";
	var feedback = "";
	var success = 0; 
	var final_list = {};
	
	strat_list = get_selected_strats();
	strat_list = strat_list[0]; 
	console.log("strat list:", strat_list);
	
	//mod_daypart = get_daypart(); 
	//console.log("list of daypart targets", mod_daypart);
	

	console.log("starting to loop through strats and update day part");
	for(var i=0; i<strat_list.length; i++) {
	
		//get list of current supplies attached to strat
		console.log("updating this strat:",strat_list[i]);
		var current_strat = strat_list[i];
		
		
			get_version(current_strat, function(current_strat, version) 
			{
				get_current_daypart(current_strat, function(current_strat, final_list, size)
				{	

						if(allparts == false){
							var mod_daypart = get_daypart(size);
							var update = "version="+version+"&"+mod_daypart+"&"+final_list;
							console.log(update);
						}
						else {
							update = "version="+version+"&"+"day_parts.1.start_hour=0&day_parts.1.end_hour=23&day_parts.1.days=MTWRFSU&day_parts.1.user_time=1";	
						}

					
				set_targeting(current_strat, update, function(current_strat, success)
				{						
					if (success == 1) {
						feedback = feedback + "<p> Added the daypart for "+current_strat+". Check changes <a target=\"_blank\" href=\"https://adroit-tools.mediamath.com/t1/api/strategies/"+ current_strat +"/day_parts\">here</a></p>";								
						$("#feedback").html(feedback); 

					}
				});	
				
			});
		});
		
}
}



$("#punch").click(function() {
update_daypart_targeting();
	
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