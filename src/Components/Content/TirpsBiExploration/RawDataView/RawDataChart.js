import React from 'react';
import PointsLineChart from './PointsLineChart';
import CustomLegend from './CustomLegend';

const RawDataChart = (props) => {
	let symbol = props.symbol; //each data chart includes only one symbol, this is the symbol (fluids, food...)
	let values = props.values; // raw data points of this entity in this symbol
	values = [['x', symbol], ...values]; //defining values array for coloring the data points
	let descriteValues = props.descriteValues; // descrite values of this entity and symbol (after HugoBot)
	let binValues = props.binValues; // bins like low, medium and high
	let colorsArr = props.colorsArr;
	let pointsToPresent = [];
	let globalMinRaw = null;
	let globalMaxRaw = null;
	for (let i = 1; i < values.length; i++) {
		//starting from 1 because the first is the name of the symbol
		let point = values[i];
		if (globalMinRaw === null || point[1] < globalMinRaw) {
			globalMinRaw = point[1];
		}
		if (globalMaxRaw === null || point[1] > globalMaxRaw) {
			globalMaxRaw = point[1];
		}
	}

	let intervalsData = [['RowLabel', 'Start', 'End']]; //preparing the intervals array for plotting the time intervals in chart
	if (descriteValues !== undefined) {
		//descriteValues is undeinded if there is raw data but no descrite data
		//(for example mental capacity for entity 0 in Alisa's datasets)
		for (let i = 0; i < Object.keys(descriteValues).length; i++) {
			// changing the order of label and values and pushed to data array
			let start = descriteValues[i][0];
			let end = descriteValues[i][1];
			let label = descriteValues[i][2];
			let interval = [label, start, end];
			intervalsData.push(interval);
		}
	}

	// gets array that each element is [time, value, point color, ...] where the ... can be color duplicates
	// in order to remove those duplicates, we cut only the 3 first element of each array
	const cutFirstOfArray = (arrayToCut) => {
		return arrayToCut.map((elementArr) => elementArr.slice(0, 3));
	};

	// for every raw data point, add black color to it
	const setOriginalRawDataStyle = (rawDataArr) => {
		let styledRawArr = [];
		for (var i = 0; i < rawDataArr.length; i++) {
			let point = rawDataArr[i];
			styledRawArr.push([point[0], point[1], 'point { size: 5; fill-color: black;}']);
		}
		return styledRawArr;
	};

	// given an interval, returns its limits - high and low for visualizaing it as a rectangle
	const getLimitsOfInterval = (interval) => {
		let intervalLabel = interval[0];
		let lowLimit = null;
		let highLimit = null;
		if (typeof binValues[intervalLabel][0] === 'string') {
			lowLimit = globalMinRaw;
		} else {
			lowLimit = binValues[intervalLabel][0];
		}
		if (typeof binValues[intervalLabel][1] === 'string') {
			highLimit = globalMaxRaw;
		} else {
			highLimit = binValues[intervalLabel][1];
		}

		return [lowLimit, highLimit];
	};

	//gets the intervals array and generated for each interval corresponding data points in the interval's range
	const intervalToPoints = (intervalsArr) => {
		let intervalsToPoints = [];
		let binsLabels = Object.keys(binValues);

		for (var i = 0; i < intervalsArr.length; i++) {
			let intervalLabel = intervalsArr[i][0];
			let startInterval = intervalsArr[i][1];
			let endInterval = intervalsArr[i][2];

			let [pointValueLow, pointValueHigh] = getLimitsOfInterval(intervalsArr[i]);
			let intervalColor = colorsArr[binsLabels.indexOf(intervalLabel) % 3];
			let pointsColor = 'point { size: 3; fill-color: ' + intervalColor + ';}';
			// setting the points in the interval
			for (let j = startInterval; j <= endInterval; j += 0.5) {
				let pointTime = j;
				intervalsToPoints.push([pointTime, pointValueLow, pointsColor]);
				intervalsToPoints.push([pointTime, pointValueHigh, pointsColor]);
			}
			let density = (pointValueHigh - pointValueLow) / 35;
			// setting the edges of the interval
			for (let j = pointValueLow; j <= pointValueHigh; j += density) {
				intervalsToPoints.push([startInterval, j, pointsColor]);
				intervalsToPoints.push([endInterval, j, pointsColor]);
			}
		}
		return intervalsToPoints;
	};

	// intervalToPoints converts the intervals to generated points to fit into one graph
	// setOriginalRawDataStyle adds color to raw data points
	//  deletes duplicates
	pointsToPresent = cutFirstOfArray([
		...setOriginalRawDataStyle(values).slice(1),
		...intervalToPoints(intervalsData.slice(1)),
	]);

	return (
		<div className='dataCharts'>
			<div style={{ display: 'flex', flexDirection: 'row' }}>
				<div className='rowChartAndLegend'>
					{pointsToPresent.length > 0 ? (
						<CustomLegend binValues={binValues} colorsArr={colorsArr} />
					) : null}
					<PointsLineChart
						title={[...values[0], { role: 'style', type: 'string' }]}
						data={pointsToPresent}
					/>
				</div>
			</div>
		</div>
	);
};

export default RawDataChart;
