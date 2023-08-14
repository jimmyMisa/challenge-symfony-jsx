import { C } from "vue/helper/V02Component.jsx";
import classNames from "classnames";
import { 
    PwLoading,
    PwButton
} from "pw-components-jsx-dev";
import { getConfig } from "modules/product/productConfig.js";
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

        var { 
            price, 
            name, 
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
							<h5 class="modal-title">Modification du produit</h5>
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
                            <form action="#">
								<div class="mb-3">
                                	{this.$input(price, set("price"))}
								</div>
								<div class="mb-3">
                                	{this.$input(name, set("name"))}
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
