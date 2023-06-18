import React, { useEffect, useState } from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import { Chart } from 'react-google-charts';
import { Button, ButtonGroup, ToggleButton } from 'react-bootstrap';

const SankeyGraph = (props) => {
	// let type = sessionStorage.getItem('type');
	const [tirp, setTirp] = useState(props.tirp);
	const tirpsJson = props.tirpsJson;
	const class0Color = '#D3D3D3'; //color for the links in the graph for class 0 metrics
	const class1Color = '#AFEEEE'; //color for the links in the graph for class 1 metrics
	const [showSankey, setShowSankey] = useState(false);
	const [metricMode, setMetricMode] = useState(0); //0 - VS, 1 - MHS
	let nodesColors = [];
	const defaultColors = [
		'#ff6347',
		'#ee82ee',
		'#ffa500',
		'#6a5acd',
		'#7f2b47',
		'#7fffe6',
		'#ffff10',
	];

	const metricOneClass = (fromSymbol, toSymbol, currTirp) => {
		let from = props.symbolsToNames[fromSymbol];
		let to = props.symbolsToNames[toSymbol];
		if (metricMode === 0) {
			return [from, to, currTirp['vertical_support_0'], class0Color];
		} else {
			return [from, to, +currTirp['mean_horizontal_support_0'].toFixed(2), class0Color];
		}
	};

	const metricTwoClass = (fromSymbol, toSymbol, currTirp) => {
		let from = props.symbolsToNames[fromSymbol];
		let to = props.symbolsToNames[toSymbol];
		if (metricMode === 0) {
			return [
				[from, to, currTirp['vertical_support_0'], class0Color],
				[from, to, currTirp['vertical_support_1'], class1Color],
			];
		} else {
			return [
				[from, to, +currTirp['mean_horizontal_support_0'].toFixed(2), class0Color],
				[from, to, +currTirp['mean_horizontal_support_1'].toFixed(2), class1Color],
			];
		}
	};

	const addNodeColor = (symbolsNamesHistory, symbolName, nodesColors, i) => {
		if (i === -1) {
			//last symbol
			if (props.symbolsToNames[symbolName] === props.prefixSymbol) {
				nodesColors.push('red');
			} else if (props.symbolsToNames[symbolName] === props.nextSymbol) {
				nodesColors.push('green');
			} else if (props.symbolsToNames[symbolName] === props.centerSymbol) {
				nodesColors.push('rgb(44, 64, 100)');
			} else {
				nodesColors.push(defaultColors[i]);
			}
			return nodesColors;
		} else if (!symbolsNamesHistory.includes(symbolName)) {
			if (props.symbolsToNames[symbolName] === props.prefixSymbol) {
				nodesColors.push('red');
			} else if (props.symbolsToNames[symbolName] === props.nextSymbol) {
				nodesColors.push('green');
			} else if (props.symbolsToNames[symbolName] === props.centerSymbol) {
				nodesColors.push('rgb(44, 64, 100)');
			} else {
				nodesColors.push(defaultColors[i]);
			}
			symbolsNamesHistory.push(symbolName);
		}
		return [symbolsNamesHistory, nodesColors];
	};

	const buildPathOneClass = (tirp, path) => {
		let tirpSymbols = tirp['symbols'];
		if (tirpSymbols.length === 1) {
			// tirp in size one - only single link between the same symbol to itself
			// the reason for the first link if from symbol + ' ' to symbol if that because sakney diagram can not contain self link
			// it calls it a circle so i just added one space character for the diagram to work with
			let [from, to, metric, color] = metricOneClass(tirpSymbols[0], tirpSymbols[0], tirp);
			path.push([from + ' ', to, metric, color]);
			nodesColors.push('rgb(44, 64, 100)');
			return path;
		} else {
			// more that 1 symbol - at least two links
			// motivation: between two adjacent symbols create a link and its width corresponds to the vertical support up until this symbol
			// i want to visualize how the vertical support changes over time
			let currTirp = JSON.parse(JSON.stringify(tirp)); //deep copy of TIRP
			let tirpSymbols = currTirp['symbols'];
			let tirpRelations = currTirp['relations'];
			let currTirpLastSymbol = tirpSymbols[tirpSymbols.length - 1];
			let reverseColors = [];
			let symbolsNamesHistory = [];
			for (var i = tirpSymbols.length - 1; i > 0; i--) {
				//from the last symbol until the first
				let directFatherSymbols = tirpSymbols;
				directFatherSymbols.pop(); //direct father symbols are all the current TIRP symbols except the last one
				let k = directFatherSymbols.length;
				let directFatherRelations = tirpRelations.slice(0, (k * (k - 1)) / 2); //calculating father's relations
				let directFatherName =
					directFatherSymbols.join('-') +
					'-' +
					(directFatherRelations.length > 0 ? directFatherRelations.join('.') + '.' : '');
				let father = tirpsJson.current[directFatherName];
				let lastFatherSymbol = directFatherSymbols[directFatherSymbols.length - 1];
				// adding a link between the last symbol of father TIRP to the current symbol and the current VS
				path.push(metricOneClass(lastFatherSymbol, currTirpLastSymbol, currTirp));

				let historyColors = addNodeColor(
					symbolsNamesHistory,
					lastFatherSymbol,
					nodesColors,
					i
				);
				symbolsNamesHistory = historyColors[0];
				nodesColors = historyColors[1];
				historyColors = addNodeColor(
					symbolsNamesHistory,
					currTirpLastSymbol,
					nodesColors,
					i
				);
				symbolsNamesHistory = historyColors[0];
				nodesColors = historyColors[1];

				// updating who is current TIRP
				currTirp = father;
				tirpSymbols = directFatherSymbols;
				tirpRelations = directFatherRelations;
				currTirpLastSymbol = directFatherSymbols[directFatherSymbols.length - 1];
			}
			nodesColors = nodesColors.concat(reverseColors.reverse());
			// at the end, adding link between the first symbol to the current with the VS
			let [from, to, metric, color] = metricOneClass(
				currTirpLastSymbol,
				currTirpLastSymbol,
				currTirp
			);
			path.push([from + ' ', to, metric, color]);
			nodesColors = addNodeColor(symbolsNamesHistory, currTirpLastSymbol, nodesColors, -1);
			return path;
		}
	};

	const buildPathTwoClass = (tirp, path) => {
		let tirpSymbols = tirp['symbols'];
		if (tirpSymbols.length === 1) {
			let [[from0, to0, metric0, color0], [from1, to1, metric1, color1]] = metricTwoClass(
				tirpSymbols[0],
				tirpSymbols[0],
				tirp
			);
			path.push([from0 + ' ', to0, metric0, color0]);
			path.push([from1 + ' ', to1, metric1, color1]);
			nodesColors.push('rgb(44, 64, 100)');
			// pushing the first two links as explained above, each for its own class metric
			return path;
		} else {
			let currTirp = JSON.parse(JSON.stringify(tirp)); // deep copy of TIRP
			let tirpSymbols = currTirp['symbols'];
			let tirpRelations = currTirp['relations'];
			let currTirpLastSymbol = tirpSymbols[tirpSymbols.length - 1];
			let symbolsNamesHistory = [];
			for (var i = tirpSymbols.length - 1; i > 0; i--) {
				// same as explained above. only difference is that we push VS of both classes
				let directFatherSymbols = tirpSymbols;
				directFatherSymbols.pop();
				let k = directFatherSymbols.length;
				let directFatherRelations = tirpRelations.slice(0, (k * (k - 1)) / 2);
				let directFatherName =
					directFatherSymbols.join('-') +
					'-' +
					(directFatherRelations.length > 0 ? directFatherRelations.join('.') + '.' : '');
				let father = tirpsJson.current[directFatherName];
				let lastFatherSymbol = directFatherSymbols[directFatherSymbols.length - 1];
				path = path.concat(metricTwoClass(lastFatherSymbol, currTirpLastSymbol, currTirp));
				//adding colors to nodes
				let historyColors = addNodeColor(
					symbolsNamesHistory,
					lastFatherSymbol,
					nodesColors,
					i
				);
				symbolsNamesHistory = historyColors[0];
				nodesColors = historyColors[1];
				historyColors = addNodeColor(
					symbolsNamesHistory,
					currTirpLastSymbol,
					nodesColors,
					i
				);
				symbolsNamesHistory = historyColors[0];
				nodesColors = historyColors[1];

				currTirp = father;
				tirpSymbols = directFatherSymbols;
				tirpRelations = directFatherRelations;
				currTirpLastSymbol = directFatherSymbols[directFatherSymbols.length - 1];
			}
			let [[from0, to0, metric0, color0], [from1, to1, metric1, color1]] = metricTwoClass(
				currTirpLastSymbol,
				currTirpLastSymbol,
				currTirp
			);
			nodesColors = addNodeColor(symbolsNamesHistory, currTirpLastSymbol, nodesColors, -1);
			path.push([from0 + ' ', to0, metric0, color0]);
			path.push([from1 + ' ', to1, metric1, color1]);
			return path;
		}
	};

	const buildVSPath = (tirp) => {
		let path = [['From', 'To', 'Weight', { type: 'string', role: 'style' }]];
		nodesColors = [];
		if (type === "BTirps") {
			// only metrics of class 0
			return buildPathOneClass(tirp, path);
		} else {
			// two classes metrics
			return buildPathTwoClass(tirp, path);
		}
	};

	const [path, setPath] = useState(buildVSPath(props.tirp));

	useEffect(() => {
		setTirp(props.tirp);
		setPath(buildVSPath(props.tirp));
	}, [props.tirp]);

	const options = {
		sankey: {
			node: {
				label: {
					fontName: 'Arial',
					fontSize: 12,
					//  color: '#871b47',
					bold: true,
					italic: false,
				},
				colors: nodesColors,
			},
			// link: { colors: colors},
		},
	};

	return (
		<div
			style={{
				marginTop: '2%',
				justifyContent: 'center',
				alignItems: 'center',
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<Button onClick={() => setShowSankey(!showSankey)}>TIRP change</Button>

			{showSankey ? (
				path.length > 1 ? (
					<>
						<Chart
							chartType='Sankey'
							width='100%'
							data={path}
							height='300px'
							options={options}
						/>
						<ButtonGroup
							toggle={true}
							style={{ display: 'block', width: '100%' }}
							size='lg'
						>
							<ToggleButton
								checked={metricMode === 0}
								className={'btn-hugobot'}
								onClick={() => {
									setMetricMode(0);
									setPath(buildVSPath(tirp));
								}}
								type={'radio'}
								value={0}
								style={{ width: '50%', height: '100%' }}
							>
								VS
							</ToggleButton>
							<ToggleButton
								checked={metricMode === 1}
								className={'btn-hugobot'}
								onClick={() => {
									setMetricMode(1);
									setPath(buildVSPath(tirp));
								}}
								type={'radio'}
								value={1}
								style={{ width: '50%', height: '100%' }}
							>
								MHS
							</ToggleButton>
						</ButtonGroup>
					</>
				) : null
			) : null}
		</div>
	);
};

export default SankeyGraph;
