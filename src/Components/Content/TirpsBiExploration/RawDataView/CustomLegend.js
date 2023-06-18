import React from 'react';

const CustomLegend = (props) => {
	let binValues = props.binValues;
	let colorsArr = props.colorsArr;

	return (
		<p
			style={{
				marginLeft: '40%',
				marginBottom: '0%',
				fontSize: '22px',
				marginTop: '1%',
				display: 'flex',
				flexDirection: 'row',
				fontWeight: 'bold',
			}}
		>
			{Object.keys(binValues).map((value) => {
				return (
					<p style={{ display: 'flex', flexDirection: 'row', marginRight: '3%' }}>
						<p style={{ color: colorsArr[Object.keys(binValues).indexOf(value) % 3] }}>
							{value}
						</p>
						[
						{typeof binValues[value][0] === 'string'
							? binValues[value][0]
							: binValues[value][0].toFixed(1)}
						,
						{typeof binValues[value][1] === 'string'
							? binValues[value][1]
							: binValues[value][1].toFixed(1)}
						]
					</p>
				);
			})}
		</p>
	);
};

export default CustomLegend;
