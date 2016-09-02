var t1orgs = Backbone.Model.extend({

	url: function() {
		return YieldTools.API_BASE + "organizations?sort%5Fby=name&q=status%3D%3D1";
	},

	parse: function(xml) {
		var xmlDoc = $(xml);
		var orgs = {};

		xmlDoc.find("entity[type=organization]").each(function() {
			orgs[$(this).attr("id")] = $(this).attr("name");
		});

		this.set("orgs", orgs);
	}

});

