import Style from "./LIST_USER_TABLE.scss?module";
import classNames from "classnames";

import {Datatable as Dt} from "pw-components-jsx-dev";
import {DatatableObject as Datatable} from "pw-components-jsx-dev";

import { showModal } from "common/functions/modal/modalFunction.js";

import MODAL_USER_EDIT from "common/structure/TABLE/user/modal/MODAL_USER_EDIT.jsx";
import MODAL_USER_REMOVE from "common/structure/TABLE/user/modal/MODAL_USER_REMOVE.jsx";

class LIST_USER_TABLE {
	static datatable;

	static getMethods() {
		return {
    		...Dt.getMethods(),

			setupTable() {
				if(LIST_USER_TABLE.datatable){
					return LIST_USER_TABLE.datatable
				}
				
				var datatable = new Datatable();

				LIST_USER_TABLE.datatable = datatable
				datatable.instance = this;

				var showModalEdit = (line) => () => {
					var {
						modalEditFields,
						buttonEdit,
					} = this.config;
					
					var modal = showModal(MODAL_USER_EDIT, {
						modalEditFields,
						buttonEdit,
						line
					});
	
					buttonEdit.init({
						modal,
						datatable,
					});
				}

				var showModalRemove = (line) => () => {
					var {
						buttonRemove,
					} = this.config;
					
					var modal = showModal(MODAL_USER_REMOVE, {
						buttonRemove,
						line
					});

					buttonRemove.init({
						modal,
						datatable,
					});
				}
				
				datatable.head.fields = [
					{
						key: "firstname",
						text: "Prénom",
						render: this.orderable,
					},
					{
						key: "email",
						text: "Email",
						render: this.orderable,
					},
					{
						key: "phone",
						text: <u>phone</u>,
						render:this.orderable
					},
					{
						text: "Actions",
						renderBody: ({ line }) => {
							return (
								<td class="d-flex justify-content-center">
									<a href={`${window.admin_utilisateurs_fiche}/${line.id}`}
										class="btn btn-info ml-2"
									>
										Voir
									</a>
									<span
										class="btn btn-primary ml-2"
										onClick={showModalEdit(line)}
									>
										Modifier
									</span>
									<span
										class="btn btn-danger ml-2"
										onClick={showModalRemove(line)}
									>
										Supprimer
									</span>
								</td>
							);
						},
					},
				];

				datatable.body.data = [];
				datatable.activePage = 1;
				datatable.pagination = 5;
				datatable.url = window.test_api_listing;

				datatable.render = ({ Style:Stl, head, body }) => {
					return (
						<table class={classNames(Stl.table, Style.table)}>
							{head()}
							{body()}
						</table>
					);	
				}

				return datatable;
			},
		};
	}
}

export default LIST_USER_TABLE;
