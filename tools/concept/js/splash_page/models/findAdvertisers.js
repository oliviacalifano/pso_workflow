/*
The purpose of this model is to query the API given a query term and return a list of matching advertisers
*/

YieldTools.selectAdvertiser = Backbone.Model.extend({

	url: YieldTools.API_BASE + "advertisers?with=agency,organization",

	parse: function(xml) {
		var advertisers = [];
		var organizations = [];
		var autocompleteOptions = [];
		var xmlDoc = $(xml);

		xmlDoc.find("entity[type=advertiser]").each(function() {
			advertisers.push([$(this).attr("name"), $(this).attr("id")]);
		});	

		xmlDoc.find("entity[type=organization]").each(function() {
			organizations.push([$(this).attr("name"), $(this).attr("id")]);
		});

		var i = advertisers.length;
		while(i--) {
			var advertiser = {
			advName: advertisers[i][0],
			advId: parseInt(advertisers[i][1]),
			orgName: organizations[i][0]
			}
			autocompleteOptions.push(advertiser);
		}
		//this.advArray = autocompleteOptions;
		return autocompleteOptions;
	}

});

