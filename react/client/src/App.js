import React, {Component} from "react"
import './App.css'
import Home from "./Home"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"

class App extends Component {

    state = {
        web3: null,
        accounts: null,
        chainid: null,

        solidityStorage: null,
        solidityValue: 0,
        solidityInput: 0,
        
        traderContract: null,
        traderAdmin: null,
        traderDaiBalance: 0,
        traderUSDCBalance: 0,

        daiContract: null,
        usdcContract: null,
        userDaiBalance: 0,
        userUsdcBalance: 0
    }

    componentDidMount = async () => {

        // Get network provider and web3 instance.
        const web3 = await getWeb3()

        // Try and enable accounts (connect metamask)
        try {
            const ethereum = await getEthereum()
            ethereum.enable()
        } catch (e) {
            console.log(`Could not enable accounts. Interaction with contracts not available.
            Use a modern browser with a Web3 plugin to fix this issue.`)
            console.log(e)
        }

        // Use web3 to get the user's accounts
        const accounts = await web3.eth.getAccounts()

        // Get the current chain id
        const chainid = parseInt(await web3.eth.getChainId())

        this.setState({
            web3,
            accounts,
            chainid
        }, await this.loadInitialContracts)

    }

    loadInitialContracts = async () => {
        // <=42 to exclude Kovan, <42 to include kovan
        if (this.state.chainid < 42) {
            // Wrong Network!
            return
        }
        console.log(this.state.chainid)
        
        var _chainID = 0;
        if (this.state.chainid === 42){
            _chainID = 42;
        }
        if (this.state.chainid === 1337){
            _chainID = "dev"
        }
        console.log(_chainID)
        const solidityStorage = await this.loadContract(_chainID,"SolidityStorage")
        const traderContract = await this.loadContract(_chainID,"Trader")
        const daiContract = await this.loadContract(_chainID,"DAI")
        const usdcContract = await this.loadContract(_chainID,"USDC")



        if (!solidityStorage || !daiContract) {
            return
        }

        const solidityValue = await solidityStorage.methods.get().call()
        const traderAdmin = await traderContract.methods.viewAdmin().call()
        const userDaiBalance = await daiContract.methods.balanceOf(this.state.accounts[0]).call()
        const userUsdcBalance = await usdcContract.methods.balanceOf(this.state.accounts[0]).call()
        const traderDaiBalance = await traderContract.methods.daiBalance().call()
        const traderUSDCBalance = await traderContract.methods.usdcBalance().call()


        this.setState({
            solidityStorage,
            solidityValue,
            traderContract,
            userDaiBalance,
            userUsdcBalance,
            traderDaiBalance,
            traderUSDCBalance,
            daiContract,
            usdcContract,
            
        })
    }

    loadContract = async (chain, contractName) => {
        // Load a deployed contract instance into a web3 contract object
        const {web3} = this.state

        // Get the address of the most recent deployment from the deployment map
        let address
        try {
            address = map[chain][contractName][0]
        } catch (e) {
            console.log(`Couldn't find any deployed contract "${contractName}" on the chain "${chain}".`)
            return undefined
        }

        // Load the artifact with the specified address
        let contractArtifact
        try {
            contractArtifact = await import(`./artifacts/deployments/${chain}/${address}.json`)
        } catch (e) {
            console.log(`Failed to load contract artifact "./artifacts/deployments/${chain}/${address}.json"`)
            return undefined
        }

        return new web3.eth.Contract(contractArtifact.abi, address)
    }


    changeSolidity = async (e) => {
        const {accounts, solidityStorage, solidityInput} = this.state
        e.preventDefault()
        const value = parseInt(solidityInput)
        if (isNaN(value)) {
            alert("invalid value")
            return
        }
        await solidityStorage.methods.set(value).send({from: accounts[0]})
            .on('receipt', async () => {
                this.setState({
                    solidityValue: await solidityStorage.methods.get().call()
                })
            })
    }

    setAdmin = async (e) => {
        const {accounts, traderContract} = this.state
        e.preventDefault()

        await traderContract.methods.setAdmin().send({from: accounts[0]})
            .on('receipt', async () => {
                this.setState({
                    traderAdmin: await traderContract.methods.viewAdmin().call()
                })
            })
    }

