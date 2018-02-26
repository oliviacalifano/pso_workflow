//with today, yesterday, day before yesterday

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
	//console.log(camp_ids);

	return camp_ids[0];
}

function todayDate(){
	today = new Date();

	var dd = today.getDate();
	var mm = today.getMonth()+1;

	var yyyy = today.getFullYear();
	if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} today = yyyy+'-'+mm+'-'+dd;

	return today;	
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

function beforeYestDate(){
	today = new Date();
	yesterday = new Date(today);
	yesterday.setDate(today.getDate() - 2);

	var dd = yesterday.getDate();
	var mm = yesterday.getMonth()+1;

	var yyyy = yesterday.getFullYear();
	if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} yesterday = yyyy+'-'+mm+'-'+dd;

	return yesterday;	
}

function check_todaySpend(camp, metric, callback){
    var hold = [];
	var max = 0;
	date = todayDate();	
	console.log(date);			
	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/reporting/v1/std/pulse?dimensions=campaign_name&metrics="+metric+"&filter=campaign_id="+camp+"&time_rollup=by_hour&start_date="+date+"&end_date="+date+"&order=date",
		type: "GET",

		success: function(csv) {
						var d = csv.split('\n');
						var tuples = [];
						var today = [];
						var last_time = "";
						
						var data = {};
						for(var i = 0; i < 24; i++){
							data[i] = 0;
						}
						
						for(var i = 1; i < d.length-1; i++){
						
						var da = d[i];
						da = da.split(/,(.+)?/);
						var day = da[0].split(" ");
						day = day[1].slice(0, -1);
						day = day.split(":")[0];
						day = parseInt(day,10);
						var rest = da[1].split(",")[2];
						//console.log(rest);
						last_time = day;						
						data[day] = rest;
						//console.log(data);
					}
					
					for(a in data){			
						tuples.push(Number(data[a]));
					}
					//console.log(tuples);
					
					var result = tuples.reduce(function(r, a) {
						if (r.length > 0)
							a += r[r.length - 1];
						r.push(a);
						return r;
						}, []);
					//console.log(result);	
						
					for(r in result){
						result[r] = Math.round(Number(result[r])*100)/100;
					}	
					
					
					for(var i = last_time+1; i < 24 ; i++){
						result[i] = "";
					}
					//console.log(result);
					
					for(var i = 0; i < last_time ; i++){
						today.push([i, result[i]])
					}
					
				callback(today); 
								
		},             
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}              
	});
}

function check_yestSpend(camp, metric, callback){
    var hold = [];   
	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/reporting/v1/std/pulse?dimensions=campaign_name&metrics="+metric+"&filter=campaign_id="+camp+"&time_rollup=by_hour&time_window=last_1_days&order=date",
		type: "GET",

		success: function(csv) {
						var d = csv.split('\n');
						var tuples = [];
						var yesterday = [];
						var last_time = "";
						
						var data = {};
						for(var i = 0; i < 24; i++){
							data[i] = 0;
						}
						
						for(var i = 1; i < d.length-1; i++){
						
						var da = d[i];
						da = da.split(/,(.+)?/);
						var day = da[0].split(" ");
						day = day[1].slice(0, -1);
						day = day.split(":")[0];
						day = parseInt(day,10);
						var rest = da[1].split(",")[2];
						//console.log(rest);
						last_time = day;						
						data[day] = rest;
						//console.log(data);
					}
					
					for(a in data){			
						tuples.push(Number(data[a]));
					}
					//console.log(tuples);
					
					var result = tuples.reduce(function(r, a) {
						if (r.length > 0)
							a += r[r.length - 1];
						r.push(a);
						return r;
						}, []);
					//console.log(result);	
						
					for(r in result){
						result[r] = Math.round(Number(result[r])*100)/100;
					}	
					
					
					for(var i = last_time+1; i < 24 ; i++){
						result[i] = "-";
					}
					//console.log(result);
									
					for(r in result){
						yesterday.push([r, result[r]])
					}
					
				callback(yesterday); 
						
		},             
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}              
	});
}

