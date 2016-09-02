YieldTools.loginModel = Backbone.Model.extend({

	url: YieldTools.API_BASE + "session",

	initialize: function() {
		var me = this;
		this.fetch({
			dataType: 'XML',
			success: function() {
				if (me.get("status") !== "ok") {
					new YieldTools.loginView({model: me});
				}
			}		
		});
	},

	parse: function(xml) {
		var status = $(xml).find("status").attr("code");
		return {status: status};
	},

	postLogin: function(user, pass){
		var me = this;
        //instantiate object that will be POSTed
        var postObj = {user: user, password: pass};
        
        $.ajax({
			url: YieldTools.API_BASE + "login",
			type: "POST",
			cache: false,
			dataType: "XML",
			data: postObj,
			success: function(xml) {
				me.set("status", $(xml).find("status").attr("code"));
			} 
		});
    } 
})