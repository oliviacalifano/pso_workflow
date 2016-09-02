var pubSelectView = Backbone.View.extend({

	tagName: "select",

	attributes: {
		"class": "select-style form-control"
	},

	initialize: function() {
		var me = this;
		var pubAjaxObj = this.model.fetch({dataType: 'xml'});
		pubAjaxObj.done(function() {
			me.render();
			me.$el.chosen();
		});
	},

	render: function() {
		var pubs = this.model.get("publishers");
		for (pub in pubs) {
			this.$el.append('<option value="' + pub + '">' + pubs[pub] + '</option>');
		}
		return this;
	}

})