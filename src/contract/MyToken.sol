// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface tokenRecipient {
  function receiveApproval(
    address _from,
    uint256 _value,
    address _token,
    bytes calldata _extraData
  ) external;
}

contract TokenERC20 {
  // Public variables of the token
  string public name;
  string public symbol;
  uint8 public decimals = 18;
  // The convention is to do 18 decimal places because that's how ethers work
  uint256 public totalSupply;

  // Mapping
  mapping(address => uint256) public balanceOf;
  mapping(address => mapping(address => uint256)) public allowance;

  // Events
  // The erc20 standard requires us to actually log events every time a transfer events append
  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed _owner,address indexed _spender,uint256 _value);
  // This notifies clients about the amount burnt
  event Burn(address indexed from, uint256 value);


  // Constructor : Initializes contract with initial supply tokens to the creator of the contract
  constructor(string memory _name,string memory _symbol,uint256 initialSupply){
    name=_name;
    symbol=_symbol;
    totalSupply=initialSupply* 10**uint256(decimals); // Warning, don't forget to update total supply with the decimal amount
    balanceOf[msg.sender] = totalSupply; // The person who deploys the contrat gets all the token
  }

  // ****************** ERC20 defines the functions name, symbol, decimals, balanceOf , totalSupply , transfer , transferFrom , approve , and allowance ******************

  // Internal HELPER transfer function, can only be called by this contract
  function _transfer(address _from,address _to,uint256 _value) internal {
    require(_to != address(0x0), "Use burn function to burn token");    // Prevent transfer to 0x0 address. Use burn() instead
    require(balanceOf[_from] >= _value, "Sender : Not enough money");
    require(balanceOf[_to] + _value >= balanceOf[_to], "Overflow");
    balanceOf[_from] -= _value;
    balanceOf[_to] += _value;
    emit Transfer(_from, _to, _value);
  }

  //Send `_value` tokens to `_to` from your account
  function transfer(address _to, uint256 _value) public returns (bool success) {
    _transfer(msg.sender, _to, _value);
    return true;
  }

  // Transfer tokens from other address
  function transferFrom(address _from,address _to,uint256 _value) public returns (bool success) {
    require(_value <= allowance[_from][msg.sender], "Not enough allowance"); // Check allowance
    allowance[_from][msg.sender] -= _value;
    _transfer(_from, _to, _value);
    return true;
  }

  // Set allowance for other address
  function approve(address _spender, uint256 _value)public returns (bool success){
    require(_spender != address(0));
    allowance[msg.sender][_spender] = _value;
    emit Approval(msg.sender, _spender, _value);
    return true;
  }

  // Set allowance for other address and notify.
  function approveAndCall(address _spender,uint256 _value,bytes memory _extraData) public returns (bool success) {
    tokenRecipient spender = tokenRecipient(_spender);
    if (approve(_spender, _value)) {
      spender.receiveApproval(msg.sender, _value, address(this), _extraData);
      return true;
    }
  }

  // Remove `_value` tokens from the system irreversibly
  function burn(uint256 _value) public returns (bool success) {
    require(balanceOf[msg.sender] >= _value); // Check if the sender has enough
    balanceOf[msg.sender] -= _value; 
    totalSupply -= _value; 
    emit Burn(msg.sender, _value);
    return true;
  }

  // Remove `_value` tokens from the system irreversibly on behalf of `_from`.
  function burnFrom(address _from, uint256 _value) public returns (bool success){
    require(balanceOf[_from] >= _value); // Check if the targeted balance is enough
    require(_value <= allowance[_from][msg.sender]); // Check allowance
    balanceOf[_from] -= _value; 
    allowance[_from][msg.sender] -= _value; 
    totalSupply -= _value; 
    emit Burn(_from, _value);
    return true;
  }
}