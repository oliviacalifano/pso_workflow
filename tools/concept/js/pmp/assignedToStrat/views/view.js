var PmpDealsAssignedToStratView = Backbone.View.extend({

	events: {
		"dragover": "allowDrop",
		"drop": "dropPmpDeal",
		"dblclick li": "removePmpDeal"
	},
	
	initialize: function() {
		var view = this;
		var modelAjaxObj = this.model.fetch({dataType: 'xml'});
		modelAjaxObj.done(function() {
			view.render();
		});
		//whenever there is a change in concept attr (b/c new concepts added to strat)
		//re-render the UL element
		this.listenTo(this.model, 'change:deals', this.render);
	},

	render: function () {
		this.$el.empty();
		for (deal in this.model.get("deals")) {
			this.$el.append('<li data-dealId="' + deal + '">' + this.model.get("deals")[deal] + '</li>');
		}
	},

	allowDrop: function(event) {
		event.preventDefault();
	},

	dropPmpDeal: function(event) {
		var dealId = event.originalEvent.dataTransfer.getData("id");
		var dealName = event.originalEvent.dataTransfer.getData("name");
		//clone existng deals obj on the model
		var newdeals = _.clone(this.model.get("deals"));
		//add the new deal on drop
		newdeals[dealId] = dealName;
		//set the new deals obj
		this.model.set("deals", newdeals);
	},

	removePmpDeal: function(event) {
		var dealId = event.target.attributes["data-dealid"].value;
		//clone existng deals obj on the model
		var newdeals = _.clone(this.model.get("deals"));
		delete newdeals[dealId];
		this.model.set("deals", newdeals);
	}
	
});
