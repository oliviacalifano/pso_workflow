var conceptsAssignedToStratView = Backbone.View.extend({

	events: {
		"dragover": "allowDrop",
		"drop": "dropConcept"
	},

	initialize: function() {
		var view = this;
		//when view is created, fetch the model + render
		var modelAjaxObj = this.model.fetch({dataType: 'xml'});
		modelAjaxObj.done(function() {
			view.render();
		});
		//whenever there is a change in concept attr (b/c new concepts added to strat)
		//re-render the UL element
		this.listenTo(this.model, 'change:concepts', this.render);
	},

	render: function () {
		this.$el.empty();
		for (concept in this.model.get("concepts")) {
			this.$el.append('<li data-conceptId="' + concept + '">' + this.model.get("concepts")[concept] + '</li>');
		}
	},

	allowDrop: function(event) {
		event.preventDefault();
	},

	dropConcept: function(event) {
		var conceptId = event.originalEvent.dataTransfer.getData("id");
		var conceptName = event.originalEvent.dataTransfer.getData("name");
		var newConcepts = _.clone(this.model.get("concepts"));
		newConcepts[conceptId] = conceptName;
		this.model.set("concepts", newConcepts);
	}
	
});