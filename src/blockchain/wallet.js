const fs = require('fs');
const contract = JSON.parse(fs.readFileSync('./truffle/build/contracts/Graphs.json', 'utf8'));
console.log(JSON.stringify(contract.abi));

const abi = contract.abi;
const contractAddress = process.env.CONTRACT_ADDRESS

const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const provider = new HDWalletProvider(process.env.MNEMONIC, `https://ropsten.infura.io/v3/515fa7c9a7bc4f2a90bcbca9a0e94ea0`);
const web3 = new Web3(provider);
const graphsContract = new web3.eth.Contract(abi, contractAddress);
graphsContract.setProvider(provider);

module.exports = graphsContract;