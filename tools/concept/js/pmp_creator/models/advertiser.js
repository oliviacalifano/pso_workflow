var advertiser = Backbone.Model.extend({
	
	url: function() {
		return YieldTools.API_BASE + "advertisers/limit/agency.organization=" + this.id
	},

	parse: function(xml) {
		var xmlDoc = $(xml);
		var advertisers = {};

		xmlDoc.find("entity[type=advertiser]").each(function() {
			advertisers[$(this).attr("id")] = $(this).attr("name");
		});

		this.set("advertisers", advertisers);
	}

});