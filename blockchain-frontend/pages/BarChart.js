import React from 'react';
import { Bar } from 'react-chartjs-2'
import { Chart, CategoryScale, LinearScale, BarElement } from 'chart.js'
Chart.register(CategoryScale, LinearScale, BarElement);


export default (props) => ({
    displayName: 'Top Keywords',
    render() {
                
        let data = {};

        for (let i = 0; i < props.data[0].length; i++) {
            if (data[props.data[0][i]] === undefined) {
                data[props.data[0][i]] = 1;
            }
            else {
                data[props.data[0][i]] = data[props.data[0][i]] + 1;
            }
        }
        
        data["No Keywords"] = 0;
        for (let i = 0; i < props.data[1].length; i++) {
            for (let j = 0; j < props.data[1][i]; j++) {
                data["No Keywords"]++;
            }
        }
        
        let dataArray = Object.entries(data)
        dataArray.sort((a, b) => { return b[1] - a[1] });
        dataArray = dataArray.slice(0, 5);

        let labelsArray = [];
        let valuesArray = [];

        if (dataArray.length > 1) {
            for (let i = 0; i < 5; i++) {
                labelsArray.push(dataArray[i][0]);
                valuesArray.push(dataArray[i][1]);
            }
        }
        
        let info = {
            labels: labelsArray || [],
            datasets: [{
                label: 'dataset',
                data: valuesArray || [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)'
                ],
                borderWidth: 1
            }]
        };

        return (
            <div style={{'maxHeight' : '200px', "minHeight": "200px"}}>
            <h2>Top Keywords</h2>
            <Bar
                data={info}
                options={{ 
                    maintainAspectRatio: false,
                    scales: { yAxis: { ticks: { stepSize: 1 } } }
                }}
            />
            </div>
        );
    }
});