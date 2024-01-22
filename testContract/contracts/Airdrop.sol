// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Airdrop is ERC20, Ownable {
    ERC20 public token;

    mapping(address => uint) public claimableAmount;

    constructor(ERC20 _token) 
        Ownable(msg.sender)
        ERC20("TestToken", "TTK")
    {
        token = _token;
    }

    function claim() external {
        uint amount = claimableAmount[msg.sender];
        require(amount > 0, "e1");
        uint contractAmount = token.balanceOf(address(this));
        require(contractAmount >= amount, "e2");
        token.transfer(msg.sender, amount);
        amount = 0;
    }

    function increaseClaimable(address[] memory _users, uint _amount) external onlyOwner {
        for (uint i=0; i<_users.length; i++) {
            require(claimableAmount[_users[i]] == 0, "e3");
            claimableAmount[_users[i]] = _amount;
        }
    }
}