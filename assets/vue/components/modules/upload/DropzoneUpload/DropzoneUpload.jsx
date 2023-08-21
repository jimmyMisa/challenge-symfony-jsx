import { C } from "vue/helper/V02Component.jsx";
import classNames from "classnames";
import styles from "./DropzoneUpload.scss?module";
import { getData } from "pw-components-core-dev";

import "dropzone/dist/basic.css";
import "dropzone/dist/dropzone.css";
import { Dropzone } from "dropzone";
import { DropzoneApi as api } from "modules/upload/DropzoneApi.js";

export default C.make({
	initDropzone() {
		var { 
			config = {}, 
			uploadFiles = ()=>{},
			getFiles = ()=>{},
			removeFiles = ()=>{},
			displayError = ()=>{},
		} = this;

		var {
			uploadUrl = "",
			removeUrl = "",
			deleteLabel = "Supprimer",
			dropLabel = "Veuillez deposer des fichiers ici ...",
			maxFiles = null,
			dropzoneParams = {},
			template,
			onSending = () => {},
			onSuccess = () => {},
			onAddedFile = () => {},
			onInit = () => {},
		} = config;

		var { pw_dropzone } = this.$refs;

		var previewTemplate = this.$refs.template.innerHTML;

		var cnf = {
			url: uploadUrl,
			maxFilesize: 5, // Maximum file size in MB
            uploadMultiple: true, // Enable multiple file upload
			addRemoveLinks: true,
			dictRemoveFile: deleteLabel,
			dictDefaultMessage: dropLabel,
			dictMaxFilesExceeded: "Impossible de charger le document",
			dictCancelUpload: "Annuler",
            acceptedFiles: ".jpg, .jpeg, .png, .gif, .pdf", // Allowed file types
			maxFiles,
			init: () => {
				setTimeout(() => {
					dropzone.on("sending", (file, xhr, formData) => {
						onSending({file, xhr, formData});
					});
					dropzone.on("success", (file, responseText) => {
						uploadFiles(file, responseText);
						onSuccess({file, responseText});
	                    if (responseText.success) {
	                    } else {
	                        displayError(file, responseText.message); // Display the error message
	                    }
					});
					dropzone.on("addedfile", (file) => {
						if (file.size > 1 * 1024 * 1024) {
	                        displayError(file, "La taille du fichier dépasse la limite de 1 Mo.");
	                    }
						setTimeout(()=> {
							var acceptedFiles = dropzone.getAcceptedFiles();
							if (acceptedFiles.length) {
								dropzone.element.querySelector(".dz-default").style.display = "none";
							}
						},100)
					});
	                dropzone.on("error", function (file, errorMessage, xhr) {
	                    displayError(file, "Erreur lors du téléchargement du fichier."); // Display the error message
	                });
	                dropzone.on("sendingmultiple", function (files, xhr, formData) {
	                     var allValid = true;
				        for (var i = 0; i < files.length; i++) {
				            if (files[i].size > 1 * 1024 * 1024) {
				                dropzone.displayError(files[i], "La taille du fichier dépasse la limite de 1 Mo.");
				                allValid = false;
				            }
				        }
				        if (!allValid) {
				            xhr.abort(); // Abort the request
				            var errorMessageElement = document.getElementById("error-message");
	                        errorMessageElement.textContent = "Certains fichiers ne sont pas valides. Veuillez corriger les erreurs.";
				        }
	                });
	                // Custom validation: Check for malicious content
	                /*dropzone.on("thumbnail", function (file) {
					    var reader = new FileReader();
					    reader.onload = function (event) {
					        var contents = event.target.result;
					        if (contents.includes("<script")) {
					            dropzone.displayError(file, "Le fichier contient du code malveillant.");
					        }
					    };
					    reader.readAsText(file);
					});*/

	                dropzone.on("removedfile", function (file) {
	                	dropzone.element.querySelector(".dz-default").style.display = "none";
	                });
					getFiles();
					onInit({ instance: this, dropzone });
				}, 10);
			},
			removedfile: (file) => {
				if (
					!file.previewElement.id && 
					file.previewElement.classList.contains("dz-error")
				) {
					file.previewElement.remove();
					setTimeout(()=> {
						var acceptedFiles = dropzone.getAcceptedFiles();
						if (!acceptedFiles.length) {
							dropzone.element.querySelector(".dz-default").style.display = "block";
						}
					},200)
				}
				if (file.previewElement.id) {
					removeFiles(
						file.previewElement.id, 
						file
					);
				}
			},
            accept: function (file, done) {
                if (file.size > 1 * 1024 * 1024) {
                    done("Le fichier dépasse la taille maximale de 1 Mo.");
                } else {
                    done();
                }
            },
			...dropzoneParams,
		};

		if (template) {
			cnf.previewTemplate = previewTemplate
		}

		var instance = this;
		var dropzone = new Dropzone(pw_dropzone, cnf);

		this.getData().dropzone = dropzone;
	},
	displayError(file, message){
		var previewElement = file.previewElement;
        previewElement.classList.add("dz-error"); // Add error class
        previewElement.querySelector(".dz-error-message").textContent = message; // Set error message
	},
	getFiles() {
		var { config } = this;
		var query={}
		var then = (response)=>{
			if (response && response.length) {
				$.each(response, (key, value) => {
					var mockFile = {
						name: value.name,
						size: value.size,
						accepted: true,
					};
					mockFile.dataURL = this.imgThumbnailD(
						value.name,
						value.url
					);
					this.getData().dropzone.files.push(mockFile);
					this.getData().dropzone.emit("addedfile", mockFile);
					this.createThumbnail(mockFile);
					this.getData().dropzone.emit("complete", mockFile);
					this.getData().dropzone._updateMaxFilesReachedClass();
					mockFile.previewElement.id = value.id;
					mockFile.previewElement.addEventListener(
						"click",
						function () {
							window.open(value.url, "_blank");
						}
					);
				});
			}
		}
		api.load({
			query,
			then
		})
	},
	imgThumbnailD(filename, img) {
		var ext = this.checkFileExt(filename); // Get extension
		if (ext == "mp4") {
			filename = "/assets/images/thumbs/video.png";
		} else if (ext == "pdf") {
			filename = "/assets/images/thumbs/pdf.png";
		} else if (ext == "jpg" || ext == "jpeg" || ext == "png") {
			if (typeof img == "function") {
				filename = img();
			} else {
				filename = img;
			}
		} else {
			filename = "/assets/images/thumbs/default_attachment.jpg";
		}
		return filename;
	},
	checkFileExt(filename) {
		filename = filename.toLowerCase();
		return filename.split(".").pop();
	},
	createThumbnail(temp) {
		this.getData().dropzone.createThumbnailFromUrl(
			temp,
			this.getData().dropzone.options.thumbnailWidth,
			this.getData().dropzone.options.thumbnailHeight,
			this.getData().dropzone.options.thumbnailMethod,
			true,
			(thumbnail) => {
				this.getData().dropzone.emit("thumbnail", temp, thumbnail);
				this.getData().dropzone.emit("complete", temp);
			}
		);
	},
	removeFiles(id, file) {
		var { config } = this;
		var { removeUrl = "", onRemove = () => {} } = config;
		var query = {id:id}
		var dropzone = this.getData().dropzone
		var then = (response)=>{
			if (response && response.status==200) {
				file.previewElement.remove();
				setTimeout(()=> {
					var acceptedFiles = dropzone.getAcceptedFiles();
					if (!acceptedFiles.length) {
						dropzone.element.querySelector(".dz-default").style.display = "block";
					}
				},200)
			}
		}
		if (id) {
			api.remove({
				query,
				then
			})
		}
	},
	uploadFiles(file, response) {
		var ext = this.checkFileExt(file.name); // Get extension
		var newimage = this.imgThumbnailD(file.name, () => {
			return URL.createObjectURL(file);
		});
		file.dataURL = newimage;
		this.createThumbnail(file);
		if (response && response.files) {
			var result_files = response.files;
			var result = result_files.find((x) => x.originalName == file.name);
			if (result) {
				if (result.id) {
					file.previewElement.id = result.id;
				}
				if (result.url) {
					file.previewElement.addEventListener("click", function () {
						window.open(result.url, "_blank");
					});
				}
			}
		}
	},
	onReady() {
		var { ready } = this.getData();

		if (!ready) {
			this.getData().ready = true;
			setTimeout(() => {
				this.initDropzone();
			}, 100);
		}
	},
	$render() {
		this.onReady();
		var { config } = this;
		console.log("$render", config)

		var { content, className = "", template } = config;

		return (
			<div class={classNames(className)}>
				<div
					ref="pw_dropzone"
					class="pw_dropzone dropzone"
				></div>
				<div ref="template" class="d-none">
					{ template }
				</div>
				<div id="error-message" style="color: red;"></div>
			</div>
		);
	},
});
