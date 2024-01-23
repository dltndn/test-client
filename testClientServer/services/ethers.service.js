const ethers = require('ethers');

// const jsonRpcUrl = "https://socket-ag.eqhub.eqbr.com?socketKey=FF_v7t9-fpSm4v3dZUnzlRqVoVS5UCwyq-sCrTpR7Ec"
const jsonRpcUrl = "https://polygon-mumbai.g.alchemy.com/v2/jPoJctKI-kiKK4OCedZzUgSaoBGbJvvf"

const MASTER_PRIVATE = "0x6f00829b4cc33dda5e9cc385ecbb7317f723604399da1a7ef5dbe09d517617ed"

const { HttpProvider, Web3Eth } = require('web3');


const ethersTest = async () => {
    // const provider = new ethers.JsonRpcProvider(jsonRpcUrl);
    // const masterWallet = new ethers.Wallet(MASTER_PRIVATE, provider)
    // console.log(masterWallet)
    // console.log(await provider.getFeeData())
    const web3Provider = new HttpProvider(jsonRpcUrl)
    const eth = new Web3Eth(web3Provider)
    console.log(await eth.getBlockNumber())
}

module.exports = {
    ethersTest
}