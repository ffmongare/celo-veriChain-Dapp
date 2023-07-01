const UssdMenu = require('ussd-builder');
const { db } = require('./fbconfig');
const { utils } = require('ethers');
const { createThisShipment } = require('./shipment');

let menu = new UssdMenu();
let sessions = {};
menu.sessionConfig({
  start: (sessionId, callback) => {
    if (!(sessionId in sessions)) sessions[sessionId] = {}
    callback()
  },
  end: (sessionId, callback) => {
    delete sessions[sessionId]
    callback()
  },
  set: (sessionId, key, value, callback) => {
    sessions[sessionId][key] = value
    callback()
  },
  get: (sessionId, key, callback) => {
    let value = sessions[sessionId][key]
    callback(null, value)
  },
})

menu.startState({
  next:{
    '' : () => {
      return 'userMenu'
    }
    
  }
})

menu.state('userMenu', {
  run: () => {
    menu.con('Welcome to VeriChain. \n1. Create Shipment \n2. Start Shipment \n3. Complete Shipment \n4. Check Shipment \n5. My Account' )
  },
  next: {
    1: 'setRecPhoneNo',
    //"2": "startShipment",
    //"3": "completeShipment",
    //4: 'checkShipment',
    //5: 'myAccount',
    //6: 'testfn',
    //7: 'connect',
  },
})

//@dev pickup time and pricing will be set automatically based on distance. 
// default will +24hrs of shipment creation and price of 3cUSD/Ks 300
menu.state('setRecPhoneNo', {
  run: () => {
    menu.session.set('details', ' ')
    menu.con('Enter Receiver Phone Number:')
  },
  next: {
    '*\\d+': 'setDistance',
  },
})

menu.state('setDistance', {
  run: () => {
    let recPhoneNo = menu.val;
    menu.session.set('details', recPhoneNo)
    menu.con('Enter Shipment Distance:') //Change to towns 
  },
  next: {
    '*\\d+': 'confirmDetails',
  },
})

menu.state('confirmDetails', {
  run: async () => {
    const distance = menu.val;
    const recPhoneNo = await menu.session.get('details');
    menu.session.set('details', recPhoneNo +" "+ distance)
    menu.con("Your Details:" + 
            "\nReceiver: " + recPhoneNo + 
            "\nDistance: " + distance +"km" +
            "\n1. Continue" +
            "\n2. Edit");
  },
  next: {
    1: 'createShipment',
    2: "setRecPhoneNo",
  },
})

menu.state("createShipment", {
  run: async () => {
    const details = await menu.session.get('details')
    const thisDetails = details.split(" ")
    menu.end('Shipment Created Successfully!')
    /*const results = await createThisShipment(details[0], details[1])
    if (results) {
      menu.end('Shipment Created Successfully!')
    } else {
      menu.end('Transaction Failed!')
    }*/
  },
})

module.exports = { menu }