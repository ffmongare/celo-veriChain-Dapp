const express = require('express');
const functions = require('firebase-functions');
const { menu } = require('./menu');


const app = express();
app.use(express.json());
app.use(express.urlencoded());

//Add states to menu
const { obMenuStates } = require('./essentials/onboarding');
const { accMenuStates } = require('./essentials/account');
const { walMenuStates } = require('./wallet/index')

menu.states = {
  ...menu.states,
  ...obMenuStates,
  ...accMenuStates,
  ...walMenuStates,

}

console.log("This menu: ", menu.states)

app.post('/ussd', (req, res) => {
  // Read the variables sent via POST from our API
  let args = {
    phoneNumber: req.body.phoneNumber,
    sessionId: req.body.sessionId,
    serviceCode: req.body.serviceCode,
    //Operator: req.body.networkCode || req.body.Operator,
    text: req.body.text,
  }
  menu.run(args, (response) => {
    res.send(response)
  })
})

//exports.menu
exports.verichainussd = functions.https.onRequest(app)