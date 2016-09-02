var conceptsAvailableToAssignCollection = Backbone.Collection.extend({
  
	url: function() {
		return YieldTools.API_BASE + "strategies/" + this.id + "/available_concepts";
	},

	parse: function(xml) {
		var concepts = [];
		var xmlDoc = $(xml);

		xmlDoc.find("entity[type=concept]").each(function() {
			var obj = {};
			obj.conceptId = $(this).attr("id");
			obj.conceptName = $(this).attr("name");
			concepts.push(obj);
		});

		return concepts;
	}

});