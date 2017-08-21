//remove strategies with no audiences
// upload broadband_audiences.csv

var strat_list = []; 

function get_aud(strat,d,callback){
	var audience = new FormData();

		var aud = d.aud_id;
		aud = aud.split(';');
		if(d.aud_id != undefined && d.aud_id != ""){
		for (i=0; i<aud.length; i++) {
		audience.append('segments.'+(i+1).toString()+'.id', aud[i]);
		audience.append('segments.'+(i+1).toString()+'.restriction', "INCLUDE");
		}
		}
		audience.append('exclude_op', "OR");
		audience.append('include_op', "OR");
	
	callback(strat,audience);
}


function add_aud(s,audience,callback){
	//c.append("strategy_id", s);
	$.ajax({
	url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+s+"/audience_segments",
	contentType: false,
	processData: false,
	data: audience,
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
		var error = "Audience Error on Row " + s + ": " + err;
		callback(error);
	}
	});
}

function get(strat, callback){
	var con = "";
	console.log(con);
	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat+"/audience_segments?with=audience_segment",
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {
			
			var array = [];
			var entry = $(xml).find("entity");
			console.log(entry);
			entry.each(function(){
			//var aud_id = $(this).find("entity").attr('id');
			var aud_id = $(this).find("entity").attr('id');
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

 	get_aud(strat,d,function(strat,audience){
		add_aud(strat,audience,function(audience_success){
		if (audience_success == 1) {
		feedback = feedback + "Success on " + strat + ": Audiences Added</p>";								
		$("#feedback").html(feedback); 
		}
		else {
		feedback = feedback + audience_success.fontcolor("red") + "<br>";							
		$("#feedback").html(feedback); 
		}
		})
	}) 

};


function get_button(d,numRows){
	var strat = d.strat_id;
	strat_list.push(strat);
	console.log(strat);
	console.log(numRows);

	var feedback = "";
	var success = 0; 
	var info = "";
	var header = "strat_id,aud_id";
 	if(strat_list.length == numRows){
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