YieldTools.Router = Backbone.Router.extend({
	
	routes: {
	 	"": "home",
	 	"advertiser/:advid/campaign/:campaignid/conceptAssigner": "conceptAssigner",
	 	"advertiser/:advid/campaign/:campaignid/pmpAssigner": "pmpAssigner",
	 	"advertiser/:advid/campaign/:campaignid/geoAssigner": "geoAssigner",
	 	"pmpCreator": "pmpCreator"
	},

	home: function() {
		new YieldTools.loginModel;
		new YieldTools.splashPageForm();
	},

	conceptAssigner: function(advid, campaignid) {
		$("#splashBoxWrapper").hide();
		$("#main").removeClass("poofGone");
		YieldTools.CAMPAIGN_ID = campaignid;
		YieldTools.ADVERTISER_ID = advid;

		//create left side search bar
		new conceptMapperStratNameFilter;
		//create right side search bar
		var availableConceptsNavBar = new conceptMapperTopNavBar;
		//create strats collection + view
		var strats = new stratsView({collection: new stratsCollection});
		//create concepts collection
		var concepts = new conceptsAssignedToStratCollection;
		//create a link between nav bar view and assigned concepts collection
		availableConceptsNavBar.existingConceptsCollection = concepts;
		//fetch all strats in the campaign
		var stratAjaxObj = strats.collection.fetch({dataType: 'xml'});
		//when it's finished, loop through each strat and pull in the concepts assigned to that strat in a model
		stratAjaxObj.done(function() {
			//now that all strategy data is populated in the collection, render it
			strats.render();
			//for each strat in the collection, populate concepts assigned to strat collection
			strats.collection.each(function(model) {
				concepts.add({id: model.id, stratName: model.get("name")});
			});
			//for each concept model in the collection, render the view by matching strat id
			concepts.each(function(model) {
				new conceptsAssignedToStratView({
					el: $(".strategyContainerBox").filter('[data-id=' + model.get("id") + ']').find('ul'),
					model: model
				});
			});
			//create collection of all available to assign concepts (the right side)
			availableConceptsCollection = new conceptsAvailableToAssignCollection();
			//need a strat Id to get available concepts, so just take the first strat id in the collection 
			availableConceptsCollection.id = strats.collection.at(0).get("id");
			//fetch all available concepts
			var conceptAjaxObj = availableConceptsCollection.fetch({dataType: 'xml'});
			//loop through each available concept and create the view
			conceptAjaxObj.done(function(){
				var container = document.createElement('div');
				container.setAttribute("id", "conceptContainer");
				//for each concept in the collection, create the view
				//append it to the concept container div
				availableConceptsCollection.each(function(model) {
					var concept = new availableConceptView({
						model: model
					});
					container.appendChild(concept.render().el);
				});
				$("#rightInner").append(container); 	
			});
		});
	},

	pmpAssigner: function(advid, campaignid) {
		$("#splashBoxWrapper").hide();
		$("#main").removeClass("poofGone");
		YieldTools.CAMPAIGN_ID = campaignid;
		YieldTools.ADVERTISER_ID = advid;

		//create left side search bar
		new generalStratNameFilter;
		//create right side search bar
		var availableDealsNavBar = new pmpTopNavBar;
		//create main view - deals container
		new pmpContainer;
		var strats = new stratsView({collection: new stratsCollection});
		var deals = new PmpDealsAssignedToStratCollection;
		//create a link between nav bar view and assigned deals collection
		availableDealsNavBar.existingDealsCollection = deals;
		var stratAjaxObj = strats.collection.fetch({dataType: 'xml'});
		stratAjaxObj.done(function() {
			strats.render();
			strats.collection.each(function(model) {
				deals.add({id: model.id, stratName: model.get("name")});
			});

			deals.each(function(model){
				new PmpDealsAssignedToStratView({
					el: $(".strategyContainerBox").filter('[data-id=' + model.get("id") + ']').find('ul'),
					model: model
				});
			});
		});
		//instantiate collection of all available PMP deals
		var allPmp = new pmpCollection;
		//fetch the pmp deals
		var allPmpAjaxObj = allPmp.fetch({dataType: 'xml'});
		//on success
		allPmpAjaxObj.done(function(){
			allPmp.each(function(model) {
				new pmpView({model: model});
			})
		})
	},

	pmpCreator: function() {
		$("#splashBoxWrapper").hide();
		$("#main").removeClass("poofGone");

		new createPmpMainForm;

	},

	geoAssigner: function(advid, campaignid) {
		$("#splashBoxWrapper").hide();
		$("#main").removeClass("poofGone");

		YieldTools.CAMPAIGN_ID = campaignid;
		YieldTools.ADVERTISER_ID = advid;

		//create left side search bar
		new generalStratNameFilter;
		//collection of existing strats
		var strats = new stratsView({collection: new stratsCollection});
		//create empty collection of assigned geos
		var assignedGeos = new GeosAssignedToStratCollection;
		var stratAjaxObj = strats.collection.fetch({dataType: 'xml'});
		stratAjaxObj.done(function() {
			strats.render();

			strats.collection.each(function(model) {
				assignedGeos.add({id: model.id, stratName: model.get("name")});
			});

			assignedGeos.each(function(model){
				new GeosAssignedToStratView({
					el: $(".strategyContainerBox").filter('[data-id=' + model.get("id") + ']').find('ul'),
					model: model
				});
			});
		});


	}

});

var homepageRouter = new YieldTools.Router();
Backbone.history.start();
