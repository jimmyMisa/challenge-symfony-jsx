class DropzoneApi{
	static load({query = {}, then = () =>{}} = {}){
		$.ajax({
			method:"POST",
			url: window.api_file_reload_dropzone,
			data: {},
		}).always(then)
	}
	static remove({query = {}, then = () =>{}} = {}){
		var {id} = query;
		$.ajax({
			type: "POST",
			url: window.api_file_remove_dropzone,
			data: { id: id },
		}).always(then)
	}
}

export {
	DropzoneApi
}