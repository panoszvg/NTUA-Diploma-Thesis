import styles from '../styles/Home.module.css';
import Head from 'next/head';
import { ethers } from 'ethers';
const Contract = require('web3-eth');
import { BatchRequest } from 'web3-core';
import { useEffect, useState } from 'react';
import contract from '../truffle/build/contracts/Graphs.json';
import BarChart from './BarChart';
import LineChart from './LineChart';

const abi = contract.abi;
const contractAddress = "0x1C4a78050B3BCb9cF2700aCb54B758cc03D8De1f"

export default function Home() {

    const [currentAccount, setCurrentAccount] = useState(null);
    const [keywordsData, setKeywordsData] = useState([]);
    const [questionsData, setQuestionsData] = useState([]);
    const [answersData, setAnswersData] = useState([]);

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

    const addContractHandler = (address) => {
        setContractAddress(address);
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

                let result = await contract.getDays(1654214400, 1654473600);
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

    const makeTransaction = (promise) => {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;
        let wallet = new ethers.Wallet(privateKey, provider);
        let contractWithSigner = contract.connect(wallet);

        contractWithSigner.addToDay(promise[0], promise[1], promise[2], promise[3], {gasLimit: 6721975, nonce: promise[4]});
        // console.log(result)
    }

    const addData = async () => {
        if (contractAddress !== '' && currentAccount) ;
        else {
            console.log("Problem");
            return;
        }
        try {
            if (ethereum) {
                let data = [
                    {
                        "date": 1654214400,
                        "topic": "QUESTION",
                        "keywords": "question,14,kafka"
                    },
                    {
                        "date": 1654214400,
                        "topic": "QUESTION",
                        "keywords": "question,15,kafka"
                    },
                    {
                        "date": 1654300800,
                        "topic": "ANSWER",
                        "keywords": ''
                    }
                ]

                let days = new Map();

                data.map(elem => {
                    if (!days.get(elem.date)) {
                        days.set(elem.date, {
                            questions: (elem.topic === "QUESTION") ? 1 : 0,
                            answers: (elem.topic === "QUESTION") ? 0 : 1,
                            keywords: (elem.topic === "QUESTION") ? elem.keywords : ''
                        })
                    }
                    else {
                        days.set(elem.date, {
                            questions: (elem.topic === "QUESTION") ? days.get(elem.date).questions + 1 : days.get(elem.date).questions,
                            answers: (elem.topic === "QUESTION") ? days.get(elem.date).answers : days.get(elem.date).answers + 1,
                            keywords: (elem.topic === "QUESTION") ? elem.keywords.concat(',' + days.get(elem.date).keywords) : days.get(elem.date).keywords
                        })
                    }
                });

                const Web3 = require('web3');
                const web3 = new Web3(Web3.givenProvider);
                const contract = new web3.eth.Contract(abi, contractAddress);
                let batch = new web3.BatchRequest();
                
                days.forEach((elem, key) => {
                    // batch.add(contract.methods.addToDay(key, elem.keywords, elem.questions, elem.answers))
                    batch.add(contract.methods.addToDay(key, elem.keywords, elem.questions, elem.answers).send({ from: currentAccount }));
                });
                
                // batch.add(contract.methods.addToDay(1654473600, stringArg, 1, 0));
                // console.log(contract.methods.addToDay(1654473600, stringArg, 1, 0))
                // batch.add(contract.methods.addToDay(1654473600, stringArg, 1, 0).send({ from: currentAccount }));

                batch.execute();

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
                {currentAccount ? `Wallet Address connected is: ${currentAccount}` : 'No Wallet Address connected.'}
            </div>
            <div className={styles.row} style={{"marginTop": "10px"}}>
                {(contractAddress !== '') ? `Contract Address connected is: ${contractAddress}` : 'No Contract Address given.'}
            </div>
            <div className={styles.row} style={{"marginTop": "30px"}}>
                <div className={styles.col}>
                    {currentAccount ? disconnectWalletButton() : connectWalletButton()}
                </div>
                <div className={styles.col}>
                    {addDataHandler()}
                </div>
            </div>
            <div className={styles.row}>
                {getDataHandler()}
            </div>
            <div className={styles.row}>
                <div className={styles.col}>
                    <BarChart data={keywordsData}/>
                </div>
                <div className={styles.col}>
                    <LineChart data={questionsData} title={'Number of Questions'}/>
                </div>
                <div className={styles.col}>
                    <LineChart data={answersData} title={'Number of Answers'}/>
                </div>
            </div>

        </div>
    )
}
