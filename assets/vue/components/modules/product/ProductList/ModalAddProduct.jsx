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

export default C.make({
    ...Components.getMethods(),
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
				<div
					class="alert alert-warning alert-dismissible fade show"
					role="alert"
				>
					{message}
					<button
						type="button"
						class="close"
						data-dismiss="alert"
						aria-label="Close"
					>
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
			);
		}
	},

	handleValid(event) {
		event.preventDefault();
		var { data = {} } = this.config;
		this.config.message = null;
		this.showLoading();
		var then = (result) => {
			if (result.status == 200) {
				getConfig().components.datatable.isLoading = true;
				this.hide()
				getConfig().components.instance.refresh()
				api.load({then:(result) =>{
					getConfig().components.data = result
					getConfig().components.datatable.isLoading = false;
					getConfig().components.instance.refresh()
					this.hideLoading()
				}})
			}
			else {
				this.config.message = result.message
				this.hideLoading()
				this.refresh()
			}
		}
		var params = {
			query:data,
			then
		};
		api.add(params)
	},

	handleChange(event) {
		var {currentTarget:input} = event
		var {value} = input;
		var field_name = $(input).attr("name");
		this.config.data[field_name] = value;
		this.config.message = null;
		this.refresh();
	},

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
							<h5 class="modal-title">Add Modal</h5>
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

							<form action="#">
								{this.$input(name)}
								{this.$input(price)}
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
