export function getIndexOfSymbolInTIRP(tirp, symbol) {
	let tirpSymbols = tirp['symbols'];
	return tirpSymbols.indexOf(symbol);
}
//returns true if tirpsList contains tirpToLook
export function listIncludesTIRP(tirpsList, tirpToLook) {
	for (var i = 0; i < tirpsList.length; i++) {
		let tirp = tirpsList[i];
		if (JSON.stringify(tirp) === JSON.stringify(tirpToLook)) {
			return true;
		}
	}
	return false;
}
//returns all the tirps in tirpsArr that contain the specific order: pre, center, next
export function TIRPsContainOrder(tirpsArr, preClickedSymbol, centerSymbol, nextSymbol) {
	let matchTIRPs = [];
	for (var i = 0; i < tirpsArr.length; i++) {
		let tirp = tirpsArr[i];
		let indexNext = getIndexOfSymbolInTIRP(tirp, nextSymbol);
		let indexCenter = getIndexOfSymbolInTIRP(tirp, centerSymbol);
		let indexPrev = getIndexOfSymbolInTIRP(tirp, preClickedSymbol);
		if (indexNext !== -1 && indexCenter !== -1 && indexPrev !== -1) {
			if (
				!listIncludesTIRP(matchTIRPs, tirp) &&
				indexNext === indexCenter + 1 &&
				indexCenter === indexPrev + 1
			) {
				matchTIRPs.push(tirp);
			}
		}
	}
	return matchTIRPs;
}
//returns all the symbols that are suitable to be nextSymbols that come after the sequence pre, center
export function getNextSymbolsConstrains(preClickedSymbol, centerSymbol, tirpsArr, nextSymbols) {
	// out of the tirpsArr check all symbols show up in next places
	let newNextSymbols = {};
	for (var symbol in nextSymbols) {
		let newMatchTIRPs = TIRPsContainOrder(tirpsArr, preClickedSymbol, centerSymbol, symbol);
		if (newMatchTIRPs.length > 0) {
			newNextSymbols[symbol] = newMatchTIRPs;
		}
	}
	return newNextSymbols;
}
//returns all the symbols that are suitable to be prefixSymbols that come after the sequence center, next
export function getPrefixSymbolsConstrains(
	nextClickedSymbol,
	centerSymbol,
	tirpsArr,
	prefixSymbols
) {
	// out of the tirpsArr check all symbols show up in next places
	let newPrefixSymbols = {};
	for (var symbol in prefixSymbols) {
		let newMatchTIRPs = TIRPsContainOrder(tirpsArr, symbol, centerSymbol, nextClickedSymbol);
		if (newMatchTIRPs.length > 0) {
			newPrefixSymbols[symbol] = newMatchTIRPs;
		}
	}
	return newPrefixSymbols;
}

// gets all candidate TIRPs and the specific order of symbols we want to look for and returns all the TIRPs
// that contain this specific order
export function getPathTirps(symbolsOrder, OriginalTirps) {
	let newTirps = [];
	for (var i = 0; i < OriginalTirps.length; i++) {
		let tirp = OriginalTirps[i];
		let symbolIndexes = [];
		for (let j = 0; j < symbolsOrder.length; j++) {
			let symbol = symbolsOrder[j];
			let symbolIndex = getIndexOfSymbolInTIRP(tirp, symbol);
			symbolIndexes.push(symbolIndex);
		}
		let sequence = true;
		for (let j = 1; j < symbolIndexes.length; j++) {
			//checking for the specific desired order
			if (symbolIndexes[j] - 1 !== symbolIndexes[j - 1]) {
				sequence = false;
			}
		}
		if (sequence) {
			newTirps.push(tirp);
		}
	}
	return newTirps;
}

// gets all candidate TIRPs and the desired symbol and returns the symbolTIRPs json corresponds to whether
// this is a next request or a prefix one
export function getSymbolsFromTirps(tirps, symbol, isPrev) {
	let symbolTirps = {};
	for (var i = 0; i < tirps.length; i++) {
		let tirp = tirps[i];
		let symbolIndex = getIndexOfSymbolInTIRP(tirp, symbol);
		if (isPrev && symbolIndex < tirp['symbols'].length - 1) {
			let prevSymbol = tirp['symbols'][symbolIndex + 1];
			if (symbolTirps.hasOwnProperty(prevSymbol)) {
				symbolTirps[prevSymbol].push(tirp);
			} else {
				symbolTirps[prevSymbol] = [tirp];
			}
		}

		if (!isPrev && symbolIndex > 0) {
			let nextSymbol = tirp['symbols'][symbolIndex - 1];
			if (symbolTirps.hasOwnProperty(nextSymbol)) {
				symbolTirps[nextSymbol].push(tirp);
			} else {
				symbolTirps[nextSymbol] = [tirp];
			}
		}
	}
	return symbolTirps;
}
