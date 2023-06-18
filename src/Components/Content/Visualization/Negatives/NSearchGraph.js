import React, { Component } from 'react';
// import Chart from "react-google-charts";
import { Row, Col } from 'react-bootstrap';

import SearchAxisPop from '../TirpsContent/SearchAxisPop';

import { Chart as ChartJS, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Bubble } from 'react-chartjs-2';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(LinearScale, PointElement, zoomPlugin, Tooltip, Legend, Title);

const X_AXIS = 'X_AXIS';
const Y_AXIS = 'Y_AXIS';
const COLOR_AXIS = 'Bubble Color';
const SIZE_AXIS = 'Bubble Size';

class NTirp {
	constructor(symbols, size, vs, mhs, mmd, row) {
		this.symbols = symbols;
		this.size = size;
		this.vs = vs;
		this.mhs = mhs;
		this.mmd = mmd;
		this.row = row

	}
}

class NSearchGraph extends Component {
	measureToTitles = {
		vs: `Vertical Support`,
		mhs: `Mean Horizontal`,
		mmd: `Mean Mean Duration`,
		size: `Num Of Events In Pattern`
	};



	state = {
		axisToMeasure: {
			[X_AXIS]: 'vs',
			[Y_AXIS]: 'mhs',
			[COLOR_AXIS]: 'mmd',
			[SIZE_AXIS]: 'size',
		},
		vnames: [],
	};

	axisToTitle(axis) {
		return this.measureToTitles[this.state.axisToMeasure[axis]];
	}

	componentDidMount() {
		let allVnames = []  
		if (localStorage.negative === 'true') {
			const entities = JSON.parse(localStorage.VMapFile);
			for (const [key, value] of Object.entries(entities)) {
				allVnames.push(value)
				allVnames.push(String.fromCharCode(172) + value)
			}
			this.setState({
				vnames: allVnames,
			});
		}
	}

	calculatePerProperty(maxMetric, minMetric, property) {
		const RATE_MAX = 0;
		const RATE_MIN = 1;
		const RATE_MEAN = 2;

		const propertyToMetric = {
			[RATE_MEAN]: Math.abs((maxMetric + minMetric) / 2),
			[RATE_MAX]: maxMetric,
			[RATE_MIN]: minMetric,
		};
		const metric = propertyToMetric[property];
		if (metric === undefined) alert('property should be either mean, max or min');
		return metric;
	}

	calculateQueryRating(size, vs0, vs1, mhs0, mhs1) {
		const delta = (x, y) => Math.abs(x - y);

		const basesParams = [
			{
				measure: 'vs0',
				min: this.props.minVS0,
				max: this.props.maxVS0,
				value: vs0,
			},
			{
				measure: 'mhs0',
				min: this.props.minHS0,
				max: this.props.maxHS0,
				value: mhs0,
			},
			{
				measure: 'size',
				min: this.props.minSize0,
				max: this.props.maxSize0,
				value: size,
			},
		];

		const predictiveBaseParams = [
			{
				measure: 'vs1',
				min: this.props.minVS1,
				max: this.props.maxVS1,
				value: vs1,
			},
			{
				measure: 'mhs1',
				min: this.props.minHS1,
				max: this.props.maxHS1,
				value: mhs1,
			},
		];
		const bases = basesParams
			.concat(this.props.isPredictive ? predictiveBaseParams : [])
			.map((baseParams) => ({
				base: this.calculatePerProperty(
					baseParams.max,
					baseParams.min,
					this.props.measureToRate[baseParams.measure]
				),
				value: baseParams.value,
				measure: baseParams.measure,
			}));

		const queryRating = bases.reduce((acc, curr) => acc + delta(curr.base, curr.value), 0);

		return 500 - queryRating;
	}

	calculateTirps() {
		const tirps = this.props.tirps.map((result) => {
			const symbols = result.elements;
            const size = result.elements.flat().length
            const vs = result['support']
            const mhs = result['mean horizontal support']
            const mmd = result['mean mean duration']

			return new NTirp(
				symbols,
				size,
				vs,
				mhs,
				mmd,
				result
			);
		});

		return tirps;
	}

