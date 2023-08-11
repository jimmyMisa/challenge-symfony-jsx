import classNames from "classnames";
import ComponentsStyle from "./Components.scss?module";
import {waitInput, idGenerator} from "pw-components-core-dev";
import {PwInput, PwSelect, PwButton} from "pw-components-jsx-dev";

class Components {
	static getMethods() {
		return {
			$resetRenderIndex(){
		        this.config.renderIndex = 0;
			},
			$setRenderIndex(){
		        if(!this.config.renderIndex){
		        	this.config.renderIndex = 0
		        }
		        this.config.renderIndex = this.config.renderIndex + 1
			},
			$getRenderIndex(){
				return this.config.renderIndex;
			},
			$setupInstance(elements){
				elements.map((element) =>{
					element.instance = this;
				})
			},
			$input(field, callback = () =>{}) {
				this.$setupInstance([field])
				var id = idGenerator();
				setTimeout(() =>{
					var {[id]:element} = this.$refs 
					callback({element})
				}, 100)
				return (
					<div class="form-group">
						<label class="pw_input">
							{field.label}
							<input
								data-jid={field.id}
								ref={id}
								type={field.type}
								placeholder={field.placeholder}
								name={field.name}
								required={field.required}
								class="pw_input form-control"
								onInput={field.checkValidation.bind(field)}
								onPaste={field.checkRestriction.bind(field)}
								onKeypress={field.checkRestriction.bind(field)}
							/>
						</label>

						<span
							class={classNames(
								"form_feedback_error",
								field.isValid
									? "d-none"
									: "invalid-feedback d-block"
							)}
						>
							{field.errorMessage}
						</span>
					</div>
				);
			},
			$phone(field, callback = () =>{}) {
				this.$setupInstance([field])
				var id = idGenerator();
				setTimeout(() =>{
					var {[id]:element={}} = this.$refs 
					if(element.$refs && element.$refs.input){
						callback({element:element.$refs.input})
					}
				}, 100)
				return (
					<div class="form-group">
						<label class="pw_input">
							{field.label}
							<PwInput
								ref={id}
							    config={{
							        mask: "phone",
									placeholder:field.placeholder,
									name:field.name,
									required:field.required,
									className:"pw_input form-control",

							        isDirect:true,
									onInput:field.checkValidation.bind(field),
									onPaste:field.checkRestriction.bind(field),
									onKeypress:field.checkRestriction.bind(field),
									onRender:(instance) =>{
										field.component = instance
									},
							        params: {
							            attrs: {
							                "data-jid":field.id
							            },
							        },
							    }}
							/>
						</label>

						<span
							class={classNames(
								"form_feedback_error",
								field.isValid
									? "d-none"
									: "invalid-feedback d-block"
							)}
						>
							{field.errorMessage}
						</span>
					</div>
				);
			},
			$select(field, callback = () =>{}, customParams={}) {
				this.$setupInstance([field])
				var id = idGenerator();
				setTimeout(() =>{
					var {[id]:element} = this.$refs 
					callback({element})
				}, 100)
				return (
					<div class="form-group">
						<label class="pw_input">
							{field.label}
							<PwSelect
								ref={id}
							    config={{
							        mask: "phone",
									placeholder:field.placeholder,
									name:field.name,
									required:field.required,
									className:"pw_input form-control",

							        isDirect:true,
									onChange:field.checkValidation.bind(field),
									onRender:(instance) =>{
										field.component = instance
									},
									options: field.options,
							        params: {
							            attrs: {
							                "data-jid":field.id
							            },
							        },
									...customParams,
							    }}
							/>
						</label>

						<span
							class={classNames(
								"form_feedback_error",
								field.isValid
									? "d-none"
									: "invalid-feedback d-block"
							)}
						>
							{field.errorMessage}
						</span>
					</div>
				);
			},
			$search(field) {
				this.$setupInstance([field])
				var onSearch = (event) =>{
					var {currentTarget:input} = event
					waitInput(input, () =>{
						var {value} = input
						var {onSearch} = field
						onSearch({value, event, input})
					}, 100)
				}
				return (
					<div class="form-group">
						<label class="pw_input">
							{field.label}
							<input
								data-jid={field.id}
								type={field.type}
								placeholder={field.placeholder}
								name={field.name}
								required={field.required}
								class="pw_input form-control"
								onInput={onSearch}
								onPaste={onSearch}
								onKeypress={onSearch}
							/>
						</label>

						<span
							class={classNames(
								"form_feedback_error",
								field.isValid
									? "d-none"
									: "invalid-feedback d-block"
							)}
						>
							{field.errorMessage}
						</span>
					</div>
				);
			},
			$password(field) {
				this.$setupInstance([field])
				if (field.switchType === undefined) {
					field.switchType = "text";
				}
				var onClickEye = () => {
					var t = field.switchType;
					field.switchType = field.type;
					field.type = t;
					field.instance.refresh();
				};
				var eye = () => {
					if (field.type == "password") {
						return (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="feather feather-eye"
							>
								<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
								<circle cx="12" cy="12" r="3"></circle>
							</svg>
						);
					}
					return (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="feather feather-eye-off"
						>
							<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
							<line x1="1" y1="1" x2="23" y2="23"></line>
						</svg>
					);
				};
				return (
					<div class="form-group">
						<label class="pw_input field_pwd">
							{field.label}
							<input
								data-jid={field.id}
								type={field.type}
								placeholder={field.placeholder}
								name={field.name}
								required={field.required}
								class="pw_input form-control"
								onInput={field.checkValidation.bind(field)}
								onPaste={field.checkRestriction.bind(field)}
								onKeypress={field.checkRestriction.bind(field)}
							/>
							<span class="eye" onClick={onClickEye}>
								{eye()}
							</span>
						</label>

						<span
							class={classNames(
								"form_feedback_error",
								field.isValid
									? "d-none"
									: "invalid-feedback d-block"
							)}
						>
							{field.errorMessage}
						</span>
					</div>
				);
			},
			$button(button) {
				this.$setupInstance([button])
				return (
					<div class="form-group">
						<PwButton
		                    config={{
		                    	className: "btn btn-primary",
		                        content: button.text,
		                        onClick: button.handleValidation.bind(button),
		                    }}
		                />
					</div>
				)
			},
		};
	}
}

export default Components;
