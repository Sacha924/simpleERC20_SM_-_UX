import { useRef, useState, useEffect } from "react";
import Web3 from "web3";
import "./App.css";

function App() {
  const [errorMess, setErrorMess] = useState("");
  const [successMess, setSuccessMess] = useState("");
  const [contractInstance, setContractInstance] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const [infos, setInfos] = useState({});
  const inputRef_address = useRef();
  const inputRef_value = useRef();

  const contractAdress = "0x2f7DD9a72A3610aF3a0a3916e7f7d41853d71c6a";
  const abi = require("./contract/abi/MyTokenABI.json").output.abi;

  // I use two useEffect to prevent an infinite loop, because if the useEffect update the state of isConnected, but his also called when the isConnected is update, this will create a loop
  useEffect(() => {
    if (window.ethereum) {
      setIsConnected(window.ethereum.isConnected());
      window.ethereum.on("accountsChanged", (e) => {
        if (e.length == 0) {
          document.location.reload();
        } //because when the user disconnects is metamask this event returns an empty array, we only want to consider the disconnection event here
      });
      window.ethereum.on("chainChanged", () => {
        document.location.reload();
      });
    }
  }, []);

  useEffect(() => {
    displayInfos();
  }, [isConnected]);

  const connectWallet = async () => {
    await window.ethereum
      .enable()
      .then(() => setIsConnected(true))
      .catch((e) => console.log("error :", e));
  };

  const displayInfos = async () => {
    // check if a provider is available
    if (window.ethereum) {
      if (isConnected) {
        const web3 = new Web3(window.ethereum); // create a web3 instance (library that allows you to interact with the Ethereum blockchain) using the provider from MetaMask (window.ethereum)
        const [account, chainId, lastblock] = await Promise.all([web3.eth.getAccounts(), web3.eth.getChainId(), web3.eth.getBlockNumber()]).catch((error) => {
          // This code will be executed if any of the promises are rejected
          setErrorMess(error);
        });

        if (account !== []) {
          const contractInstance = new web3.eth.Contract(abi, contractAdress); // creates an instance of a contract on the Ethereum blockchain using its ABI and contract address.
          setContractInstance(contractInstance);
          const balance = await contractInstance.methods.balanceOf(account[0]).call(); //  get the balance of the account that is connected to MetaMask
          const decimal = await contractInstance.methods.decimals().call(); // get the number of decimals of the token
          const realBalance = balance / 10 ** decimal; // convert the balance to a real number
          const symbol = await contractInstance.methods.symbol().call(); // get the symbol of the token

          setInfos({ account, chainId, lastblock, balance, decimal, realBalance, symbol });
        }
      }
    } else {
      setErrorMess("Please install MetaMask!");
    }
  };

  const sendTokens = async (_to, _value) => {
    const success = await contractInstance.methods
      .tranfer(_to, _value)
      .call()
      .catch((e) => setErrorMess(`Something Wrong Happened : ${e}`));
    if (success) setSuccessMess("Transaction Successful ! You just sent " + _value + " tokens to " + _to + " !");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const _address = inputRef_address.current.value;
    const _value = parseFloat(inputRef_value.current.value); //*(10**infos.decimal);
    console.log(_address, _value);
    sendTokens(_address, _value);
  };

  const styleLabel = { color: "#FB8DFF", fontSize: "28px", fontWeight: "400", marginBottom: "1%" };

  return (
    <div>
      {errorMess === "" ? (
        <div>
          <div>
            <p style={{ color: "#DC7F9B", fontSize: "44px", fontWeight: "600", margin: "5% 0% 5% 12%", whiteSpace: "nowrap" }}>Account : {infos.account}</p>
            <p style={{ color: "#94BFA7", fontSize: "44px", fontWeight: "400", margin: "0% 0% 2% 81%", whiteSpace: "nowrap" }}>Chain ID : {infos.chainId}</p>
            <p style={{ color: "#E0B7B7", fontSize: "44px", fontWeight: "500", margin: "0% 0% 6% 6%", whiteSpace: "nowrap" }}>Last block : {infos.lastblock}</p>
            <p style={{ color: "#FAA9CA", fontSize: "44px", fontWeight: "500", margin: "0% 0% 5% 62%", whiteSpace: "nowrap" }}>
              Current Balance : {infos.realBalance} {infos.symbol}
            </p>
          </div>
          <div>
            {!isConnected && (
              <button id="connectHandl" onClick={connectWallet}>
                Connect your wallet
              </button>
            )}
          </div>
          <div>
            <form id="tokenForm" onSubmit={handleSubmit}>
              <label htmlFor="addressTo" style={styleLabel}>
                Address You want to send tokens to
              </label>
              <input type="text" id="addressTo" name="addressTo" placeholder="0x..." style={{ textAlign: "center" }} required size={44} ref={inputRef_address} />
              <br />
              <label htmlFor="amount" style={styleLabel}>
                Amount of tokens you want to send
              </label>
              <input type="number" id="amount" name="amount" placeholder="0.00...1 (18 decimals max)" style={{ textAlign: "center" }} step={1 / 10 ** infos.decimal} required size={18} ref={inputRef_value} />

              <button type="submit" style={{ color: "#FB8DFF", backgroundColor: "black", width: "23%", height: "30px", marginTop: "1%" }}>
                Send Tokens
              </button>
            </form>
            <p style={{ textAlign: "center", color: "white", fontSize: "20px" }}> {successMess}</p>
          </div>
        </div>
      ) : (
        <p className="error">{errorMess}</p>
      )}
    </div>
  );
}

export default App;
