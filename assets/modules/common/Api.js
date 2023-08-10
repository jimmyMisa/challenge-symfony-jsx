class Api{
	static post({url, data = {}, then = () =>{}} = {}){
		$.ajax({
			method:"POST",
			url,
			data: JSON.stringify(data),
			contentType: "application/json",
		}).always(then)
	}
}

export {
	Api
}