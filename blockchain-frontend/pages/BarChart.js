import React from 'react';
import { Bar } from 'react-chartjs-2'
import { Chart, CategoryScale, LinearScale, BarElement } from 'chart.js'
Chart.register(CategoryScale, LinearScale, BarElement);

const labels = ['1', '2', '3', '4', '5'];
let info = {
    labels: labels,
    datasets: [{
        label: 'dataset',
        data: [],
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

export default (props) => ({
    displayName: 'Top Keywords',
    render() {
        info.datasets[0].data = props.data;
        return (
            <div style={{'maxHeight' : '200px'}}>
            <h2>Top Keywords</h2>
            <Bar
                data={info}
                options={{ maintainAspectRatio: false }}
            />
            </div>
        );
    }
});