import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "./utils/WavePortal.json";

const App = () => {

  const contractAddress = "0x8596bEed3BE64797ee241F81FE0E49130d92C709";
  const contractABI = abi.abi;

  const [formText, setFormText] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllWaves = async () => {
    const { ethereum } = window;

    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        const waves = await wavePortalContract.getAllWaves();

        const wavesCleaned = waves.map((wave) => {
          return {
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
          };
        });

        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        const waveTxn = await wavePortalContract.wave(formText, { gasLimit: 300000 })
        console.log("Mining...", waveTxn.hash);
        setLoading(true)

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        // setWaveCount(count.toNumber());
        getAllWaves();

      } else {
        console.log("Ethereum object doesn't exist!");
        // setWaveCount(count.toNumber());
      }
    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false)
      setFormText("");
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  useEffect(() => {
    getAllWaves();
  })

  useEffect(() => {
    let wavePortalContract;

    const onNewWave = (from, timestamp, message) => {
      console.log("NewWave", from, timestamp, message);
      setAllWaves((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };


    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      wavePortalContract.on("NewWave", onNewWave);
    }

    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("NewWave", onNewWave);
      }
    };
  }, []);

  const handleChange = (e) => {
    setFormText(e.target.value);
  };

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          👋 Wave at Lucus
        </div>
  <>
        {!currentAccount && (
          <button className="walletButton" onClick={connectWallet}>
            Connect Wallet
           </button>
        )}

        {currentAccount && (
          <div className="walletConnect">Wallet Connected!</div>
        )}
</>
        <input
          className="input"
          type="text"
          onChange={handleChange}
          value={formText}
          placeholder="Send me a message!"
        />

        {loading !== true ? (
        <button className="waveButton" onClick={wave}>
          👋 Wave at me
        </button>
        ) : (
        <button className="waveButton" onClick={wave}>
          👋 Wave is being mined on the blockchain! Please wait!
        </button>
        )}
  
        <div className="waves">
          {allWaves.map((wave, index) => {
            return (
              <div className="wave" key={index} style={{ marginTop: "16px", padding: "8px" }}>
                <div>From: {wave.address}</div>
                <div>Date: {wave.timestamp.toString()}</div>
                <div>Message: {wave.message}</div>
              </div>)
          })}
        </div>
      </div>
    </div>
  );
}

export default App