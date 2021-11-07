pragma solidity ^0.6.0;

import "./Token.sol";




contract UniswapRouter {



    function swapExactTokensForTokens(uint _amountIn, uint _amountOutMin, address[] memory _path, address destination, uint _timestamp) public {
        //send self token 0
        Token(_path[0]).transferFrom(destination, address(this), 100);
        //send address token 1
        Token(_path[1]).transfer(destination, 100);

    }

}