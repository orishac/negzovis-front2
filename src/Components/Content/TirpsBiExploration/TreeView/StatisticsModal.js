import React from 'react';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

//presents a histogram - for every symbol, the number of TIRPs that connected to it
const StatModal = ({ symbolTirpsCountJson, setSymbolFilter, symbolFilter }) => {
	const symbols = Object.keys(symbolTirpsCountJson);
	return (
		<Pie
			options={{
				onClick: (e) => {
					const element = e.chart.getActiveElements()[0];
					if (element) {
						const index = element.index;
						setSymbolFilter(symbolFilter === symbols[index] ? '' : symbols[index]);
					}
				},
				onHover: (e) => {
					const element = e.chart.getActiveElements()[0];
					if (element) {
						e.native.target.style.cursor = 'pointer';
					} else {
						e.native.target.style.cursor = '';
					}
				},
				responsive: true,
				radius: () => '90%',
				plugins: {
					legend: {
						display: false,
					},
				},
				elements: {
					arc: {
						hoverOffset: (context) => {
							if (symbols[context.dataIndex] === symbolFilter) {
								return 30;
							}
							return 20;
						},
						offset: (context) => {
							if (symbols[context.dataIndex] === symbolFilter) {
								return 20;
							}
							return 0;
						},
					},
				},
			}}
			data={{
				labels: symbols,
				datasets: [
					{
						label: '# of TIRPs',
						data: Object.values(symbolTirpsCountJson),
						backgroundColor: [
							'rgba(255, 159, 64, 1)',
							'rgba(255, 206, 86, 1)',
							'rgb(242, 255, 60, 1)',
							'rgb(156, 241, 59, 1)',
							'rgb(71, 231, 57, 1)',
							'rgba(75, 192, 192, 1)',
							'rgba(54, 162, 235, 1)',
							'rgb(104, 102, 238, 1)',
							'rgba(153, 102, 255, 1)',
							'rgba(255, 99, 132, 1)',
						],
						borderWidth: 1,
					},
				],
			}}
		/>
	);
};

export default StatModal;
