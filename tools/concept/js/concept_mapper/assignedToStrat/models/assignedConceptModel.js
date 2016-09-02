var conceptsAssignedToStratModel = Backbone.Model.extend({
	
	url: function() {
		return YieldTools.API_BASE + "strategies/" + this.id + "/concepts";
	},

	parse: function(xml) {
		var xmlDoc = $(xml);
		var concepts = {};

		xmlDoc.find("entity[type=concept]").each(function() {
			concepts[$(this).attr("id")] = $(this).attr("name");
		});

		this.set("concepts", concepts);
	},

	updateModel: function(){
        //instantiate object that will be POSTed
        var postObj = {};
        //loop through concepts obj of model attributes to build the postObj
        var index = 1;
        for (concept in this.get("concepts")) {
        	postObj["concepts." + index + ".id"] = concept;
        	index++;
        }
        return $.ajax({
			url: this.url(),
			type: "POST",
			cache: false,
			dataType: "XML",
			data: postObj 
		});
    }

})