	onSelect(tirp) {
		this.props.handleOnSelect(tirp)
	}

	render() {
		const tirps = this.calculateTirps();
		// We are not using the parsing option because it does'nt get updated when the axes change
		const data = tirps.map((tirp) => {
			return {
				...tirp,
				x: tirp[this.state.axisToMeasure[X_AXIS]],
				y: tirp[this.state.axisToMeasure[Y_AXIS]],
			};
		});

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
		const axisOptions = (axis) => {
			return {
				// beginAtZero: true,
				title: {
					display: true,
					text: this.axisToTitle(axis),
					font: {
						size: 28,
					},
				},
			};
		};

		const dynamicAxes = ['vs', 'mhs', 'mmd', 'size']

		return (
			<div>
				<Row>
					<Col >
						<Bubble test_id="bubble graph"
							height={100}
							options={{
								onClick: (e) => {
									const elements = e.chart.getActiveElements();
									if (elements.length > 0) {
										const index = elements[0].index;
										const tirp = tirps[index];
										this.onSelect(tirp);
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
												const symbols = tirp.symbols;
												const firstSymbol = symbols.flat()[0]
												return this.state.vnames[firstSymbol]
											},
											label: (item) => {
												const properties = 
														{
															VS: 'vs',
															MHS: 'mhs',
															MMD: 'mmd',
															Size: 'size',
													  	};
												return Object.entries(properties).map(
													([name, value]) => {
														return `${name}: ${item.raw[value].toFixed(
															2
														)}`;
													}
												);
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
									y: axisOptions(Y_AXIS),
									x: axisOptions(X_AXIS),
								},
								elements: {
									point: {
										borderColor: (context) => {
											if (!context.raw) return undefined;

											const tirp = context.raw;
											// if (
											// 	tirp.relations === this.props.selectedRelations &&
											// 	tirp.symbols === this.props.selectedSymbols
											// ) {
											// 	return 'black';
											// }
											return '#C9C9C9';
										},
										borderWidth: (context) => {
											if (!context.raw) return undefined;

											const tirp = context.raw;
											// if (
											// 	tirp.relations === this.props.selectedRelations &&
											// 	tirp.symbols === this.props.selectedSymbols
											// ) {
											// 	return 2.5;
											// }
											return 1;
										},
										backgroundColor: (context) => {
											if (!context.raw) return undefined;

											const rawToValue = (raw) =>
												raw[this.state.axisToMeasure[COLOR_AXIS]];
											const colors = context.dataset.data.map((point) =>
												rawToValue(point)
											);
											const minColor = Math.min(...colors);
											const maxColor = Math.max(...colors);
											const delta = maxColor - minColor;
											const normalizedColor =
												(rawToValue(context.raw) - minColor) /
												(delta === 0 ? 1 : delta);

											const [r, g, b] = pickHex(
												[0, 0, 255],
												[255, 255, 255],
												normalizedColor
											);
											return `rgb(${r},${g},${b})`;
										},
										radius: (context) => {
											if (!context.raw) return undefined;

											const radiuses = context.dataset.data.map(
												(point) => point.size
											);
											const minRadius = Math.min(...radiuses);
											const maxRadius = Math.max(...radiuses);
											const delta = maxRadius - minRadius;
											const normalizedRadius =
												(context.raw.size - minRadius) /
												(delta === 0 ? 1 : delta);

											return 10 + normalizedRadius * 10;
										},
									},
								},
							}}
							data={{ datasets: [{ data }] }}
						/>

						<div className='gradient'>{this.axisToTitle(COLOR_AXIS)}</div>
					</Col>
				</Row>

				<SearchAxisPop
					axes={this.state.axisToMeasure}
					options={{
						[X_AXIS]: dynamicAxes,
						[Y_AXIS]: dynamicAxes,
						[COLOR_AXIS]: dynamicAxes,
						[SIZE_AXIS]: ['size'],
					}}
					measureToTitles={this.measureToTitles}
					onChange={(newAxisToMeasure) => {
						this.setState({
							axisToMeasure: newAxisToMeasure,
						});
					}}
				></SearchAxisPop>
			</div>
		);
	}
}

export default NSearchGraph;
