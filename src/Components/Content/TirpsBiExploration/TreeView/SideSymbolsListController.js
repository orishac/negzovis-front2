import React, { useState } from 'react';

import * as HelperFunctions from './SideSymbolListHelper';
import SideSymbolsListView from './SideSymbolsListView';

const SideSymbolsListController = (props) => {
	let type = props.type;
	const [showPie, setShowPie] = useState(false);
	const [sortBy, setSortBy] = useState('vertical_support_0');
	const [ascending, setAscending] = useState(false);
	const [sameSymbol, setSameSymbol] = useState(true);

	const [symbolFilter, setSymbolFilter] = useState('');

	let updatedSymbolList = props.symbolTirpsList;
	if (props.mode === 2) {
		updatedSymbolList = HelperFunctions.updateFinishedBy(
			props.symbolTirpsList,
			props.centerSymbol
		);
	} else if (props.mode === 0) {
		updatedSymbolList = HelperFunctions.updateStartWith(
			props.symbolTirpsList,
			props.centerSymbol
		);
	}
	const filterSameSymbol = (symbolList)=>{ // if sameSymbol = True, do nothing, if false dont show tirps that the prev or next symbol is the same as center symbol
		let filteredJson = {};
		for (let [symbolNumber, value] of Object.entries(symbolList)) {
			if(symbolNumber !== 'null'){
				let centerSymbolName = props.symbolToNames[props.centerSymbol].split('.')[0];
				let otherSymbolName = props.symbolToNames[symbolNumber].split('.')[0];
				if(centerSymbolName !== otherSymbolName){
					filteredJson[symbolNumber] = value;
				}
			}
		  }
		  return filteredJson;
	}

	const symbolTirpsList = sameSymbol ? updatedSymbolList : filterSameSymbol(updatedSymbolList);

	const filteredSymbolList = (symbolList)=>{ // gets the current symbolList and returns only the ones that include the filter symbol
		let filteredJson = {};
		for (let [symbolNumber, value] of Object.entries(symbolList)) {
			if(symbolNumber !== 'null' && (props.symbolToNames[symbolNumber]).toLowerCase().includes(symbolFilter.toLowerCase())){
				filteredJson[symbolNumber] = value;
			}
		  }
		  return filteredJson;
	}
	

	const symbolTirpsCountJson = HelperFunctions.createSymbolTirpsCountJson(
		filteredSymbolList(symbolTirpsList),
		props.symbolToNames
	);

	const filterTirpsByName = (candidateTirps, name) => {
		let filteredTirps = candidateTirps.filter((tirp) =>
			props.symbolToNames[tirp['connectedSymbol']].toLowerCase().includes(name.toLowerCase())
		);
		return filteredTirps;
	};

	const allTirps = HelperFunctions.castSymbolTirpsToTirpsArr(symbolTirpsList);
	const filteredTirps = filterTirpsByName(allTirps, symbolFilter);
	const cleanedTirps = filteredTirps.map((tirp) => {
		const vs0 = tirp['vertical_support_0'];
		const vs1 = tirp['vertical_support_1'];
		const numEntities0 = localStorage.getItem('num_of_entities');
		const numEntities1 = localStorage.getItem('num_of_entities_class_1');

		return {
			...tirp,
			score: HelperFunctions.TIRPScore(tirp, numEntities0, numEntities1),
			vertical_support_0: (vs0 / numEntities0) * 100,
			vertical_support_1: (vs1 / numEntities1) * 100,
			num_supporting_entities_0: vs0,
			num_supporting_entities_1: vs1,
			symbol: props.symbolToNames[tirp['connectedSymbol']],
			relation: HelperFunctions.getIndexOfRelation(props.isPrefix, tirp, props.centerSymbol),
		};
	});
	const sortedTirps = cleanedTirps.sort((a, b) => {
		const delta =
			typeof b[sortBy] === 'number'
				? b[sortBy] - a[sortBy]
				: b[sortBy].localeCompare(a[sortBy]);
		return ascending ? -1 * delta : delta;
	});

	return (
		<SideSymbolsListView
			allTirpsArr={sortedTirps}
			centerSymbol={props.centerSymbol}
			clickedTitles={props.clickedTitles}
			handleSymbolClicked={props.symbolClicked}
			isPrefix={props.isPrefix}
			markedTirp={props.markedTirp}
			numberOfTIRPsPresented={sortedTirps.length}
			prevNext={props.prevNext}
			setShowPie={setShowPie}
			symbolFilter={symbolFilter}
			setSymbolFilter={setSymbolFilter}
			showPie={showPie}
			symbolTirpsCountJson={symbolTirpsCountJson}
			type={type}
			setSortBy={(newSortBy) => {
				setAscending(newSortBy === sortBy ? !ascending : false);
				setSortBy(newSortBy);
			}}
			sortBy={sortBy}
			ascending={ascending}
			showSameSymbol={sameSymbol}
			setSameSymbol={(v)=>setSameSymbol(v)}
		/>
	);
};

export default SideSymbolsListController;
