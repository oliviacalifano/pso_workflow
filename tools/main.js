$('form[name="preview"]').on('submit', function() {
    $('#submit').prop('disabled', 'disabled');
});

$('form[name="login"]').on('submit', function() {
    $('#submit').prop('disabled', 'disabled');
});

$("[data-toggle=popover]").popover