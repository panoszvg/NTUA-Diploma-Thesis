import React from 'react';
import { Line } from 'react-chartjs-2'
import { Chart, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js'
Chart.register(CategoryScale, LinearScale, PointElement, LineElement);

const options = {
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
    },
    elements: {
        line: {
            tension: 0,
            borderWidth: 2,
            borderColor: "rgba(47,97,68, 1)",
            fill: "start",
            backgroundColor: "rgba(47,97,68, 0.3)"
        },
        point: {
            radius: 0,
            hitRadius: 0,
        },
    },
    scales: {
        xAxis: {
            display: true,
        },
        yAxis: {
            display: true,
        },
    },
};

export default (props) => ({
    displayName: '',
    render() {
        
        let todayString = '';
        let threeDaysAgoString = '';
        if (props.data.length !== 0) {
            const today = new Date();
            todayString = today.getDate() + "/" + (parseInt(today.getMonth()) + 1) + "/" + today.getFullYear();
            const threeDaysAgo = new Date(today.getTime());
            threeDaysAgo.setDate(today.getDate() - 3);   
            threeDaysAgoString = threeDaysAgo.getDate() + "/" + (parseInt(threeDaysAgo.getMonth()) + 1) + "/" + threeDaysAgo.getFullYear();
        }
        

        const labels = ['', threeDaysAgoString, '', '', todayString];
        let info = {
            labels: labels,
            datasets: [{
                data: props.data || [],
            }],
        };

        this.displayName = props.title;
        return (
            <div style={{'maxHeight' : '200px'}}>
            <h2>{this.displayName}</h2>
            <Line
                data={info}
                options={options}
            />
            </div>
        );
    }
});