var strat_list = [];

function get_selected_strats() {

	var strat_id = [];
	
	//get all selected strat ids
	$("#strat_list").each(function(){
		strat_id.push($(this).val());
	});
	 
	return strat_id;
}

function get_pmp(strat,d,callback){
	var deals = new FormData();

	//if(d.sitelists != undefined && d.sitelists != ""){
		var d_assign = d.sitelists_assign;
		var d_unassign = d.sitelists_unassign;
		d_assign = d_assign.split(';');
		d_unassign = d_unassign.split(';');
		assign_length = d_assign.length;
		unassign_length = d_unassign.length;
		total_length = assign_length + unassign_length;
		if(d_assign[0] == ""){assign_length = 0;}
		if(d_unassign[0] == ""){unassign_length = 0;}
		
		for (i=0; i<assign_length; i++) {
		deals.append('site_lists.'+(i+1).toString()+'.id', d_assign[i]);
		deals.append('site_lists.'+(i+1).toString()+'.assigned', "1");
		}
		for (i=0; i<unassign_length; i++) {
		deals.append('site_lists.'+(i+1+assign_length).toString()+'.id', d_unassign[i]);
		deals.append('site_lists.'+(i+1+assign_length).toString()+'.assigned', "0");
		}

	//}
	callback(strat,deals);
}

function add_pmp(s,deals,callback){
	//c.append("strategy_id", s);
	$.ajax({
	url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+s+"/site_lists",
	contentType: false,
	processData: false,
	data: deals,
	type: 'POST',
	success: function(data,textStatus, jqXHR) { 
	success = 1;
	console.log("success", success,data,textStatus, jqXHR);
	callback(success);
	},
	error: function(xml,jqXHR, textStatus, errorThrown) {
		//var err = xhr.responseXML.getElementsByTagName("field-error");
		var err = xml.responseXML.getElementsByTagName("field-error")[0].getAttribute('error');
		console.log(err);
		var error = "Concept Error on Row " + s + ": " + err;
		callback(error);
	}
	});
}

function get(strat, callback){
	var con = "";
	console.log(con);
	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat+"/site_lists?q=assigned==1",
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {
			
			var array = [];
			var entry = $(xml).find("entity");
			console.log(entry);
			entry.each(function(){
			//var aud_id = $(this).find("entity").attr('id');
			var exchange_id = $(this).attr('id');
			if(exchange_id != undefined && exchange_id != "" && exchange_id != "undefined"){
			array.push(exchange_id);
			}
			});
			
			con = con + array.join(";") + ",";
			console.log(con);
			
			callback(strat,con);
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
}

function upload_button(d){
	feedback = "";
	var strat = d.strat_id;
	console.log(strat);

 	get_pmp(strat,d,function(strat,deals){
		add_pmp(strat,deals,function(deal_success){
		if (deal_success == 1) {
		feedback = feedback + "Success on " + strat + ": Deals Added</p>";								
		$("#feedback").html(feedback); 
		}
		else {
		feedback = feedback + deal_success.fontcolor("red") + "<br>";							
		$("#feedback").html(feedback); 
		}
		})
	}) 

};


$("#get_dropdown").click(function() {
	console.log("hit!");
	var strat_list_drop = [];
	strat_list_drop = get_selected_strats();
	strat_list_drop = strat_list_drop[0]; 
	dropdown(strat_list_drop); 	
})

function get_button(d,numRows){
	var strat = d.strat_id;
	strat_list.push(strat);
 	if(strat_list.length == numRows){
		dropdown(strat_list);
		} 

};

function dropdown(strat_list){
	var feedback = "";
	var success = 0; 
	var info = "";
	var header = "strat_id,sitelists";
	//console.log("starting to loop through strats and update geo");
	for(var i=0; i<strat_list.length; i++) {

	var current_strat = strat_list[i];
	//console.log(current_strat);
	var counter = 0;
		
		get(current_strat, function(current_strat,exch){
					counter++;
					console.log(strat_list.length);
					console.log(counter);
					
					
					if(counter == strat_list.length){
						info = header +info+ "\n"+ current_strat + "," + exch;
						downloadCSV(info, { filename: "Strategy_Sitelist_Template.csv" });
					}
					else{
						//console.log(info);
						info = info +"\n"+ current_strat + "," + exch;
					} 
					//});
					})

		}
		

};

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