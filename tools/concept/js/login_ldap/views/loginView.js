YieldTools.loginView = Backbone.View.extend({
	el: $("#loginModal"),

	initialize: function() {
		this.listenTo(this.model, 'change:status', this.render);
		this.$el.modal({
		  keyboard: false,
		  show: true
		});
	},

	events: {
		"click button" : "login",
		"keypress #password" : "login",
		"hidden.bs.modal" : "destroy"
	},

	login: function(event) {
		//if you clicked or if you hit the enter key in the password field
		if (event.type === "click" || event.charCode === 13) {
			var usernameField = this.$el.find("#username input").val();
			var passwordField = this.$el.find("#password input").val();
			
			//validate. 4 is kinda arbitrary.
			if (usernameField.length < 4) {
				var username = false;
				this.$el.find("#username").addClass('has-error');
			}

			if (passwordField.length < 4) {
				var password = false;
				this.$el.find("#password").addClass('has-error');
			}

			if (username != false && password != false) {
				this.model.postLogin(usernameField, passwordField);
			}
		}
	},

	render: function() {
		var status = this.model.get("status");
		if (status !== "ok") {
			this.$el.find("#password input").val("");
		}
		else {
			this.$el.modal('hide');
		}
	},

	destroy: function() {
		this.remove();
	}	
	
})