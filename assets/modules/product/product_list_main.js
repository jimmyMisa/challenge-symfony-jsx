import ProductList from 'vue/components/modules/product/ProductList/ProductList'
import { C } from "vue/helper/V01Component";
import {setChildView} from "vue/helper/renderVue.js";
import { ProductApi as api } from "modules/product/ProductApi.js";

var config = null;

function getConfig() {
	if(!config){
		config = {}
	}
	return config;
}

function main() {
	getConfig().components = {}
	getConfig().components.fields = ["id", "name"]
	getConfig().components.data = []
	setChildView("#app",ProductList,getConfig().components)
	api.load({then:(result) =>{
		console.log(result)
		getConfig().components.data = result
		getConfig().components.instance.refresh()
	}})
}

export { main, getConfig };
