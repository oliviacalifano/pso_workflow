'use strict' 

//returns selected deals
function get_selected_deals() 
{

	var deals = []; 
	
	//get selected ctxlice ids
	$("#deals_list").each(function() { 
		deals.push($(this).val()); 
	});
	console.log(deals);
	
	return deals[0];

}

function get_deal(deal, callback){
	

	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/deals/"+deal,
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {
			
			var version = $(xml).find('entity').attr('version');
			
			callback(deal, version);	
			
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
}	

function update_deal(deal, ver, s, new_name, new_id, callback)
{		
		var to_post = "version="+ ver +"&status="+s +"&name="+new_name +"&deal_identifier="+new_id;

		var request = $.ajax({
			url: "https://adroit-tools.mediamath.com/t1/api/v2.0/deals/"+deal,
			type: "POST",
			cache: false,
			dataType: "xml",
			data: to_post,
			success: function(data,textStatus, jqXHR) { 
				var success = 1;
				callback(success);
				console.log("success", success);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				var success = 0;
				callback(success);
				console.log(jqXHR, textStatus, errorThrown)
			}
		})
}


function update() {

	var new_name = $("#d_name").val();
	var new_id = $("#d_id").val();
	
	console.log(new_name);
	console.log(new_id);
	
	var feedback = "";
	var success = 0;
	var count = 0; 

	//check if adding or removing technologies
	var active = $('input[name=status]:checked', '#status').val();
	console.log("status:", active);	
	
	var deals_list = get_selected_deals();
	//deals_list = deals_list[0]; 
	console.log("deals_list:", deals_list);
	
		console.log(deals_list.length);
		console.log("starting to loop through deals");
		for(var i=0; i<deals_list.length; i++) {
		var current_deal = deals_list[i];
				get_deal(current_deal, function(deal, version) 
				{
					update_deal(deal, version, active, new_name, new_id, function(success)
					{			
						if (success == 1) {
							feedback = feedback + "<p>Updated Deal ID. Check changes <a target=\"_blank\" href=\"https://adroit-tools.mediamath.com/t1/api/v2.0/deals/"+deal+"\">here</a></p>";								
							$("#feedback").html(feedback); 
						}
						else{
							var error = "ERROR: ";
							feedback = feedback + "<p>" + error.fontcolor("red")+deal+". Check changes <a target=\"_blank\" href=\"https://adroit-tools.mediamath.com/t1/api/v2.0/deals/"+deal+"\">here</a></p>";								
							$("#feedback").html(feedback); 
						}
						
					});	
					
				});
		}
	}

$("#punch").click(function() {
	console.log("hit!");
	update();
})	