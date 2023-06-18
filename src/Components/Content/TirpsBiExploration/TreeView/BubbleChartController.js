import React, { useState } from 'react';
import { Chart as ChartJS, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';

import * as HelperFunctions from './SideSymbolListHelper';
import BubbleChartView from './BubbleChartView';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend, Title);

class Tirp {
	constructor(symbols, symbol, relation, vs0, vs1, dmhs, dmmd, mhs0, mmd0, size) {
		this.symbol = symbol;
		this.relation = relation;
		this.size = size;
		this.symbols = symbols;
		this.vs0 = vs0;
		this.vs1 = vs1;

		this.dmhs = dmhs;
		this.dmmd = dmmd;

		this.mhs0 = mhs0;
		this.mmd0 = mmd0;
	}
}

const BubbleChartController = (props) => {
	let type = props.type;

	const [xValue, setXValue] = useState(type === "BTirps" ? 'VS' : 'VS0');
	const [yValue, setYValue] = useState(type === "BTirps" ? 'MHS' : 'VS1');
	const [colorValue, setColorValue] = useState(type === "BTirps" ? 'MMD' : 'Delta MHS');
	const [bubbleSize, setBubbleSize] = useState(type === "BTirps" ? 'SIZE' : 'Delta MMD');
	const [symbolFilter, setSymbolFilter] = useState('');

	const formValuesToTitles = {
		VS: 'vertical support',
		VS0: `vertical support - ${localStorage.class_name}`,
		VS1: `vertical support - ${localStorage.second_class_name}`,
		MHS: 'mean horizontal support',
		MMD: 'mean mean duration',
		SIZE: 'size',
		'Delta MHS': 'Delta Mean Horizontal Support',
		'Delta MMD': 'Delta Mean Mean Duration',
	};
	const valueToProperty = {
		VS: 'vs0',
		VS0: 'vs0',
		VS1: 'vs1',
		MHS: 'mhs0',
		MMD: 'mmd0',
		SIZE: 'size',
		'Delta MHS': 'dmhs',
		'Delta MMD': 'dmmd',
	};

	const changeXAxis = (e) => {
		setXValue(e.target.value);
	};
	const changeYAxis = (e) => {
		setYValue(e.target.value);
	};
	const changeColorAxis = (e) => {
		setColorValue(e.target.value);
	};
	const changeBubbleSize = (e) => {
		setBubbleSize(e.target.value);
	};

	const filteredTirpsObject =
		props.mode === 1
			? props.symbolTirpsList
			: props.mode === 2
			? HelperFunctions.updateFinishedBy(props.symbolTirpsList, props.centerSymbol)
			: HelperFunctions.updateStartWith(props.symbolTirpsList, props.centerSymbol);
	
	const filteredSymbolList = (filteredTirpsObject)=>{ // gets the current symbolList and returns only the ones that include the filter symbol
		let filteredJson = {};
		for (let [symbolNumber, tirps] of Object.entries(filteredTirpsObject)) {
			if(symbolNumber !== 'null' && (props.symbolToNames[symbolNumber]).toLowerCase().includes(symbolFilter.toLowerCase())){
				filteredJson[symbolNumber] = tirps;
			}
		}
		return filteredJson;
	}
	const filteredSymbolTirpsObject = filteredSymbolList(filteredTirpsObject);

	// is responsible for casting VS to percentage in all tirps that appear on the side lists
	const filteredTirpsList = Object.keys(filteredSymbolTirpsObject)
		.map((symbol) =>
			filteredTirpsObject[symbol].map((tirp) => 
				({ ...tirp,
					vertical_support_0: (tirp.vertical_support_0 / localStorage.num_of_entities) * 100,
					vertical_support_1: (tirp.vertical_support_1 / localStorage.num_of_entities_class_1) * 100,
					connectedSymbol: symbol 
				})
			)
		)
		.flat();

	const objTirps = filteredTirpsList
		.filter((rawTirp) => rawTirp.size > 1)
		.map(
			(rawTirp) =>
				new Tirp(
					rawTirp.symbols,
					props.symbolToNames[rawTirp['connectedSymbol']],
					HelperFunctions.getIndexOfRelation(props.isPrefix, rawTirp, props.centerSymbol),
					rawTirp.vertical_support_0, 
					rawTirp.vertical_support_1,
					Math.abs(rawTirp.mean_horizontal_support_0 - rawTirp.mean_horizontal_support_1),
					Math.abs(rawTirp.mean_duration_0 - rawTirp.mean_duration_1),
					rawTirp.mean_horizontal_support_0,
					rawTirp.mean_duration_0,
					rawTirp.size
				)
		)
		.map((tirp, index) => {
			return {
				...tirp,
				x: tirp[valueToProperty[xValue]],
				y: tirp[valueToProperty[yValue]],
				index,
			};
		});

	return (
		<BubbleChartView
			bubbleSize={bubbleSize}
			centerSymbol={props.centerSymbol}
			changeBubbleSize={changeBubbleSize}
			changeColorAxis={changeColorAxis}
			changeXAxis={changeXAxis}
			changeYAxis={changeYAxis}
			colorValue={colorValue}
			formValuesToTitles={formValuesToTitles}
			isPredictive={type === "BPTirps"}
			isPrefix={props.isPrefix}
			markedTirp={props.markedTirp}
			objTirps={objTirps}
			symbolClicked={props.symbolClicked}
			tirpsObjectsList={filteredTirpsList}
			valueToProperty={valueToProperty}
			xValue={xValue}
			yValue={yValue}
			symbolFilter={symbolFilter}
			setSymbolFilter={setSymbolFilter}
		/>
	);
};
export default BubbleChartController;
