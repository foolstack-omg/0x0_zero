export default [{
	"inputs": [{
		"internalType": "bytes",
		"name": "signature",
		"type": "bytes"
	}],
	"name": "mint",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "nonpayable",
	"type": "function"
},{
    "constant": true,
    "inputs": [
        {
            "internalType": "address",
            "name": "account",
            "type": "address"
        }
    ],
    "name": "balanceOf",
    "outputs": [
        {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
},] as const