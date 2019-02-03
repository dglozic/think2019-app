/*****************************************************************************
 * Example app for Think 2019 presentation
 * Infuse Your Applications with AI
 * License: MIT
 * Author: Dejan Glozic 2019
 * ***************************************************************************/

const express = require('express');
const path = require('path');
const consolidate = require("consolidate");
const dust = require("dustjs-helpers");

const controller = require('./controllers/controller');
const apiController = require('./controllers/api-controller');

const PORT = 3000;

const app = express();

app.set("views", path.join(__dirname, "./templates"));
app.engine("dust", consolidate.dust);
app.set("view engine", "dust");

// Static resources
app.use('/', express.static(path.join(__dirname, 'public')));

// UI
app.get('/:choice', controller);
app.get('/', controller);

// API
app.get('/api/score-describe', apiController.scoreDescribe);
app.get('/api/score-vr', apiController.scoreVR);

// Start the server
app.listen(PORT, () => console.log(`Think 2019 demo app listening on port ${PORT}!`));