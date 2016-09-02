var orgSelectView = Backbone.View.extend({

	tagName: "select",

	attributes: {
		"multiple": "multiple",
		"class": "form-control",
		"data-placeholder": "Select orgs"
	},

	initialize: function() {
		var me = this;
		var orgAjaxObj = this.model.fetch({dataType: 'xml'});
		orgAjaxObj.done(function() {
			me.render();
			me.$el.chosen();
		});
	},

	render: function() {
		var orgs = this.model.get("orgs");
		for (org in orgs) {
			this.$el.append('<option value="' + org + '"">' + orgs[org] + '</option>');
		}
		return this;
	}

});