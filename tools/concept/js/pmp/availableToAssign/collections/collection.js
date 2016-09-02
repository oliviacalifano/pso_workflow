var pmpCollection = Backbone.Collection.extend({

	url: function() {
		return YieldTools.API_BASE + "deals/?full=*&q=advertiser_id%3D%3D" + YieldTools.ADVERTISER_ID;
	},

	parse: function(xml) {
		xmlDoc = $(xml);
		var deals = [];

		xmlDoc.find("entity[type=deal]").each(function() {
			var obj = {};
			obj.pmpname = $(this).attr("name");
			obj.pmpid = $(this).attr("id");
			obj.pmpstart = $(this).find("prop[name=start_datetime]").find("local_time").attr("value");
			obj.pmpend = $(this).find("prop[name=end_datetime]").find("local_time").attr("value");
			var price = $(this).find("prop[name=price]").attr("value");
			var priceType = $(this).find("prop[name=price_type]").attr("value");
			obj.pmpprice = price + " " + priceType.toLowerCase();
			deals.push(obj);
		});

		return deals;
	}

})