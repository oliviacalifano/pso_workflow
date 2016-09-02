/*var pmpView = Backbone.View.extend({

	tagName: 'nav',

	attributes: function() {
		return {
			"class": "navbar navbar-default clearfix pmpdeal",
			"data-id": this.model.get("pmpid"),
			"data-name": this.model.get("pmpname"),
			"draggable": "true"
		}
	},

	events: {
		"dragstart": "dragConcept"
	},

	initialize: function() {
		this.render();
	},
	
	render: function() {
		var blah = '<div class="collapse navbar-collapse">';
		var name = '<p class="navbar-text"><label class="checkbox-inline">' + this.model.get("pmpname") + '<input type="checkbox"></label></p>';
		var start = '<p class="navbar-text">' + this.model.get("pmpstart") + '</p>';
		var end = '<p class="navbar-text">' + this.model.get("pmpend") + '</p>';
		var price = '<p class="navbar-text">' + this.model.get("pmpprice") + '</p>';
		var blahend = '</div>';
		this.$el.html(blah + name + start + end + price + blahend);
		//$("#availablePmpDeals").find("tbody").append(this.$el);
		$("#availablePmpDeals").append(this.$el);
	},

	dragConcept: function(event) {
		event.originalEvent.dataTransfer.setData("name", event.target.attributes["data-name"].value);
		event.originalEvent.dataTransfer.setData("id", event.target.attributes["data-id"].value);
	}

});*/

var pmpView = Backbone.View.extend({

	tagName: 'div',

	attributes: function() {
		return {
			"class": "well well-sm clearfix pmpdeal",
			"data-id": this.model.get("pmpid"),
			"data-name": this.model.get("pmpname"),
			"draggable": "true"
		}
	},

	events: {
		"dragstart": "dragConcept"
	},

	initialize: function() {
		this.render();
	},
	
	render: function() {
		var name = '<label class="checkbox-inline">' + this.model.get("pmpname") + '<input type="checkbox"></label>';
		//var start = '<span>' + this.model.get("pmpstart") + '</span>';
		//var end = '<span>' + this.model.get("pmpend") + '</span>';
		var price = '<span>' + this.model.get("pmpprice") + '</span>';
		this.$el.html(name + price);
		//$("#availablePmpDeals").find("tbody").append(this.$el);
		$("#availablePmpDeals").append(this.$el);
	},

	dragConcept: function(event) {
		event.originalEvent.dataTransfer.setData("name", event.target.attributes["data-name"].value);
		event.originalEvent.dataTransfer.setData("id", event.target.attributes["data-id"].value);
	}

});
