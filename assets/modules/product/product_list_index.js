import $ from "jquery";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/dist/css/bootstrap.min.css";

require('utilities/utilities.js')

global.$ = $;

var {main} = require('./product_list_main.js')

$(document).ready(() => {
	main()
});
