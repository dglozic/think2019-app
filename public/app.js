/*****************************************************************************
 * Example app for Think 2019 presentation
 * Infuse Your Applications with AI
 * License: MIT
 * Author: Dejan Glozic 2019
 * ***************************************************************************/

 (function() {

	document.addEventListener("DOMContentLoaded", function onLoad() {
		var describe = document.querySelector("#choice-describe");
		var picture = document.querySelector("#choice-picture");
		var describePanel = document.querySelector("#panel-describe");
		var picturePanel = document.querySelector("#panel-picture");

		describe.addEventListener("click", function(evt) {
			evt.stopPropagation();
			evt.preventDefault();
			location.href = "/";
		});
		picture.addEventListener("click", function(evt) {
			evt.stopPropagation();
			evt.preventDefault();
			location.href = "/vr";
		});

		/*

		function _selectDescribe() {
			describe.classList.add("bx--content-switcher--selected");
			describePanel.classList.remove("hidden");
			picture.classList.remove("bx--content-switcher--selected");
			picturePanel.classList.add("hidden");
		}

		function _selectPicture() {
			describe.classList.remove("bx--content-switcher--selected");
			describePanel.classList.add("hidden");
			picture.classList.add("bx--content-switcher--selected");
			picturePanel.classList.remove("hidden");
		}
		*/

		var describeCommit = document.querySelector("#describe-commit");
		var capColor = document.querySelector("#cap-color");
		var gillsColor = document.querySelector("#gills-color");
		var smell = document.querySelector("#smell");
		var describeError = document.querySelector("#describe-error");

		describeCommit.addEventListener("click", function(evt) {
			var normalLabel = describeCommit.innerHTML;
			describeCommit.innerHTML = "Let me see...";
			describeError.innerHTML = "";
			_updateVerdict();
			var capColorValue = capColor.innerHTML;
			var gillsColorValue = gillsColor.innerHTML;
			var smellValue = smell.innerHTML;
			var url = "/api/score-describe?cap_color=" + 
				capColorValue + "&gills_color=" +
				gillsColorValue + "&smell=" + 
				smellValue;

			var options = {
				url: url,
				json: true
			};
			_doXhr(options, [200], function(err, result) {
				describeCommit.innerHTML = normalLabel;
				if (err) {
					describeError.innerHTML = err.message;
					return;
				}
				_updateVerdict(result);
			});
		});

		var previewButton = document.querySelector("#preview-button");
		var previewImage = document.querySelector(".picture-preview-section > img");
		var imageUrlInput = document.querySelector("#image-url-input");
		var vrCommit = document.querySelector("#vr-commit");
		var vrError = document.querySelector("#vr-error");

		vrCommit.disabled = true;
		previewButton.disabled = true;

		imageUrlInput.addEventListener("input", function(evt) {
			if (imageUrlInput.value && imageUrlInput.value.length > 0) {
				previewButton.disabled = false;
				vrCommit.disabled = false;
			} else {
				previewButton.disabled = true;
				vrCommit.disabled = true;
			}
		});

		previewButton.addEventListener("click", function(evt) {
			previewImage.src = imageUrlInput.value;
		});

		vrCommit.addEventListener("click", function(evt) {
			var normalLabel = vrCommit.innerHTML;
			vrCommit.innerHTML = "Let me see...";
			vrError.innerHTML = "";
			_updateVerdict();

			var imageUrl = encodeURIComponent(imageUrlInput.value);

			var url = "/api/score-vr?url=" + imageUrl;

			var options = {
				url: url,
				json: true
			};
			_doXhr(options, [200], function(err, result) {
				vrCommit.innerHTML = normalLabel;
				if (err) {
					vrError.innerHTML = err.message;
					return;
				}
				_updateVerdict(result);
			});
		});

	});

	function _updateVerdict(result) {
		var verdictValue = document.querySelector(".verdict-value");
		var scaleNumber = document.querySelector(".scale-number");
		var scaleNumberValue = document.querySelector(".scale-number-value");

		verdictValue.classList.remove("verdict-none");

		if (!result) {
			verdictValue.innerHTML = "";
			scaleNumber.classList.add("hidden");
		} else {
			if (result.probability[0] && result.probability[1] &&
				result.probability[0] < 0.5 && result.probability[1] < 0.5) {
				verdictValue.classList.remove("verdict-poisonous");
				verdictValue.classList.add("verdict-none");
				verdictValue.innerHTML = "Probably not a mushroom";
				scaleNumber.classList.add("hidden");
				console.log("VERDICT: Not a mushroom");
				return;
			}
			scaleNumber.classList.remove("hidden");
			var probability;
			if (result.winningClass === "EDIBLE") {
				probabilityValue = result.probability[0];
				probabilityPosition = 1 - result.probability[0];
			} else {
				probabilityPosition = result.probability[1];
				probabilityValue = probabilityPosition;
			}
			scaleNumber.style.left = `calc(${100 * probabilityPosition}% - 20px)`;
			var rounded = Math.round( probabilityValue * 1000 ) / 10;
			scaleNumberValue.innerHTML = rounded + "%";
			console.log("VERDICT: " + JSON.stringify(result));
			verdictValue.innerHTML = result.winningClass;
			if (result.winningClass === "EDIBLE") {
				verdictValue.classList.remove("verdict-poisonous");
			} else {
				verdictValue.classList.add("verdict-poisonous");				
			}
		}
	}

	function _doXhr(options, acceptableReturnCodes, callback) {
		if (!options || !options.url) {
			callback(new Error("options parameter no provided or does not contain 'url'"));
			return;
		}

		var request = new XMLHttpRequest();
		request.open(options.method || "GET", options.url, true);

		if (options.headers) {
			for (var header in options.headers) {
				if (options.headers.hasOwnProperty(header)) {
					request.setRequestHeader(header, options.headers[header]);
				}
			}
		}

		if (options.method && (options.method !== "GET" && options.method !== "OPTIONS")) {
			if (!options.headers || !options.headers["X-Requested-With"]) {
				request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			}
		}

		request.onload = function() {
			if (acceptableReturnCodes.indexOf(request.status) === -1) {
				callback(new Error("Unexpected response code: " + request.status));
				return;
			}

			var result = request.responseText;
			if (options.json) {
				try {
					result = JSON.parse(result);
				} catch (exception) {
					callback(new Error("Error: unable to parse result as JSON"));
					return;
				}
			}
			callback(null, result);
			return;
		};
		request.onerror = callback;

		request.send(options.data);
	}

 }());