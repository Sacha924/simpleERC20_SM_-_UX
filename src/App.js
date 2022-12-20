import { useState, useEffect } from "react";
import Web3 from "web3";
import "./App.css";

function App() {
  const [errorMess, setErrorMess] = useState("");
  const [infos, setInfos] = useState({});

  const contractAdress = "0x2f7DD9a72A3610aF3a0a3916e7f7d41853d71c6a";
  const abi = require("./contract/abi/MyTokenABI.json").output.abi;
  let contractInstance;
  useEffect(() => {
    displayInfos();
  }, []);

 

  const displayInfos = async () => {
    // check if a provider is available
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum); // create a web3 instance (library that allows you to interact with the Ethereum blockchain) using the provider from MetaMask (window.ethereum)
      const [account, chainId, lastblock] = await Promise.all([web3.eth.getAccounts(), web3.eth.getChainId(), web3.eth.getBlockNumber()]).catch((error) => {
        // This code will be executed if any of the promises are rejected
        setErrorMess(error);
      });

      contractInstance = new web3.eth.Contract(abi, contractAdress); // creates an instance of a contract on the Ethereum blockchain using its ABI and contract address.
      const balance = await contractInstance.methods.balanceOf(account).call(); //  get the balance of the account that is connected to MetaMask
      setInfos({ account, chainId, lastblock, balance });
    } else {
      setErrorMess("Please install MetaMask!");
    }
  };

  return (
    <div className="App">
      {errorMess === "" ? (
        <div>
          <p style={{ color: "#DC7F9B", fontSize: "44px", fontWeight: "600" }}>Account : {infos.account}</p>
          <p style={{ color: "#94BFA7", fontSize: "44px", fontWeight: "400" }}>Chain ID : {infos.chainId}</p>
          <p style={{ color: "#E0B7B7", fontSize: "44px", fontWeight: "500" }}>Last block : {infos.lastblock}</p>
          <p style={{ color: "#FAA9CA", fontSize: "44px", fontWeight: "500" }}>Current Balance : {infos.lastblock}</p>
        </div>
      ) : (
        <div className="error">{errorMess}</div>
      )}
    </div>
  );
}

export default App;
