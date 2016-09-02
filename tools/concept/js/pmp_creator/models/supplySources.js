var supplySources = Backbone.Model.extend({

	url: function() {
		//i didn't make up the q param, I got it from t1beta..
		return YieldTools.API_BASE + "deals/supply_sources";
	},

	parse: function(xml) {
		var xmlDoc = $(xml);
		var supplySources = {};

		xmlDoc.find("entity[type=supply_source]").each(function() {
			supplySources[$(this).attr("id")] = $(this).attr("name");
		});

		this.set("supplySources", supplySources);
	}

});