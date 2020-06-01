import Web3 from 'web3';

let web3 = null;

	if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
		window.ethereum.autoRefreshOnNetworkChange = false;
		// We are in the browser and metamask is running...
		// web3 = new Web3(window.web3.currentProvider);
		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum);
			web3 = window.web3;
			window.ethereum.enable();
		} else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider);
			web3 = window.web3;
		}
	} else {
		// We are on the server or the user is not running metamask
		const provider = new Web3.providers.HttpProvider('http://localhost:8545');
		web3 = new Web3(provider);
	}

// const loadWeb3 = async () => {
// 	if (window.ethereum) {
// 		window.web3 = new Web3(window.ethereum);
// 		try {
// 			await window.ethereum.enable();
// 		} catch (error) {
//
// 		}
// 	} else if (window.web3) {
// 		window.web3 = new Web3(window.web3.currentProvider);
// 	} else {
//
// 	}
// }
//
// const web3 = async () => {
// 	const condition = typeof window.web3 !== 'undefined';
//
// 	let web3 = null;
// 	if (condition) {
// 		await loadWeb3();
// 		web3 = window.web3;
// 	}
// 	return web3;
// }

export default web3;
