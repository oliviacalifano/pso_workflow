var pmpContainer = Backbone.View.extend({

	el: $("#rightInner"),

	initialize: function() {
		this.render();
	},

	render: function() {
		this.$el.append('<div id="availablePmpDeals"></div>');
		//this.$el.append('<table id="availablePmpDeals" class="table table-striped"><thead><tr><th>Name</th><th>Start</th><th>End</th><th>CPM</th></tr></thead><tbody></tbody></table>');
	}
})
