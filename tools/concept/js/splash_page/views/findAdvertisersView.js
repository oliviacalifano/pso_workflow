/*
The purpose of this view is to display the advertiser names in an "autocomplete" fashion
Once an advertiser is selected, it will set the adv id as a property on the YieldTools object
I hope one day, typeahead can be replaced with something better cuz it kinda sucks
*/

YieldTools.advertiserAutocomplete = Backbone.View.extend({
	
	el: "#advertisersAutocomplete",

	initialize: function() {
		var me = this;
		//render html and set the model (this) to model var
		this.$el.find("#advertisersInput").typeahead({
			limit: 10,
			remote: {
				replace: function(url, uriEncodedQuery) {
					//replace spaces with +
					//escape the whole adv name
					//escape the whole name="*__*" and throw that inno the q= param
					var queryTerm = escape($("#advertisersInput").val().replace(" ", "+"));
					var qParam = escape("name=:*" + queryTerm + "*");
					return YieldTools.API_BASE + "advertisers?with=agency,organization&sort_by=id&order_by=ascending&page_limit=10&q=" + qParam;
				},
				cache: true,
				dataType: 'XML',
				beforeSend: function() {
					me.$el.find("#advertisersInput").addClass("ajax-loader");
				},
				filter: function(xml) {
					//not good place for this but closest thing typeahead exposes for success handler
					me.$el.find("#advertisersInput").removeClass("ajax-loader");
					// =[
					
					var advertisers = [];
					var organizations = [];
					var autocompleteOptions = [];
					var xmlDoc = $(xml);

					xmlDoc.find("entity[type=advertiser]").each(function() {
						advertisers.push([$(this).attr("name"), $(this).attr("id")]);
					});	

					xmlDoc.find("entity[type=organization]").each(function() {
						organizations.push([$(this).attr("name"), $(this).attr("id")]);
					});

					var i = advertisers.length;
					while(i--) {
						var datum = {
							id: parseInt(advertisers[i][1]),
							value: advertisers[i][0] + " (" + organizations[i][0] + ")" 
						}
						autocompleteOptions.push(datum);
					}
					return autocompleteOptions;
				}
			}
		});

	},

	events: {
		"typeahead:selected": "setAdvertiser"
	},

	//after user selects advertiser, this will set id + instantiate YieldTools.selectCampaign model 
	setAdvertiser: function(event, datum) {
			YieldTools.ADVERTISER_ID = datum.id;
			this.$el.find("#advertisersInput").typeahead('destroy');
			new YieldTools.campaignDropdown({model: new YieldTools.selectCampaign});
	}

});