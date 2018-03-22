'use strict' 

var camp = {};
var strategy1 = {};
var selectedStrats = [];
var campaignId = 0;

//returns array of all selected strategies
function get_selected_strats() {

	var strat_id = [];
	
	//get all selected strat ids
	$("#strat_list").each(function(){
		strat_id.push($(this).val());
	});
	
	//print all strats	
	// for (i=0; i<strat_id.length; i++) {
		// console.log(strat_id[i]);
	// }
	
	return strat_id;
}

function get_selected_campaign() {

	var campaign_id = [];
	
	//get all selected strat ids
	$("#campaign_list").each(function(){
		campaign_id.push($(this).val());
	});
	
	campaignId = campaign_id;
	
	return campaign_id;
}

function get_info(feed, callback){

	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/" + feed,
		type: "GET",
		//cache: false,
		//dataType: "xml",
	
		success: function(xml) {

			var strategy = $(xml).find('entity#' + feed).children('prop');
			
			callback(strategy, feed);
		}
	});	
};

function logPosts(posts, id) {
	var strat = {};
	
	posts.each(function(){
		strat[this.getAttribute('name')] = this.getAttribute('value')});
	
	strategy1[id] = strat;
	console.log(strategy1);
}

function campaign_info(selectedCampaign){
	var campaignId = selectedCampaign;
	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/campaigns/" + campaignId,
		type: "GET",
		//cache: false,
		//dataType: "xml",
	
		success: function(xml) {
			
			var campaign = $(xml).find('entity#' + campaignId).children('prop');

			campaign.each(function(){
			camp[this.getAttribute('name')] = this.getAttribute('value')});
		}
	});
		return camp;
};
	
$("#punch").click(function() {
	//console.log("hit!");
	var selectedCampaign = get_selected_campaign();
	selectedCampaign = selectedCampaign[0];
	selectedStrats = get_selected_strats();
	selectedStrats = selectedStrats[0];
	//var strategy1 = {};
	
	//check_dates();
	
	$( "#punch").hide();
	var campaignInfo = campaign_info(selectedCampaign);
	
	//var strategy_info = get_info();

	for(var i = 0; i < selectedStrats.length; i++){
	get_info(selectedStrats[i], logPosts);
	}
	
	$( document ).ajaxStop(function() {
	$( ".log" ).text( "Triggered ajaxStop handler." );
  	$( "#dates").show();
	$( "#budgets").show();
	$( "#concepts").show();
	$( "#creatives").show();
	$( "#recencies").show();
});
	
});




