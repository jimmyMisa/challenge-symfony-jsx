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

	$render() {
		var { 
            buttonCreate:button,
            modalCreateFields:fields,
        } = this.config;

        var {
        	name,
            price,
        } = fields;

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
				data-backdrop="static"
			>
				<div class="modal-dialog" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<h5 class="modal-title">Ajout du produit</h5>
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
									{this.$input(name)}
								</div>
								<div class="mb-3">
									{this.$input(price)}
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
