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
            ticks: {
                stepSize: 1
            }
        },
    },
};

export default (props) => ({
    displayName: '',
    render() {
        
        let daysStringsArray = []
        if (props.data.length !== 0) {
            const today = new Date();
            for (let day = 0; day < props.data.length; day++) {
                let tempDate = new Date(today.getTime());
                tempDate.setDate(today.getDate() - day)
                daysStringsArray.unshift(tempDate.getDate() + "/" + (parseInt(tempDate.getMonth()) + 1) + "/" + tempDate.getFullYear().toString().substring(2,4));
            }
        }

        const labels = daysStringsArray;
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