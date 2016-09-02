function t1date(date){
	if (date == undefined) {
		var d = new Date();
	} else {
		var d = new Date(date.toString());
	}

	var month = d.getUTCMonth() + 1;

	var year = d.getFullYear();
	var month = (d.getUTCMonth().toString().length == 1) ? "0" + month : month;
	var date =  (d.getUTCDate().toString().length == 1) ? "0" + d.getUTCDate() : d.getUTCDate();
	var hours = (d.getHours().toString().length == 1) ? "0" + d.getHours() : d.getHours();
	var minutes = (d.getMinutes().toString().length == 1) ? "0" + d.getMinutes() : d.getMinutes();

	return year + "-" + month + "-" + date + "T" + hours + ":" + minutes + ":00";
}
