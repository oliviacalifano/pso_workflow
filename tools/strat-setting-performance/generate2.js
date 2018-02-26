// 5.24.17 --> now you can choose custom dates
// 5.25.17 --> now total_spend is included, rounds performance numbers to two decimal places

var selectedCamps = [];
var csv = ""; 

jQuery.extend({
    percentage: function(a, b) {
        var p = Math.round((a / b) * 100);
		return p + "%";
    }
});

function get_selected_strategies() 
{
	var strat_ids = []; 
	
	//get selected ctxlice ids
	$("#strat_list").each(function() { 
		strat_ids.push($(this).val()); 
	});
	console.log(strat_ids);

	return strat_ids[0];
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
		url: "https://adroit-tools.mediamath.com/t1/reporting/v1/std/performance?start_date="+d+"&time_rollup=by_day&filter=strategy_id%3D"+camp+"&end_date="+d+"&dimensions=strategy_id&metrics=total_spend",
		type: "GET",
	
		success: function(csv) {
			var d = csv.split('\n');
			d = d[1];
			d = d.split(",");
			var spend = d[d.length - 1];			
			callback(camp, Number(spend));
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}	
	});
}

function check_perf(camp, start, end, callback){
	
	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/reporting/v1/std/performance?start_date="+start+"&end_date="+end+"&time_rollup=all&filter=strategy_id%3D"+camp+"&dimensions=strategy_id&metrics=total_spend_cpm,total_spend_cpa,total_spend",
		type: "GET",
	
		success: function(csv) {
			var d = csv.split('\n');
			d = d[1];
			d = d.split(",");
			var total_spend = d[d.length - 1];
			var cpa = d[d.length - 2];
			var cpm = d[d.length - 3];
			total_spend = Math.round(Number(total_spend) * 100) / 100;
			cpa = Math.round(Number(cpa) * 100) / 100;
			cpm = Math.round(Number(cpm) * 100) / 100;
			var data = cpm + "," + total_spend + "," + cpa;
			console.log(data);
			
			callback(camp, data);
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}	
	});
} 

function get_settings(camp,callback){

	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+camp+"?with=campaign",
		type: "GET",
		cache: false,
	
		success: function(xml) {
			
			var camp_name = $(xml).find("entity").find("entity").attr("name");
			console.log(camp_name);

			var camp_id = $(xml).find("entity").find("entity").attr("id");
			console.log(camp_id);
			
			var strat_name = $(xml).find("entity").attr("name");
			console.log(strat_name);
			strat_name = strat_name.replace(/,/g, '/');

			var strat_id = $(xml).find("entity").attr("id");
			console.log(strat_id);
			
			var pacing_type = $(xml).find("prop[name=pacing_type]").attr("value");
			console.log(pacing_type);
			
			var pacing_interval = $(xml).find("prop[name=pacing_interval]").attr("value");
			console.log(pacing_interval);

			var pacing_amount = $(xml).find("prop[name=pacing_amount]").attr("value");
			console.log(pacing_amount);

			var min_bid = $(xml).find("prop[name=min_bid]").attr("value");
			console.log(min_bid);			
			
			var max_bid = $(xml).find("prop[name=max_bid]").attr("value");
			console.log(max_bid);
			
			var bids = min_bid +","+ max_bid;
			
			var info = camp_id +","+ camp_name + "," + strat_id +","+ strat_name + "," + pacing_type +","+ pacing_interval+ "," + pacing_amount;

			callback(camp,info,bids);
			
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
}



function checks(){
	var start = $('#reportrange').data('daterangepicker').startDate.format('YYYY-MM-DD');
	var end = $('#reportrange').data('daterangepicker').endDate.format('YYYY-MM-DD');
	console.log(start,end);
	console.log($('#reportrange').data('daterangepicker').dateLimit);
	
	var campaign_list = [];
	var feedback = "";
	date = yesterdayDate();
	console.log(date);
		
	campaign_list = get_selected_strategies();
	console.log("pixel list:", campaign_list);
	var counter =0;
	var doc = "";
	
		for(var i=0; i<campaign_list.length; i++) {
				var current_camp = campaign_list[i];
				
				get_settings(current_camp, function(current_camp, info,bids){
					check_spend(current_camp, date ,function(current_camp, spend){
						check_perf(current_camp, start, end, function(current_camp, perf){
						counter++;

						if(counter == campaign_list.length){
						doc = "camp_id,camp_name,strat_id,strat_name,pacing_type,pacing_interval,pacing_amount,spend,min_bid,max_bid,eCPM,total_spend,eCPA" +'\r\n' + doc + info + "," + spend + "," + bids + "," + perf;
						downloadCSV(doc, { filename: "settings_performance_report_" + start + "_" + end + ".csv" });
						}
						else{
						doc = doc + info + "," + spend + "," + bids + "," + perf +'\r\n'; 
						console.log(info);
						}
						});
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