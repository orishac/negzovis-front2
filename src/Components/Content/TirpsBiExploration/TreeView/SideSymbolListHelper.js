export function updateFinishedBy(symbolTirpsJson, centerSymbol) {
	let newSymbolTirpList = {};
	for (var i = 0; i < Object.keys(symbolTirpsJson).length; i++) {
		let prevSymbol = Object.keys(symbolTirpsJson)[i];
		newSymbolTirpList[prevSymbol] = [];
		let tirps = symbolTirpsJson[prevSymbol];
		for (var j = 0; j < tirps.length; j++) {
			let tirp = tirps[j];
			if (tirp['symbols'][tirp['symbols'].length - 1] === centerSymbol) {
				// tirp that end with the center symbol
				newSymbolTirpList[prevSymbol].push(tirp);
			}
		}
	}
	return newSymbolTirpList;
}

export function updateStartWith(symbolTirpsJson, centerSymbol) {
	let newSymbolTirpList = {};
	for (var i = 0; i < Object.keys(symbolTirpsJson).length; i++) {
		let nextSymbol = Object.keys(symbolTirpsJson)[i];
		newSymbolTirpList[nextSymbol] = [];
		let tirps = symbolTirpsJson[nextSymbol];
		for (var j = 0; j < tirps.length; j++) {
			let tirp = tirps[j];
			if (tirp['symbols'][0] === centerSymbol) {
				// tirp that start with the center symbol
				newSymbolTirpList[nextSymbol].push(tirp);
			}
		}
	}
	return newSymbolTirpList;
}

export function createSymbolTirpsCountJson(symbolTirpsList, symbolsToNames) {
	let symbolTirpsCountJson = {};
	Object.keys(symbolTirpsList).forEach((symbol) => {
		if (symbol !== 'null') {
			let symbolName = symbolsToNames[symbol];
			if (symbolTirpsCountJson.hasOwnProperty(symbolName)) {
				symbolTirpsCountJson[symbolName] += symbolTirpsList[symbol].length;
			} else {
				symbolTirpsCountJson[symbolName] = symbolTirpsList[symbol].length;
			}
		}
	});
	return symbolTirpsCountJson;
}

export function equalTirps(tirp1, tirp2) {
	return (
		tirp1 !== null &&
		tirp2 !== null &&
		tirp1.size === tirp2.size &&
		tirp1.mean_horizontal_support_0 === tirp2.mean_horizontal_support_0 &&
		tirp1.mean_horizontal_support_1 === tirp2.mean_horizontal_support_1 &&
		JSON.stringify(tirp1.symbols) === JSON.stringify(tirp2.symbols) &&
		JSON.stringify(tirp1.relations) === JSON.stringify(tirp2.relations)
	);
}

export function getIndexOfRelationHelper(centerSymbolIndex, tirpSize) {
	let relationSymbol = 0;
	for (var i = 0; i < centerSymbolIndex; i++) {
		relationSymbol += tirpSize - 1 - i;
	}
	return relationSymbol;
}

export function getIndexOfRelation(isPrefix, tirp, centerSymbol) {
	// index = int(((1 + column_index) * column_index) / 2 + row_index)
	if (isPrefix === false) {
		if (tirp['symbols'].indexOf(centerSymbol) === 0) {
			return tirp['relations'][0];
		} else {
			let columnIndex = tirp['symbols'].indexOf(centerSymbol);
			let rowIndex = tirp['symbols'].indexOf(centerSymbol);
			let index = ((1 + columnIndex) * columnIndex) / 2 + rowIndex;
			return tirp['relations'][index];
		}
	} else {
		if (tirp['symbols'].indexOf(centerSymbol) === tirp['symbols'].length - 1) {
			return tirp['relations'][tirp['relations'].length - 1];
		} else {
			let columnIndex = tirp['symbols'].indexOf(centerSymbol) - 1;
			let rowIndex = tirp['symbols'].indexOf(centerSymbol);
			let index = ((1 + columnIndex) * columnIndex) / 2 + rowIndex;
			return tirp['relations'][index];
		}
	}
}

