var stratsView = Backbone.View.extend({

	el: $("#leftInner"),

	render: function() {
		var stratDiv = document.createElement("div");
		stratDiv.setAttribute("id", "stratContainer");
		
		this.collection.forEach(function(model) {
			var container = document.createElement("div");
			container.setAttribute("class", "strategyContainerBox");
			container.setAttribute("data-id", model.get("id"));	
			var label = document.createElement("label");
			label.setAttribute("class", "strategyNameBox checkbox-inline")
			var nameText = document.createTextNode(model.get("name"));
			label.appendChild(nameText);
			var input = document.createElement("input");
			input.setAttribute("type", "checkbox");
			label.appendChild(input);
			var list = document.createElement("ul");
			container.appendChild(label);
			container.appendChild(list);
			stratDiv.appendChild(container);
		});

		this.$el.append(stratDiv);
	}


})