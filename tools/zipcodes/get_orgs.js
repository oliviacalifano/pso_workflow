$(function(){
	get_orgs();
});


function get_orgs()
{
	$("#org_list").empty(); 


	aggregate_pages("https://adroit-tools.mediamath.com/t1/api/v2.0/organizations/?sort_by=name")
		.then(function(xml) { push_entities_to_multiselect(xml, "#org_list")});
}



// $(function(){

// 	console.log("getting orgs");
// 	$(document).ready(function () {
// 		var request = $.ajax({
// 			url: "https://adroit-tools.mediamath.com/t1/api/v2.0/organizations/",
// 			type: "GET",
// 			cache: false,
// 			dataType: "xml",
// 			success: function(xml) {
// 				var options = []; 
// 				$(xml).find('entity').each(function(result) {
// 					var org_id = $(this).attr('id')
// 					var org_name = $(this).attr('name')	
// 					options.push("<option value="+org_id+">"+org_name+"</option>");
// 					})
// 					$("#org_dropdown").append(options); 
// 					$("#org_dropdown").multipleSelect({
// 						selectAll: false,
// 						placeholder: "Choose Org",
// 						single: true
// 					});
// 			},
// 			error: function(jqXHR, textStatus, errorThrown) {
// 			console.log(jqXHR, textStatus, errorThrown)
// 			}
// 		})
// 	})
// });





