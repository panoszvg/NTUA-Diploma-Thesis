import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import './App.css';
import contract from './VendingMachine.json';

const contractAddress = "0xff0D036b48FfE3DBA3215e535f205033115B03C1";
const abi = contract.abi;

function App() {

    const [currentAccount, setCurrentAccount] = useState(null);
    const [donuts, setDonuts] = useState(null);

    const checkWalletIsConnected = async () => {
        const { ethereum } = window;
        
        if (!ethereum) {
            console.log("Make sure you have Metamask installed!");
            return;
        }
        else {
            console.log("Wallet exists! We're ready to go!");    
        }

        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (accounts.length !== 0) {
            const account = accounts[0];
            console.log("Found an authorized account: ", account);
            setCurrentAccount(account);
        }
        else {
            console.log("No authorized account found");
        }
    }

    const connectWalletHandler = async () => {
        const { ethereum } = window;
        
        if (!ethereum) {
            alert("Please install Metamask!");
        }

        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            console.log("Found an account! Address: ", accounts[0]);
            setCurrentAccount(accounts[0]);
        } catch (err) {
            console.log(err);
        }
    }

    const balanceGetter = async () => {
        try {
            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(contractAddress, abi, signer);

                let result = await contract.getVendingMachineBalance();
                setDonuts(parseInt((result._hex).toString(16), 16));    
            }
            else {
                console.log("Ethereum object does not exist");
            }
        }
        catch(err) {
            console.log(err);
        }
    }

    const donutPurchaser = async () => {
        try {
            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(contractAddress, abi, signer);

                const privateKey = process.env.REACT_APP_PRIVATE_KEY;
                let wallet = new ethers.Wallet(privateKey, provider);
                let contractWithSigner = contract.connect(wallet);

                let amount = ethers.utils.parseUnits("2", "ether");
                console.log(amount);

                let result = await contractWithSigner.purchase(1, {value: amount, gasLimit: 6721975});
                
                result = await contract.getVendingMachineBalance();
                setDonuts(parseInt((result._hex).toString(16), 16));    
            }
            else {
                console.log("Ethereum object does not exist");
            }
        }
        catch(err) {
            console.log(err);
        }
    }

    const connectWalletButton = () => {
        return (
        <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
            Connect Wallet
        </button>
        )
    }

    const getBalance = () => {
        return (
            <button onClick={balanceGetter} className='cta-button orange-button'>
                Get Donuts
            </button>
        )
    }

    const purchaseDonut = () => {
        return (
            <button onClick={donutPurchaser} className='cta-button orange-button'>
                Purchase Donut
            </button>
        )
    }

    useEffect(() => {
        checkWalletIsConnected();
    }, [])



    return (
        <div className='main-app'>
            <h1>Vending Machine</h1>
            <div className='row'>
                {currentAccount ? `Address connected is: ${currentAccount}` : connectWalletButton()}
            </div>
            <div className='row'>

                <div className='col'>
                    {currentAccount ? getBalance() : ''}
                    <h3>{(donuts !== null) ? `There are ${donuts} donuts` : ''}</h3>
                </div>
                <div className='col'>
                    {currentAccount ? purchaseDonut() : ''}
                    <h3>{(donuts !== null) ? `Purchased a donut` : ''}</h3>
                </div>
            </div>
        </div>
    )
}

export default App;