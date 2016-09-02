var GeosAssignedToStratView = Backbone.View.extend({

	initialize: function() {
		view = this;
		var modelAjaxObj = this.model.fetch({dataType: 'xml'});
		modelAjaxObj.done(function() {
			view.dmaxRender();
			view.regnRender();
		});
		//whenever there is a change in geo attr (b/c new geos added to strat)
		//re-render the UL element
		//this.listenTo(this.model, 'change:dmax', this.dmaxRender);
		//this.listenTo(this.model, 'change:regn', this.regnRender);
	},

	dmaxRender: function() {
		this.$el.empty();
		blahblah = this.$el;
		for (regn in this.model.get("regn")) {
			this.$el.append('<li>hi</li>');
			console.log(regn);
		}
	},

	regnRender: function() {
		this.$el.empty();
		for (dmax in this.model.get("dmax")) {
			this.$el.append('<li data-dealId="' + dmax + '">' + this.model.get("regn")[regn]["name"] + ' - ' + this.model.get("regn")[regn]["id"] + '</li>');
		}
	}	

});
