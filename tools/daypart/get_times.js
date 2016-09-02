$(function(){
		options = [];
		
		options.push("<option value=0>12:00am</option>");
		options.push("<option value=1>01:00am</option>");
		options.push("<option value=2>02:00am</option>");
		options.push("<option value=3>03:00am</option>");
		options.push("<option value=4>04:00am</option>");
		options.push("<option value=5>05:00am</option>");
		options.push("<option value=6>06:00am</option>");
		options.push("<option value=7>07:00am</option>");
		options.push("<option value=8>08:00am</option>");
		options.push("<option value=9>09:00am</option>");
		options.push("<option value=10>10:00am</option>");
		options.push("<option value=11>11:00am</option>");
		
		options.push("<option value=12>12:00pm</option>");
		options.push("<option value=13>01:00pm</option>");
		options.push("<option value=14>02:00pm</option>");
		options.push("<option value=15>03:00pm</option>");
		options.push("<option value=16>04:00pm</option>");
		options.push("<option value=17>05:00pm</option>");
		options.push("<option value=18>06:00pm</option>");
		options.push("<option value=19>07:00pm</option>");
		options.push("<option value=20>08:00pm</option>");
		options.push("<option value=21>09:00pm</option>");
		options.push("<option value=22>10:00pm</option>");
		options.push("<option value=23>11:00pm</option>");
		
		$("#daypart_start").append(options);
		$("#daypart_start").multipleSelect({
		placeholder: "Choose The Thing",
		filter: true
	});	

});


$(function(){
		options = [];
		
		options.push("<option value=0>12:59am</option>");
		options.push("<option value=1>01:59am</option>");
		options.push("<option value=2>02:59am</option>");
		options.push("<option value=3>03:59am</option>");
		options.push("<option value=4>04:59am</option>");
		options.push("<option value=5>05:59am</option>");
		options.push("<option value=6>06:59am</option>");
		options.push("<option value=7>07:59am</option>");
		options.push("<option value=8>08:59am</option>");
		options.push("<option value=9>09:59am</option>");
		options.push("<option value=10>10:59am</option>");
		options.push("<option value=11>11:59am</option>");
		
		options.push("<option value=12>12:59pm</option>");
		options.push("<option value=13>01:59pm</option>");
		options.push("<option value=14>02:59pm</option>");
		options.push("<option value=15>03:59pm</option>");
		options.push("<option value=16>04:59pm</option>");
		options.push("<option value=17>05:59pm</option>");
		options.push("<option value=18>06:59pm</option>");
		options.push("<option value=19>07:59pm</option>");
		options.push("<option value=20>08:59pm</option>");
		options.push("<option value=21>09:59pm</option>");
		options.push("<option value=22>10:59pm</option>");
		options.push("<option value=23>11:59pm</option>");
		
		$("#daypart_end").append(options);
		$("#daypart_end").multipleSelect({
		placeholder: "Choose The Thing",
		filter: true
	});	
});

$(function(){
		options = [];
		
		options.push("<option value=M>Monday</option>");
		options.push("<option value=T>Tuesday</option>");
		options.push("<option value=W>Wednesday</option>");
		options.push("<option value=R>Thursday</option>");
		options.push("<option value=F>Friday</option>");
		options.push("<option value=S>Saturday</option>");
		options.push("<option value=U>Sunday</option>");

		
		$("#days").append(options);
		$("#days").multipleSelect({
		placeholder: "Choose The Thing",
		filter: true
	});	

});