function check_dayBeforeYestSpend(camp, metric, callback){
    var hold = [];
	var max = 0;
	date = beforeYestDate();	
	console.log(date);			
	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/reporting/v1/std/pulse?dimensions=campaign_name&metrics="+metric+"&filter=campaign_id="+camp+"&time_rollup=by_hour&start_date="+date+"&end_date="+date+"&order=date",
		type: "GET",

		success: function(csv) {
						var d = csv.split('\n');
						var tuples = [];
						var yesterday = [];
						var last_time = "";
						
						var data = {};
						for(var i = 0; i < 24; i++){
							data[i] = 0;
						}
						
						for(var i = 1; i < d.length-1; i++){
						
						var da = d[i];
						da = da.split(/,(.+)?/);
						var day = da[0].split(" ");
						day = day[1].slice(0, -1);
						day = day.split(":")[0];
						day = parseInt(day,10);
						var rest = da[1].split(",")[2];
						//console.log(rest);
						last_time = day;						
						data[day] = rest;
						//console.log(data);
					}
					
					for(a in data){			
						tuples.push(Number(data[a]));
					}
					//console.log(tuples);
					
					var result = tuples.reduce(function(r, a) {
						if (r.length > 0)
							a += r[r.length - 1];
						r.push(a);
						return r;
						}, []);
					//console.log(result);	
						
					for(r in result){
						result[r] = Math.round(Number(result[r])*100)/100;
					}	
					
					
					for(var i = last_time+1; i < 24 ; i++){
						result[i] = "-";
					}
					//console.log(result);
									
					for(r in result){
						yesterday.push([r, result[r]])
					}
					
				callback(yesterday); 
						
		},             
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}              
	});
}

function checks(click){
	var campaign_list = [];
	var feedback = "";
	date1 = todayDate();
	date2 = yesterdayDate();
	date3 = beforeYestDate();
	//console.log(date1);
		
	campaign_list = get_selected_campaigns();
	var current_camp = campaign_list[0];
	var camp_name = $("#campaign_list").multipleSelect('getSelects', 'text');
	
	var metrics = $('input[name=metric]:checked', '#metric').val();
	//console.log(metric);
	
	//console.log("pixel list:", campaign_list);
	var counter =0;
	var doc = "";
	
		check_todaySpend(current_camp, metrics, function(today){
			check_yestSpend(current_camp, metrics, function(yest) 
			{	
			check_dayBeforeYestSpend(current_camp, metrics, function(beforeYest) 
			{	
			//console.log(metrics);
				console.log(today);
				console.log(yest);
				console.log(beforeYest);
				if(click == "plot"){
				display(today,yest,beforeYest,metrics);
				}
 				if(click == "download"){
					var csv = "";
					for(var i = 0; i < 24; i++){
/* 						if(yest[i] == undefined && today[i][1] == undefined){
							csv = csv + "\r\n" + i +":00 - "+i+":59" + "," + 0 + "," + 0;
						}
						else if(yest[i][1] == undefined){
						csv = csv + "\r\n" + i +":00 - "+i+":59" + "," + 0 + "," + today[i][1];
						}
						else if(today[i][1] == undefined){
						csv = csv + "\r\n" + i +":00 - "+i+":59" + "," + yest[i][1] + "," + 0;
						} */
						var t_arr = today[i];
						var y_arr = yest[i];
						var by_arr = beforeYest[i];
						console.log(t_arr);
						var t;
						var y;
						var by;
						
						if(t_arr == undefined){
							t = "-"
						}
						else{
							t = t_arr[1];
						}
						
						if(y_arr == undefined){
							y = "-"
						}
						else{
							y = y_arr[1];
						}

						if(by_arr == undefined){
							by = "-"
						}
						else{
							by = by_arr[1];
						}						
						
						
						csv = csv + "\r\n" + i +":00 - "+i+":59" + "," + by + "," + y + "," + t;
						
					
					}	
					
				doc = "Hour," + date3 + ","+ date2 + ","+ date1 + csv;
				//downloadCSV(doc, { filename: strat_name+"_Pacing_Report_" + date1 + ".csv" });
				downloadCSV(doc, { filename: camp_name+"_Pacing_Report_" + date1 + ".csv" });
				} 
				});
		});
	});
}

