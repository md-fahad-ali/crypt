const { Web3 } = require('web3');
const web3 = new Web3("https://polygon-rpc.com");
// or
// const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
// 
// // change provider
// web3.setProvider('ws://localhost:8546');
async function ad() {
  let chkMessage = "Welcome to the META Questboard, please sign this message to verify your identity. Your custom message is : 52eaa8d5-3fc6-4e6b-9dc5-c0a179859e91";
  let address = "0xfebd4Bcc7936e46D7f9D7e12f7b58e6F19f232D8";

  console.log('Is valid address:', web3.utils.isAddress(address)); // Check if the address is valid

  // Sign the message using the private key of the Ethereum address
  const signature = await web3.eth.sign(chkMessage, address);

  console.log('Signature:', signature);
}


ad()
