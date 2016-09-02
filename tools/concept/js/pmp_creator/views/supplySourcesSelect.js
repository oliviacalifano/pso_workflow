var supplySelectView = Backbone.View.extend({

	tagName: "select",

	attributes: {
		"class": "select-style form-control"
	},

	initialize: function() {
		var me = this;
		var supplyAjaxObj = this.model.fetch({dataType: 'xml'});
		supplyAjaxObj.done(function() {
			me.render();
			me.$el.chosen();
		});
	},	

	render: function() {
		var supplySources = this.model.get("supplySources");
		for (supplySource in supplySources) {
			this.$el.append('<option value="' + supplySource + '"">' + supplySources[supplySource] + '</option>');
		}
		return this;
	}

})