function display(to,ye,by,m){
	if(m == "total_spend"){
		m = "Total Spend"
	}
	
	if(m == "media_cost"){
		m = "Media Cost"
	}

	if(m == "impressions"){
		m = "Impressions"
	}
	
	console.log(to);
	console.log(ye);
	console.log(by);
//$("#plot").one("click", function(event) {
$(document).ready(function(){
	//console.log(to);
toolTip1 = ['Today', 'Yesterday','Day Before Yesterday'];
  plot2 = $.jqplot ('chart2', [to,ye,by],{	

      title: 'Cumulative ' +m+ ' by Hour',
        legend: {
			renderer: $.jqplot.EnhancedLegendRenderer,
            show: true,
            placement: 'outside',
			labels: ['Today','Yesterday',"Day Before Yesterday"]
        },
	    animate: true,
        // Will animate plot on calls to plot1.replot({resetAxes:true})
        animateReplot: true,
        cursor: {
            show: true,
            zoom: true,
            looseZoom: true,
            showTooltip: false
        },
        series:[
            {	
                pointLabels: {
                    show: false
                },
                showHighlight: true,
                rendererOptions: {
                    // Speed up the animation a little bit.
                    // This is a number of milliseconds.  
                    // Default for bar series is 3000.  
                    animation: {
                        speed: 2500
                    },
                    barWidth: 15,
                    barPadding: -15,
                    barMargin: 0,
                    highlightMouseOver: true
                }
            }, 
            {
                rendererOptions: {
                    // speed up the animation a little bit.
                    // This is a number of milliseconds.
                    // Default for a line series is 2500.
                    animation: {
                        speed: 2000
                    }
                }
            }
        ],
 axesDefaults: {
            tickRenderer: $.jqplot.CanvasAxisTickRenderer ,
            tickOptions: {
                angle: -30,
                fontSize: '10pt'
            }
        },
            axes: {
                xaxis: {
					renderer: $.jqplot.CategoryAxisRenderer,
					label: "Hour",
                    //ticks: [[0,'00:00-00:59'],[1,'01:00-01:59'],[2,'02:00-02:59'],[3,'03:00-03:59'],[4,'04:00-04:59'],[5,'05:00-05:59'],[6,'06:00-06:59'],[7,'07:00-07:59'],[8,'08:00-08:59'],[9,'09:00-09:59'],[10,'10:00-10:59'],[11,'11:00-11:59'],[12,'12:00-12:59'],[13,'13:00-13:59'],[14,'14:00-14:59'],[15,'15:00-15:59'],[16,'16:00-16:59'],[17,'17:00-17:59'],[18,'18:00-18:59'],[19,'19:00-19:59'],[20,'20:00-20:59'],[21,'21:00-21:59'],[22,'22:00-22:59'],[23,'23:00-23:59']]
					ticks: [[0,'1am'],[1,'2am'],[2,'3am'],[3,'4am'],[4,'5am'],[5,'6am'],[6,'7am'],[7,'8am'],[8,'9am'],[9,'10am'],[10,'11am'],[11,'12pm'],[12,'1pm'],[13,'2pm'],[14,'3pm'],[15,'4pm'],[16,'5pm'],[17,'6pm'],[18,'7pm'],[19,'8pm'],[20,'9pm'],[21,'10pm'],[22,'11pm'],[23,'12am']]
				},
				yaxis: {
					labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
					label:"Cumulative "+ m,
					min: 0
				}
           },
		           highlighter: {
            show: true, 
            showLabel: true, 
            tooltipAxes: 'y',
            sizeAdjust: 7.5 , tooltipLocation : 'ne'
        }
    });
});
	
//})	
}

$("#plot").click(function() {
	$('#chart2').empty();
	checks("plot");
	//var yesterday = check_yestSpend();
})	
$("#punch").click(function() {
	checks("download");
	//var yesterday = check_yestSpend();
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