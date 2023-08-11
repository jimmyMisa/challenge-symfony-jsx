class ModalMethod {
	static getMethodsJsx() {
		return {
			show() {
				var { modal } = this.$refs;
				$(modal).modal("show")
			},
			hide() {
				var { modal } = this.$refs;
				$(modal).modal("hide")
			},
		}
	}
}

export {
	ModalMethod
}