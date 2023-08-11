import { C } from "vue/helper/V01Component.jsx";

import classNames from "classnames";
import Components from "common/classes/Components.jsx";

import { PwModalMethodes } from "common/functions/modal/PwModalMethodes.jsx";

export default C.make({
    ...Components.getMethods(),
	...PwModalMethodes.getMethodsJsx(),
	
	$render() {
        var {
            buttonCreate:button,
            fieldCreate:fields,
        } = this.config;

        var {
        	firstname,
            lastname,
            email,
            phone,
            password,
            confirmPassword
        } = fields
		
		return (
			<div class="modal fade" ref="modal" tabindex="-1" role="dialog" aria-hidden="true">
			  <div class="modal-dialog" role="document">
			    <div class="modal-content">
			      <div class="modal-header">
			        <h5 class="modal-title">Ajouter un utilisateur</h5>
			        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
			          <span aria-hidden="true">&times;</span>
			        </button>
			      </div>
			      <div class="modal-body">
			        <form action="#">
                        {this.$input(lastname)}
                        {this.$input(firstname)}
                        {this.$phone(phone)}
                        {this.$input(email)}
                        {this.$password(password)}
                        {this.$password(confirmPassword)}
			        </form>
			      </div>
			      <div class="modal-footer">
			        <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>
			        
                    {this.$button(button)}
			      </div>
			    </div>
			  </div>
			</div>
		);
	},
});