var createPmpMainForm = Backbone.View.extend({
	
	tagName: "form",

	attributes: {
		"id": "makePmpDealForm"
	},

	events: {
		"click :checkbox": "dateChoose",
		"click #dealid :radio": "dealIdChoose",
		"click #pmpSubmit": "validate",
		"click .dropdown-menu li a": "setButtonText",
		"click #fetchAdvertisers": "getAdvertisers"
	},

	initialize: function() {
		this.render();	
	},

	dateChoose: function(event) {
		var target = event.target.parentNode.parentNode.children[1];
		if ($(target).css("visibility") == "hidden") {
			$(target).css("visibility", "visible");
		} else {
			$(target).css("visibility", "hidden");
		}
	},

	dealIdChoose: function(event) {
		if (event.target.value == "new") {
			$(event.target).parent().siblings("input").attr("disabled", false);
		} else {
			$(event.target).parent().siblings("input").attr("disabled", true);
		}
	},

	setButtonText: function(event) {
		var selText = event.target.text;
  		var button = $(event.target).parents('.input-group-btn').find('button').html(selText+' <span class="caret"></span>');
	},

	render: function() {
		orgs = new orgSelectView({model: new t1orgs});
		var pubs = new pubSelectView({model: new publishers});
		var supplies = new supplySelectView({model: new supplySources});
		
		var orgDiv = '<div id="org" class="form-group"><label>Select Orgs</label></div>';
		var advSelectBtn = '<div class="form-group"><label>Select Advertisers</label><br><button id="fetchAdvertisers" type="button" class="btn btn-default form-control">Fetch</button></div>';
		var name = '<div id="name" class="form-group"><label>Name</label><input type="text" class="form-control"></div>';
		var description = '<div id="description" class="form-group"><label>Description (Optional)</label><input type="text" class="form-control"></div>';
		var active = '<div id="active" class="btn-group form-group" data-toggle="buttons"><label class="btn btn-default"><input type="radio" name="active" value="0"> Active </label><label class="btn btn-default"><input type="radio" name="active" value="0"> Inactive </label></div>';
		var startDate = '<div id="startdate" class="checkbox"><label><input type="checkbox" checked="checked"> Start Immediately </label><input type="date"></div>';
		var endDate = '<div id="enddate" class="checkbox"><label><input type="checkbox" checked="checked"> No End </label><input type="date"></div>';
		var pubDiv = '<div id="pub" class="form-group"><label>Select Publisher</label></div>';
		var dealId = '<div id="dealid" class="form-group"><label class="radio-inline"><input type="radio" name="dealid" value="existing"> New Deal ID</label><label class="radio-inline"><input type="radio" name="dealid" value="new"> Use Existing Deal ID</label><input type="text" disabled></div>';
		var supplyDiv = '<div id="supply" class="form-group"><label>Select RTB Provider</label></div>';
		var price = '<div id="price" class="form-group"><label>Price</label><div class="input-group"><input type="text" placeholder="X.XX"class="form-control"><div class="input-group-btn"><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">CPM Type<span class="caret"></span></button><ul class="dropdown-menu pull-right" role="menu"><li><a href="javascript:void(0)">Floor</a></li><li><a href="javascript:void(0)">Fixed</a></li></ul></div></div></div>';
		var submit = '<button id="pmpSubmit" type="button" class="btn btn-default">Submit</button>';
		this.$el.append($(orgDiv).append(orgs.$el));
		this.$el.append(advSelectBtn);
		this.$el.append(name);
		this.$el.append(description);
		this.$el.append(active);
		this.$el.append(startDate);
		this.$el.append(endDate);
		this.$el.append($(pubDiv).append(pubs.$el));
		this.$el.append(dealId);
		this.$el.append($(supplyDiv).append(supplies.$el));
		this.$el.append(price);
		this.$el.append(submit);
		$("#rightInner").append(this.$el);
	},

	validate: function() {
		//clean slate
		this.$el.find(".errorz").each(function(){
			$(this).removeClass("errorz");
		})

		//verify pmp deal name is entered
		if (this.$el.find("#name input").val() < 1) {
			var verifyName = false;
			this.$el.find("#name").addClass('errorz');
		}

		//verify active or inactive is selected
		if (this.$el.find('#active input[type="radio"]:checked').length == 0) {
			var verifyIsActive = false;
			this.$el.find('#active label').addClass('errorz');
		}

		//verify start date is set
		if (this.$el.find('#startdate input[type="checkbox"]:checked').length == 0 && this.$el.find('#startdate input[type="date"]').val() == "") {
			var verifyStart = false;
			this.$el.find('#startdate').addClass('errorz');
		}

		//verify end date is set
		if (this.$el.find('#enddate input[type="checkbox"]:checked').length == 0 && this.$el.find('#enddate input[type="date"]').val() == "") {
			var verifyEnd = false;
			this.$el.find('#enddate').addClass('errorz');
		}

		//verify deal radio is clicked
		if (this.$el.find('#dealid input[type="radio"]:checked').length == 0) {
			var verifyDealRadio = false;
			this.$el.find("#dealid label").addClass('errorz');
		}

		//verify deal id entered if use existing is selected
		if (this.$el.find('#dealid input[type="radio"]:checked').val() === "new" && this.$el.find('#dealid input[type="text"]').val().length === 0) {
			var verifyNewDealId = false;
			this.$el.find('#dealid').addClass('errorz');
		}

		//verify cpm type is set
		if (this.$el.find("#price  button").text() == "CPM") {
			var verifyCpm = false;
			this.$el.find("#price").addClass('errorz');
		}

		//verify price isn't blank
		if (this.$el.find("#price  input").val() == "") {
			var verifyPrice = false;
			this.$el.find("#price").addClass('errorz');
		}

		if (verifyName != false && verifyIsActive != false && verifyStart != false && verifyEnd != false && verifyDealRadio != false && verifyNewDealId !=false && verifyCpm != false && verifyPrice != false) {
			this.saveDeal();
		}
	},	

	getAdvertisers: function() {
		var orgArray = this.$el.find("#org select").val();

		if (orgArray == null) {
			return;
		}

		this.$el.find("#fetchAdvertisers").attr("disabled", "disabled");

		//create collection of org models that have all the adv IDs in them
		var orgsWithAdvId = new advertisersInOrg;

		//add each org id to the collection
		//in the collection, each model represents an org
		//the advertisers in that org are an attribute on that model
		orgArray.forEach(function(orgId) {
			orgsWithAdvId.add({id: orgId})
		});

		//this will hold all the jquery ajax obj for $.when
		var ajaxFetchArray = [];

		//loop through the collection and fetch each org to pull in adv IDs
		orgsWithAdvId.each(function(model){
			ajaxObj = model.fetch({dataType: 'xml'});
			ajaxFetchArray.push(ajaxObj);
		});

		//when all adv IDs are pulled in, create one array to loop through
		$.when.apply($, ajaxFetchArray).done(function() {
			var advertisers = new advView({collection: orgsWithAdvId});
		});
	},

	saveDeal: function() {

		var advArray = $(".adv-entry").has("input[type='checkbox']:checked").map(function(){
							return $(this).attr("data-advid");
						});
		var advArray = advArray.toArray();

		var postObj = {
			version: 0,
			name: this.$el.find("#name input").val(),
			status: this.$el.find('#active input[type="radio"]:checked').val(),
			description: this.$el.find("#description input").val(),
			ignore: true,
			publisher_id: this.$el.find("#pub select").val(),
			supply_source_id: this.$el.find("#supply select").val(),
			price: this.$el.find("#price input").val(),
			price_type: this.$el.find("#price  button").text().replace(" ","").toUpperCase(),
			zone_name: "America/New_York",
			deal_source: "INTERNAL",
			price_method: "CPM"
		};

		//if inputting an existing deal ID
		if (this.$el.find('#dealid input[type="radio"]:checked').val() === "new"){
			postObj["deal_identifier"] = this.$el.find('#dealid input[type="text"]').val();
		}

		//if start date immediate or future
		if (this.$el.find('#startdate input[type="checkbox"]:checked').length == 0) {
			//future date
			postObj["start_datetime"] = t1date(this.$el.find('#startdate input[type="date"]').val());
		} else {
			//immediate
			postObj["start_datetime"] = t1date();
		}

		//if end date forever or set
		if (this.$el.find('#enddate input[type="checkbox"]:checked').length == 0) {
			//future date
			postObj["end_datetime"] = t1date(this.$el.find('#enddate input[type="date"]').val());
		} else {
			//forever
			postObj["end_datetime"] = "2999-12-31T00:00:00";
		}

		//create modal view + model passing in modal title
		var modal = new YieldTools.updateModalView({
			model: new YieldTools.updateModalModel({
				title: "Creating PMP Deals"
			})
		});

		var totalDeals = advArray.length;
		var updatedCounter = 0;
		var statusObj = {};

		//iterate over each advid and save the pmp deal and update the modal
		advArray.forEach(function(adv){

			postObj["advertiser_id"] = adv;

			var ajaxObj = $.ajax({
				url: YieldTools.API_BASE + "deals",
				type: "POST",
				cache: false,
				dataType: "XML",
				data: postObj
			});

			ajaxObj.done(function() {
				updatedCounter++;
				modal.model.set("progress", ((updatedCounter / totalDeals) * 100));
			})

		});
	}

});
