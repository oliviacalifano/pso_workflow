/*
The purpose of this model is to get all campaigns given an advertiser id
*/

YieldTools.selectCampaign = Backbone.Model.extend({

	url: function() {
		if (YieldTools.ADVERTISER_ID.toString().length > 1) {
			return YieldTools.API_BASE + "campaigns/limit/advertiser=" + YieldTools.ADVERTISER_ID + "?sort_by=-status%2C-updated_on%2Cid&order_by=descending";	
		}
	},

	defaults: {
		"campaignArray": []
	},

	parse: function(xml) {
		var campaigns = [];
		var xmlDoc = $(xml);

		xmlDoc.find("entity[type=campaign]").each(function() {
			campaigns.push([$(this).attr("name"), $(this).attr("id")]);
		});

		this.campaignArray = campaigns;
	}

});