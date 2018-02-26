

var selectedCamps = [];
var csv = ""; 

jQuery.extend({
    percentage: function(a, b) {
        var p = Math.round((a / b) * 100);
		return p + "%";
    }
});

function get_selected_strats() 
{
	var strat_ids = []; 
	
	//get selected ctxlice ids
	$("#strat_list").each(function() { 
		strat_ids.push($(this).val()); 
	});
	console.log(strat_ids);

	return strat_ids[0];
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

function check_todaySpend(camp, metric, callback){
    var hold = [];
	var max = 0;
	date = todayDate();	
	console.log(date);			
	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/reporting/v1/std/pulse?dimensions=strategy_name&metrics="+metric+"&filter=strategy_id="+camp+"&time_rollup=by_hour&start_date="+date+"&end_date="+date,
		type: "GET",

		success: function(csv) {
			//console.log(csv);
						var d = csv.split('\n');
						//console.log(d[1]);
						var tuples = [];
						//console.log(d.length);
						
						for(var i = 1; i < d.length-1; i++){
						
						var da = d[i];
						//console.log(da);
						da = da.split(/,(.+)?/);
						
						var day = da[0].split(" ");
						//console.log(day);
						day = day[1].slice(0, -1);
						var rest = da[1];		
					
						//console.log(day);
						tuples.push([day, rest]);
					}
					
					tuples.sort(function(a, b) {
						a = a[1];
						b = b[1];

						return a < b ? -1 : (a > b ? 1 : 0);
					});

					var data = {};
					for(var i = 0; i < 24; i++){
						data[i] = 0;
					}
					
					for (var i = 0; i < tuples.length; i++) {
						var key = tuples[i][0].split(":")[0];
						key = Number(key);
						console.log(key);
						var value = tuples[i][1];
						value = value.split(","); 
						value = value.slice(-1)[0];
						value = Number(value);
						value = Math.round(value * 100) / 100;
						console.log(value);
						//hold2[key] = value;
						
						if(key > max){
							max = key;
						}
						
						for(d in data){
							if(Number(d) == key){
								data[d] = value;
							}
						}
						//hold.push([key, value])
						// do something with key and value
					}	

					console.log(data);
					var spend = [];
					for(d in data){
						spend.push(data[d]);
					}
					console.log(spend);
					var new_array = [];
					spend.reduce(function(a,b,i) { 
					var n = Math.round((a+b) * 100) / 100;
					return new_array[i] = n; },0);
					console.log(new_array);	
					
				for(var k = 1; k < max+1; k++){
					data[k] = new_array[k];
					hold.push([k, new_array[k]])
				}
				for(var k = max+1; k < 24; k++){
					data[k] = "-";
				}					
				console.log(hold);
				console.log(data);				
				callback(hold,data);
								
		},             
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}              
	});
}

function check_yestSpend(camp, metric, callback){
    var hold = [];   
	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/reporting/v1/std/pulse?dimensions=strategy_name&metrics="+metric+"&filter=strategy_id="+camp+"&time_rollup=by_hour&time_window=last_1_days",
		type: "GET",

		success: function(csv) {
			//console.log(csv);
						var d = csv.split('\n');
						//console.log(d[1]);
						var tuples = [];
						//console.log(d.length);
						
						for(var i = 1; i < d.length-1; i++){
						
						var da = d[i];
						//console.log(da);
						da = da.split(/,(.+)?/);
						
						var day = da[0].split(" ");
						//console.log(day);
						day = day[1].slice(0, -1);
						var rest = da[1];		
					
						//console.log(day);
						tuples.push([day, rest]);
					}
					
					tuples.sort(function(a, b) {
						a = a[1];
						b = b[1];

						return a < b ? -1 : (a > b ? 1 : 0);
					});

					var data = {};
					for(var i = 0; i < 24; i++){
						data[i] = 0;
					}
					
					for (var i = 0; i < tuples.length; i++) {
						var key = tuples[i][0].split(":")[0];
						key = Number(key);
						console.log(key);
						var value = tuples[i][1];
						value = value.split(","); 
						value = value.slice(-1)[0];
						value = Number(value);
						value = Math.round(value * 100) / 100;
						console.log(value);
						//hold2[key] = value;
						
						for(d in data){
							if(Number(d) == key){
								data[d] = value;
							}
						}
						//hold.push([key, value])
						// do something with key and value
					}	

					console.log(data);
					var spend = [];
					for(d in data){
						spend.push(data[d]);
					}
					var new_array = [];
					spend.reduce(function(a,b,i) { 
					var n = Math.round((a+b) * 100) / 100;
					return new_array[i] = n; },0);
					console.log(new_array);	
				for(d in data){
					data[d] = new_array[d];
					hold.push([d, new_array[d]])
				}
					
				console.log(hold);
				console.log(data);				
				callback(hold,data);
						
		},             
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}              
	});
}

function checks(click){
	var strat_list = [];
	var feedback = "";
	date1 = todayDate();
	date2 = yesterdayDate();
	console.log(date1);
		
	strat_list = get_selected_strats();
	var current_strat = strat_list[0];
	var strat_name = $("#strat_list").multipleSelect('getSelects', 'text');
	//var current_strat = "1402052";
	var metrics = $('input[name=metric]:checked', '#metric').val();
	console.log(metric);
	
	//console.log("pixel list:", strat_list);
	var counter =0;
	var doc = "";
	
		check_todaySpend(current_strat, metrics, function(today,dt){
			check_yestSpend(current_strat, metrics, function(yest,dy) 
			{	
			console.log(metrics);
				console.log(today);
				console.log(yest);
				if(click == "plot"){
				display(today,yest,metrics);
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
						
						csv = csv + "\r\n" + i +":00 - "+i+":59" + "," + dy[i] + "," + dt[i];
						
					
					}	
					
				doc = "Hour," + date2 + ","+ date1 + csv;
				//downloadCSV(doc, { filename: strat_name+"_Pacing_Report_" + date1 + ".csv" });
				downloadCSV(doc, { filename: strat_name+"_Pacing_Report_" + date1 + ".csv" });
				} 
		});
	});
}

function display(to,ye,m){
	console.log(to);
	console.log(ye);
//$("#plot").one("click", function(event) {
$(document).ready(function(){
	//console.log(to);
toolTip1 = ['Today', 'Yesterday'];
  plot2 = $.jqplot ('chart2', [to,ye],{	

      title: 'cumulative ' +m+ ' by hour',
        legend: {
            show: true,
            placement: 'outside',
			labels: ['Today','Yesterday']
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
					label:"cumulative "+ m,
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