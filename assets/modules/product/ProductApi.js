import { Api as api } from "modules/common/Api.js";

class ProductApi{
	static load({query = {}, then = () =>{}} = {}){
		api.post({
			url:window.product_list_api,
			data:{query},
			then,
		})
	}
	static add({query = {}, then = () =>{}} = {}){
		api.post({
			url:window.product_add_api,
			data:{query},
			then,
		})
	}
	static edit({query = {}, then = () =>{}} = {}){
		api.post({
			url:window.product_edit_api,
			data:{query},
			then,
		})
	}
	static remove({query = {}, then = () =>{}} = {}){
		api.post({
			url:window.product_remove_api,
			data:{query},
			then,
		})
	}
}

export {
	ProductApi
}