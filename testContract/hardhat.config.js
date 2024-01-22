require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

const ALCHEMY_API = process.env.ALCHEMY_API

const PRIVATE_KEYS = [
  process.env.PRIVATE_KEY1 ? process.env.PRIVATE_KEY1 : "", // 0x2cC285279f6970d00F84f3034439ab8D29D04d97 
  process.env.PRIVATE_KEY2 ? process.env.PRIVATE_KEY2 : "", // 0x1e1864802DcF4A0527EF4315Da37D135f6D1B64B
  process.env.PRIVATE_KEY3 ? process.env.PRIVATE_KEY3 : "", // 0x521D5d2d40C80BAe1fec2e75B76EC03eaB82b4E0
  process.env.PRIVATE_KEY4 ? process.env.PRIVATE_KEY4 : "", // 0xd397AEc78be7fC14ADE2D2b5F03232b04A7AB42E

  process.env.PRIVATE_KEY5 ? process.env.PRIVATE_KEY5 : "", // 0x4F357E34d2b871d353Ec9bC2deA275C9A067e30b
  process.env.PRIVATE_KEY6 ? process.env.PRIVATE_KEY6 : "", // 0x5FCd33daf7B6053f648111B99e6608beFF466002
  process.env.PRIVATE_KEY7 ? process.env.PRIVATE_KEY7 : "", // 0xbf3e058eF1604059276e70042750413630F11A08
  process.env.PRIVATE_KEY8 ? process.env.PRIVATE_KEY8 : "", // 0xd708af1D48cA76A2c01227280E4c1581F1D82517
  process.env.PRIVATE_KEY9 ? process.env.PRIVATE_KEY9 : "", // 0x01a41D41C43cc9077A45Cc1c65E9b293368dBD08
  process.env.PRIVATE_KEY10 ? process.env.PRIVATE_KEY10 : "", // 0xfEE4384B3ffBE3659C544501FB29025525A0281A
  process.env.PRIVATE_KEY11 ? process.env.PRIVATE_KEY11 : "", // 0x175F85bCd6f753c1c39637fa808e0a8029dDe5B4
]

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API}`,
      accounts: PRIVATE_KEYS
    }
  },
};
