import STRUCTURE from "common/structure/FIELD/FIELD.STRUCTURE.js"

class FIELD{
	static NAME = {
		...STRUCTURE.NAME,
		PLACEHOLDER:{
			DEFAULT:"Ny anaran'ny vokatra",
			BO:"Ny anaran'ny vokatra",
		},
		LABEL:{
			DEFAULT:"Ampidiro ny anaran'ny vokatra",
			BO:"Ampidiro ny anaran'ny vokatra",
		},
		EMPTY_MESSAGE:{
			DEFAULT:"Ampidiro azafady ny anaran'ny vokatra",
			BO:"Ampidiro azafady ny anaran'ny vokatra"
		},
	}
	static PRICE = {
		...STRUCTURE.PRICE,
		PLACEHOLDER:{
			DEFAULT:"Vidin'ny vokatra",
			BO:"Vidin'ny vokatra",
		},
		LABEL:{
			DEFAULT:"Ampidiro ny vidin'ny vokatra",
			BO:"Ampidiro ny vidin'ny vokatra",
		},
		EMPTY_MESSAGE:{
			DEFAULT:"Ampidiro azafady ny vidin'ny vokatra",
			BO:"Ampidiro azafady ny vidin'ny vokatra"
		},
	}
	static NAME_COMMANDE = {
		...STRUCTURE.NAME_COMMANDE,
		PLACEHOLDER:{
			DEFAULT:"Ny anaran'ny kaomandy",
			BO:"Ny anaran'ny kaomandy",
		},
		LABEL:{
			DEFAULT:"Anaran'ny kaomandy",
			BO:"Anaran'ny kaomandy",
		},
		EMPTY_MESSAGE:{
			DEFAULT:"Ampidiro azafady ny anarana kaomandy",
			BO:"Ampidiro azafady ny anarana kaomandy"
		},
	}
	static PRICE_COMMANDE = {
		...STRUCTURE.PRICE_COMMANDE,
		PLACEHOLDER:{
			DEFAULT:"Vidin'ny kaomandy",
			BO:"Vidin'ny kaomandy",
		},
		LABEL:{
			DEFAULT:"Vidin'ny kaomandy",
			BO:"Vidin'ny kaomandy",
		},
		EMPTY_MESSAGE:{
			DEFAULT:"Ampidiro azafady ny vidin'ny kaomandy",
			BO:"Ampidiro azafady ny vidin'ny kaomandy"
		},
	}
	static QUANTITY = {
		...STRUCTURE.QUANTITY,
		PLACEHOLDER:{
			DEFAULT:"Habetsahany",
			BO:"Habetsahany",
		},
		LABEL:{
			DEFAULT:"Isan'ny kaomandy",
			BO:"Isan'ny kaomandy",
		},
		EMPTY_MESSAGE:{
			DEFAULT:"Ampidiro azafady ny habetsahan'ny kaomandy",
			BO:"Ampidiro azafady ny habetsahan'ny kaomandy"
		},
	}
	static STATUS = {
		...STRUCTURE.STATUS,
		PLACEHOLDER:{
			DEFAULT:"Ny sata",
			BO:"Ny sata",
		},
		LABEL:{
			DEFAULT:"Ampidiro ny sata",
			FO:"Ampidiro ny sata",
			BO:"Ampidiro ny sata",
		},
		EMPTY_MESSAGE:{
			DEFAULT:"Ampidiro azafady ny sata",
			BO:"Ampidiro azafady ny sata",
		},
	}
	static PRODUCT = {
		...STRUCTURE.PRODUCT,
		PLACEHOLDER:{
			DEFAULT:"Vokatra",
		},
		LABEL:{
			DEFAULT:"Vokatra",
		},
		INVALID_MESSAGE:{
			DEFAULT:"Misafidiana vokatra iray azafady",
		},
	}
}

export default FIELD;