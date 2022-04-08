// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract TbsToken {
    uint256 public totalSupply; //Erc20 standard to store the supply of total tokens available
    // name fot the token
    string public constant name = "Tbs Token";
    // Symbol for the token
    string public constant symbol = "TBS";
    // Standard
    string public constant standard = "TBS Token v1.0";

    mapping(address => uint256) public balanceOf;

    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    // Costructor
    constructor(uint256 _initialSupply) {
        // Allocate initial supply
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    function transfer(address _toAddress, uint256 _valueToTransfer)
        external
        returns (bool success)
    {
        // Trigger exception if account does not have enough token to transfer
        require(
            balanceOf[msg.sender] >= _valueToTransfer,
            "Account does not have enought token to transfer"
        );
        // Transfer the balance
        balanceOf[msg.sender] -= _valueToTransfer;
        balanceOf[_toAddress] += _valueToTransfer;
        emit Transfer(msg.sender, _toAddress, _valueToTransfer);
        return true;
    }

    // approve
    function approve(address _spenderAddress, uint256 _valueToTransfer)
        external
        returns (bool success)
    {
        allowance[msg.sender][_spenderAddress] = _valueToTransfer;
        emit Approval(msg.sender, _spenderAddress, _valueToTransfer);
        return true;
    }

    function transferFrom(
        address _fromAddress,
        address _toAddress,
        uint256 _valueToTransfer
    ) external returns (bool success) {
        require(
            _valueToTransfer <= balanceOf[_fromAddress],
            "Account do not have sufficient balance to transfer"
        );
        require(
            _valueToTransfer <= allowance[_fromAddress][msg.sender],
            "Trying to send more amount than approved by the owner"
        );
        balanceOf[_fromAddress] -= _valueToTransfer;
        balanceOf[_toAddress] += _valueToTransfer;
        allowance[_fromAddress][msg.sender] -= _valueToTransfer;
        emit Transfer(_fromAddress, _toAddress, _valueToTransfer);
        return true;
    }
}
