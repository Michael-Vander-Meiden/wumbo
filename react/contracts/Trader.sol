pragma solidity ^0.6.0;

import "./Token.sol";




contract Trader {

    address payable admin;
    Token public DAI;
    Token public USDC;


    using SafeMath for uint256;

    constructor(Token _DAI, Token _USDC) public {
        DAI = _DAI;
        USDC = _USDC;
    }

    function setAdmin() public{
        require(admin == address(0));
        admin = msg.sender;
    }

    function withdrawDai() public {
        require(msg.sender == admin);
        DAI.transfer(msg.sender, 100);
    }

    function withdrawUsdc() public {
        require(msg.sender == admin);
        USDC.transfer(msg.sender, 100);
    }

    function daiBalance() public view returns (uint256) {
        return DAI.balanceOf(address(this));
    }

    function usdcBalance() public view returns (uint256) {
        return USDC.balanceOf(address(this));
    }

    function viewAdmin() public view returns (address) {
        return admin;
    }    


}