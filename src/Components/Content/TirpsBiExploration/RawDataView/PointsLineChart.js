import React from 'react';
import Chart from 'react-google-charts';

const PointsLineChart = (props) => {
	let title = props.title;
	let values = props.data;

	return (
		<div>
			{values.length > 0 ? (
				<Chart
					chartType='LineChart'
					loader={<div>Loading Chart</div>}
					data={[title, ...values]}
					options={{
						interpolateNulls: true,
						theme: 'material',
						hAxis: {
							title: 'Time',
						},
						vAxis: {
							title: 'value',
						},
						width: '2000',
						height: '350',
						pointSize: 10,
						lineWidth: 0,
						legend: { position: 'right' },
						explorer: {
							actions: ['dragToZoom', 'rightClickToReset'],
						},
					}}
					rootProps={{ 'data-testid': '1' }}
				/>
			) : null}
		</div>
	);
};

export default PointsLineChart;
