import styles from '../styles/Home.module.css';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import contract from '../truffle/build/contracts/Graphs.json';

const contractAddress = "0xfd7EBed0E0a0cE3b3F6958a2DaD47A5A1b738A8a";
const abi = contract.abi;

export default function Home() {

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

    const disconnectWalletHandler = async () => {
        const { ethereum } = window;
        
        if (!ethereum) {
            alert("Please install Metamask!");
        }

        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            console.log("Found an account! Address: ", accounts[0]);
            setCurrentAccount(null);
        } catch (err) {
            console.log(err);
        }
    }

    const getData = async () => {
        try {
            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(contractAddress, abi, signer);

                console.log(contract)

                let result = await contract.getDays(1654387200, 1654473600);
                // setDonuts(parseInt((result._hex).toString(16), 16));
                console.log(result);
            }
            else {
                console.log("Ethereum object does not exist");
            }
        }
        catch(err) {
            console.log(err);
        }
    }

    const addData = async () => {
        try {
            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(contractAddress, abi, signer);

                const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;
                let wallet = new ethers.Wallet(privateKey, provider);
                let contractWithSigner = contract.connect(wallet);

                // addToDay(uint date, string memory newKeywordsString, uint newQuestions, uint newAnswers)
                const stringArg = "test,test2";
                let result = await contractWithSigner.addToDay(1654473600, stringArg, 1, 0, {gasLimit: 6721975});
                
                // result = await contract.getDays(1654387200, 1654473600);
                // setDonuts(parseInt((result._hex).toString(16), 16));
                console.log(result);    
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
        <button onClick={connectWalletHandler} className={`${styles.ctaButton} ${styles.connectWalletButton}`}>
            Connect Wallet
        </button>
        )
    }

    const disconnectWalletButton = () => {
        return (
        <button onClick={disconnectWalletHandler} className={`${styles.ctaButton} ${styles.connectWalletButton}`}>
            Disconnect Wallet
        </button>
        )
    }

    const getDataHandler = () => {
        return (
            <button onClick={getData} className={`${styles.ctaButton} ${styles.orangeButton}`}>
                Get Data
            </button>
        )
    }

    const addDataHandler = () => {
        return (
            <button onClick={addData} className={`${styles.ctaButton} ${styles.orangeButton}`}>
                Add Data
            </button>
        )
    }

    useEffect(() => {
        checkWalletIsConnected();
    }, []);

    return (
        <div className={styles.mainApp}>
            <h1>Graphs Service</h1>
            <div className={styles.row}>
                {currentAccount ? `Address connected is: ${currentAccount}` : connectWalletButton()}
            </div>
            <div className={styles.row}>
                {currentAccount ? disconnectWalletButton() : ''}
            </div>
            <div className={styles.row}>

                <div className={styles.col}>
                    {currentAccount ? getDataHandler() : ''}
                    <h3>{(donuts !== null) ? `There are ${donuts} donuts` : ''}</h3>
                </div>
                <div className={styles.col}>
                    {currentAccount ? addDataHandler() : ''}
                    <h3>{(donuts !== null) ? `Purchased a donut` : ''}</h3>
                </div>
            </div>
        </div>
    )
}
