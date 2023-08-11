import { C } from "vue/helper/V02Component.jsx";
import classNames from "classnames";
import { 
    PwLoading,
    PwButton,
} from "pw-components-jsx-dev";
import { ModalMethod } from 'classes/ModalMethod.js';
import { CommandApi as api } from "modules/command/CommandApi.js";
import { getConfig } from "modules/command/commandConfig.js";

export default C.make({
	...ModalMethod.getMethodsJsx(),

	showLoading() {
		this.config.loading = true;
		this.refresh();
	},

	hideLoading() {
		this.config.loading = false;
		this.refresh();
	},

	renderFormFeedbackMessage() {
		var { message = null } = this.config
		if (message) {
			return (
				<div class="alert alert-warning alert-dismissible fade show" role="alert">
				  {message}
				  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
				    <span aria-hidden="true">&times;</span>
				  </button>
				</div>
			)
		}
	},

	handleValid(event) {
		event.preventDefault();
		var { 
			line = {} 
		} = this.config;
		var { id = null } = line
		this.showLoading();
		var data = {
			id
		};
		var then = (result) => {
			if (result && result.status == 200) {
				this.hide()
				getConfig().components.datatable.isLoading = true;
				getConfig().components.instance.refresh()
				api.load({then:(result) =>{
					getConfig().components.datatable.isLoading = false;
					getConfig().components.data = result.commands;
					getConfig().components.products = result.products;
					getConfig().components.instance.refresh()
					this.hideLoading()
				}})
			}

			if (
				result && result.status == 500
			) {
				this.config.message = result.message;
				this.hideLoading()
				this.refresh()
			}
		};

		var params = {
			query:data,
			then
		};
		api.remove(params);
	},

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
							<h5 class="modal-title">Suppression de la commande</h5>
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
