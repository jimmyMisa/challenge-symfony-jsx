import { Api as api } from "modules/common/Api.js";

class CommandApi{
	static load({query = {}, then = () =>{}} = {}){
		api.post({
			url:window.command_list_api,
			data:{query},
			then,
		})
	}
	static add({query = {}, then = () =>{}} = {}){
		api.post({
			url:window.command_add_api,
			data:{query},
			then,
		})
	}
	static edit({query = {}, then = () =>{}} = {}){
		api.post({
			url:window.command_edit_api,
			data:{query},
			then,
		})
	}
	static remove({query = {}, then = () =>{}} = {}){
		api.post({
			url:window.command_remove_api,
			data:{query},
			then,
		})
	}
}

export {
	CommandApi
}