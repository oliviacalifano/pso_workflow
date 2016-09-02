$(function(){
		options = [];
		
		options.push("<option value=0>T1 Standard Disabled</option>");
		options.push("<option value=25>T1 Standard + Light Increase</option>");
		options.push("<option value=50>T1 Standard + Moderate Increase</option>");
		options.push("<option value=75>T1 Standard + Strong Increase</option>");
		options.push("<option value=100>T1 Standard + Maximum Increase</option>");
		
		$("#custom").append(options);
		$("#custom").multipleSelect({
		placeholder: "Choose The Thing",
		filter: true
		});	

});