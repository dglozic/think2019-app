# think2019-app
App used to demo IBM Watson Studio AI training for a [Think 2019 presentation](https://myibm.ibm.com/events/think/all-sessions/session/6975A). It uses both IBM Watson Machine Learning and IBM Watson Visual Recognition to detect if a mushroom is edible or poisonous. The app is deployed in IBM Cloud at (https://mushroomtest.mybluemix.net).

## Requirements
This is a Node.js application and requires Node v8 or higher.

## Install dependencies
```
npm install
```

## Run
```
npm start
```

## Scoring APIs
The app will render the pages (both ML and DL side) but will not provide the verdict without trained models. You will need to register for [IBM Watson Studio](https://dataplatform.cloud.ibm.com), create a project and train a Machine Learning model using Model Builder and a suitable CSV dataset with mushroom properties. For this you will need an instance of Watson Machine Learning service.

For the DL side, you will need an instance of IBM Watson Visual Recognition service, and two sets of images - those representing `edible` and `poisonous` classes, and train the model in the IBM Watson Studio tool.

The deployed app is running using our own instances and credentials. You will need to edit `config.json.template`, rename it to `config.json` and provide the missing credentials for the two services once you trained the models.

The names of the properties for ML model and classes for DL VR model are based on our choices. If you modify them, you will need to change the code to match.

## DISCLAIMER
This app accompanies a conference presentation. It has not been designed for use in real-life situations. Any action you take upon the information on this website is strictly at your own risk, and we are not liable for any losses or damages in connection with its use.

## License
MIT
