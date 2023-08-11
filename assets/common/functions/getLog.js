import LOGMG from "common/structure/LOG/LOG.mg.js"
import LOGFR from "common/structure/LOG/LOG.fr.js"

import {FieldManager} from "common/functions/getField.js"

function getLog() {
    if (window.lang == "MG") {
        return LOGMG
    } else if (window.lang == "FR") {
        return LOGFR
    }
}

function getLogText(params={}){
	var {
		log,
		prop = "TEXT",
		domain = FieldManager.domain,
	} = params;

	var LOG = getLog();

	if(
		!LOG ||
		!LOG[log] ||
		!LOG[log][prop]
	){
		return null;
	}

	if(LOG[log][prop][domain]){
		return LOG[log][prop][domain];
	}
	else if(LOG[log][prop]["DEFAULT"]){
		return LOG[log][prop]["DEFAULT"];
	}

	return null;
}

export { getLog, getLogText }
