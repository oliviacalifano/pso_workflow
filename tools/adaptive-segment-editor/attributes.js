$("#adv_list").change(function(){
	get_attr($(this).val());

});

/* function get_attr(adv){
	console.log("getting data pixels");
	$("#attr_list").empty(); 
	get_single_page("https://adroit-tools.mediamath.com/t1/dmp/v2.0/attributes/limit/advertiser="+adv+"?sort_by=name")
		.then(function(xml) { push_attr(xml, "#attr_list")});
}  */

function get_attr(adv){
	$("#attr_list").empty(); 
	$.getJSON('https://adroit-tools.mediamath.com/t1/dmp/v2.0/attributes/limit/advertiser='+adv, function(data) {
		//var json = JSON.parse(data);
	console.log(data);
	options = [];
	data = data['data']
		for (x in data){
		
		item_id = data[x]['id'];
		name = data[x]['name'];
		options.push("<option value="+item_id+">"+name+"</option>")
		}
		$('#attr_list').append(options);
		$('#attr_list').multipleSelect({
			placeholder: "Choose The Thing",
			filter: true
		});
	});
} 

