pragma solidity ^0.6.0;

import "./Token.sol";
import "./UniswapRouter.sol";




contract Trader {

    address payable admin;
    Token public DAI;
    Token public USDC;
    UniswapRouter public router;


    using SafeMath for uint256;

    constructor(Token _DAI, Token _USDC, UniswapRouter _router) public {
        DAI = _DAI;
        USDC = _USDC;
        router = _router;
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

    function swapERC20(address _tokenA, address _tokenB) public {
        require(msg.sender == admin);

        address[] memory _path = new address[](2);
        _path[0] = _tokenA;
        _path[1] = _tokenB;
        Token(_tokenA).approve(address(router), 100);
        router.swapExactTokensForTokens(100, 100, _path, address(this), block.timestamp);
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