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
		var { message = null } = this.config;
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
		var { line = {}, data = {} } = this.config;
		var { id = null } = line;
		data.id = id;
		this.config.message = null;
		this.showLoading();
		var then = (result) => {
			if (result && result.status == 200) {
				getConfig().components.datatable.isLoading = true;
				getConfig().components.instance.refresh()
				this.hide()
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
		};
		var params = {
			query:data,
			then
		};
		api.edit(params)
	},

	onReady() {
		var { ready = false } = this.config;
		if (!ready) {
			this.config.ready = true;
		}
	},

	handleChange(event) {
		event.preventDefault();
		var { data = {} } = this.config;
		this.config.data = data;
		var {currentTarget:input} = event
		var {value} = input;
		var field_name = $(input).attr("name");
		data[field_name] = value;
		this.config.message = null;
		this.refresh();
	},
	handleChangeSelect(event) {
		var {currentTarget:select} = event
		var {value} = select;
		var field_name = $(select).attr("name");
		this.config.data[field_name] = [value];
		this.config.message = null;
		this.refresh();
	},
	getSelected(product, product_command_ids){
		var selected = "";
		if (
			product_command_ids && 
			product_command_ids.includes(product.id)
		) {
			selected = "selected"
		}
		return selected
	},
	getProducts(){
		var { products = [], line = {} } = this.config;

		var { product_command_ids=[] } = line;
		var array = [];
		products.map((product) => {
			var selected=this.getSelected(product, product_command_ids)
			array.push(<option value={product.id} selected={selected}>{product.name}</option>)
		})

		return array;
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
							<h5 class="modal-title">Update Modal</h5>
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
                            <form action="#" id="form_edit_command">
								{this.$input(name, set("name"))}
								{this.$input(price, set("price"))}
								{this.$input(quantity, set("quantity"))}
								{this.$input(status, set("status"))}
								{this.$select(product, set("product",true), {
									selectOption: {
										dropdownParent: $("#form_edit_command")
									}
								})}
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
