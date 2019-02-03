/*****************************************************************************
 * Example app for Think 2019 presentation
 * Infuse Your Applications with AI
 * License: MIT
 * Author: Dejan Glozic 2019
 * ***************************************************************************/

module.exports = function(req, res) {
	const choice = req.params.choice;
	res.render("app.dust", { choice });
}