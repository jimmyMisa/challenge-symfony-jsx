import { C } from "vue/helper/V02Component.jsx";
import classNames from "classnames";
import { 
    PwLoading,
    PwButton,
    Components
} from "pw-components-jsx-dev";
import { ModalMethod } from 'classes/ModalMethod.js';
import { ProductApi as api } from "modules/product/ProductApi.js";
import { getConfig } from "modules/product/productConfig.js";
import { getPageText } from "common/functions/getPage.js"

export default C.make({
	...ModalMethod.getMethodsJsx(),
    ...Components.getMethods(),

	onReady() {
		var { ready = false } = this.config;
		if (!ready) {
			this.config.ready = true;
		}
	},

	$render() {
		this.onReady();
        var { 
            line,
            buttonRemove: button,
        } = this.config;

        var { 
            name, 
        } = line;

        button.line = line;

        this.$setRenderIndex();

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
        var renderCorfirm = () => {
            var text = getPageText({
                page: "PRODUIT_LISTE",
                prop: "CONFIRM_REMOVE",
            });

            return (
                <span>{text} {name} ?</span>
            )
        }

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
                            <h5 class="modal-title">Supprimer un produit</h5>
							<button
								type="button"
								class="close"
								data-dismiss="modal"
								aria-label="Close"
								onClick={this.hide}
							>
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body">
                            <div class="text-center w-100">
                                {renderError()}
                            </div>
                            <div class="text-center w-100">
                                {renderCorfirm()}
                            </div>
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
								hasConfig: true
							}} 
						/>
					</div>
				</div>
			</div>
		);
	},
});
