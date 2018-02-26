function aggregate_pages(url)
{
	return new Promise(function(resolve, reject) {
		var array_of_pages_promises = [];
		var complete_xml;

		get_number_of_entities(url)
		.then(function(number_of_entities){
			for(i=0; i<number_of_entities; i+=100){
				array_of_pages_promises.push(get_single_page(url+"&page_offset="+i));
			}
			Promise.all(array_of_pages_promises).then(function(xml){
				complete_xml = xml.join();
				resolve(complete_xml);
			});
		});
	});
}


function push_entities_to_multiselect(xml, id)
{
	options = [];

	$(xml).find('entity').each(function(result) {
		item_id = $(this).attr('id')
		name = $(this).attr('name')
		options.push("<option value="+item_id+">"+name+"</option>")
	});
	//console.log(options, id);
	$(id).append(options);
	$(id).multipleSelect({
		placeholder: "Choose The Thing",
		filter: true
	});	
}

function push_entities(xml ,id)
{
	options = [];

	
	options.push("<option value="+xml+">"+xml+"</option>")
	
	//console.log(options, id);
	$(id).append(options);
	$(id).multipleSelect({
		placeholder: "Choose The Thing",
		filter: true
	});	
}

function push_entities_to_multiselect_with_name_prefix(xml, id, name_prefix, id_prefix)
{
	options = [];

	$(xml).find('entity').each(function(result) {
		item_id = $(this).attr('id')
		name = $(this).attr('name')
		options.push("<option value="+id_prefix+item_id+">"+name_prefix+" - "+name+"</option>")
	});
	console.log(options, id);
	$(id).append(options);
	$(id).multipleSelect({
		placeholder: "Choose The Thing",
		filter: true
	});	
}

function get_single_page(url)
{
	//console.log(url);
	return new Promise(function(resolve, reject) {
		var request = $.ajax({
		url: url,
		type: "GET",
		cache: true,
		dataType: "text",
		success: function(xml) {
					//console.log(xml);
					resolve(xml);			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(jqXHR, textStatus, errorThrown)
			}
		});		
	});
}

function get_number_of_entities(url)
{ 
	return new Promise(function(resolve, reject) {
		var request = $.ajax({
		url: url,
		type: "GET",
		cache: true,
		dataType: "xml",
		success: function(xml) {
				$(xml).find('entities').each(function(result) {
					var count = $(this).attr('count')
					resolve(count);
				});	
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(jqXHR, textStatus, errorThrown)
			}
		});		
	});
}