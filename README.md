# Wave Portal

## Description

Wave is a Web3 application that allows messages to be sent and received through smart contracts on the etherium network. Currently this application is using the Rinkeby Testnet to deploy the smart contract to avoid paying real gas fees.

![Alt text](https://github.com/LucusR/Wave/blob/main/smart-contract/assets/1.png)

## Dependencies

- Hardhat
- React
- Ethers
- Vite
- React
- Metamask (connected to Rinkeby)

## Smart Contract Deployment

1) Install dependencies with `npm install`.

Create a .env file using .envEXAMPLE as a template. You can get your alchemy key by logging in and creating an application [here](https://www.alchemy.com/).

2) Deploy smart contract to Rinkeyby testnet with `npx hardhat run scripts/deploy.js --network rinkeby`.

3) You can view your newly created smart contract on [etherscan] (https://etherscan.io/) by typing in your contract address (you can get your contract address from your terminal after you have deployed it).


