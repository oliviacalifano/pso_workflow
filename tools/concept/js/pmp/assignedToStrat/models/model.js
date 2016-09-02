var PmpDealsAssignedToStratModel = Backbone.Model.extend({

	url: function() {
		return YieldTools.API_BASE + "strategies/" + this.id + "/supplies";
	},

	parse: function(xml) {
		var xmlDoc = $(xml);
		var deals = {};

		xmlDoc.find("entity[type=deal]").each(function() {
			deals[$(this).attr("id")] = $(this).attr("name");
		});

		this.set("deals", deals);
	},

		updateModel: function(){
        //instantiate object that will be POSTed
        var postObj = {};
        //loop through concepts obj of model attributes to build the postObj
        var index = 1;
        for (deal in this.get("deals")) {
        	postObj["deal." + index + ".id"] = deal;
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

});