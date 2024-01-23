// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const ethers = hre.ethers

const TOKEN_ADDRESS = "0x142eD92182BE44b01e10bf8Eb8b6C97A997AD674"
const AIRDROP_ADDRESS = "0x76E8460B11331d3F141a4D68d483ffB02a33E9a6"

async function main() {
  const deployContracts = async () => {
    const testToken = await ethers.deployContract("TestToken", ["0x2cC285279f6970d00F84f3034439ab8D29D04d97"])
    await testToken.waitForDeployment()
    console.log(`TestToken 배포 완료: ${testToken.target}`)
    const airdrop = await ethers.deployContract("Airdrop", [testToken.target])
    await airdrop.waitForDeployment()
    console.log(`Airdrop 배포 완료: ${airdrop.target}`)

    const mintAmount = "100"
    const tokenAmount = ethers.parseEther(mintAmount);
    await testToken.transfer(airdrop.target, tokenAmount)
    console.log(`Airdrop으로 ${mintAmount}토큰 전송`)
  }

  const increaseClaimable = async () => {
    const tokenAmount = ethers.parseEther("2");
    const users = await ethers.getSigners();
    let targetUsers = []
    for (let i=1; i<users.length; ++i) {
      targetUsers.push(users[i].address)
    }
    const Airdrop = await ethers.getContractFactory("Airdrop")
    const airdrop = Airdrop.attach(AIRDROP_ADDRESS)
    await airdrop.increaseClaimable(targetUsers, tokenAmount)
    console.log("increaseClaimable 완료")
  }

  const claim = async () => {
    const users = await ethers.getSigners();
    const Airdrop = await ethers.getContractFactory("Airdrop")
    const airdrop = Airdrop.attach(AIRDROP_ADDRESS)
    let successAmount = 0
    for (let i=1; i<users.length; ++i) {
      try {
        await airdrop.connect(users[i]).claim()
        successAmount++
        console.log(`user ${i} token claim 완료`)
      } catch (e) {
        console.log(`user ${i} token claim 실패`)
      }
    }
    console.log(`${successAmount}명 성공`)
  }

  deployContracts()
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
