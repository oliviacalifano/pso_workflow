//remove strategies with no audiences
// upload broadband_audiences.csv

var deal_list = []; 

 function get_edits(deal,d,callback){
	console.log(deal);
	console.log(d);
	
	var edits = {};
		console.log(edits);
		var name = d.name;
		var stat = d.status;
		console.log(stat)
		var deal_identifier = d.deal_identifier;
		
		var exchange = d.exchange;
		console.log(name);
		if(name != undefined && name != ""){
			//edits.supply_source_id = Number(name);
		edits.name = name;
		}
		console.log(stat);
		if(stat != undefined && stat != ""){
			stat = stat.toLowerCase();
			var stat_boolean = (stat == "true");
			console.log(typeof(stat_boolean));
			console.log(stat_boolean);
			edits.status = stat_boolean;
			console.log("yes");
		}
		if(deal_identifier != undefined && deal_identifier != ""){
			edits.deal_identifier = String(deal_identifier);
		}
		if(exchange != undefined && exchange != ""){
			edits.supply_source_id = Number(exchange);
		}

		console.log(edits);
		
	callback(deal,edits);
} 

function update(deal,edits,callback){
	console.log(edits);
	//c.append("strategy_id", d);
	//console.log(d.name);
	$.ajax({
	type: 'POST',
	url: "https://adroit-tools.mediamath.com/t1/media/deals/"+deal,
	contentType: "application/json",
	dataType: "json",
	data: JSON.stringify(edits),
	success: function(response) { 
	success = 1;
	console.log("success");
	callback(success);
	},
	error: function(response) {
		//var err = xhr.responseXML.getElementsByTagName("field-error");
		var err = xml.responseXML.getElementsByTagName("field-error")[0].getAttribute('error');
		console.log(err);
		var error = "Deal Error on deal: " + d + ": " + err;
		callback(error);
	}
	});
}

function get(deal, callback){
	var con = "";
	console.log(con);
	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/media/deals/"+deal,
		type: "GET",
		cache: false,
		dataType: "json",
	
		success: function(response) {
			console.log(response.data);
			var name = response.data.name;
			name = name.replace(/,/g, ';');
			var stat = response.data.status;
			var deal_identifier = response.data.deal_identifier;
			var exchange = response.data.supply_source_id;
			var info = name + "," + stat + "," + deal_identifier + "," + exchange;
			console.log(info);
			callback(deal,info); 
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		callback(deal,"not_found");
		}
	})
}

function upload_button(d){
	feedback = "";
	var deal = d.deal_id;
	console.log(deal);

 	get_edits(deal,d,function(deal,edits){
		update(deal,edits,function(deal_success){
		if (deal_success == 1) {
		feedback = feedback + "Success on " + deal + ": Deal Updated</p>";								
		$("#feedback").html(feedback); 
		}
		else {
		feedback = feedback + deal_success.fontcolor("red") + "<br>";							
		$("#feedback").html(feedback); 
		}
		})
	}) 

};

function get_button(d,numRows){
	var deal = d.deal_id;
	deal_list.push(deal);
	console.log(deal);
	console.log(numRows);

	var feedback = "";
	var success = 0; 
	var info = "";
	var header = "deal_id,name,status,deal_identifier,exchange";
 	if(deal_list.length == numRows){
	//console.log("starting to loop through strats and update geo");
	for(var i=0; i<deal_list.length; i++) {

	var current_deal = deal_list[i];
	//console.log(current_deal);
	var counter = 0;
		
		get(current_deal, function(current_deal,stuff){
					counter++;

					if(counter == deal_list.length){
						info = header +info+ "\n"+ current_deal  + "," + stuff;
						downloadCSV(info, { filename: "Strategy_PMP_Template.csv" });
					}
					else{
						//console.log(info);
						info = info +"\n"+ current_deal  + "," + stuff;
					} 
					//});
					})

		}
		} 

};



//download audiences
/* function download() {
	var strat_list = [2454705,2454704,2454702,2454703,2454602,2454599,2454597,2454598,2454596,2454595,2454594,2454593,2454590,2454591,2454589,2454588,2454587,2454585,2454586,2454584,2454583,2454582,2454579,2454581,2454578,2454577,2454576,2454574,2454575,2454573,2454572,2454571,2454569,2454570,2454568,2454567,2454565,2454566,2454564,2454557,2454556,2454554,2454555,2454553,2454552,2454551,2454550,2454548,2454549,2454547,2454546,2454545,2454543,2454544,2454542,2454541,2454540,2454536,2454534,2454535,2454533,2454532,2454531,2454529,2454530,2454528,2454527,2454525,2454526,2454523,2454502,2454498,2454488,2454484];
	var feedback = "";
	var success = 0; 
	var info = "";
	var header = "strat_id,aud_id";
	
	//console.log("starting to loop through strats and update geo");
	for(var i=0; i<strat_list.length; i++) {

	var current_strat = strat_list[i];
	//console.log(current_strat);
	var counter = 0;
		
		get(current_strat, function(current_strat,audience){
					counter++;

					if(counter == strat_list.length){
						info = header +info+ "\n"+ current_strat  + "," + audience;
						downloadCSV(info, { filename: "Strategy_Audience_Template.csv" });
					}
					else{
						//console.log(info);
						info = info +"\n"+ current_strat  + "," + audience;
					} 
					//});
					})

		}
		} */


/* $("#get").click(function() {
	console.log("hit!");
	download();

})	 */


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