import { setChildView } from "vue/helper/renderVue";

function showModal(component, config) {
	var { onShow=() => {}} = config
	setChildView(
		"#app_modal_wrapper", 
		component, 
		config
	);
	config.instance.show();
	onShow(config.instance)
	return config.instance;
}

export {
	showModal
}