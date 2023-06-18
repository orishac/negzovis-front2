import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { Chart as ChartJS, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Bubble } from 'react-chartjs-2';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(LinearScale, PointElement, zoomPlugin, Tooltip, Legend, Title);

function pickHex(color1, color2, weight) {
	var w1 = weight;
	var w2 = 1 - w1;
	var rgb = [
		Math.round(color1[0] * w1 + color2[0] * w2),
		Math.round(color1[1] * w1 + color2[1] * w2),
		Math.round(color1[2] * w1 + color2[2] * w2),
	];
	return rgb;
}

const BubbleChartView = ({
	tirpsObjectsList,
	isPrefix,
	centerSymbol,
	symbolClicked,
	formValuesToTitles,
	xValue,
	yValue,
	markedTirp,
	colorValue,
	valueToProperty,
	bubbleSize,
	objTirps,
	changeXAxis,
	isPredictive,
	changeYAxis,
	changeBubbleSize,
	changeColorAxis,
	symbolFilter,
	setSymbolFilter,
}) => {
	const axisOptions = (axis) => {
		return {
			// beginAtZero: true,
			title: {
				display: true,
				text: formValuesToTitles[axis],
				font: {
					size: 28,
				},
			},
		};
	};

	const Options = () => {
		return (
			<>
				{!isPredictive ? (
					<option value='VS'>Vertical Support</option>
				) : (
					<option value='VS0'>Vertical Support - {localStorage.class_name}</option>
				)}
				{!isPredictive ? (
					<option value='MHS'>Mean Horizontal Support</option>
				) : (
					<option value='VS1'>Vertical Support - {localStorage.second_class_name}</option>
				)}
				{!isPredictive ? (
					<option value='MMD'>Mean Mean Duration</option>
				) : (
					<option value='Delta MHS'>Delta MHS</option>
				)}
				{isPredictive && <option value='Delta MMD'>Delta MMD</option>}
				<option value='SIZE'>Size</option>
			</>
		);
	};

	return (
		<>
			<span className='input-filter-container' search='{'>
				<i className='fas fa-search'></i>
				<input
					type='text'
					placeholder='Search'
					className='input-filter'
					value={symbolFilter}
					onChange={(e) => setSymbolFilter(e.target.value)}
				/>
			</span>
			<Bubble
				options={{
					onClick: (e) => {
						const elements = e.chart.getActiveElements();
						if (elements.length > 0) {
							const location = elements[0].index;
							let tirp = tirpsObjectsList[location];
							if (isPrefix) {
								let clickedSymbol =
									tirp['symbols'][tirp['symbols'].indexOf(centerSymbol) - 1];
								symbolClicked(clickedSymbol, isPrefix, tirp);
							} else {
								let clickedSymbol =
									tirp['symbols'][tirp['symbols'].indexOf(centerSymbol) + 1];
								symbolClicked(clickedSymbol, isPrefix, tirp);
							}
						}
					},

					responsive: true,
					plugins: {
						legend: {
							display: false,
						},
						tooltip: {
							enabled: true,
							displayColors: false,
							callbacks: {
								title: (items) => {
									const tirp = items[0].raw;
									return `${tirp.symbol} ${tirp.relation}`;
								},
								label: (item) => {
									const properties = isPredictive
										? {
												VS0: 'vs0',
												VS1: 'vs1',
												MHS0: 'mhs0',
												MHS1: 'mhs1',
												MMD0: 'mmd0',
												MMD1: 'mmd1',
												DMHS: 'dmhs',
												DMMD: 'dmmd',
										  }
										: { VS: 'vs0', MHS: 'mhs0', MMD: 'mmd0' };
									return Object.entries(properties)
										.filter(([_, value]) => item.raw[value] !== undefined)
										.map(([name, value]) => {
											return `${name}: ${item.raw[value].toFixed(2)}`;
										});
								},
							},
						},
						zoom: {
							pan: {
								enabled: true,
								mode: 'xy',
							},
							zoom: {
								// drag: {
								// 	enabled: true,
								// },
								wheel: {
									enabled: true,
								},
								pinch: {
									enabled: true,
								},
								mode: 'xy',
							},
						},
					},

					scales: {
						y: axisOptions(yValue),
						x: axisOptions(xValue),
					},
					// parsing: {
					// 	xAxisKey: valueToProperty[xValue],
					// 	yAxisKey: valueToProperty[yValue],
					// },
					elements: {
						point: {
							borderColor: (context) => {
								if (!context.raw) return undefined;
								const tirp = context.raw;
								const fullTirp = tirpsObjectsList[tirp.index];

								if (
									fullTirp.relations === markedTirp.relations &&
									fullTirp.symbols === markedTirp.symbols
								) {
									return 'black';
								}
								return '#C9C9C9';
							},
							borderWidth: (context) => {
								if (!context.raw) return undefined;
								const tirp = context.raw;
								const fullTirp = tirpsObjectsList[tirp.index];
								if (
									fullTirp.relations === markedTirp.relations &&
									fullTirp.symbols === markedTirp.symbols
								) {
									return 3;
								}
								return 1;
							},
							backgroundColor: (context) => {
								if (!context.raw) return undefined;
								const property = valueToProperty[colorValue];
								const colors = context.dataset.data.map((point) => point[property]);
								const minColor = Math.min(...colors);
								const maxColor = Math.max(...colors);
								const delta = maxColor - minColor;
								const normalizedColor =
									(context.raw[property] - minColor) / (delta === 0 ? 1 : delta);
								const [r, g, b] = pickHex(
									[0, 0, 255],
									[255, 255, 255],
									normalizedColor
								);
								return `rgb(${r},${g},${b})`;
							},
							radius: (context) => {
								if (!context.raw) return undefined;
								if (bubbleSize === 5) return 15;
								const property = valueToProperty[bubbleSize];
								const values = context.dataset.data.map((point) => point[property]);
								const minValue = Math.min(...values);
								const maxValue = Math.max(...values);
								const delta = maxValue - minValue;
								const normalizedValue =
									(context.raw[property] - minValue) / (delta === 0 ? 1 : delta);
								return 10 + normalizedValue * 15;
							},
						},
					},
				}}
				data={{ datasets: [{ data: objTirps }] }}
			/>

			<div className='gradient'>{formValuesToTitles[colorValue]}</div>

			<Row className='mb-0 mt-4'>
				<Col>
					<Form.Label className={'text-bold-black'}>X Axis</Form.Label>
				</Col>
				<Col>
					<Form.Label className={'text-bold-black fat-label'}> Y Axis </Form.Label>
				</Col>
				<Col>
					<Form.Label className={'text-bold-black'}>Bubble Color </Form.Label>
				</Col>
				<Col>
					<Form.Label className={'text-bold-black'}>Bubble Size</Form.Label>
				</Col>
			</Row>
			<Row>
				<Col>
					<Form.Control
						className={'font-weight-bold'}
						name='1'
						as='select'
						value={xValue}
						onChange={changeXAxis}
					>
						<Options />
					</Form.Control>
				</Col>
				<Col>
					<Form.Control
						className={'font-weight-bold'}
						name='2'
						as='select'
						value={yValue}
						onChange={changeYAxis}
					>
						<Options />
					</Form.Control>
				</Col>
				<Col>
					<Form.Control
						className={'font-weight-bold'}
						name='3'
						as='select'
						value={colorValue}
						onChange={changeColorAxis}
					>
						<Options />
					</Form.Control>
				</Col>
				<Col>
					<Form.Control
						className={'font-weight-bold'}
						name='3'
						as='select'
						value={bubbleSize}
						onChange={changeBubbleSize}
					>
						<Options />
					</Form.Control>
				</Col>
			</Row>
		</>
	);
};
export default BubbleChartView;
