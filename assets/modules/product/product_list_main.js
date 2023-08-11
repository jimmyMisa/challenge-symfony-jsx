import ProductList from 'vue/components/modules/product/ProductList/ProductList'
import { C } from "vue/helper/V01Component";
import {setChildView} from "vue/helper/renderVue.js";
import { ProductApi as api } from "modules/product/ProductApi.js";
import { getConfig } from "./productConfig.js";

import { FIELD } from "common/structure/FIELD/FIELD.js";
import { FieldManager } from "common/functions/getField.js";
 
import { 
    getButtonEdit,
    getButtonCreate,
    getButtonRemove,
    getModalEditFields,
    getModalCreateFields,
} from "./functions/product_functions.js"



function main() {
    FieldManager.domain = "BO";
    FIELD.init();

    var modalCreateFields = getModalCreateFields();
    var modalEditFields = getModalEditFields()
    var buttonCreate = getButtonCreate(modalCreateFields);
    var buttonEdit = getButtonEdit(modalEditFields);
    var buttonRemove = getButtonRemove()

    getConfig().components = {}
    getConfig().components.buttonEdit = buttonEdit;
    getConfig().components.buttonCreate = buttonCreate;
    getConfig().components.buttonRemove = buttonRemove;
    getConfig().components.modalEditFields = modalEditFields;
    getConfig().components.modalCreateFields = modalCreateFields;
	getConfig().components.fields = ["id", "name", "price"]
	getConfig().components.data = [];
    getConfig().components.datatable = {};
    getConfig().components.datatable.isLoading = true;
	setChildView("#app",ProductList,getConfig().components)
	api.load({then:(result) =>{
		console.log(result)
        getConfig().components.datatable.isLoading = false;
		getConfig().components.data = result
		getConfig().components.instance.refresh()
	}})
}

export { main };