export function castSymbolTirpsToTirpsArr(symbolTirpsList) {
	// returns an array that each element is tirp and it's connected symbol
	let tirpsArr = [];
	for (var i = 0; i < Object.keys(symbolTirpsList).length; i++) {
		let symbol = Object.keys(symbolTirpsList)[i];
		if (symbol !== 'null') {
			let tirps = symbolTirpsList[symbol];
			let newTirps = tirps.map((tirp) => {
				return { ...tirp, connectedSymbol: symbol };
			});
			tirpsArr = tirpsArr.concat(newTirps);
		}
	}
	return tirpsArr;
}

export function TIRPScore(tirp, numEntities0, numEntities1) {
	const toPercentage = (amount, total) => ((amount * 100) / total).toFixed(2);
	let vs0 = 0;
	let vs1 = 0;
	let mhs0 = 0;
	let mhs1 = 0;
	let md0 = 0;
	let md1 = 0;
	if (tirp.exist_in_class0) {
		vs0 = toPercentage(tirp.vertical_support_0, numEntities0);
		mhs0 = tirp.mean_horizontal_support_0;
		md0 = tirp.mean_duration_0;
	}
	if (tirp.exist_in_class1) {
		vs1 = toPercentage(tirp.vertical_support_1, numEntities1);
		mhs1 = tirp.mean_horizontal_support_1;
		md1 = tirp.mean_duration_1;
	}
	const delta_vs = Math.abs(vs0 - vs1);
	const delta_mhs = Math.abs(mhs0 - mhs1);
	const delta_mmd = Math.abs(md0 - md1);

	const score = 34 * delta_vs + 33 * delta_mhs + 33 * delta_mmd;
	return (score / 100).toFixed(2);
}

export function getTirpsToBubbles(
	symbolTirpsList,
	chosenTirp,
	xValue,
	yValue,
	colorValue,
	symbolToNames,
	bubbleSize
) {
	let tirps = [['symbol', xValue, yValue, colorValue, 'bubble size']];
	let tirpsObjectsList = [];
	for (var i = 0; i < Object.keys(symbolTirpsList).length; i++) {
		let symbol = Object.keys(symbolTirpsList)[i];
		if (symbol !== 'null') {
			let symbolTirps = symbolTirpsList[symbol];
			for (var j = 0; j < symbolTirps.length; j++) {
				let tirpMetrics = [];
				tirpMetrics.push(symbolToNames[symbol]);
				tirpsObjectsList.push(symbolTirps[j]);
				if (xValue === 'VS') {
					tirpMetrics.push(
						+(
							(symbolTirps[j].vertical_support_0 / +localStorage.num_of_entities) *
							100
						).toFixed(2)
					);
				} else if (xValue === 'MHS') {
					tirpMetrics.push(symbolTirps[j].mean_horizontal_support_0);
				} else {
					tirpMetrics.push(symbolTirps[j].mean_duration_0);
				}
				/////////////////////////////////////////////////////////////
				if (yValue === 'VS') {
					tirpMetrics.push(
						+(
							(symbolTirps[j].vertical_support_0 / +localStorage.num_of_entities) *
							100
						).toFixed(2)
					);
				} else if (yValue === 'MHS') {
					tirpMetrics.push(symbolTirps[j].mean_horizontal_support_0);
				} else {
					tirpMetrics.push(symbolTirps[j].mean_duration_0);
				}
				////////////////////////////////////////////////////////////
				if (colorValue === 'VS') {
					tirpMetrics.push(
						+(
							(symbolTirps[j].vertical_support_0 / +localStorage.num_of_entities) *
							100
						).toFixed(2)
					);
				} else if (colorValue === 'MHS') {
					tirpMetrics.push(symbolTirps[j].mean_horizontal_support_0);
				} else {
					tirpMetrics.push(symbolTirps[j].mean_duration_0);
				}
				if (chosenTirp !== null && equalTirps(symbolTirps[j], chosenTirp)) {
					tirpMetrics.push(bubbleSize + 3);
				} else {
					tirpMetrics.push(bubbleSize);
				}

				///////////////////////////////////////////////////////////
				tirps.push(tirpMetrics);
			}
		}
	}

	return [tirps, tirpsObjectsList];
}

