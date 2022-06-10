import styles from '../styles/Home.module.css';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import contract from '../truffle/build/contracts/Graphs.json';
import BarChart from './BarChart';
import LineChart from './LineChart';

const abi = contract.abi;
const contractAddress = "0x251e6D081eEb399783CB94F5e3C84B883576Cb8b"

export default function Home() {

    const [currentAccount, setCurrentAccount] = useState(null);
    const [keywordsData, setKeywordsData] = useState([]);
    const [questionsData, setQuestionsData] = useState([]);
    const [answersData, setAnswersData] = useState([]);
    const [noKeywordsData, setNoKeywordsData] = useState([]);

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
                Update Graphs
            </button>
        )
    }

    useEffect(() => {
        checkWalletIsConnected();
        getData();
        setInterval(() => {
            (currentAccount) ? getData() : '';
            keywordsData; // access to update
        }, 5000)
    }, [])

    return (
        <div className={styles.mainApp}> 
            <div className={styles.top}>
                <h1>Graphs Service</h1>
            </div>
            <div className={styles.row} style={{"position" : "relative", "marginTop": "13%"}}>
                {currentAccount ? `Wallet Address connected is: ${currentAccount}` : 'No Wallet Address connected.'}
            </div>
            <div className={styles.row} style={{"marginTop": "30px"}}>
                <div className={styles.col}>
                    {currentAccount ? disconnectWalletButton() : connectWalletButton()}
                </div>
                <div className={styles.col}>
                    {getDataHandler()}
                </div>
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
