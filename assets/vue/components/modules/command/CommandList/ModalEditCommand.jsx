import { C } from "vue/helper/V02Component.jsx";
import classNames from "classnames";
import { 
    PwLoading,
    PwButton,
} from "pw-components-jsx-dev";
import { getConfig } from "modules/command/commandConfig.js";
import Components from "common/classes/Components.jsx";
import { ModalMethod } from 'common/functions/modal/ModalMethod.jsx';

export default C.make({
    ...Components.getMethods(),
	...ModalMethod.getMethodsJsx(),

	onReady() {
		var { ready = false } = this.config;
		if (!ready) {
			this.config.ready = true;
		}
	},

	$render() {
        var { 
            line,
            buttonEdit: button,
            modalEditFields: fields,
        } = this.config;

        this.onReady();

        var { 
			price,
			name,
			quantity,
			status,
			product,
        } = fields;

        button.line = line;

        this.$setRenderIndex();

		
        var set = (key, is_select=false) => {
            return ({ element }) => {
                if (this.$getRenderIndex() > 1) {
                    return true;
                }
                element.value = line[key];
                fields[key].isValid = true;
                fields[key].errorMessage = "";
                fields[key].value = element.value;
                if (is_select && element.setValue) {
                	setTimeout(()=>{
                		element.setValue(line[key])
                	},500)
                }
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
							<h5 class="modal-title">Modification de la commande</h5>
							<button
								type="button"
								class="btn-close"
								data-dismiss="modal"
								aria-label="Close"
								onClick={this.hide}
							>
							</button>
						</div>
						<div class="modal-body">
                            <div class="text-center w-100">
                                {renderError()}
                            </div>
                            <form action="#" id="form_edit_command">
	                            <div class="mb-3">
									{this.$input(name, set("name"))}
								</div>
								<div class="mb-3">
									{this.$input(price, set("price"))}
								</div>
								<div class="mb-3">
									{this.$input(quantity, set("quantity"))}
								</div>
								<div class="mb-3">
									{this.$input(status, set("status"))}
								</div>
								<div class="mb-3">
									{this.$select(product, set("product",true), {
										selectOption: {
											dropdownParent: $("#form_edit_command")
										}
									})}
								</div>
                            </form>
						</div>
						<div class="modal-footer">
                            <button
                                type="button"
                                class="btn btn-secondary"
                                data-dismiss="modal"
								onClick={this.hide}
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
