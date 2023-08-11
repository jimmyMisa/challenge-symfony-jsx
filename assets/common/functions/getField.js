import FIELDMG from "common/structure/FIELD/LANG/FIELD.mg.js"
import FIELDFR from "common/structure/FIELD/LANG/FIELD.fr.js"
import {
	Field,
	VALIDATION,
	RESTRICTION,
	LIMITATION,
} from "pw-components-js-dev"


function getFields(){
	if(window.lang == "MG"){
		return FIELDMG
	}
	else if(window.lang == "FR"){
		return FIELDFR
	}
	else {
		console.error(`window.lang not defined`);
	}
}

function getField(){
	if(FieldManager.Field){
		return FieldManager.Field;
	}
	var FIELD = getFields()
	Object.keys(FIELD).map((field) =>{
		Field.add(field, FIELD[field]);
	})
	FieldManager.Field = Field.get();
	return FieldManager.Field;
}

function getFieldText(params={}){
	var {
		field,
		prop,
		domain = FieldManager.domain,
	} = params;

	var FIELD = getFields();

	if(
		!FIELD ||
		!FIELD[field] ||
		!FIELD[field][prop]
	){
		return null;
	}

	if(FIELD[field][prop][domain]){
		return FIELD[field][prop][domain];
	}
	else if(FIELD[field][prop]["DEFAULT"]){
		return FIELD[field][prop]["DEFAULT"];
	}

	return null;
}

class FieldManager{
	static Field = null;	
	static create(KEY, page) {
		var getStructure = () =>{
			if(!getField()[KEY]){
				console.warn(`Field / create : STRUCTURE for ${KEY} not defined`);
				return {}
			}
			return getField()[KEY]
		}
		var getValidation = () =>{
			if(
				!VALIDATION ||
				!VALIDATION.data ||
				!VALIDATION.data[KEY] ||
				!VALIDATION.data[KEY][page]
			){
				console.warn(`Field / create : VALIDATION for ${KEY} not defined`);
				return []
			}
			return VALIDATION.data[KEY][page]
		}
		var getRestriction = () =>{
			if(
				!RESTRICTION ||
				!RESTRICTION.data ||
				!RESTRICTION.data[KEY]
			){
				console.warn(`Field / create : RESTRICTION for ${KEY} not defined`);
				return []
			}
			return RESTRICTION.data[KEY]
		}
		var getLimitation = () =>{
			if(
				!LIMITATION ||
				!LIMITATION.data ||
				!LIMITATION.data[KEY]
			){
				console.warn(`Field / create : LIMITATION for ${KEY} not defined`);
				return []
			}
			return LIMITATION.data[KEY]
		}
		var field = Field.create({
	    	domain:FieldManager.domain,
	        STRUCTURE: getStructure(),
	        VALIDATION: getValidation(),
	        RESTRICTION: getRestriction(),
	        LIMITATION: getLimitation(),
	    });
	    field.page = page;
	    return field
	}
}


export { getField, getFieldText, FieldManager }