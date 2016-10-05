$("#allex").change(function(){

	$("#supply_list").multipleSelect("disable");

});	

$("#add").change(function(){

	$("#supply_list").multipleSelect("enable");

});	

$("#remove").change(function(){

	$("#supply_list").multipleSelect("enable");

});	

$('#fold_targeting').click(function(){
	var fold_position = [];
	$('input:checkbox:checked', '#fold_targeting').each(function() {
			fold_position.push($(this).val());
		});
	
	if(fold_position.length <= 0){
	$('#above').attr('disabled',false);
	$('#below').attr('disabled',false);
	$('#uncat').attr('disabled',false);
	$('#none').attr('disabled',false);	
	}
	
	if (fold_position.indexOf("45054") > -1 || fold_position.indexOf("45055") > -1 || fold_position.indexOf("45056") > -1) {
    $('#above').attr('disabled',false);
	$('#below').attr('disabled',false);
	$('#uncat').attr('disabled',false);
	$('#none').attr('disabled',true);
	
	} if(fold_position.indexOf("0") > -1) {
	$('#above').attr('disabled',true);
	$('#below').attr('disabled',true);
	$('#uncat').attr('disabled',true);
	$('#none').attr('disabled',false);
	}

})