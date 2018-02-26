
var strat_list = []; 

function get_ctx(strat,d,callback){
	var contextual = new FormData();

		var ctx_inc = d.ctx_inc_id;
		var ctx_exc = d.ctx_exc_id;
		ctx_inc = ctx_inc.split(';');
		ctx_exc = ctx_exc.split(';');
		
		var index_inc = ctx_inc.indexOf("");
		var index_exc = ctx_exc.indexOf("");
		
		if (index_inc > -1) {
			ctx_inc.splice(index_inc, 1);
			}
		if (index_exc > -1) {
			ctx_exc.splice(index_exc, 1);
			}
		
		var inc_length = ctx_inc.length;
		console.log(inc_length);
		var exc_length = ctx_exc.length;
		console.log(exc_length);
		var total_length = inc_length + exc_length;
		console.log(total_length);
		
		if(inc_length != 0 || exc_length != 0){
		for (i=0; i<inc_length; i++) {
		contextual.append('segments.'+(i+1).toString()+'.id', ctx_inc[i]);
		contextual.append('segments.'+(i+1).toString()+'.restriction', "INCLUDE");
		contextual.append('segments.'+(i+1).toString()+'.operator', "AND");
		console.log("entered loop");
		}
		for (i=inc_length; i<total_length; i++) {
		contextual.append('segments.'+(i+1).toString()+'.id', ctx_exc[i-inc_length]);
		contextual.append('segments.'+(i+1).toString()+'.restriction', "EXCLUDE");
		contextual.append('segments.'+(i+1).toString()+'.operator', "OR");
		//console.log(contextual);
		}
}
	contextual.append('exclude_op', "OR");
	contextual.append('include_op', "OR");			
	callback(strat,contextual);
}


function add_ctx(s,audience,callback){
	//c.append("strategy_id", s);
	$.ajax({
	url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+s+"/targeting_segments",
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
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat+"/targeting_segments?full=*",
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {
			
			var inc_array = [];
			var exc_array = [];
			var entry = $(xml).find("entity");
			console.log(entry);
			entry.each(function(){
			//var aud_id = $(this).find("entity").attr('id');
			if($(this).find("prop[name=restriction]").attr("value") == "INCLUDE"){
				var aud_id = $(this).find("prop[name=targeting_segment_id]").attr("value");
				if(aud_id != undefined && aud_id != "" && aud_id != "undefined"){
				inc_array.push(aud_id);
				}
			}
			if($(this).find("prop[name=restriction]").attr("value") == "EXCLUDE"){
				var aud_id = $(this).find("prop[name=targeting_segment_id]").attr("value");
				if(aud_id != undefined && aud_id != "" && aud_id != "undefined"){
				exc_array.push(aud_id);
				}
			}
			});
			
			con = con + inc_array.join(";") + ","+ exc_array.join(";");
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

 	get_ctx(strat,d,function(strat,contextual){
		add_ctx(strat,contextual,function(ctx_success){
		if (ctx_success == 1) {
		feedback = feedback + "Success on " + strat + ": Audiences Added</p>";								
		$("#feedback").html(feedback); 
		}
		else {
		feedback = feedback + ctx_success.fontcolor("red") + "<br>";							
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
	var header = "strat_id,ctx_inc_id,ctx_exc_id";
 	if(strat_list.length == numRows){
	//console.log("starting to loop through strats and update geo");
	for(var i=0; i<strat_list.length; i++) {

	var current_strat = strat_list[i];
	//console.log(current_strat);
	var counter = 0;
		
		get(current_strat, function(current_strat,ctx){
					counter++;

					if(counter == strat_list.length){
						info = header +info+ "\n"+ current_strat  + "," + ctx;
						downloadCSV(info, { filename: "Strategy_Contextual_Template.csv" });
					}
					else{
						//console.log(info);
						info = info +"\n"+ current_strat  + "," + ctx;
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