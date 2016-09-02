var GeosAssignedToStratModel = Backbone.Model.extend({

	url: function() {
		return YieldTools.API_BASE + "strategies/" + this.id + "/target_values?full=*&partial=1";
	},

	parse: function(xml) {
		var xmlDoc = $(xml);
		var dmax = {};
		var regn = {};

		xmlDoc.find("dimension[code=DMAX]").each(function() {
			dmax[$(this).attr("id")] = {	
				name: $(this).find("entity").attr("name"),
				set: $(this).find("entities").attr("set")
			}
		});

		xmlDoc.find("dimension[code=REGN]").each(function() {
			regn[$(this).attr("id")] = {	
				name: $(this).find("entity").attr("name"),
				set: $(this).find("entities").attr("set")
			}
		});		

		this.set("dmax", dmax);
		this.set("regn", regn);
	},

updateModel: function(){
	/*	
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
		});*/
    }

});