    depositDAI = async (e) => {
        const {accounts, daiContract, traderContract} = this.state
        e.preventDefault()

        await daiContract.methods.transfer(traderContract._address, 100).send({from: accounts[0]})
            .on('receipt', async () => {
                this.setState({
                    userDaiBalance: await daiContract.methods.balanceOf(this.state.accounts[0]).call(),
                    traderDaiBalance: await traderContract.methods.daiBalance().call()

                })
            })
    }

    depositUSDC = async (e) => {
        const {accounts, usdcContract, traderContract} = this.state
        e.preventDefault()

        await usdcContract.methods.transfer(traderContract._address, 100).send({from: accounts[0]})
            .on('receipt', async () => {
                this.setState({
                    userUsdcBalance: await usdcContract.methods.balanceOf(this.state.accounts[0]).call(),
                    traderUSDCBalance: await traderContract.methods.usdcBalance().call()

                })
            })
    }

    withdrawDAI = async (e) => {
        const {accounts, daiContract, traderContract} = this.state
        e.preventDefault()

        await traderContract.methods.withdrawDai().send({from: accounts[0]})
            .on('receipt', async () => {
                this.setState({
                    userDaiBalance: await daiContract.methods.balanceOf(this.state.accounts[0]).call(),
                    traderDaiBalance: await traderContract.methods.daiBalance().call()

                })
            })
    }

    withdrawUSDC = async (e) => {
        const {accounts, usdcContract, traderContract} = this.state
        e.preventDefault()

        await traderContract.methods.withdrawUsdc().send({from: accounts[0]})
            .on('receipt', async () => {
                this.setState({
                    userUsdcBalance: await usdcContract.methods.balanceOf(this.state.accounts[0]).call(),
                    traderUSDCBalance: await traderContract.methods.usdcBalance().call()

                })
            })
    }

    render() {
        const {
            web3, accounts, chainid,
            solidityStorage, solidityValue, solidityInput,
            traderAdmin, traderDaiBalance, traderUSDCBalance,
            userDaiBalance, userUsdcBalance
        } = this.state

        if (!web3) {
            return <div>Loading Web3, accounts, and contracts...</div>
        }

        // <=42 to exclude Kovan, <42 to include Kovan
        if (isNaN(chainid) || chainid < 42) {
            return <div>Wrong Network! Switch to your local RPC "Localhost: 8545" in your Web3 provider (e.g. Metamask)</div>
        }

        if ( !solidityStorage) {
            return <div>Could not find a deployed contract. Check console for details.</div>
        }

        const isAccountsUnlocked = accounts ? accounts.length > 0 : false

        return (<div className="App">

            {
                !isAccountsUnlocked ?
                    <p><strong>Connect with Metamask and refresh the page to
                        be able to edit the storage fields.</strong>
                    </p>
                    : null
            }

            <h2>Solidity Storage Contract</h2>
            <div>The stored value is: {solidityValue}</div>
            <br/>
            <form onSubmit={(e) => this.changeSolidity(e)}>
                <div>
                    <label>Change the value to: </label>
                    <br/>
                    <input
                        name="solidityInput"
                        type="text"
                        value={solidityInput}
                        onChange={(e) => this.setState({solidityInput: e.target.value})}
                    />
                    <br/>
                    <button type="submit" disabled={!isAccountsUnlocked}>Submit</button>

                </div>
            </form>
            <button onClick={this.setAdmin}>Set TradeContract Admin</button>
            <div>trader admin: {traderAdmin}</div>
            <div>user dai balance: {userDaiBalance}</div>
            <div>user usdc balance: {userUsdcBalance}</div>
            <div>trader dai balance: {traderDaiBalance}</div>
            <div>trader usdc balance: {traderUSDCBalance}</div>
            <button onClick={this.depositDAI}>Deposit DAI</button>
            <button onClick={this.depositUSDC}>Deposit USDC</button>
            <button onClick={this.withdrawDAI}>Withdraw DAI</button>
            <button onClick={this.withdrawUSDC}>Withdraw USDC</button>


        <Home/>
        </div>)
    }
}

export default App
