var availableConceptView = Backbone.View.extend({

	tagName: 'div',

	attributes: function() {
		return {
			"class": "well well-sm clearfix concept",
			"data-id": this.model.get("conceptId"),
			"data-name": this.model.get("conceptName"),
			"draggable": "true"
		}
	},

	events: {
		"dragstart": "dragConcept"
	},

	render: function() {
		this.$el.html('<label class="checkbox-inline">' + this.model.get("conceptName") + '<input type="checkbox"></label>');
		return this;
	},

	dragConcept: function(event) {
		event.originalEvent.dataTransfer.setData("name", event.target.attributes["data-name"].value);
		event.originalEvent.dataTransfer.setData("id", event.target.attributes["data-id"].value);
	}
});