import PAGEMG from "common/structure/PAGE/PAGE.mg.js"
import PAGEFR from "common/structure/PAGE/PAGE.fr.js"

import {FieldManager} from "common/functions/getField.js"

function getPage() {
    if (window.lang == "MG") {
        return PAGEMG
    } else if (window.lang == "FR") {
        return PAGEFR
    }
}

function getPageText(params={}){
	var {
		page,
		prop,
		domain = FieldManager.domain,
	} = params;

	var PAGE = getPage();

	if(
		!PAGE ||
		!PAGE[page] ||
		!PAGE[page][prop]
	){
		return null;
	}

	if(PAGE[page][prop][domain]){
		return PAGE[page][prop][domain];
	}
	else if(PAGE[page][prop]["DEFAULT"]){
		return PAGE[page][prop]["DEFAULT"];
	}

	return null;
}

export { getPage, getPageText }