export function getTirpsToBubblesDiscriminative(
	symbolTirpsList,
	chosenTirp,
	xValue,
	yValue,
	colorValue,
	symbolToNames,
	bubbleSize
) {
	let tirps = [['symbol', xValue, yValue, colorValue, bubbleSize]];
	let tirpsObjectsList = [];
	for (var i = 0; i < Object.keys(symbolTirpsList).length; i++) {
		let symbol = Object.keys(symbolTirpsList)[i];
		if (symbol !== 'null') {
			let symbolTirps = symbolTirpsList[symbol];
			for (var j = 0; j < symbolTirps.length; j++) {
				let tirpMetrics = [];
				tirpMetrics.push(symbolToNames[symbol]);
				tirpsObjectsList.push(symbolTirps[j]);
				if (xValue === 'VS0') {
					tirpMetrics.push(
						+(
							(symbolTirps[j].vertical_support_0 / +localStorage.num_of_entities) *
							100
						).toFixed(2)
					);
				} else if (xValue === 'VS1') {
					tirpMetrics.push(
						+(
							(symbolTirps[j].vertical_support_1 /
								+localStorage.num_of_entities_class_1) *
							100
						).toFixed(2)
					);
				} else if (xValue === 'Delta MHS') {
					let deltaMHS = parseFloat(
						Math.abs(
							symbolTirps[j].mean_horizontal_support_1 -
								parseFloat(symbolTirps[j].mean_horizontal_support_0)
						).toFixed(2)
					);
					tirpMetrics.push(deltaMHS);
				} else {
					let deltaMMD =
						parseFloat(
							Math.abs(
								symbolTirps[j].mean_duration_1 -
									parseFloat(symbolTirps[j].mean_duration_0)
							).toFixed(2)
						) / 100;
					tirpMetrics.push(deltaMMD);
				}
				/////////////////////////////////////////////////////////////
				if (yValue === 'VS0') {
					tirpMetrics.push(
						+(
							(symbolTirps[j].vertical_support_0 / +localStorage.num_of_entities) *
							100
						).toFixed(2)
					);
				} else if (yValue === 'VS1') {
					tirpMetrics.push(
						+(
							(symbolTirps[j].vertical_support_1 /
								+localStorage.num_of_entities_class_1) *
							100
						).toFixed(2)
					);
				} else if (yValue === 'Delta MHS') {
					let deltaMHS = parseFloat(
						Math.abs(
							symbolTirps[j].mean_horizontal_support_1 -
								parseFloat(symbolTirps[j].mean_horizontal_support_0)
						).toFixed(2)
					);
					tirpMetrics.push(deltaMHS);
				} else {
					let deltaMMD =
						parseFloat(
							Math.abs(
								symbolTirps[j].mean_duration_1 -
									parseFloat(symbolTirps[j].mean_duration_0)
							).toFixed(2)
						) / 100;
					tirpMetrics.push(deltaMMD);
				}
				////////////////////////////////////////////////////////////
				if (colorValue === 'VS0') {
					tirpMetrics.push(
						+(
							(symbolTirps[j].vertical_support_0 / +localStorage.num_of_entities) *
							100
						).toFixed(2)
					);
				} else if (colorValue === 'VS1') {
					tirpMetrics.push(
						+(
							(symbolTirps[j].vertical_support_1 /
								+localStorage.num_of_entities_class_1) *
							100
						).toFixed(2)
					);
				} else if (colorValue === 'Delta MHS') {
					let deltaMHS = parseFloat(
						Math.abs(
							symbolTirps[j].mean_horizontal_support_1 -
								parseFloat(symbolTirps[j].mean_horizontal_support_0)
						).toFixed(2)
					);
					tirpMetrics.push(deltaMHS);
				} else {
					let deltaMMD =
						parseFloat(
							Math.abs(
								symbolTirps[j].mean_duration_1 -
									parseFloat(symbolTirps[j].mean_duration_0)
							).toFixed(2)
						) / 100;
					tirpMetrics.push(deltaMMD);
				}
				////////////////////////////////////////////////////////////
				if (bubbleSize === 'VS0') {
					tirpMetrics.push(
						+(
							(symbolTirps[j].vertical_support_0 / +localStorage.num_of_entities) *
							100
						).toFixed(2)
					);
				} else if (bubbleSize === 'VS1') {
					tirpMetrics.push(
						+(
							(symbolTirps[j].vertical_support_1 /
								+localStorage.num_of_entities_class_1) *
							100
						).toFixed(2)
					);
				} else if (bubbleSize === 'Delta MHS') {
					let deltaMHS = parseFloat(
						Math.abs(
							symbolTirps[j].mean_horizontal_support_1 -
								parseFloat(symbolTirps[j].mean_horizontal_support_0)
						).toFixed(2)
					);
					tirpMetrics.push(deltaMHS);
				} else {
					let deltaMMD =
						parseFloat(
							Math.abs(
								symbolTirps[j].mean_duration_1 -
									parseFloat(symbolTirps[j].mean_duration_0)
							).toFixed(2)
						) / 100;
					tirpMetrics.push(deltaMMD);
				}
				////////////////////////////////////////////////////////////
				tirps.push(tirpMetrics);
			}
		}
	}
	return [tirps, tirpsObjectsList];
}

