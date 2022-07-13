import styles from '../styles/Home.module.css';
import { useEffect, useState } from 'react';
import contract from '../public/Graphs.json';
import BarChart from './BarChart';
import LineChart from './LineChart';
import Web3 from 'web3';
import HDWalletProvider from '@truffle/hdwallet-provider';

const abi = contract.abi;
const contractAddress = "0x292BC609f99b1Fe0bEBf89ed5C6bCB3B27c796dB"

export default function Home() {

    const [keywordsData, setKeywordsData] = useState([]);
    const [questionsData, setQuestionsData] = useState([]);
    const [answersData, setAnswersData] = useState([]);
    const [noKeywordsData, setNoKeywordsData] = useState([]);
    const [days, setDays] = useState(5);

    const getData = async () => {
        try {
            const provider = new HDWalletProvider(process.env.NEXT_PUBLIC_MNEMONIC, `https://ropsten.infura.io/v3/515fa7c9a7bc4f2a90bcbca9a0e94ea0`)
            const web3 = new Web3(provider);
            const graphsContract = new web3.eth.Contract(abi, contractAddress);
            graphsContract.setProvider(provider);

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayInSeconds = Math.floor(today / 1000) + (86400/8);
            const previousDate = todayInSeconds - ((days - 1) * 86400);
            
            let result = await graphsContract.methods.getDays(previousDate, todayInSeconds).call();

            setKeywordsData(result.keywords);
            setQuestionsData(result.questions);
            setAnswersData(result.answers);
            setNoKeywordsData(result.noKeywords);
        }
        catch(err) {
            console.log(err);
        }
    }

    const getDataHandler = () => {
        return (
            <button onClick={getData} className={styles.ctaButton}>
                Update Graphs
            </button>
        )
    }

    const daysButtons = () => {
        return (
            <div className={styles.daysRow}>
                <button className={styles.daysButton}
                        style={(days === 5) ? {"backgroundColor" : "rgb(32, 129, 226)", "color": "antiquewhite"} : {}}
                        onClick={() => { setDays(5); }}>5</button>
                <button className={styles.daysButton} 
                        style={(days === 7) ? {"backgroundColor" : "rgb(32, 129, 226)", "color": "antiquewhite"} : {}}
                        onClick={() => { setDays(7); }}>7</button>
                <button className={styles.daysButton} 
                        style={(days === 9) ? {"backgroundColor" : "rgb(32, 129, 226)", "color": "antiquewhite"} : {}}
                        onClick={() => { setDays(9); }}>9</button>
            </div>
        )
    }

    useEffect(() => {
        getData();
    }, [keywordsData, questionsData, answersData, noKeywordsData])

    return (
        <div className={styles.mainApp}> 
            <div className={styles.top}>
                <h1>Graphs Service</h1>
            </div>
            <div style={{"marginTop": "130px", "fontSize" : "20px"}}>Get Data for the last N days:</div>
            <div style={{"marginBottom" : "50px"}}>
                {daysButtons()}
            </div>
            <div>
                {getDataHandler()}
            </div>
            <div className={styles.row}>
                <div className={styles.col}>
                    <BarChart key={keywordsData} data={[keywordsData, noKeywordsData, days]}/>
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
