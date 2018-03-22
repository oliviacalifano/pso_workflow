jQuery.fn.filterByText = function(textbox, selectSingleMatch) {
    return this.each(function() {
	
		var select = this;
		var options = [];
		
		console.log("select",select);
		
		$(select).find('option').each(function() {
			options.push({value: $(this).val(), text: $(this).text()});
		});
		
		$(select).data('options', options);
		$(textbox).bind('change keyup', function() {
			if (textbox.value.length > 1) {
				var options = $(select).empty().data('options');
				var search = $(this).val().trim();
				var regex = new RegExp(search,"gi");
			  
				$.each(options, function(i) {
					var option = options[i];
					if(option.text.match(regex) !== null) {
						$(select).append(
						   $('<option>').text(option.text).val(option.value)
						);
					}		
				});
			}	
			
			if (selectSingleMatch === true && $(select).children().length === 1) {
				$(select).children().get(0).selected = true;
			}
		});            
	});
};

$(function() {
	$('#select').filterByText($('#adv_textbox'), false);
	$("select option").click(function(){
		alert(1);
	});
});