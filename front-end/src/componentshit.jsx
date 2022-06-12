import React from "react";
import WaveForm from "./components/WaveForm";
import WaveList from "./components/WaveList";
import Wallet from "./components/Wallet";
import "./App.css";
import abi from "./utils/WavePortal.json";

const App = () => {
  
  const contractAddress = "0xA12C9f2Af4d213A90455E285A38Ab792A6a2b7CE";
  const contractABI = abi.abi;

  return (
    <div className="app">
    < WaveForm contractAddress={contractAddress} contractABI={contractABI} />
    < Wallet />
    < WaveList contractAddress={contractAddress} contractABI={contractABI} />
    </div>
  );
}

export default App