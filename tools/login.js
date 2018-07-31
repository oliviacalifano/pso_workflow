$("#login_form").submit(function(event) {
	event.preventDefault();
	var username=$("#username").val();
	var password=$("#password").val();
	
	 console.log(username, password); 
	
		var request = $.ajax({
			url: "https://adroit-tools.mediamath.com/t1/api/v2.0/login",
			type: "POST",
			cache: false,
			dataType: "xml",
<<<<<<< HEAD
			//data: {user:username, password: password, api_key: "4d56c81d0d6b14f43e28a0d7fb0caf35"}, 
			data: {user:username, password: password, api_key: "zknzxverexqwf5epb53z87ae"}, 
=======
			data: {user:username, password: password, api_key: "4d56c81d0d6b14f43e28a0d7fb0caf35"}, 
			//data: {user:username, password: password, api_key: "zknzxverexqwf5epb53z87ae"}, 
>>>>>>> b9b35f8b2200c79d520123d4d58aa7169a3d2830
			
			success: function(data,textStatus, jqXHR) {
				$(data).find('status').each(function() {
					var status = $(this).attr('code');	
					console.log(status);
					if (status == "auth_error") {
						console.log("login incorrect"); 
						$("#login_feedback").html("<p>Incorrect Login</p>");
					}
					else {
						console.log("logged in");
						$("#login_feedback").html("<p>Logged in successfully</p>");
						setTimeout(function() {
							window.location.replace('tools.html');
							}, 1000);
					}	
				});
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(data);
			console.log(jqXHR, textStatus, errorThrown, "error")
			}
			})
			return "";
	
}); 	
