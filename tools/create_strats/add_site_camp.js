var camp_list = [];

//retrieve list of selected campaigns from excel or UI
function get_selected_camps() {

	var camp_id = [];
	
	//get all selected camp ids
	$("#campaign_list").each(function(){
		camp_id.push($(this).val());
	});
	 
	return camp_id;
}

//retrieve the sitelists to be added or removed from user excel
function get_site(camp,d,callback){
	var deals = new FormData();
	var d_assign = d.sitelists_assign;
	var d_unassign = d.sitelists_unassign;
	d_assign = d_assign.split(';');
	d_unassign = d_unassign.split(';');
	var assign_length = d_assign.length;
	var unassign_length = d_unassign.length;
	
	if(d.sitelists_assign == ""){assign_length = 0;}
	if(d.sitelists_unassign == ""){unassign_length = 0;}

	//if(d.sitelists != undefined && d.sitelists != ""){

		total_length = d_assign.length + d_unassign.length;
		for (i=0; i<assign_length; i++) {
		deals.append('site_lists.'+(i+1).toString()+'.id', d_assign[i]);
		deals.append('site_lists.'+(i+1).toString()+'.assigned', "1");
		}
		for (i=0; i<unassign_length; i++) {
		deals.append('site_lists.'+(i+1+assign_length).toString()+'.id', d_unassign[i]);
		deals.append('site_lists.'+(i+1+assign_length).toString()+'.assigned', "0");
		}

	//}
	callback(camp,deals);
}

//make a post with the new sitelist
function add_site(s,deals,callback){
	
	$.ajax({
	url: "https://adroit-tools.mediamath.com/t1/api/v2.0/campaigns/"+s+"/site_lists",
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

//access sitelists currently attached to campaign
function get(camp, callback){
	var con = "";
	console.log(con);
	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/campaigns/"+camp+"/site_lists?q=assigned==1",
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
			
			callback(camp,con);
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
}


function upload_button(d){
	feedback = "";
	var camp = d.camp_id;
	console.log(camp);

 	get_site(camp,d,function(camp,deals){
		add_site(camp,deals,function(deal_success){
		if (deal_success == 1) {
		feedback = feedback + "Success on " + camp + ": Deals Added</p>";								
		$("#feedback").html(feedback); 
		}
		else {
		feedback = feedback + deal_success.fontcolor("red") + "<br>";							
		$("#feedback").html(feedback); 
		}
		})
	}) 

};

//pull sites attached to campaigns using dropdown
$("#get_dropdown").click(function() {
	console.log("hit!");
	var camp_list_drop = [];
	camp_list_drop = get_selected_camps();
	camp_list_drop = camp_list_drop[0]; 
	dropdown(camp_list_drop); 	
})

function get_button(d,numRows){
	var camp = d.camp_id;
	camp_list.push(camp);
 	if(camp_list.length == numRows){
		dropdown(camp_list);
		} 

};

function dropdown(camp_list){
	var feedback = "";
	var success = 0; 
	var info = "";
	var header = "camp_id,sitelists";
	
	for(var i=0; i<camp_list.length; i++) {

	var current_camp = camp_list[i];
	//console.log(current_camp);
	var counter = 0;
		
		get(current_camp, function(current_camp,exch){
					counter++;
					console.log(camp_list.length);
					console.log(counter);
					
					if(counter == camp_list.length){
						info = header +info+ "\n"+ current_camp + "," + exch;
						downloadCSV(info, { filename: "Campaign_Sitelist_Template.csv" });
					}
					else{
						//console.log(info);
						info = info +"\n"+ current_camp + "," + exch;
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