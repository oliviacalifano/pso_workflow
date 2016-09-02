var conceptMapperTopNavBar = Backbone.View.extend({

	tagName: 'div',

	attributes: {
		"id": "conceptFilterAddRemoveContainer",
		"class": "clearfix"
	},

	events: {
		"click #addBtn": "addConceptsToStrats",
		"click #removeBtn": "removeConceptsFromStrats",
		"click #saveBtn": "save",
		'keyup input[type="text"]': "filterConcepts",
		"click .selectall": "selectAll",
		"click .selectnone": "selectNone"
	},
	
	initialize: function() {
		this.render();
	},

	render: function() {
		var input = '<div id="topNavContainer" class="input-group input-group-sm rightNavMember"><span class="input-group-addon">Filter Concepts</span><input type="text" class="form-control"><span class="input-group-btn"><button class="selectall btn btn-default glyphicon glyphicon-check" type="button"></button></span><span class="input-group-btn"><button class="selectnone btn btn-default glyphicon glyphicon-ban-circle" type="button"></button></span></div>';
		var addBtn = '<button type="button" id="addBtn" class="btn btn-sm btn-success rightNavMember">Add</button>';
		var removeBtn = '<button type="button" id="removeBtn" class="btn btn-sm btn-danger rightNavMember">Remove</button>';
		var saveBtn = '<button type="button" id="saveBtn" class="btn btn-sm btn-primary">Save</button>';
		this.$el.append(input + addBtn + removeBtn + saveBtn);
		$("#rightInner").append(this.$el);
	},

	addConceptsToStrats: function() {
		var me = this;
		var conceptsToAssign = $(".concept").has("input:checked").map(function(){
			return [[$(this).attr("data-id"), $(this).attr("data-name")]];
		});
		$(".strategyContainerBox").has("input:checked").each(function() {
			var stratId = $(this).attr("data-id");
			var newConceptList = _.clone(me.existingConceptsCollection.findWhere({id: stratId}).get("concepts"));
			for (var i = conceptsToAssign.length - 1; i >= 0; i--) {
				newConceptList[conceptsToAssign[i][0]] = conceptsToAssign[i][1];
			}
			me.existingConceptsCollection.findWhere({id: stratId}).set("concepts", newConceptList);
		});
		
	},

	removeConceptsFromStrats: function() {
		var me = this;
		var conceptsToRemove = $(".concept").has("input:checked").map(function(){
			return $(this).attr("data-id");
		});
		$(".strategyContainerBox").has("input:checked").each(function() {
			var stratId = $(this).attr("data-id");
			var newConceptList = _.clone(me.existingConceptsCollection.findWhere({id: stratId}).get("concepts"));
			for (var i = conceptsToRemove.length - 1; i >= 0; i--) {
				delete newConceptList[conceptsToRemove[i]];
			}
			me.existingConceptsCollection.findWhere({id: stratId}).set("concepts", newConceptList);
		});		
	},

	filterConcepts: function(event) {
		var searchTerm = event.target.value;
		$(".concept").each(function() {
			var regex = new RegExp(searchTerm, 'ig'); 
			var match = regex.test($(this).text());
			!match ? $(this).addClass("poofGone") : $(this).removeClass("poofGone");
		});
	},

	selectAll: function() {
		$(".concept").not(".poofGone").each(function() {
			$(this).find("input[type='checkbox']").prop('checked', true);
		});
	},

	selectNone: function() {
		$(".concept").not(".poofGone").each(function() {
			$(this).find("input[type='checkbox']").prop('checked', false);
		});
	}, 

	save: function() {
		//create modal view + model passing in modal title
		var modal = new YieldTools.updateModalView({
			model: new YieldTools.updateModalModel({
				title: "Updating Strategies"
			})
		});
		var totalModels = this.existingConceptsCollection.length;
		var updatedCounter = 0;
		var statusObj = {};
		//iterate over each model, saving it + updating the confirmation modal
		this.existingConceptsCollection.each(function(concept) {
			var xhr = concept.updateModel();
			xhr.done(function(xml) {
				updatedCounter++;
				//set progress attr to % done, modal view will auto-update
				modal.model.set("progress", ((updatedCounter / totalModels) * 100));
				statusObj[concept.get("stratName")] = $(xml).find("status").attr("code");
				if (updatedCounter == totalModels) {
					modal.model.set("finalStatus", statusObj);
				}
			});
		});
	}

});



