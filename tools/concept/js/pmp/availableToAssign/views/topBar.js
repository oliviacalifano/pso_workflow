var pmpTopNavBar = Backbone.View.extend({

	initialize: function() {
		this.render();
	},

	events: {
		'keyup input[type="text"]': "filterPmpDeals",
		"click .selectall": "selectAll",
		"click .selectnone": "selectNone",
		"click #addBtn": "addDealsToStrats",
		"click #removeBtn": "removeDealsFromStrats",
		"click #saveBtn": "save"
	},

	render: function() {
		var input = '<div id="topNavContainer" class="input-group input-group-sm rightNavMember"><span class="input-group-addon">Filter PMP Deals</span><input type="text" class="form-control"><span class="input-group-btn"><button class="selectall btn btn-default glyphicon glyphicon-check" type="button"></button></span><span class="input-group-btn"><button class="selectnone btn btn-default glyphicon glyphicon-ban-circle" type="button"></button></span></div>';
		var addBtn = '<button type="button" id="addBtn" class="btn btn-sm btn-success rightNavMember">Add</button>';
		var removeBtn = '<button type="button" id="removeBtn" class="btn btn-sm btn-danger rightNavMember">Remove</button>';
		var saveBtn = '<button type="button" id="saveBtn" class="btn btn-sm btn-primary">Save</button>';
		this.$el.append(input + addBtn + removeBtn + saveBtn);
		$("#rightInner").append(this.$el);
	},

	selectAll: function() {
		$(".pmpdeal").not(".poofGone").each(function() {
			$(this).find("input[type='checkbox']").prop('checked', true);
		});
	},

	selectNone: function() {
		$(".pmpdeal").not(".poofGone").each(function() {
			$(this).find("input[type='checkbox']").prop('checked', false);
		});
	},

	filterPmpDeals: function(event) {
		var searchTerm = event.target.value;
		$(".pmpdeal").each(function() {
			var regex = new RegExp(searchTerm, 'ig'); 
			var match = regex.test($(this).text());
			!match ? $(this).addClass("poofGone") : $(this).removeClass("poofGone");
		});
	},

	addDealsToStrats: function() {
		var me = this;
		var dealsToAssign = $(".pmpdeal").has("input:checked").map(function(){
			return [[$(this).attr("data-id"), $(this).attr("data-name")]];
		});
		$(".strategyContainerBox").has("input:checked").each(function() {
			var stratId = $(this).attr("data-id");
			var newDealList = _.clone(me.existingDealsCollection.findWhere({id: stratId}).get("deals"));
			for (var i = dealsToAssign.length - 1; i >= 0; i--) {
				newDealList[dealsToAssign[i][0]] = dealsToAssign[i][1];
			}
			me.existingDealsCollection.findWhere({id: stratId}).set("deals", newDealList);
		});
		
	},

	removeDealsFromStrats: function() {
		var me = this;
		var dealsToRemove = $(".pmpdeal").has("input:checked").map(function(){
			return $(this).attr("data-id");
		});
		$(".strategyContainerBox").has("input:checked").each(function() {
			var stratId = $(this).attr("data-id");
			var newDealList = _.clone(me.existingDealsCollection.findWhere({id: stratId}).get("deals"));
			for (var i = dealsToRemove.length - 1; i >= 0; i--) {
				delete newDealList[dealsToRemove[i]];
			}
			me.existingDealsCollection.findWhere({id: stratId}).set("deals", newDealList);
		});		
	},

	save: function() {
		//create modal view + model passing in modal title
		var modal = new YieldTools.updateModalView({
			model: new YieldTools.updateModalModel({
				title: "Updating PMP Deals"
			})
		});
		var totalModels = this.existingDealsCollection.length;
		var updatedCounter = 0;
		var statusObj = {};
		//iterate over each model, saving it + updating the confirmation modal
		this.existingDealsCollection.each(function(pmpdeal) {
			//if pmp deal has no
			if (Object.keys(pmpdeal.get("deals")).length == 0) {
				statusObj[pmpdeal.get("stratName")] = "No Deals - skipped";
				updatedCounter++;
			} else {
				var xhr = pmpdeal.updateModel();
				xhr.done(function(xml) {
					updatedCounter++;
					//set progress attr to % done, modal view will auto-update
					modal.model.set("progress", ((updatedCounter / totalModels) * 100));
					statusObj[pmpdeal.get("stratName")] = $(xml).find("status").attr("code");
					if (updatedCounter == totalModels) {
						modal.model.set("finalStatus", statusObj);
					}
				});
			}
		});
	}


});