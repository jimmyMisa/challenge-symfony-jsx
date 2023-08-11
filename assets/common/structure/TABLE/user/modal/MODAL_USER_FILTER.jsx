import { C } from "vue/helper/V01Component.jsx";

import classNames from "classnames";
import Components from "common/classes/Components.jsx";

import { PwModalMethodes } from "common/functions/modal/PwModalMethodes.jsx";

export default C.make({
    ...Components.getMethods(),
	...PwModalMethodes.getMethodsJsx(),
	
	$render() {
        var {
            modalFilterFields: fields,
            datatable,
        } = this.config;

        var {
        	category
        } = fields

        var applyFilter = () => {
        	var categoryInstance = category;
        	var run = () =>{
	            var category = categoryInstance.value;
	            var subcategory = $('[name="mf_subcategory"]').val();

	            var filters = [];

	            if (category && category.length) {
	                filters.push({ category });
	            }

	            if (subcategory && subcategory.length) {
	                filters.push({ subcategory });
	            }

	            datatable.activePage = 1;
	            datatable.filters = json_encode(filters);
	            datatable.load();

	            hideModalFilter();
        	}

        	run()
        };

        var hideModalFilter = () => {
        	this.$$$hide();
        };

		return (
			<div class="modal fade" ref="modal" tabindex="-1" role="dialog" aria-hidden="true">
			  <div class="modal-dialog" role="document">
			    <div class="modal-content">
			      <div class="modal-header">
			        <h5 class="modal-title">Filtrage</h5>
			        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
			          <span aria-hidden="true">&times;</span>
			        </button>
			      </div>
			      <div class="modal-body">
			        <form action="#">
                        <div class="my-1">
                        	{this.$select(category)}
                        </div>
                        <div class="my-1">
                            <label
                                class="mr-sm-2"
                                for="inlineFormCustomSelect"
                            >
                                Sous-catégorie
                            </label>
                            <select
                                ref="mf_subcategory"
                                class="custom-select mr-sm-2"
                                name="mf_subcategory"
                            >
                                <option value="">
                                    Tous les sous-catégories
                                </option>
                                <option value="id-sub-category-1">
                                    Maths
                                </option>
                                <option value="id-sub-category-2">
                                    A
                                </option>
                                <option value="id-sub-category-3">
                                    B
                                </option>
                            </select>
                        </div>
			        </form>
			      </div>
			      <div class="modal-footer">
			        <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>
                    <button
                        type="button"
                        class="btn btn-primary"
                        onClick={applyFilter}
                    >
                        Filtrer
                    </button>
			      </div>
			    </div>
			  </div>
			</div>
		);
	},
});