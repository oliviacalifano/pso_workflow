var advView = Backbone.View.extend({

	tagName: 'ul',

	attributes: {
		"id": "advSelect",
		"class": "list-group"
	},

	initialize: function() {
		this.render()
	},

	render: function() {
		new advFilterBar();
		var me = this;
		this.collection.each(function(model){
			for (adv in model.get("advertisers")) {
				me.$el.append('<li data-advId="' + adv + '" class="list-group-item adv-entry"><div class="checkbox"><label><input type="checkbox">' + model.get("advertisers")[adv] + '</label></div></li>');
			}
		});		
		$("#leftInner").append(this.$el); 
	}

});
