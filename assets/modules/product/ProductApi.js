import { Api as api } from "modules/common/Api.js";

class ProductApi{
	static load({query = {}, then = () =>{}} = {}){
		api.post({
			url:window.product_list_api,
			data:{query},
			then,
		})
	}
}

export {
	ProductApi
}