const solc = require("solc");
const fs = require("fs");

function generateContractCode(name, symbol, supply) {
  const className = name.split(" ").join(""); // misalnya "ICE TEA" -> "ICETEA"

  const contractCode = `
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract ERC20 {
  mapping(address => uint256) public balances;
  mapping(address => mapping(address => uint256)) public allowed;

  uint256 public totalSupply;
  string public name;
  string public symbol;
  uint256 public decimals;

  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);

  constructor(string memory _name, string memory _symbol, uint256 _supply, uint256 _decimals) {
    name = _name;
    symbol = _symbol;
    totalSupply = _supply * 10 ** _decimals;
    balances[msg.sender] = totalSupply;
    decimals = _decimals;
  }

  function transfer(address _to, uint256 _value) public {
    require(balances[msg.sender] >= _value, "Insufficient balance");
    balances[msg.sender] -= _value;
    balances[_to] += _value;
    emit Transfer(msg.sender, _to, _value);
  }

  function approve(address _spender, uint256 _value) public {
    allowed[msg.sender][_spender] = _value;
    emit Approval(msg.sender, _spender, _value);
  }

  function transferFrom(address _from, address _to, uint256 _value) public {
    require(balances[_from] >= _value, "Insufficient balance");
    require(allowed[_from][msg.sender] >= _value, "Allowance exceeded");
    balances[_from] -= _value;
    balances[_to] += _value;
    allowed[_from][msg.sender] -= _value;
    emit Transfer(_from, _to, _value);
  }

  function balanceOf(address _owner) public view returns (uint256) {
    return balances[_owner];
  }

  function allowance(address _owner, address _spender) public view returns (uint256) {
    return allowed[_owner][_spender];
  }
}

contract ${className} is ERC20 {
  constructor() ERC20("${name}", "${symbol}", ${supply}, 18) {}
}
`;

  // Simpan ke file (opsional)
  fs.writeFileSync("contract.sol", contractCode);

  const input = {
    language: "Solidity",
    sources: {
      "contract.sol": {
        content: contractCode,
      },
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["*"],
        },
      },
    },
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  if (output.errors) {
    output.errors.forEach((err) => {
      console.error("Compile error:", err.formattedMessage);
    });
    throw new Error("Solidity compile failed.");
  }

  const contract = output.contracts["contract.sol"][className];
  if (!contract) {
    throw new Error(`Contract "${className}" not found in compiled output.`);
  }

  return {
    abi: contract.abi,
    bytecode: contract.evm.bytecode,
  };
}

module.exports = { generateContractCode };
