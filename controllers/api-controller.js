/*****************************************************************************
 * Example app for Think 2019 presentation
 * Infuse Your Applications with AI
 * License: MIT
 * Author: Dejan Glozic 2019
 * ***************************************************************************/

const request = require("request");
const btoa = require("btoa");
const VisualRecognitionV3 = require("watson-developer-cloud/visual-recognition/v3");
const stream = require("stream");
const config = require("../config.json");

const SCORING_FIELDS_OF_INTEREST = [
	"probability",
	"nodeADP_class"
];

module.exports.scoreDescribe = function(req, res) {
	var capColor = req.query.cap_color;
	var gillsColor = req.query.gills_color;
	var smell = req.query.smell;

	console.log(`API: ${capColor}, ${gillsColor}, ${smell}`);

	_getToken(function(err, token) {
		if (err) {
			res.status(500).send(err.message);
			return;
		}
		console.log("TOKEN: " + token);
		_score(capColor, gillsColor, smell, token, function(err2, result) {
			if (err) {
				res.status(500).send(err.message);
				return;
			}
			res.json(result);
		});
	});
}

function _getToken(callback) {
	const options = {
		url: `${config.credentials.url}/v3/identity/token`,
		headers: {
			"Authorization": "Basic " + btoa((config.credentials.username + ":" + config.credentials.password)),
			"Content-Type": "application/json;charset=UTF-8"
		},
		json: true
	};
	request.get(options, function(err, response, result) {
		if (err) {
			console.log(err.message);
			callback(err);
			return;
		}
		if (response.statusCode !== 200) {
			const message = "Unexpected return code from WML Auth: " + response.statusCode;
			console.log(message);
			callback(new Error(message));
			return;
		}
		callback(null, result.token);
	});
}

function _score(capColor, gillsColor, smell, token, callback) {
	const options = {
		url: config.scoring.url,
		json: true,
		method: "post",
		body: {
			"fields": [	
				"CAP_SHAPE",
				"CAP_SURFACE",
				"CAP_COLOR",
				"BRUISES",
				"ODOR",
				"GILL_ATTACHMENT",
				"GILL_SPACING",
				"GILL_SIZE",
				"GILL_COLOR",
				"STALK_SHAPE",
				"STALK_ROOT",
				"STALK_SURFACE_ABOVE_RING",
				"STALK_SURFACE_BELOW_RING",
				"STALK_COLOR_ABOVE_RING",
				"STALK_COLOR_BELOW_RING",
				"VEIL_TYPE",
				"VEIL_COLOR",
				"RING_NUMBER",
				"RING_TYPE",
				"SPORE_PRINT_COLOR",
				"POPULATION",
				"HABITAT"
			], 
			"values": [[null, null, capColor, null, smell, null, null, null, gillsColor,
				null, null, null, null, null, null, null, null, null, null, null, null, null
			]]
		},
		headers: {
			"Accept": "application/json",
			"Authorization": "Bearer " + token,
			"Content-Type": "application/json;charset=UTF-8"
		}
	};

	request(options, function(err, response, result) {
		if (err) {
			console.log(err.message);
			callback(err);
			return;
		}
		if (response.statusCode !== 200) {
			const message = "Unexpected return code from WML Auth: " + response.statusCode;
			console.log(message);
			callback(new Error(message));
			return;
		}

		const processedResult = {};

		if (result.fields && result.values) {
			for (let i = 0; i< result.fields.length; i++) {
				const key = result.fields[i];
				if (SCORING_FIELDS_OF_INTEREST.indexOf(key) !== -1) {
					let keyToUse = key;
					if (key === "nodeADP_class") {
						keyToUse = "winningClass";
					}
					processedResult[keyToUse] = result.values[0][i];
				}
			}
		}
		callback(null, processedResult);
	});
}

module.exports.scoreVR = function(req, res) {
	const url = req.query.url;
	const visualRecognition = new VisualRecognitionV3({
		version: config.watson_vr.version,
		iam_apikey: config.watson_vr.iam_apikey
	});

	var params = {
		url,
		classifier_ids: [config.watson_vr.model_id],
		threshold: 0.0
	};

	visualRecognition.classify(params, function(err2, response) {
		if (err2) { 
			console.log(err2);
			res.status(500).send(err2.message);
			return;
		}
		console.log(JSON.stringify(response, null, 2));

		const probability = [
			response.images[0].classifiers[0].classes[0].score,
			response.images[0].classifiers[0].classes[1].score
		];

		const result = {
			probability,
			winningClass: probability[0] > probability[1] ? "EDIBLE": "POISONOUS"
		};

		res.json(result);
	});
}



