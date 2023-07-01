const { utils } = require('ethers')

//shipment functions
async function createThisShipment(recPhoneNo, distance) {
  //Retrive receiver address by phone number
  const recAddress = "0x61979179B0EFcad139Bf6AcAA32Ba7aF50e41BA1"
  //Set price by phone number
  let assumedAmount = "3"
  const price = utils.utils.parseUnits((assumedAmount * 1).toFixed(2), 18).toString()
  console.log(price)
}

module.exports = {
  createThisShipment,
}
