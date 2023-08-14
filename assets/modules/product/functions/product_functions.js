import { FieldManager } from "common/functions/getField.js";
import Button from "common/classes/Button.js";
import { getButton } from "common/functions/getButton.js";
import { getConfig } from "../productConfig.js"
import { getPageText } from "common/functions/getPage.js"
import { getFieldText } from "common/functions/getField.js"
import { ProductApi as api } from "modules/product/ProductApi.js";

var BUTTON = getButton();
function getModalCreateFields(){
    var page = "MODAL_PRODUCT_CREATE";
    var name = FieldManager.create("NAME", page);
    var price = FieldManager.create("PRICE", page);

    return {
        name,
        price,
    };
};

function loadProduct() {
    getConfig().components.datatable.isLoading = true;
    getConfig().components.instance.refresh()
    api.load({then:(result) =>{
        getConfig().components.data = result
        getConfig().components.datatable.isLoading = false;
        getConfig().components.instance.refresh()
    }})
}

function getModalEditFields(){
    var page = "MODAL_PRODUCT_EDIT";
    var name = FieldManager.create("NAME", page);
    var price = FieldManager.create("PRICE", page);

    return {
        name,
        price,
    };
};

function getButtonEdit(fields){
    var button = Button.create({
        BUTTON: BUTTON.EDIT,
        domain: FieldManager.domain,
        required_fields: Object.values(fields),
    });

    button.init = (params={}) => {
        var {
            modal,
            datatable,
        } = params;

        button.modal = modal;
        button.datatable = datatable;

        button.error = null;
        button.loading = false;

        if(modal && modal.refresh){
            setTimeout(() => {
                button.required_fields.map((field) => {
                    field.isValid = true;
                    field.errorMessage = null;
                });

                modal.refresh();
            }, 100);
        }
    }

    button.always = (params) => {
        var {isValid, fields} = params;
        var {modal, line={}} = button;

        if(!isValid || !modal || !line.id){
            return false;
        }

        button.loading = true;
        modal.refresh();
       
        var data = {};
        data.id = line.id

        fields.map((field) => {
            data[field.name] = field.value;
        })

        var then = (result={}) => {
            if(result && (result.status == 200)){
                button.loading = false;

                modal.hide();
                modal.refresh();

                loadProduct()

                return true;
            }

            var error = getError("PRODUIT_LISTE", result);
            
            button.error = error;
            button.loading = false;
            modal.refresh();  
        }
        var params = {
            query:data,
            then
        };
        api.edit(params)
    };
    
    return button;
}

function getButtonCreate(fields){
    var button = Button.create({
        BUTTON: BUTTON.CREATE,
        domain: FieldManager.domain,
        required_fields: Object.values(fields),
    });

    button.init = (params={}) => {
        var {
            modal,
        } = params;

        button.modal = modal;

        button.error = null;
        button.loading = false;

        if(modal && modal.refresh){
            setTimeout(() => {
                button.required_fields.map((field) => {
                    field.isValid = true;
                    field.errorMessage = null;
                });

                modal.refresh();
            }, 100);
        }
    }

    button.always = (params) => {
        var {modal} = button;
        var {isValid, fields} = params;

        if(!isValid || !modal){
            return false;
        }

        button.loading = true;
        modal.refresh();
       
        var data = {};

        fields.map((field) => {
            data[field.name] = field.value;
        })
        var then = (result={}) => {
            if (result && (result.status == 200)) {
                button.loading = false;
                modal.hide();
                modal.refresh();
                loadProduct()

                return true;
            }

            var error = getError("PRODUIT_LISTE", result);
            
            button.error = error;
            button.loading = false;
            modal.refresh();
        }
        var params = {
            query:data,
            then
        };
        api.add(params)
    };
    
    return button;
}



function getButtonRemove(){
    var button = Button.create({
        BUTTON: BUTTON.REMOVE,
        domain: FieldManager.domain,
        required_fields: [],
    });

    button.init = (params={}) => {
        var {
            modal,
        } = params;

        button.modal = modal;

        button.error = null;
        button.loading = false;
    }

    button.always = (params) => {
        var {modal, line={}} = button;

        if(!modal || !line.id){
            return false;
        }

        button.loading = true;
        modal.refresh();
       
        var data = {};
        data.id = line.id

        var then = (result={}) => {
            if(result && (result.status == 200)){
                button.loading = false;

                modal.hide();
                modal.refresh();

                loadProduct()

                return true;
            }

            var error = getError("PRODUIT_LISTE", result);
            
            button.error = error;
            button.loading = false;
            modal.refresh();  
        }

        var then = (result={}) => {
            if(result && (result.status == 200)){
                button.loading = false;

                modal.hide();
                modal.refresh();

                loadProduct()


                return true;
            }

            var error = getError("PRODUIT_LISTE", result);
            
            button.error = error;
            button.loading = false;
            modal.refresh();  
        }

        var params = {
            query:data,
            then
        };
        api.remove(params);
    };
    
    return button;
}

function getError(page, result={}){
    var error = getPageText({
        page,
        prop: "DEFAULT_ERROR_MESSAGE",
    });

    if(result.error){
        var text = null;
        var {field, code} = result.error;

        if(field){
            text = getFieldText({
                field,
                prop: code
            });
        }
        else {
            text = getPageText({
                page,
                prop: code
            });
        }

        if(text){
            error = text;
        }
    }

    return error;
}

export {
    getButtonEdit,
    getButtonCreate,
    getButtonRemove,
    getModalEditFields,
    getModalCreateFields,
}
