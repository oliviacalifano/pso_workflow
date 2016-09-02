var conceptMapperStratNameFilter = Backbone.View.extend({

	el: $("#leftInner"),

	events: {
		"keyup #stratFilter": "filterStrats",
		"click .dropdown-menu li a": "setButtonText",
		"click .selectall": "selectAll",
		"click .selectnone": "selectNone"
	},

	initialize: function() {
		this.render();
	},

	render: function() {
		var html = '<div id="stratFilterContainer" class="input-group input-group-sm"><div class="input-group-btn"><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">Filter Strats <span class="caret"></span></button><ul class="dropdown-menu"><li><a href="javascript:void(0)">By Strat</a></li><li><a href="javascript:void(0)">By Concept</a></li></ul></div><input type="text" id="stratFilter" class="form-control"><span class="input-group-btn"><button class="selectall btn btn-default glyphicon glyphicon-check" type="button"></button></span><span class="input-group-btn"><button class="selectnone btn btn-default glyphicon glyphicon-ban-circle" type="button"></button></span></div>';	
		this.$el.append(html);
	},

	filterStrats: function(event) {
		var searchTerm = event.target.value;
		var selected = $.trim($(event.target).siblings().find("button").text());
		if (selected !== "By Concept") {
			$(".strategyContainerBox").each(function() {
				var regex = new RegExp(searchTerm, 'ig'); 
				var match = regex.test($(this).children(".strategyNameBox").text());
				!match ? $(this).addClass("poofGone") : $(this).removeClass("poofGone");
			});
		}
		else if (selected === "By Concept") {
			testString = function() {
				var string = "";
				$(".strategyConceptsBox").find("li").each(function(){
					
				})
			}
			$(".strategyContainerBox").each(function() {
				var regex = new RegExp(searchTerm, 'ig'); 
				var match = regex.test( $(this).find("li").text() );
				!match ? $(this).addClass("poofGone") : $(this).removeClass("poofGone");
			});
		}

	},

	setButtonText: function(event) {
		var selText = event.target.text;
  		var button = $(event.target).parents('.input-group-btn').find('button').html(selText+' <span class="caret"></span>');
	},

	selectAll: function() {
		this.$el.find(".strategyContainerBox").not(".poofGone").each(function() {
			$(this).find("input[type='checkbox']").prop('checked', true);
		});
	},

	selectNone: function() {
		this.$el.find(".strategyContainerBox").not(".poofGone").each(function() {
			$(this).find("input[type='checkbox']").prop('checked', false);
		});
	}


});