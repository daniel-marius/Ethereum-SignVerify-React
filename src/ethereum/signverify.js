import web3 from './web3';
import SignatureVerification from './abis/SignatureVerification.json';

const networkID = 5777;
const contractABI = SignatureVerification.abi;
const contractAddress = SignatureVerification.networks[networkID].address;

// Create an instance of the contract
const instance = new web3.eth.Contract(contractABI, contractAddress);

export default instance;
