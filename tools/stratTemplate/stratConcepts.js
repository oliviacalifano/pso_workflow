'use strict' 

var selectedCamps = [];
var csv = ""; 

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

function get_selected_camps() {

	var camp_id = [];
	
	//get all selected strat ids
	$("#campaign_list").each(function(){
		camp_id.push($(this).val());
	});
	
	//print all strats	
	// for (i=0; i<strat_id.length; i++) {
		// console.log(strat_id[i]);
	// }
	 
	return camp_id;
}


function get_camp_info(camp, callback){
	
	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/campaigns/"+camp,
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {
			var entry = $(xml).find('entity').attr('name');
			console.log(entry);
			callback(camp,entry)
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
}	



function get_strat_info(strat,callback){
	
	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat+"?with=campaign",
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {
			var strat_name = $(xml).find('entity').attr('name');
			var camp_id = $(xml).find('entity').find('entity').attr('id');
			var camp_name = $(xml).find('entity').find('entity').attr('name');
			console.log(strat);
			console.log(camp_id);
			console.log(camp_name);
			callback(strat,strat_name,camp_id,camp_name)
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
}	


function get_history(strat, callback){
	
	var string = "";
	var csv="";
	var num = 0;
	var max = 0;

	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat+"/concepts?q=status%3D%3D1",
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {
			
			var entry = $(xml).find('entity');
			var array = [];
			entry.each(function(){
			
				
			var concept_id = $(this).attr('id');
			console.log(concept_id);
			var concept_name = $(this).attr('name');	
			console.log(concept_name);
			
			array.push(concept_id);
			
			string = string + concept_id+","+concept_name+",";
			
			});
			console.log(max);
			if(array.length > max){
				max = array.length;
			}
			
			var header = "campaign_id,campaign_name,strategy_id,strategy_name";
			for (var j=0;j<max;j++){
				header = header + ",concept_id_"+j+",concept_name_"+j;
			}
			
			
			console.log("string="+string)
			
			callback(strat,string,header);
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
}	

function download() {
	var strat_list = [];
	var strat_names = [];
	var feedback = "";
	var success = 0; 
	var final_list = {};

	var strategy_history = "";
	strat_list = get_selected_strats();
	strat_list = strat_list[0]; 
	//console.log("strat list:", strat_list);
	
	console.log("starting to loop through strats and update geo");
	for(var i=0; i<strat_list.length; i++) {

	//get list of current supplies attached to strat
	//console.log("updating this strat:",strat_list[i]);
	var current_strat = strat_list[i];
	var counter = 0;
	var head = "";


	get_strat_info(current_strat,function(current_strat,strat_name,camp_id,camp_name){
		get_history(current_strat,function(current_strat, doc,header) 
		{	counter++;
			//console.log(counter);
			console.log(head);
			if(header.length > head.length){head = header;}
			
			if(counter == strat_list.length){
			strategy_history = head +strategy_history+"\n"+ current_strat+","+strat_name+","+camp_id+","+camp_name +","+ doc;
			downloadCSV(strategy_history, { filename: "Strategy_Concepts.csv" });
			}
			else{
			strategy_history = strategy_history+"\n"+ current_strat+","+strat_name+","+camp_id+","+camp_name +","+ doc;
		}
		});

})
		
	}		
}


	
$("#punch").click(function() {
	console.log("hit!");
	download();

})	

function downloadCSV(csv, args) {  
        var data = "";
		var filename = "";
		var link = "";

        if (csv == null) return;	

        filename = args.filename || 'export.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);

        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
		link.click();
		//window.alert("Download Complete.");
    };