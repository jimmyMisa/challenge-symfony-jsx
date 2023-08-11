import { C } from "vue/helper/V01Component.jsx";

import classNames from "classnames";
import Components from "common/classes/Components.jsx";

import { PwLoading } from "pw-components-jsx-dev";
import { PwModalMethodes } from "common/functions/modal/PwModalMethodes.jsx";

export default C.make({
    ...Components.getMethods(),
    ...PwModalMethodes.getMethodsJsx(),

    $render() {
        var { 
            line,
            buttonEdit: button,
            modalEditFields: fields,
        } = this.config;

        var { 
            lastname, 
            firstname, 
            phone,
        } = fields;

        button.line = line;

        this.$setRenderIndex();

        var set = (key) => {
            return ({ element }) => {
                if (this.$getRenderIndex() > 1) {
                    return true;
                }
                element.value = line[key];
                fields[key].isValid = true;
                fields[key].errorMessage = "";
                fields[key].value = element.value;
            };
        };

        var renderError = () => {
            if(button.error){
                return (
                    <div class="alert alert-warning f_17 py-2" role="alert">
                        {button.error}
                    </div>
                )
            }
    
            return null;
        };

        return (
            <div
                class="modal fade"
                ref="modal"
                tabindex="-1"
                role="dialog"
                aria-hidden="true"
            >
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                    
                        <div class="modal-header">
                            <h5 class="modal-title">Modifier un utilisateur</h5>
                            <button
                                type="button"
                                class="close"
                                data-dismiss="modal"
                                aria-label="Close"
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="text-center w-100">
                                {renderError()}
                            </div>

                            <form action="#">
                                {this.$input(lastname, set("lastname"))}
                                {this.$input(firstname, set("firstname"))}
                                {this.$phone(phone, set("phone"))}
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button
                                type="button"
                                class="btn btn-secondary"
                                data-dismiss="modal"
                            >
                                Fermer
                            </button>

                            {this.$button(button)}
                        </div>
                        <PwLoading
                            config={{
                                isVisible: button.loading,
                                hasConfig: true,
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    },
});
