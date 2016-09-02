/*
The purpose of thie view is to display the data in the YieldTools.selectCampaign model which
is just showing all the campaigns under an advertiser in a dropdown
*/

YieldTools.campaignDropdown = Backbone.View.extend({

	el: "#campaignDropdown",

	initialize: function() {
		var me = this;
		this.model.fetch({
			dataType: 'xml',
			success: function(response) {
				me.render();
			}
		});
	},

	render: function() {
		var dropdown = this.$el;
		this.model.campaignArray.forEach(function(element, index, array){
			dropdown.find("select").append('<option value="' + element[1] + '">' + element[0] + '</option>');
		});
	}

});