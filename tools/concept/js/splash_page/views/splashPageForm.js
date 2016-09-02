YieldTools.splashPageForm = Backbone.View.extend({

	tagName: 'div',

	attributes: {
		"id": "splashBoxWrapper",
		"class": "aligner"
	},

	initialize: function() {
		this.render();
		new YieldTools.advertiserAutocomplete({model: new YieldTools.selectAdvertiser});
	},

	events: {
		"click #submitSplashPageForm" : "submitForm",
		"change #toolDropdown select": "route"
	},

	render: function() {
		//var toolDropdownDiv = '<div id="toolDropdown" class="aligner-item input-group"><span class="input-group-addon">Tool</span><select class="form-control select-style"><option selected="selected">Choose a tool...</option><option value="conceptAssigner">Concept Assigner</option><option value="pmpCreator">PMP apply to all</option><option value="pmpAssigner">PMP Assigner</option><option value="geoAssigner">Geo Assigner</option></select></div>';
		var toolDropdownDiv = '<div id="toolDropdown" class="aligner-item input-group"><span class="input-group-addon">Tool</span><select class="form-control select-style"><option selected="selected">Choose a tool...</option><option value="conceptAssigner">Concept Assigner</option><option value="pmpCreator">PMP apply to all</option><option value="pmpAssigner">PMP Assigner</option></select></div>';
		var advDropdownDiv = '<div id="advertisersAutocomplete" class="aligner-item input-group poofGone"><span class="input-group-addon">Advertiser</span><input type="text" id="advertisersInput" class="form-control"/></div>';
		var campaignDropdownDiv = '<div id="campaignDropdown" class="aligner-item input-group poofGone"><span class="input-group-addon">Campaign</span><select id="campaignSelect" class="form-control select-style"></select></div>';
		var submitButton = '<button id="submitSplashPageForm" class="btn btn-default" type="button">Submit</button>';
		this.$el.append(toolDropdownDiv + advDropdownDiv + campaignDropdownDiv + submitButton);
		$("body").append(this.$el);
	},

	//form validation
	submitForm: function() {
		
		var tool = this.$el.find("#toolDropdown select").val();

		switch (tool) {
			case "pmpCreator":
				homepageRouter.navigate("pmpCreator", {trigger: true});
				break;
			//form validation to make sure advertiser + campaign id is set if tool needs it
			case "conceptAssigner":
			case "pmpAssigner":
			case "geoAssigner":
				YieldTools.CAMPAIGN_ID = this.$el.find("#campaignDropdown").find("select").val();

				if (YieldTools.ADVERTISER_ID / YieldTools.ADVERTISER_ID != 1) {
					this.$el.find("#advertisersAutocomplete").addClass('has-error');
					var advStatus = false;
				}

				if (YieldTools.CAMPAIGN_ID / YieldTools.CAMPAIGN_ID != 1) {
					this.$el.find("#campaignDropdown").addClass('has-error');
					var campaignStatus = false;
				}

				if ($("#toolDropdown select").val() == "Choose a tool...") {
					this.$el.find("#toolDropdown").addClass('has-error');
					var toolStatus = false;
				}

				if(advStatus != false && campaignStatus != false && toolStatus != false) {
					homepageRouter.navigate("advertiser/" + YieldTools.ADVERTISER_ID + "/campaign/" + YieldTools.CAMPAIGN_ID + "/" + $("#toolDropdown").find("select").val(), {trigger: true});
				}
				break;
		}		
	},

	route: function(event) {
		var tool = event.target.value;

		switch (tool) {
			case "conceptAssigner":
				this.$el.find("#advertisersAutocomplete").removeClass("poofGone");
				this.$el.find("#campaignDropdown").removeClass("poofGone");
				break;
			case "pmpCreator":
				this.$el.find("#advertisersAutocomplete").addClass("poofGone");
				this.$el.find("#campaignDropdown").addClass("poofGone");
				break;
			case "pmpAssigner":
				this.$el.find("#advertisersAutocomplete").removeClass("poofGone");
				this.$el.find("#campaignDropdown").removeClass("poofGone");
				break;
			case "geoAssigner":
				this.$el.find("#advertisersAutocomplete").removeClass("poofGone");
				this.$el.find("#campaignDropdown").removeClass("poofGone");
				break;
		}
	}

})