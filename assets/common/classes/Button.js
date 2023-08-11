import { getIndex, getData, subscribe } from "tools/indexation/indexation.js";

class Button{
	init = () =>{};
	always = () =>{};
	onSuccess = () =>{};
	onFailure = () =>{};

	text;
	required_fields=[];

	static create(params = {}){
		var {
			BUTTON, 
			required_fields, 
			domain = "DEFAULT"
		} = params;

		var button = new Button();
		button.text = BUTTON.TEXT[domain];
		button.required_fields = required_fields;

		if(!button.text){
			button.text = BUTTON.TEXT["DEFAULT"];
		}

        return button
	}
	handleValidation(event) {
		event.preventDefault();

		var isValid = true;

		this.required_fields.map((field) => {
			field.validationsCheck()
			isValid = isValid && field.isValid;
		})

		this.instance.refresh();

		var params = {
			isValid,
			fields: this.required_fields,
		}

		this.always(params);

		if (!isValid) {
			this.onFailure(params);
			return;
		}

		this.onSuccess(params);
	}
}

export default Button