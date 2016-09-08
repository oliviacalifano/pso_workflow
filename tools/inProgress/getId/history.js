

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

function get_strat_info(strat, callback){
	
	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat+"?with=campaign",
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {
			var entry = $(xml).find('entity').attr('name');
			var camp_name = $(xml).find('entity').find('entity').attr('name');
			var camp_id = $(xml).find('entity').find('entity').attr('id');
			console.log(entry);
			callback(strat,entry,camp_name,camp_id)
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
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



function get_history(strat, n, col, camp_n, camp_i, callback){
	
	var array = [];
	var string = "";
	var csv="";
	var num = 0;
	var max = 0;

	var request = $.ajax({
		//url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat_id+"/history",
		
		
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/"+col+"/"+strat+"/history",
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {
			var entry = $(xml).find('entry');
			var field = $(xml).find('entry').find('field');
			
			entry.each(function(){
			string = "";
			var array = [];
			var date = this.getAttribute('date').split('T');
			var day = date[0];
			var time = date[1];
			
			array.push(day);
			array.push(time);
			if(col == "strategies"){
				array.push(camp_i);
				array.push(camp_n);
			}
			array.push(strat);
			array.push(n);
			array.push(this.getAttribute('user_id'));
			array.push(this.getAttribute('user_name'));
			$(this).find('field').each(function(){
				array.push(this.getAttribute('name'));
				array.push(this.getAttribute('new_value'));
				array.push(this.getAttribute('old_value'));
			});
			if(array.length > max){
				max = array.length;
			}
			for(var i=0;i<array.length;i++){
				var str = array[i];
				//console.log(str);
				if(str.indexOf(',') != -1) {
				var segments = str.split(',');
				//console.log(segments);	
				s = segments.join(";");
				//console.log(s);
				//console.log(typeof array);
				
				array.splice(i,1,s);
				//console.log(array);
				string = array.join(",");
				//console.log(string);
				}
				else{
					string = array.join(",");
				}
			}
			
			csv = csv + "\n" + string;
			});
			
			if(col == "strategies"){
			var header = "date,time,campaign_id,campaign_name," + col + "_id," + col+"_name,user_id,user_name";
			num = (max - 6)/3;
			}
			else {
			var header = "date,time," + col + "_id," + col+"_name,user_id,user_name";
			num = (max - 6)/3;
			}
			for (var j=0;j<num;j++){
				header = header + ",name,new_value,old_value";
			}
			
			//csv = header + csv;
			
			callback(strat,csv,header);
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
}	

function download() {
	var collection_list = [];
	var strat_names = [];
	var feedback = "";
	var success = 0; 
	var final_list = {};

	var collection = $('input[name=toggle]:checked', '#toggle').val();
	console.log("toggle:", toggle);	
	//console.log(collection);
	
	if(collection == 'campaigns'){
		var strategy_history = "";
		camp_list = get_selected_camps();
		camp_list = camp_list[0]; 
		//console.log("strat list:", strat_list);
		collection_list = camp_list;
		
		//var camp = $('#campaign_list').val();
		//collection_list.push(camp);
		console.log("starting to loop through strats and update geo");
		for(var i=0; i<collection_list.length; i++) {
	
		//get list of current supplies attached to strat
		console.log("updating this strat:",collection_list[i]);
		var current_strat = collection_list[i];
		var counter = 0;
		var head = "";

		get_camp_info(current_strat,function(current_strat,name){
			get_history(current_strat, name, collection, "", "", function(current_strat, doc, header) 
			{	counter++;
				console.log(counter);
				console.log(header);
				console.log(head);
				if(header.length > head.length){head = header;}
				if(counter == collection_list.length){
				strategy_history = head + strategy_history + doc;
				downloadCSV(strategy_history, { filename: "ChangeLog_" + "Campaign_"+current_strat + ".csv" });
				}
				else{
				strategy_history = strategy_history + doc;
			}
			});
		});
		}
		}
	if(collection == 'strategies'){
		var strategy_history = "";
		strat_list = get_selected_strats();
		strat_list = strat_list[0]; 
		//console.log("strat list:", strat_list);
		collection_list = strat_list;
		
		console.log("starting to loop through strats and update geo");
		for(var i=0; i<collection_list.length; i++) {
	
		//get list of current supplies attached to strat
		//console.log("updating this strat:",collection_list[i]);
		var current_strat = collection_list[i];
		var counter = 0;
		var head = "";

		get_strat_info(current_strat,function(current_strat,name,camp_name,camp_id){
			get_history(current_strat, name, collection, camp_name, camp_id, function(current_strat, doc, header) 
			{	counter++;
				console.log(counter);
				console.log(header);
				console.log(head);
				if(header.length > head.length){head = header;}
				if(counter == collection_list.length){
				strategy_history = head + strategy_history + doc;
				downloadCSV(strategy_history, { filename: "ChangeLog_" + "Strategy_"+current_strat + ".csv" });
				}
				else{
				strategy_history = strategy_history + doc;
			}
			});
		});
		}
		
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