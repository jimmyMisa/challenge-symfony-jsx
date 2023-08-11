import STRUCTURE from "common/structure/FIELD/FIELD.STRUCTURE.js"

class FIELD{
	static NAME = {
		...STRUCTURE.NAME,
		PLACEHOLDER:{
			DEFAULT:"Le nom du produit",
			BO:"Le nom du produit",
		},
		LABEL:{
			DEFAULT:"Nom du produit",
			BO:"Nom du produit",
		},
		EMPTY_MESSAGE:{
			DEFAULT:"Veuillez saisir le nom du produit",
			BO:"Veuillez saisir le nom du produit"
		},
	}
	static PRICE = {
		...STRUCTURE.PRICE,
		PLACEHOLDER:{
			DEFAULT:"Prix du produit",
			BO:"Prix du produit",
		},
		LABEL:{
			DEFAULT:"Prix du produit",
			BO:"Prix du produit",
		},
		EMPTY_MESSAGE:{
			DEFAULT:"Veuillez saisir le prix du produit",
			BO:"Veuillez saisir le prix du produit"
		},
	}
	static NAME_COMMANDE = {
		...STRUCTURE.NAME_COMMANDE,
		PLACEHOLDER:{
			DEFAULT:"Le nom de la commande",
			BO:"Le nom de la commande",
		},
		LABEL:{
			DEFAULT:"Nom de la commande",
			BO:"Nom de la commande",
		},
		EMPTY_MESSAGE:{
			DEFAULT:"Veuillez saisir le nom de la commande",
			BO:"Veuillez saisir le nom de la commande"
		},
	}
	static PRICE_COMMANDE = {
		...STRUCTURE.PRICE_COMMANDE,
		PLACEHOLDER:{
			DEFAULT:"Prix de la commande",
			BO:"Prix de la commande",
		},
		LABEL:{
			DEFAULT:"Prix de la commande",
			BO:"Prix de la commande",
		},
		EMPTY_MESSAGE:{
			DEFAULT:"Veuillez saisir le prix de la commande",
			BO:"Veuillez saisir le prix de la commande"
		},
	}
	static QUANTITY = {
		...STRUCTURE.QUANTITY,
		PLACEHOLDER:{
			DEFAULT:"Quantité",
			BO:"Quantité",
		},
		LABEL:{
			DEFAULT:"Quantité de la commande",
			BO:"Quantité de la commande",
		},
		EMPTY_MESSAGE:{
			DEFAULT:"Veuillez saisir la quantité de la commande",
			BO:"Veuillez saisir la quantité de la commande"
		},
	}
	static STATUS = {
		...STRUCTURE.STATUS,
		PLACEHOLDER:{
			DEFAULT:"Le statut",
			BO:"Le statut",
		},
		LABEL:{
			DEFAULT:"Entrez le statut",
			FO:"Entrez le statut",
			BO:"Entrez le statut",
		},
		EMPTY_MESSAGE:{
			DEFAULT:"Veuillez saisir le statut",
			BO:"Veuillez saisir le statut",
		},
	}
	static PRODUCT = {
		...STRUCTURE.PRODUCT,
		PLACEHOLDER:{
			DEFAULT:"Produit",
		},
		LABEL:{
			DEFAULT:"Produit",
		},
		INVALID_MESSAGE:{
			DEFAULT:"Veillez sélectionner un produit",
		},
	}
	
}

export default FIELD;