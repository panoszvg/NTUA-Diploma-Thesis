import React from 'react';
import { Line } from 'react-chartjs-2'
import { Chart, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js'
Chart.register(CategoryScale, LinearScale, PointElement, LineElement);

const labels = ['1', '2', '3', '4', '5'];
let info = {
    labels: labels,
    datasets: [{
        data: [],
    }],
};
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
        info.datasets[0].data = props.data;
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