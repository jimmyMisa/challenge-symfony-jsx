import { C } from "vue/helper/V01Component";
import {setChildView} from "vue/helper/renderVue.js";
import { getConfig } from "./upload_config.js";
import DropzoneUpload from 'vue/components/modules/upload/DropzoneUpload/DropzoneUpload'

function main() {
    getConfig().components = {};
    getConfig().components.uploadUrl = window.api_file_upload_dropzone;
    setChildView(
        "#app",
        DropzoneUpload,
        getConfig().components
    )
}

export {
    main
}