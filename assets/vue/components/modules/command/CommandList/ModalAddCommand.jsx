import { C } from "vue/helper/V02Component.jsx";
import classNames from "classnames";
import { 
    PwLoading,
    PwButton,
} from "pw-components-jsx-dev";
import { ModalMethod } from 'classes/ModalMethod.js';
import { CommandApi as api } from "modules/command/CommandApi.js";
import { getConfig } from "modules/command/commandConfig.js";
import Components from "common/classes/Components.jsx";

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
				this.hide()
				getConfig().components.datatable.isLoading = true;
				getConfig().components.instance.refresh()
				api.load({then:(result) =>{
					getConfig().components.data = result.commands;
					getConfig().components.datatable.isLoading = false;
					getConfig().components.products = result.products;
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

	handleChangeSelect(event) {
		var {currentTarget:select} = event
		var {value} = select;
		var field_name = $(select).attr("name");
		this.config.data[field_name] = value;
		this.config.message = null;
		this.refresh();
	},
	getProducts(){
		var { products = [] } = this.config;
		var array = [];
		products.map((product) => {
			array.push(<option value={product.id}>{product.name}</option>)
		})

		return array;
	},

	$render() {
		var { 
            buttonCreate:button,
            modalCreateFields:fields,
            products,
        } = this.config;

        var {
        	name,
            price,
            quantity,
            status,
            product,
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
							<h5 class="modal-title">Ajout de la commande</h5>
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

							<form action="#" id="form_add_command">
								<div class="mb-3">
									{this.$input(name)}
								</div>
								<div class="mb-3">
									{this.$input(price)}
								</div>
								<div class="mb-3">
									{this.$input(quantity)}
								</div>
								<div class="mb-3">
									{this.$input(status)}
								</div>
								<div class="mb-3">
									{this.$select(product,()=>{},{
										selectOption: {
											dropdownParent: $("#form_add_command")
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
