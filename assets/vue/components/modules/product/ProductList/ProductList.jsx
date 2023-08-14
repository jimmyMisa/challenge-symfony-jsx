import { C } from "vue/helper/V02Component.jsx";
import classNames from "classnames";

import { Table } from "vue/components/modules/common/Table/Table.jsx";
import ModalAddProduct from "./ModalAddProduct.jsx";
import ModalEditProduct from "./ModalEditProduct.jsx";
import ModalRemoveProduct from "./ModalRemoveProduct.jsx";
import { 
    PwLoading
} from "pw-components-jsx-dev";
import { showModal } from "common/functions/modal/modal_function.js";

export default C.make({
	...Table.getMethods(),
	tableEventEdit(params){
		return (event) =>{
			var {line={}}  = params
			var {
				modalEditFields,
				buttonEdit,
			} = this.config;

			var config = {
				line,
				modalEditFields,
				buttonEdit
			};
			var modal = showModal(ModalEditProduct, config);
			buttonEdit.init({
				modal
			});
		}
	},
	tableEventRemove(params){
		return (event) =>{
			var {line={}}  = params
			var {
				buttonRemove,
			} = this.config;

			var config = {
				buttonRemove,
				line
			};
			var modal = showModal(ModalRemoveProduct, config);
			buttonRemove.init({
				modal
			});
		}
	},
	tableEventAdd(event){
		event.preventDefault();
        var {
            buttonCreate,
            modalCreateFields,
        } = this.config;
		var config = {
            buttonCreate,
            modalCreateFields,
		}
		var modal = showModal(ModalAddProduct, config);
        buttonCreate.init({
            modal
        });
	},
	renderTableBodyAction(params={}) {
		var {line, index} = params
		return (
			<td class="text-center">
				<button 
					type="button" 
					onClick={this.tableEvent("Edit", {line, index})}
					class="btn btn-success mx-2"
				>
					Modifier
				</button>
				<button 
					type="button" 
					onClick={this.tableEvent("Remove", {line, index})}
					class="btn btn-danger mx-2"
				>
					Supprimer
				</button>
			</td>
		);
	},
	renderTableBodyValue(value, line, field){
		return (
			<td class="text-center">
				{value}
			</td>
		)
	},
	renderTableTop(){
		return (
			<div class="form-group mb-2">
                <button
                    type="button"
                    class="btn btn-primary"
                    onClick={this.tableEventAdd}
                >
                	Ajouter
                </button>
			</div>
		)
	},
	$render(h, instance) {
		var {config={}} = this
		var {datatable={}} = config
		var {isLoading=false} = datatable;
		this.config.datatable = datatable;
		return (
            <div class={classNames("w-100")}>
                <div class="row">
                    <div class="col-12">
                        <div class="position-relative">
							{this.renderTable()}
                            <PwLoading
                                ref="loading"
                                config={{
                                    isVisible: datatable.isLoading,
                                    hasConfig:true
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
		);
	},
});