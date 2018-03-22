$("#login_button").click(function() {
	
	var username=$("#username").val();
	var password=$("#password").val();
	
	// console.log(username, password); 
	
		var request = $.ajax({
			url: "https://adroit-tools.mediamath.com/t1/api/v1/login",
			type: "POST",
			cache: false,
			dataType: "xml",
			data: {user:username, password: password}, 
			success: function(data,textStatus, jqXHR) {
				$(data).find('status').each(function() {
					var status = $(this).attr('code');	
					// console.log(status);
					if (status == "auth_error") {
						console.log("login incorrect"); 
						$("#login_feedback").html("<p>Incorrect Login</p>");
					}
					else {
						console.log("logged in");
						$("#login_feedback").html("<p>Logged in successfully</p>");
						setTimeout(function() {
							window.location.replace('checklist.html');
							}, 1000);
					}	
				});
			},
			error: function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR, textStatus, errorThrown, "error")
			}
			})
			return "";
	
}); 	

