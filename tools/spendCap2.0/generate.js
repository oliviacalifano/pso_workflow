

var selectedCamps = [];
var csv = ""; 

jQuery.extend({
    percentage: function(a, b) {
        var p = Math.round((a / b) * 100);
		return p + "%";
    }
});

function get_selected_campaigns() 
{
	var camp_ids = []; 
	
	//get selected ctxlice ids
	$("#campaign_list").each(function() { 
		camp_ids.push($(this).val()); 
	});
	console.log(camp_ids);

	return camp_ids[0];
}

function yesterdayDate(){
	today = new Date();
	yesterday = new Date(today);
	yesterday.setDate(today.getDate() - 1);

	var dd = yesterday.getDate();
	var mm = yesterday.getMonth()+1;

	var yyyy = yesterday.getFullYear();
	if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} yesterday = yyyy+'-'+mm+'-'+dd;

	return yesterday;	
}

function check_spend(camp, d, callback){
	
	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/reporting/v1/std/performance?start_date=" + d + "&time_rollup=by_day&filter=campaign_id%3D" + camp + "&end_date=" + d + "&dimensions=advertiser_name%2Cadvertiser_id%2Ccampaign_name%2Ccampaign_id&metrics=total_spend",
		type: "GET",
	
		success: function(csv) {
			var d = csv.split('\n');
			d = d[1];
			d = d.split(",");
			var data = d[d.length - 1];
			console.log(data);
			console.log(typeof(data));
			
			callback(camp, data);
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}	
	});
}

function get_spendCap(camp,callback){

	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/campaigns/"+camp+"?with=advertiser",
		type: "GET",
		cache: false,
	
		success: function(xml) {
			
			var org_id = $("#org_dropdown").multipleSelect('getSelects');
			console.log(org_id[0]);
			
			var org_name = $("#org_dropdown").multipleSelect('getSelects', 'text');
			console.log(org_name[0]);
			
			var adv_id = $(xml).find("entity").find("entity").attr("id");
			console.log(adv_id);
			
			var adv_name = $(xml).find("entity").find("entity").attr("name");
			console.log(adv_name);

			var camp_id = $(xml).find("entity").attr("id");
			console.log(camp_id);
			
			var camp_name = $(xml).find("entity").attr("name");
			console.log(camp_name);

			var auto = $(xml).find("prop[name=spend_cap_automatic]").attr("value");
			console.log(auto);
			
			var cap = $(xml).find("prop[name=spend_cap_amount]").attr("value");
			console.log(cap);
			
			if(auto == "1"){
			var info = org_id +","+ org_name +","+ adv_id +","+ adv_name +","+ camp_id +","+ camp_name +",Auto";
			cap = "Auto";
			}
			else {
				var info = org_id +","+ org_name +","+ adv_id +","+ adv_name +","+ camp_id +","+ camp_name +","+ cap;
			}
			callback(camp,info,cap);
			
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
}



function checks(){
	var campaign_list = [];
	var feedback = "";
	date = yesterdayDate();
	console.log(date);
		
	campaign_list = get_selected_campaigns();
	console.log("pixel list:", campaign_list);
	var counter =0;
	var doc = "";
	
		for(var i=0; i<campaign_list.length; i++) {
				var current_camp = campaign_list[i];
				
				get_spendCap(current_camp, function(current_camp, info, cap){
					check_spend(current_camp, date ,function(current_camp, spend) 
					{	
						counter++;
						console.log(counter);
						var hitting = "N";
						var temp = +cap - 2;
						console.log("cap:"+cap);
						console.log("temp:"+temp);
						if (spend >= temp){
							hitting = "Y";
						}
						console.log(hitting);
						if(counter == campaign_list.length){
						doc = "org_id,org_name,advertiser_name,advertiser_id,campaign_name,campaign_id,spend_cap,spend_YDY,hitting_spend_cap" +'\r\n' + doc + info + "," + Number(spend) + ","+ hitting;
						downloadCSV(doc, { filename: "SpendCap_Report_" + date + ".csv" });
						}
						else{
						doc = doc + info + "," + Number(spend) +","+ hitting +'\r\n'; 
						console.log(info);
						}
				});
		});
		}
}

	
$("#punch").click(function() {
	checks();
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