import {
    LIMITATION,
    Limitation
} from "pw-components-js-dev"

class FIELD_LIMITATION {
	static init() {
		LIMITATION.add("NAME", [
			{
				verification: Limitation.get("max")(255),
			},
		]);

		LIMITATION.add("PRICE", [
			{
				verification: Limitation.get("max")(5),
			},
		]);
		LIMITATION.add("NAME_COMMANDE", [
			{
				verification: Limitation.get("max")(255),
			},
		]);
		LIMITATION.add("STATUS", [
			{
				verification: Limitation.get("max")(255),
			},
		]);
		LIMITATION.add("PRICE_COMMANDE", [
			{
				verification: Limitation.get("max")(5),
			},
		]);
		LIMITATION.add("QUANTITY", [
			{
				verification: Limitation.get("max")(5),
			},
		]);
        LIMITATION.add("PRODUCT", []);
	}
}

export { FIELD_LIMITATION };
