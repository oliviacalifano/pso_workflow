
var strat_list = []; 

//returns array of all selected strategies
function get_selected_strats() {

	var strat_id = [];
	
	//get all selected strat ids
	$("#strat_list").each(function(){
		strat_id.push($(this).val());
	});
	 
	return strat_id;
}

function get_ctx(strat,d,callback){
	var contextual = new FormData();

		var dv = d.dv_inc_id;
		var pe = d.pe_inc_id;
		var ia = d.ia_inc_id;
		var gs = d.gs_inc_id;
		var sm = d.sm_inc_id;
		
		var ctx_exc = d.ctx_exc_id;
		
		
		if(dv != undefined && dv != ""){
			dv = dv.split(';');
			for (i=0; i<dv.length; i++) {
				contextual.append('segments.'+(i+1).toString()+'.id', dv[i]);
				contextual.append('segments.'+(i+1).toString()+'.restriction', "INCLUDE");
				contextual.append('segments.'+(i+1).toString()+'.operator', d.dv_inc_op);
			}
		}

		if(ia != undefined && ia != ""){
			ia = ia.split(';');
			var len = dv.length + ia.length;
			for (i=dv.length; i<len; i++) {
				var index = i - dv.length;
				contextual.append('segments.'+(i+1).toString()+'.id', ia[index]);
				contextual.append('segments.'+(i+1).toString()+'.restriction', "INCLUDE");
				contextual.append('segments.'+(i+1).toString()+'.operator', d.ia_inc_op);
			}
		}	

		if(pe != undefined && pe != ""){
			pe = pe.split(';');
			var start = dv.length + ia.length;
			var end = dv.length + ia.length + pe.length;
			for (i=start; i<end; i++) {
				var index = i - start;
				contextual.append('segments.'+(i+1).toString()+'.id', pe[index]);
				contextual.append('segments.'+(i+1).toString()+'.restriction', "INCLUDE");
				contextual.append('segments.'+(i+1).toString()+'.operator', d.pe_inc_op);
			}
		}	
		
		if(gs != undefined && gs != ""){
			gs = gs.split(';');
			var start = dv.length + ia.length + pe.length;
			var end = dv.length + ia.length + pe.length + gs.length;
			for (i=start; i<end; i++) {
				var index = i - start;
				contextual.append('segments.'+(i+1).toString()+'.id', gs[index]);
				contextual.append('segments.'+(i+1).toString()+'.restriction', "INCLUDE");
				contextual.append('segments.'+(i+1).toString()+'.operator', d.gs_inc_op);
			}
		}			

		if(sm != undefined && sm != ""){
			sm = sm.split(';');
			var start = dv.length + ia.length + pe.length + gs.length;
			var end = dv.length + ia.length + pe.length + gs.length + sm.length;
			for (i=start; i<end; i++) {
				var index = i - start;
				contextual.append('segments.'+(i+1).toString()+'.id', sm[index]);
				contextual.append('segments.'+(i+1).toString()+'.restriction', "INCLUDE");
				contextual.append('segments.'+(i+1).toString()+'.operator', d.sm_inc_op);
			}
		}
	
		if(ctx_exc != undefined && ctx_exc != ""){
			ctx_exc = ctx_exc.split(';');
			var start = dv.length + ia.length + pe.length + gs.length + sm.length;
			var end = dv.length + ia.length + pe.length + gs.length + sm.length + ctx_exc.length;
			for (i=start; i<end; i++) {
				var index = i - start;
				contextual.append('segments.'+(i+1).toString()+'.id', ctx_exc[index]);
				contextual.append('segments.'+(i+1).toString()+'.restriction', "EXCLUDE");
				contextual.append('segments.'+(i+1).toString()+'.operator', "OR");
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
			
			var dv_inc_array = [];
			var ia_inc_array = [];
			var pe_inc_array = [];
			var gs_inc_array = [];
			var sm_inc_array = [];
			
			var dv_inc_op = "";
			var ia_inc_op = "";
			var pe_inc_op = "";
			var gs_inc_op = "";
			var sm_inc_op = "";
			
			var exc_array = [];
			var entry = $(xml).find("entity");
			console.log(entry);
			entry.each(function(){
			
			//doubleverify
			if($(this).find("prop[name=restriction]").attr("value") == "INCLUDE"){
				if($(this).find("prop[name=group_identifier]").attr("value") == "tsg1_dv"){
					dv_inc_op = $(this).find("prop[name=operator]").attr("value");
					var aud_id = $(this).find("prop[name=targeting_segment_id]").attr("value");
					if(aud_id != undefined && aud_id != "" && aud_id != "undefined"){
					dv_inc_array.push(aud_id);
					}
				}
			}
			
			//ias
			if($(this).find("prop[name=restriction]").attr("value") == "INCLUDE"){
				if($(this).find("prop[name=group_identifier]").attr("value") == "tsg1_ia"){
					ia_inc_op = $(this).find("prop[name=operator]").attr("value");
					var aud_id = $(this).find("prop[name=targeting_segment_id]").attr("value");
					if(aud_id != undefined && aud_id != "" && aud_id != "undefined"){
					ia_inc_array.push(aud_id);
					}
				}
			}		

			//peer39
			if($(this).find("prop[name=restriction]").attr("value") == "INCLUDE"){
				if($(this).find("prop[name=group_identifier]").attr("value") == "tsg1_pe"){
					pe_inc_op = $(this).find("prop[name=operator]").attr("value");
					var aud_id = $(this).find("prop[name=targeting_segment_id]").attr("value");
					if(aud_id != undefined && aud_id != "" && aud_id != "undefined"){
					pe_inc_array.push(aud_id);
					}
				}
			}			

			//grapeshot
			if($(this).find("prop[name=restriction]").attr("value") == "INCLUDE"){
				if($(this).find("prop[name=group_identifier]").attr("value") == "tsg1_gs"){
					gs_inc_op = $(this).find("prop[name=operator]").attr("value");
					var aud_id = $(this).find("prop[name=targeting_segment_id]").attr("value");
					if(aud_id != undefined && aud_id != "" && aud_id != "undefined"){
					gs_inc_array.push(aud_id);
					}
				}
			}

			//semasio
			if($(this).find("prop[name=restriction]").attr("value") == "INCLUDE"){
				if($(this).find("prop[name=group_identifier]").attr("value") == "tsg1_sm"){
					sm_inc_op = $(this).find("prop[name=operator]").attr("value");
					var aud_id = $(this).find("prop[name=targeting_segment_id]").attr("value");
					if(aud_id != undefined && aud_id != "" && aud_id != "undefined"){
					sm_inc_array.push(aud_id);
					}
				}
			}
			
			//Exclusion
			if($(this).find("prop[name=restriction]").attr("value") == "EXCLUDE"){
				var aud_id = $(this).find("prop[name=targeting_segment_id]").attr("value");
				if(aud_id != undefined && aud_id != "" && aud_id != "undefined"){
				exc_array.push(aud_id);
				}
			}
			});
			
			var dv_string = dv_inc_op + "," + dv_inc_array.join(";"); 
			var ia_string = ia_inc_op + "," + ia_inc_array.join(";");
			var pe_string = pe_inc_op + "," + pe_inc_array.join(";"); 			
			var gs_string = gs_inc_op + "," + gs_inc_array.join(";"); 
			var sm_string = sm_inc_op + "," + sm_inc_array.join(";"); 
			
			con = con + dv_string + "," + ia_string + "," + pe_string + "," + gs_string + "," + sm_string + "," + exc_array.join(";");
			console.log(con);
			
			callback(strat,con);
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
}


function get_button(d,numRows){
	var strat = d.strat_id;
	strat_list.push(strat);
	console.log(strat);
	console.log(numRows);

	var feedback = "";
	var success = 0; 
	var info = "";
	var header = "strat_id,dv_inc_op,dv_inc_id,ia_inc_op,ia_inc_id,pe_inc_op,pe_inc_id,gs_inc_op,gs_inc_id,sm_inc_op,sm_inc_id,ctx_exc_id";
 	if(strat_list.length == numRows){
		dropdown(strat_list);
		} 

};

$("#get_dropdown").click(function() {
	console.log("hit!");
	var strat_list_drop = [];
	strat_list_drop = get_selected_strats();
	strat_list_drop = strat_list_drop[0]; 
	dropdown(strat_list_drop); 	
})

function dropdown(strat_list_drop){
	var feedback = "";
	var success = 0; 
	var info = "";
	var header = "strat_id,dv_inc_op,dv_inc_id,ia_inc_op,ia_inc_id,pe_inc_op,pe_inc_id,gs_inc_op,gs_inc_id,sm_inc_op,sm_inc_id,ctx_exc_id";
 
	for(var i=0; i<strat_list_drop.length; i++) {
	var current_strat = strat_list_drop[i];
	var counter = 0;
		get(current_strat, function(current_strat,ctx){
					counter++;
					if(counter == strat_list_drop.length){
						info = header +info+ "\n"+ current_strat  + "," + ctx;
						downloadCSV(info, { filename: "Strategy_Contextual_Template.csv" });
					}
					else{
						//console.log(info);
						info = info +"\n"+ current_strat  + "," + ctx;
					} 
					})
		}
};

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