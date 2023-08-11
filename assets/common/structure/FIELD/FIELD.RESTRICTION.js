import {
    RESTRICTION,
    Restriction,
} from "pw-components-js-dev"

class FIELD_RESTRICTION {

	static setupRestrictions() {
		Restriction.add("onlyNumber", () =>{
			return (event) => {
				if (48 <= event.keyCode && event.keyCode <= 57) {
					return true;
				}
				event.preventDefault();
			}
		})
	}

	static init() {
		FIELD_RESTRICTION.setupRestrictions();
		RESTRICTION.add("NAME", []);
		RESTRICTION.add("PRICE", [
			{
				verification: Restriction.get("onlyNumber")(),
			},
		]);

        RESTRICTION.add("NAME_COMMANDE", []);
        RESTRICTION.add("PRICE_COMMANDE", [
			{
				verification: Restriction.get("onlyNumber")(),
			}
		]);
        RESTRICTION.add("QUANTITY", [
			{
				verification: Restriction.get("onlyNumber")(),
			}
		]);
        RESTRICTION.add("STATUS", []);
        RESTRICTION.add("PRODUCT", []);
	}
}

export { FIELD_RESTRICTION };
