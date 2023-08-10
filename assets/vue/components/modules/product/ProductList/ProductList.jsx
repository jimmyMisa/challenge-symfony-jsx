import { C } from "vue/helper/V02Component.jsx";
import classNames from "classnames";

import { Table } from "vue/components/modules/common/Table/Table.jsx";

export default C.make({
	...Table.getMethods(),
	tableEventEdit(params){
		return (event) =>{
			alert(params.line.id)
		}
	},
	tableEventRemove(params){
		return (event) =>{
			alert(`Removing ${params.line.id}`)
		}
	},
	tableEventAdd(event){
		//TODO show modal open
	},
	renderTableTop(){
		return (
			<div>
				<button type="button" onClick={this.tableEventAdd}>
					Ajouter
				</button>
			</div>
		)
	},
	$render(h, instance) {
		return (
			<div>
				{this.renderTable()}
			</div>
		);
	},
});