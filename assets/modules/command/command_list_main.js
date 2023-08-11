import CommandList from 'vue/components/modules/command/CommandList/CommandList'
import { C } from "vue/helper/V01Component";
import {setChildView} from "vue/helper/renderVue.js";
import { CommandApi as api } from "modules/command/CommandApi.js";
import { getConfig } from "./commandConfig.js";


import { FIELD } from "common/structure/FIELD/FIELD.js";
import { FieldManager } from "common/functions/getField.js";

 
import { 
    getButtonEdit,
    getButtonCreate,
    getButtonRemove,
    getModalEditFields,
    getModalCreateFields,
} from "./functions/command_functions.js"



function main() {
    FieldManager.domain = "BO";
    FIELD.init();

	getConfig().components = {}

    var modalEditFields = getModalEditFields()
    var modalCreateFields = getModalCreateFields();
    var buttonEdit = getButtonEdit(modalEditFields);
    var buttonCreate = getButtonCreate(modalCreateFields);
    var buttonRemove = getButtonRemove()

    getConfig().components.buttonCreate = buttonCreate;
    getConfig().components.buttonRemove = buttonRemove;
    getConfig().components.modalCreateFields = modalCreateFields;
    
    getConfig().components.buttonEdit = buttonEdit;
    getConfig().components.modalEditFields = modalEditFields;

	getConfig().components.fields = ["id", "name", "price", "status"]
	getConfig().components.data = [];
    getConfig().components.datatable = {};
    getConfig().components.datatable.isLoading = true;
	setChildView("#app",CommandList,getConfig().components)
	api.load({then:(result) =>{
		console.log(result)
		getConfig().components.datatable.isLoading = false;
		getConfig().components.data = result.commands;
		getConfig().components.products = result.products;
		var {product:product_id=null} = result.products
		if (!modalCreateFields.product) {
			modalCreateFields.product = {}
		}
		if (!modalEditFields.product) {
			modalEditFields.product = {}
		}
		modalCreateFields.product.options = result.products;
		modalEditFields.product.options = result.products.map((product) =>{
			if (product_id && product.value == product_id) {
				product.selected=true;
			}
			return product
		});
		getConfig().components.instance.refresh()
	}})
}

export { main };
