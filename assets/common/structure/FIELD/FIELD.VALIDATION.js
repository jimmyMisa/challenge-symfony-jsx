import {
    VALIDATION,
    Validation,
} from "pw-components-js-dev"

import {FieldManager} from "common/functions/getField.js"

class FIELD_VALIDATION {

    static setupValidations() {

        Validation.add("notEmptySelect", (password) => {
            return (baseValue, params = {}) => {
                var {instance} = params
                var value = instance.component.getValue();
                return (value !== "" && value !== undefined && value !== null)
            }
        })
    }

    static init() {
        var domain = FieldManager.domain;

        FIELD_VALIDATION.setupValidations();
        
        /*VALIDATION.add("CATEGORY", {
            MODAL_USER_FILTER: [
                Validation.build({domain})("CATEGORY", "notEmptySelect", "INVALID_MESSAGE"),
            ],
        });*/

        VALIDATION.add("NAME", {
            MODAL_PRODUCT_CREATE: [
                Validation.build({domain})("NAME", "notEmpty", "EMPTY_MESSAGE"),
            ],
            MODAL_PRODUCT_EDIT: [
                Validation.build({domain})("NAME", "notEmpty", "EMPTY_MESSAGE"),
            ],
        });

        VALIDATION.add("PRICE", {
            MODAL_PRODUCT_CREATE: [
                Validation.build({domain})("PRICE", "notEmpty", "EMPTY_MESSAGE"),
            ],
            MODAL_PRODUCT_EDIT: [
                Validation.build({domain})("PRICE", "notEmpty", "EMPTY_MESSAGE"),
            ],
        });
        
        VALIDATION.add("NAME_COMMANDE", {
            MODAL_COMMAND_CREATE: [
                Validation.build({domain})("NAME_COMMANDE", "notEmpty", "EMPTY_MESSAGE"),
            ],
            MODAL_COMMAND_EDIT: [
                Validation.build({domain})("NAME_COMMANDE", "notEmpty", "EMPTY_MESSAGE"),
            ],
        });

        VALIDATION.add("PRICE_COMMANDE", {
            MODAL_COMMAND_CREATE: [
                Validation.build({domain})("PRICE_COMMANDE", "notEmpty", "EMPTY_MESSAGE"),
            ],
            MODAL_COMMAND_EDIT: [
                Validation.build({domain})("PRICE_COMMANDE", "notEmpty", "EMPTY_MESSAGE"),
            ],
        });
        
        VALIDATION.add("QUANTITY", {
            MODAL_COMMAND_CREATE: [
                Validation.build({domain})("QUANTITY", "notEmpty", "EMPTY_MESSAGE"),
            ],
            MODAL_COMMAND_EDIT: [
                Validation.build({domain})("QUANTITY", "notEmpty", "EMPTY_MESSAGE"),
            ],
        });
        
        VALIDATION.add("STATUS", {
            MODAL_COMMAND_CREATE: [
                Validation.build({domain})("STATUS", "notEmpty", "EMPTY_MESSAGE"),
            ],
            MODAL_COMMAND_EDIT: [
                Validation.build({domain})("STATUS", "notEmpty", "EMPTY_MESSAGE"),
            ],
        });
        
        VALIDATION.add("PRODUCT", {
            MODAL_COMMAND_CREATE: [
                Validation.build({domain})("PRODUCT", "notEmptySelect", "INVALID_MESSAGE"),
            ],
            MODAL_COMMAND_EDIT: [
                Validation.build({domain})("PRODUCT", "notEmptySelect", "INVALID_MESSAGE"),
            ],
        });
        
    }
}
export { FIELD_VALIDATION };