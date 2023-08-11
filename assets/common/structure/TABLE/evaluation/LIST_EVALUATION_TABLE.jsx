import Style from "./LIST_EVALUATION_TABLE.scss?module";

import moment from "moment";
import classNames from "classnames";

import {Datatable as Dt} from "pw-components-jsx-dev";
import {DatatableObject as Datatable} from "pw-components-jsx-dev";

import { showModal } from "common/functions/modal/modalFunction.js";

import MODAL_EVALUATION_REMOVE from "common/structure/TABLE/evaluation/modal/MODAL_EVALUATION_REMOVE.jsx";

class LIST_EVALUATION_TABLE {
	static datatable;

	static getMethods() {
		return {
    		...Dt.getMethods(),

			setupTable() {
				if(LIST_EVALUATION_TABLE.datatable){
					return LIST_EVALUATION_TABLE.datatable
				}
				
				var datatable = new Datatable();

				LIST_EVALUATION_TABLE.datatable = datatable
				datatable.instance = this;

				var showModalRemove = (line) => () => {
					var {
						buttonRemove,
					} = this.config;
					
					var modal = showModal(MODAL_EVALUATION_REMOVE, {
						buttonRemove,
						line
					});

					buttonRemove.init({
						modal,
						datatable,
					});
				}

				var renderDates = ({line={}}) => {
					var {
						date_start,
						date_end,
					} = line;

					if(date_start && date_end){
						date_start = moment(date_start, "DD/MM/YYYY").format("DD/MM");
            			date_end = moment(date_end, "DD/MM/YYYY").format("DD/MM");

						return (
							<td>
								du {date_start} au {date_end}
							</td>
						)
					}

					return <td></td>;
				}

				var renderStatus = ({col}) => {
					var text = "En cours";
					var clazz = "badge-success";

					if(col == "finalise"){
						text = "Finalisé";
						clazz = "badge-secondary";
					}
					else if(col == "edition"){
						text = "Édition";
						clazz = "badge-danger";
					}

					return (
						<td>
							<span class={classNames("badge", clazz)}>
								{text}
							</span>
						</td>
					);
				}
				
				datatable.head.fields = [
					{
						key: "title",
						text: "Nom de l’évaluation",
						render: this.orderable,
					},
                    {
						key: "affected_categories",
						text: "Catégories affectées",
						render: this.orderable,
					},
                    {
						key: "questions_nbr",
						text: "Nombre de questions",
						render: this.orderable,
					},
					{
						key: "avancement",
						text: "Avancement",
						render: this.orderable,
					},
                    {
						key: "status",
						text: "Statut",
						render: this.orderable,
						renderBody: renderStatus,
					},
                    {
						key: "dates",
						text: "Dates",
						render: this.orderable,
						renderBody: renderDates,
					},
                    {
						key: "evaluation_category",
						text: "Catégorie d’évaluation",
						render: this.orderable,
					},
					{
						text: "Actions",
						renderBody: ({ line }) => {
							return (
								<td>
                                    <div class="d-flex justify-content-center">
                                        <a href={`${window.admin_evaluations_edition}/${line.id}`}
                                            class="btn btn-info ml-2"
                                        >
                                            Modifier
                                        </a>
                                        <span
                                            class="btn btn-danger ml-2"
                                            onClick={showModalRemove(line)}
                                        >
                                            Supprimer
                                        </span>
								    </div>
                                </td>
							);
						},
					},
				];

				datatable.body.data = [];
				datatable.activePage = 1;
				datatable.pagination = 5;
				datatable.url = window.admin_api_evaluations_liste;

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

export default LIST_EVALUATION_TABLE;
