const UssdMenu = require('ussd-builder');
const { db } = require('./fbconfig');

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
    1: 'createShipment',
    //"2": "startShipment",
    //"3": "completeShipment",
    //4: 'checkShipment',
    //5: 'myAccount',
    //6: 'testfn',
    //7: 'connect',
  },
})

menu.state('createShipment', {
  run: () => {
    menu.session.set('mnemonic', ' ')
    menu.con('Enter Receiver Phone Number:')
  },
  //next: {
  //  1: 'registration',
  //  2: 'importation',
  //  3: 'testfn',
  //},
})

module.exports = { menu }