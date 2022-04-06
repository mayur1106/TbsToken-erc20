// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract TbsToken {
    uint256 public totalSupply;  //Erc20 standard to store the supply of total tokens available 
    // name fot the token 
    string public name ="Tbs Token";
    // Symbol for the token 
    string public symbol = "TBS";
    // Standard 
    string public standard = "TBS Token v1.0";

    mapping(address=>uint256) public balanceOf;

    mapping(address=>mapping(address=>uint256)) public allowance;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );
    // Costructor 
    constructor (uint256 _initialSupply) {
        // Allocate initial supply 
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    function transfer(address _to,uint256 _value ) public returns(bool success){

        // Trigger exception if account does not have enough token to transfer 
        require(balanceOf[msg.sender]>=_value);
        // Transfer the balance 
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender,_to,_value);
        return true;
    }
    // approve 
    function approve(address _spender, uint256 _value) public returns(bool success){
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender,_spender,_value);
        return true;
    }
    function transferFrom(address _from, address _to, uint256 _value) public returns(bool success){
        require(_value<=balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from,_to,_value);
        return true;
    }
}