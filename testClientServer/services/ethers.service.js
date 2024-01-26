const ethers = require('ethers');
const Web3 = require('web3');

/**
 * 
 * @param {*} rpcUrl 
 * @returns obj { chainId: null | number, errorData: string }
 */
const testNodeState = async (rpcUrl) => {
    let resObj = {
        chainId: null,
        errorData: ""
    }
    const web3 = new Web3(rpcUrl)
    try {
        const chainId = await web3.eth.getChainId()
        resObj.chainId = chainId
    } catch (e) {
        resObj.errorData = e
    }
    return resObj
}


module.exports = {
    testNodeState
}