export function sortTirps(allTirpsArr, sort, symbolToNames, entities0, entities1) {
	if (sort === 'name') {
		return allTirpsArr.sort((tirp1, tirp2) =>
			symbolToNames[tirp1['connectedSymbol']].localeCompare(
				symbolToNames[tirp2['connectedSymbol']]
			)
		);
	}
	if (sort === 'size') {
		return allTirpsArr.sort((tirp1, tirp2) => tirp1.size - tirp2.size);
	}
	if (sort === 'score') {
		return allTirpsArr.sort(
			(tirp1, tirp2) =>
				TIRPScore(tirp1, entities0, entities1) - TIRPScore(tirp2, entities0, entities1)
		);
	}
	if (sort === 'vs' || sort === 'vs0') {
		return allTirpsArr.sort(
			(tirp1, tirp2) => tirp1['vertical_support_0'] - tirp2['vertical_support_0']
		);
	}
	if (sort === 'vs1') {
		return allTirpsArr.sort(
			(tirp1, tirp2) => tirp1['vertical_support_1'] - tirp2['vertical_support_1']
		);
	}
	if (sort === 'mhs' || sort === 'mhs0') {
		return allTirpsArr.sort(
			(tirp1, tirp2) =>
				tirp1['mean_horizontal_support_0'] - tirp2['mean_horizontal_support_0']
		);
	}
	if (sort === 'mhs1') {
		return allTirpsArr.sort(
			(tirp1, tirp2) =>
				tirp1['mean_horizontal_support_1'] - tirp2['mean_horizontal_support_1']
		);
	}
	if (sort === 'mmd' || sort === 'mmd0') {
		return allTirpsArr.sort(
			(tirp1, tirp2) => tirp1['mean_duration_0'] - tirp2['mean_duration_0']
		);
	}
	if (sort === 'mmd1') {
		return allTirpsArr.sort(
			(tirp1, tirp2) => tirp1['mean_duration_1'] - tirp2['mean_duration_1']
		);
	}
	if (sort === 'entities' || sort === 'entities0') {
		return allTirpsArr.sort(
			(tirp1, tirp2) =>
				tirp1['num_supporting_entities_0'] - tirp2['num_supporting_entities_0']
		);
	}
	if (sort === 'entities1') {
		return allTirpsArr.sort(
			(tirp1, tirp2) =>
				tirp1['num_supporting_entities_1'] - tirp2['num_supporting_entities_1']
		);
	}

	return allTirpsArr;
}
