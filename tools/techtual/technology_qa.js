'use strict' 

//returns array of all selected strategies
function get_selected_strats() {

	var strat_id = [];
	
	//get all selected strat ids
	$("#strat_list").each(function(){
		strat_id.push($(this).val());
	});
	return strat_id;
}

function get_dvce(strat, target_dimension_id, callback){
	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat+"/target_dimensions/"+target_dimension_id,
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {
			
			var inc_array = [];
			var exc_array = [];
			var entry_inc = $(xml).find("include").find("entity");
			var entry_exc = $(xml).find("exclude").find("entity");
			entry_inc.each(function(){	
				var inc = $(this).attr("name");
				inc_array.push(inc);
			});
			entry_exc.each(function(){	
				var exc = $(this).attr("name");
				exc_array.push(exc);
			});
			
			var con = inc_array.join(";") + ","+ exc_array.join(";");
			console.log(con);
			
			callback(strat,con);
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
}

function get_bser(strat, callback){
	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat+"/target_dimensions/4",
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {
			
			var inc_array = [];
			var exc_array = [];
			var entry_inc = $(xml).find("include").find("entity");
			var entry_exc = $(xml).find("exclude").find("entity");
			entry_inc.each(function(){	
				var inc = $(this).attr("name");
				inc_array.push(inc);
			});
			entry_exc.each(function(){	
				var exc = $(this).attr("name");
				exc_array.push(exc);
			});
			
			var con = inc_array.join(";") + ","+ exc_array.join(";");
			console.log(con);
			
			callback(strat,con);
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
}

function get_cspd(strat, callback){
	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat+"/target_dimensions/2",
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {
			
			var inc_array = [];
			var exc_array = [];
			var entry_inc = $(xml).find("include").find("entity");
			var entry_exc = $(xml).find("exclude").find("entity");
			entry_inc.each(function(){	
				var inc = $(this).attr("name");
				inc_array.push(inc);
			});
			entry_exc.each(function(){	
				var exc = $(this).attr("name");
				exc_array.push(exc);
			});
			
			var con = inc_array.join(";") + ","+ exc_array.join(";");
			console.log(con);
			
			callback(strat,con);
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
}

function get_ispx(strat, callback){
	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat+"/target_dimensions/3",
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {
			
			var inc_array = [];
			var exc_array = [];
			var entry_inc = $(xml).find("include").find("entity");
			var entry_exc = $(xml).find("exclude").find("entity");
			entry_inc.each(function(){	
				var inc = $(this).attr("name");
				inc_array.push(inc);
			});
			entry_exc.each(function(){	
				var exc = $(this).attr("name");
				exc_array.push(exc);
			});
			
			var con = inc_array.join(";") + ","+ exc_array.join(";");
			console.log(con);
			
			callback(strat,con);
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
}

function get_invt(strat, callback){
	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat+"/target_dimensions/25",
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {
			
			var inc_array = [];
			var exc_array = [];
			var entry_inc = $(xml).find("include").find("entity");
			var entry_exc = $(xml).find("exclude").find("entity");
			entry_inc.each(function(){	
				var inc = $(this).attr("name");
				inc_array.push(inc);
			});
			entry_exc.each(function(){	
				var exc = $(this).attr("name");
				exc_array.push(exc);
			});
			
			var con = inc_array.join(";") + ","+ exc_array.join(";");
			console.log(con);
			
			callback(strat,con);
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
}

function qa(){
	var strat_list = get_selected_strats();
	strat_list = strat_list[0]; 
	console.log("strat list:", strat_list);
	
	var tech_id = $("#target_values").val()[0];
	if (tech_id == "dvce") {var target_dimension_id = "24"};
	if (tech_id == "bser") {var target_dimension_id = "4"};
	if (tech_id == "cspd") {var target_dimension_id = "2"};
	if (tech_id == "ispx") {var target_dimension_id = "3"};
	if (tech_id == "invt") {var target_dimension_id = "25"};

	var feedback = "";
	var success = 0; 
	var info = "";
	//var header = "strat_id,dvce_inc,dvce_exc,bser_inc,bser_exc,cspd_inc,cspd_exc,ispx_inc,ispx_exc,invt_inc,invt_exc";
	var header = "strat_id,"+tech_id+"_inc,"+tech_id+"_exc";
	for(var i=0; i<strat_list.length; i++) {

	var current_strat = strat_list[i];
	var counter = 0;
		
		get_dvce(current_strat,target_dimension_id, function(current_strat,dvce){
			//get_bser(current_strat, function(current_strat,bser){
				//get_cspd(current_strat, function(current_strat,cspd){
					//get_ispx(current_strat, function(current_strat,ispx){
						//get_invt(current_strat, function(current_strat,invt){
							counter++;
							$("#counter").html(counter + "/" + strat_list.length);
							move(Math.round((counter/strat_list.length)*100));
							if(counter == strat_list.length){
								
								//info = header +info+ "\n"+ current_strat  + "," + dvce + "," + bser + "," + cspd + "," + ispx + "," + invt;
								info = header +info+ "\n"+ current_strat  + "," + dvce;
								downloadCSV(info, { filename: "Strategy_Device_Template.csv" });
							}
							else{	
								//info = info +"\n"+ current_strat  + "," + dvce + "," + bser + "," + cspd + "," + ispx + "," + invt;
								info = info +"\n"+ current_strat  + "," + dvce;
							}
							

					})
					//})
					//})
					//})
					//})

		}
		 

};

$("#qa").click(function() {

	console.log("hit!");
	qa(); 	
})	

function move(width) {
console.log(width);
  var elem = document.getElementById("myBar");
  elem.style.width = width + '%';
}

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