var stratsCollection = Backbone.Collection.extend({

	url: function() {
		return YieldTools.API_BASE + "strategies/limit/campaign=" + YieldTools.CAMPAIGN_ID;
	},

	initialize: function() {
		this.fetch({dataType: 'xml', reset: true});
	},

	parse: function(xml) {
		var xmlDoc = $(xml);
		var strats = [];

		xmlDoc.find("entity[type=strategy]").each(function() {
			var obj = {};
			obj.name = $(this).attr("name");
			obj.id = $(this).attr("id");
			strats.push(obj);
		});

		return strats;
	}

})


//https://t1beta.mediamath.com/api/v1/strategies/limit/campaign=107384

