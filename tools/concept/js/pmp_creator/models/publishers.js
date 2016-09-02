var publishers = Backbone.Model.extend({

	url: function() {
		//i didn't make up the q param, I got it from t1beta..
		return YieldTools.API_BASE + "publishers?q=organization_id%3Anull";
	},

	parse: function(xml) {
		var xmlDoc = $(xml);
		var publishers = {};

		xmlDoc.find("entity[type=publisher]").each(function() {
			publishers[$(this).attr("id")] = $(this).attr("name");
		});

		this.set("publishers", publishers);
	}

});