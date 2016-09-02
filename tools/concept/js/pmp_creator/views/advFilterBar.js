var advFilterBar = Backbone.View.extend({

	el: $("#leftInner"),

	events: {
		"keyup #advFilter" : "filterStrats",
		"click .selectall": "selectAll",
		"click .selectnone": "selectNone"
	},

	initialize: function() {
		this.render();
	},

	render: function() {
		var searchbarHtml = "<div id='advFilterContainer' class='input-group input-group-sm'><span class='input-group-addon'>Filter Adv</span><input type='text' id='advFilter' class='form-control'><span class='input-group-btn'><button class='selectall btn btn-default glyphicon glyphicon-check' type='button'></button></span><span class='input-group-btn'><button class='selectnone btn btn-default glyphicon glyphicon-ban-circle' type='button'></button></span></div>";
		this.$el.append(searchbarHtml);
	},

	filterStrats: function(event) {
		var searchTerm = event.target.value;
		$(".adv-entry").each(function() {
			var regex = new RegExp(searchTerm, 'ig'); 
			var match = regex.test($(this).find("label").text());
			!match ? $(this).addClass("poofGone") : $(this).removeClass("poofGone");
		});
	},

	selectAll: function() {
		this.$el.find(".adv-entry").not(".poofGone").each(function() {
			$(this).find("input[type='checkbox']").prop('checked', true);
		});
	},

	selectNone: function() {
		this.$el.find(".adv-entry").not(".poofGone").each(function() {
			$(this).find("input[type='checkbox']").prop('checked', false);
		});
	}


})