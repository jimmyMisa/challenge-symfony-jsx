import { C } from "vue/helper/V02Component.jsx";
import classNames from "classnames";
import style from "./PwSelect.scss?modules";

export default C.make({

	initSelect2() {
		var { $config } = this;
		var {
			showSearchBar = true,
			selectOption = {}
		} = $config;
		var { select } = this.$refs;

		var selectConfig = {
			//width: "400px",
			selectionCssClass: "pw_select2",
			dropdownCssClass: "pw_select2",
			
		}

		if(!showSearchBar){
			selectConfig.minimumResultsForSearch = -1;
		}
		selectConfig = {...selectConfig, ...selectOption}

		$(select).select2(selectConfig);

		$(select).off("select2:select");
		$(select).off("select2:unselect");
		$(select).off("select2:clear");
		$(select).on("select2:select", this.handleSelect2);
		$(select).on("select2:unselect", this.handleSelect2);
		$(select).on("select2:clear", this.handleSelect2);
	},

	reinit(){
		var { select } = this.$refs;
		setTimeout(() =>{

			this.setValue(this.getValue());
			$(select).select2("destroy");
			this.initSelect2();

		},100)
	},

	handleSelect2(event) {
		var { $config } = this;
		var {
			params = {},
			name = "",
			value = "",
			onChange = () => {},
			setValue = () => {},
			className,
			isDirect = false,
		} = $config;

		var { select } = this.$refs;
		var value = $(select).val(); // recuperation value
		
		this.setValue(value);
		if(isDirect){
			return onChange(event)
		}
		onChange({value, event, instance: this})
	},

	setValue(value) {
		var { $config } = this;
		var {
			setValue = () => {},
		} = $config;

		var { select } = this.$refs;
		$(select).val(value);
		$(select).trigger('change');
		setValue({value:$(select).val(), instance: this})
	},

	getValue(){
		var { select } = this.$refs;
		return $(select).val();
	},


	onReady() {
		var { ready = false } = this.getData();
		if (!ready) {
			ready = true;
			this.getData().ready = ready;
			setTimeout(() => {
				this.initSelect2();
				var {value } = this.$config
				setTimeout(() =>{

					this.setValue(value);
					this.reinit();
				},100)
			}, 100);
		}
	},
	
	$render() {
		this.onReady()

		var { $config } = this;
		var {
			params = {},
			name = "",
			options = [],
			onRender = () => {},
			className,
			multiple = false,
		} = $config;
		onRender(this)

		var optionsElements = () => {
			return options.map((option = {}, index) => {
				var { value, content, params = {}, selected=false } = option;
				return (
					<option 
						value={value}
						selected={selected ? "selected": ""}
						{...params}
					>
						{content}
					</option>
				)
			})
		}

		return (
			<select
				ref="select"
				name={name}
				class={classNames("pw_select", className)}
				multiple={multiple}
				{...params}
			>
				{optionsElements()}
			</select>
		);

	},
});
