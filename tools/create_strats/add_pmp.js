function get_pmp(strat,d,callback){
	var deals = new FormData();

	if(d.deal_id != undefined && d.deal_id != ""){
		var deal = d.deal_id;
		deal = deal.split(';');
		for (i=0; i<deal.length; i++) {
		deals.append('deal.'+(i+1).toString()+'.id', deal[i]);
		}

	}
	callback(strat,deals);
}

function add_pmp(s,deals,callback){
	//c.append("strategy_id", s);
	$.ajax({
	url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+s+"/deals",
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
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat+"/deals?with=deal",
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {
			
			var array = [];
			var entry = $(xml).find("entity").find("entity");
			console.log(entry);
			entry.each(function(){
			//var aud_id = $(this).find("entity").attr('id');
			var aud_id = $(this).attr('id');
			if(aud_id != undefined && aud_id != "" && aud_id != "undefined"){
			array.push(aud_id);
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

var strat_list = []; 

function get_button(d,numRows){
	var strat = d.strat_id;
	strat_list.push(strat);
	console.log(strat);
	console.log(numRows);

	var feedback = "";
	var success = 0; 
	var info = "";
	var header = "strat_id,deal_id";
 	if(strat_list.length == numRows){
	//console.log("starting to loop through strats and update geo");
	for(var i=0; i<strat_list.length; i++) {

	var current_strat = strat_list[i];
	//console.log(current_strat);
	var counter = 0;
		
		get(current_strat, function(current_strat,deal){
					counter++;

					if(counter == strat_list.length){
						info = header +info+ "\n"+ current_strat  + "," + deal;
						downloadCSV(info, { filename: "Strategy_PMP_Template.csv" });
					}
					else{
						//console.log(info);
						info = info +"\n"+ current_strat  + "," + deal;
					} 
					//});
					})

		}
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