import styles from '../styles/Home.module.css';
import Head from 'next/head';
import { ethers } from 'ethers';
const Contract = require('web3-eth');
import { BatchRequest } from 'web3-core';
import { useEffect, useState } from 'react';
import contract from '../truffle/build/contracts/Graphs.json';
import BarChart from './BarChart';
import LineChart from './LineChart';
import { Dropdown } from 'semantic-ui-react';

const abi = contract.abi;
const contractAddress = "0x251e6D081eEb399783CB94F5e3C84B883576Cb8b"

export default function Home() {

    const [currentAccount, setCurrentAccount] = useState(null);
    const [keywordsData, setKeywordsData] = useState([]);
    const [questionsData, setQuestionsData] = useState([]);
    const [answersData, setAnswersData] = useState([]);
    const [noKeywordsData, setNoKeywordsData] = useState([]);
    const [isOpen, setOpen] = useState(false);

    const checkWalletIsConnected = async () => {
        const { ethereum } = window;
        
        if (!ethereum) {
            console.log("Make sure you have Metamask installed!");
            return;
        }
        else {
            // console.log("Wallet exists! We're ready to go!");    
        }

        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (accounts.length !== 0) {
            const account = accounts[0];
            // console.log("Found an authorized account: ", account);
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

                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const todayInSeconds = Math.floor(today / 1000) + (86400/8);
                const previousDate = todayInSeconds - (4 * 86400);
                let result = await contract.getDays(previousDate, todayInSeconds);

                setKeywordsData(result.keywords);
                let newQuestionsData = [];
                let newAnswersData = [];
                let newNoKeywordsData = [];
                for (let i = 0 ; i < result.questions.length; i++) {
                    newQuestionsData.push(parseInt((result.questions[i]._hex).toString(16), 16));
                    newAnswersData.push(parseInt((result.answers[i]._hex).toString(16), 16));
                    newNoKeywordsData.push(parseInt((result.noKeywords[i]._hex).toString(16), 16));
                }
                setQuestionsData(newQuestionsData);
                setAnswersData(newAnswersData);
                setNoKeywordsData(newNoKeywordsData);
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
                const today = new Date();
                today.setHours(0,0,0,0);
                const todayInSeconds = Math.floor(today / 1000) + (86400 / 8) - (86400 * 2);
                let data = [
                    {
                        "date": todayInSeconds,
                        "topic": "QUESTION",
                        "keywords": "question,14,kafka",
                        "noKeywords": 0
                    },
                    {
                        "date": todayInSeconds,
                        "topic": "QUESTION",
                        "keywords": "question,15,kafkajs",
                        "noKeywords": 0
                    },
                    {
                        "date": todayInSeconds,
                        "topic": "QUESTION",
                        "keywords": "",
                        "noKeywords": 1
                    },
                    {
                        "date": todayInSeconds,
                        "topic": "ANSWER",
                        "keywords": '',
                        "noKeywords": 0
                    }
                ]

                let days = new Map();

                data.map(elem => {
                    if (!days.get(elem.date)) {
                        days.set(elem.date, {
                            questions: (elem.topic === "QUESTION") ? 1 : 0,
                            answers: (elem.topic === "QUESTION") ? 0 : 1,
                            keywords: (elem.topic === "QUESTION") ? elem.keywords : '',
                            noKeywords: elem.noKeywords
                        })
                    }
                    else {
                        if (elem.noKeywords === 0) {
                            days.set(elem.date, {
                                questions: (elem.topic === "QUESTION") ? days.get(elem.date).questions + 1 : days.get(elem.date).questions,
                                answers: (elem.topic === "QUESTION") ? days.get(elem.date).answers : days.get(elem.date).answers + 1,
                                keywords: (elem.topic === "QUESTION") ? elem.keywords.concat(',' + days.get(elem.date).keywords) : days.get(elem.date).keywords,
                                noKeywords: elem.noKeywords + days.get(elem.date).noKeywords
                            })
                        }
                        else {
                            days.set(elem.date, {
                                questions: (elem.topic === "QUESTION") ? days.get(elem.date).questions + 1 : days.get(elem.date).questions,
                                answers: (elem.topic === "QUESTION") ? days.get(elem.date).answers : days.get(elem.date).answers + 1,
                                keywords: days.get(elem.date).keywords,
                                noKeywords: elem.noKeywords + days.get(elem.date).noKeywords
                            })
                        }
                    }
                });

                const Web3 = require('web3');
                const HDWalletProvider = require('@truffle/hdwallet-provider');
                const provider = new HDWalletProvider(process.env.NEXT_PUBLIC_MNEMONIC, `https://ropsten.infura.io/v3/4753dbd425664af5b25153ac5bee2cb8`);
                const web3 = new Web3(provider);
                const contract = new web3.eth.Contract(abi, contractAddress);
                contract.setProvider(provider);
                let batch = new web3.BatchRequest();

                console.log(days)

                days.forEach((elem, key) => {
                    batch.add(contract.methods.addToDay(key, elem.keywords, elem.questions, elem.answers, elem.noKeywords).send({ from: currentAccount }));
                });
                
                batch.execute();

            }
            else {
                console.log("Ethereum object does not exist");
            }
        }
        catch(err) {
            // console.log(err);
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
                    <BarChart key={keywordsData} data={[keywordsData, noKeywordsData]}/>
                </div>
                <div className={styles.col}>
                    <LineChart key={questionsData} data={questionsData} title={'Number of Questions'}/>
                </div>
                <div className={styles.col}>
                    <LineChart key={answersData} data={answersData} title={'Number of Answers'}/>
                </div>
            </div>

        </div>
    )
}
