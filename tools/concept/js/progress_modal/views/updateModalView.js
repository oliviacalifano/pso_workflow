/*
This view is responsible for the confirmation modal. A few notes:
1. when instantiating this view, pass in the model, and pass the title into the model as an argument
	ex) modal = new YieldTools.updateModalView({
			model: new YieldTools.updateModalModel({
				title: "Updating Strategies"
			})
		});
2. When making updates to the collection, use progress percent to set progress attribute.
	ex) (1/4) * 100 is 25% done so model.set("progress", 25) and this view will auto move the progress bar
3. It takes a finalStatus object that looks like {name: status}

*/
YieldTools.updateModalView = Backbone.View.extend({

	el: $("#confirmationModal"),

	initialize: function() {
		this.$el.modal('show');
		this.listenTo(this.model, "change:progress", this.render);
		this.listenTo(this.model, "change:finalStatus", this.finalStatus)
		this.$el.find(".modal-title").text(this.model.get("title"));
	},

	events: {
		"click .btn": "kill"
	},

	render: function() {
		var model = this.model;
		this.$el.find(".progress-bar").css("width", model.get("progress") + "%");
	},	

	finalStatus: function() {
		var tableString = '<table class="table table-condensed"><thead><tr><th>Name</th><th>Status</th></tr></thead><tbody>';
		for (prop in this.model.get("finalStatus")){
			tableString += '<tr><td>' + prop + '</td><td>' + this.model.get("finalStatus")[prop] + '</td></tr>';
		}
		tableString += '</tbody></table>';
		this.$el.find("#modalContent").append(tableString);
	},

	kill: function() {
		this.$el.modal('hide');
		this.model.set("progress", "0");
		this.$el.find("#modalContent").empty();
	}



});