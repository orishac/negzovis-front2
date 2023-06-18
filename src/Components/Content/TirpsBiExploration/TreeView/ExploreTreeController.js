import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { invalidOperationAlert } from '../../../SweetAlerts';
import { findPathOfTirps } from '../../../../networking/requests/visualization.js';
import * as HelperFunctions from './ExploreTreeHelper';
import ExploreTreeView from './ExploreTreeView';

const ExploreTree = (props) => {
	const [centerSymbol, setCenterSymbol] = useState(props.focusSymbol); //symbol in the center
	const symbolTirpsJson = useRef(props.symbolTirpsJson); //{symbol: {next: symbol: [TIRPs...]} prefix: symbol: [TIRPs...]}
	const [tirp, setTirp] = useState(symbolTirpsJson.current[centerSymbol]['next']['null'][0]); //tirp that is displayed at the moment (tirp JSON)
	const originalTIRP = symbolTirpsJson.current[centerSymbol]['next']['null'][0]; // tirp to explore that was gien from the user
	const symbolsToNames = props.symbolsToNames; // json that maps symbol number to it's name
	const [isClearPrefix, setIsClearPrefix] = useState(true); // is some symbol from left chosen or not
	const [isClearNext, setIsClearNext] = useState(true); // is some symbol from right chosen or not
	const [prefixSymbol, setPrefixSymbol] = useState(null); // symbol from left that is chosen {symbol: [TIRPS...]}
	const [nextSymbol, setNextSymbol] = useState(null); //symbol from right that is chosen  {symbol: [TIRPS...]}
	const [nextSymbols, setNextSymbols] = useState(symbolTirpsJson.current[centerSymbol]['next']); //symbols appear in the right
	const [prefixSymbols, setPrefixSymbols] = useState(//symbols appear in the left
		symbolTirpsJson.current[centerSymbol]['prefix']
	); // symbols appear in the left
	const history = useHistory();
	const [redirect, setRedirect] = useState(false);
	const [path, setPath] = useState([]); // current path of symbols that were clicked in the current exploration
	const [pathTirps, setPathTirps] = useState([]); // all possible tirps that can continue the exploration from current point
	const [prevNext, setPrevNext] = useState(''); //how has the priority to explore? did we get here from left or right?
	const [mode, setMode] = useState(1); // default - both sides are shown, or show onky tirps end with center symbol or those start with
	const [bubbleMode, setBubbleMode] = useState(false); // to present the explored tirps in both sides in tabular or bubble mode
	const [metricsTitles, setMetricsTitles] = useState([]); // bold metrics titles if the user clicks on them

	// this method is called from CustomNavBar, if the user decides to click on another symbol to explore, set accoridngly
	const setNewCenterSymbol = (symbolNumer)=>{
		setCenterSymbol(symbolNumer);
		setTirp(symbolTirpsJson.current[symbolNumer]['next']['null'][0]);
		setIsClearPrefix(true);
		setIsClearNext(true);
		setPrefixSymbol(null);
		setNextSymbol(null);
		setPrefixSymbols(symbolTirpsJson.current[symbolNumer]['prefix']);
		setNextSymbols(symbolTirpsJson.current[symbolNumer]['next']);
		setPrevNext('');
		setPath([]);
		setPathTirps([]);
	}
	// the user clicked on a symbol from left (prefix column)
	const handlePrefixClicked = (symbol, tirp) => {
		setPrefixSymbol(symbol);
		setIsClearPrefix(false);
		if (prevNext === '') {
			// no pripority set yet
			setPrevNext('prev'); //priority to prev
			setPath([symbol, centerSymbol]); //prefix is clicked and center exists
			let tirpsConnectedPrefix = symbolTirpsJson.current[centerSymbol]['prefix'][symbol]; //tirps that connect center symbol and prefix symbol
			let originalNextSymbols = symbolTirpsJson.current[centerSymbol]['next']; //when new prefix is clicked, we give everybody a chance
			let newNextSymbols = HelperFunctions.getNextSymbolsConstrains(
				//new next symbols are the only ones that appear after the center symbol and the prefix symbol just clicked
				symbol,
				centerSymbol,
				tirpsConnectedPrefix,
				originalNextSymbols
			);
			setNextSymbols(newNextSymbols);
			let newMatchTirps = HelperFunctions.getPathTirps(
				[symbol, centerSymbol],
				tirpsConnectedPrefix
			); //currnet path is prefixSymbol->center, so adjust the path
			setPathTirps(newMatchTirps);
			setTirp(tirp);
			let centerIndex = tirp['symbols'].indexOf(centerSymbol);
			setNextSymbol(
				//if there is a next symbol in the TIRP that was selected then mark it, else do nothing
				centerIndex === tirp['symbols'].length - 1 ? null : tirp['symbols'][centerIndex + 1]
			);
			setIsClearNext(centerIndex === tirp['symbols'].length - 1 ? true : false);
		} else if (prevNext === 'prev') {
			//priority was set to prefix
			//PrevNext === "prev" - priority to prev
			let oldPath = path;
			let centerIndexPath = oldPath.indexOf(centerSymbol);
			if (centerIndexPath === 0) {
				//if the center symbol used to be the first in the path, add the clicked symbol before it
				oldPath = [symbol].concat(oldPath);
			} else {
				//just replace the old prefix symbol with the current clicked one
				oldPath[centerIndexPath - 1] = symbol;
			}
			setPath(oldPath);
			let tirpsConnectedPrefix = symbolTirpsJson.current[centerSymbol]['prefix'][symbol]; //tirps that connect center symbol and prefix symbol
			let newMatchTirps = HelperFunctions.getPathTirps(oldPath, tirpsConnectedPrefix);
			setPathTirps(newMatchTirps); //setting the new TIRPS according to the symbol that was pressed
			let newNextSymbols = HelperFunctions.getSymbolsFromTirps(
				newMatchTirps,
				centerSymbol,
				true
			);
			setNextSymbols(newNextSymbols); //set next symbols that come after the clicked symbol and center symbol only
			setTirp(tirp);
			let centerIndex = tirp['symbols'].indexOf(centerSymbol);
			setNextSymbol(
				centerIndex === tirp['symbols'].length - 1 ? null : tirp['symbols'][centerIndex + 1]
			);
			setIsClearNext(centerIndex === tirp['symbols'].length - 1 ? true : false);
		} else {
			setTirp(tirp);
			setPrefixSymbol(symbol);
		}
	};

	//same as above, just in a symmetry - now a next symbol was clicked
	const handleNextClicked = (symbol, tirp) => {
		setNextSymbol(symbol);
		setIsClearNext(false);
		if (prevNext === '') {
			setPrevNext('next'); //priority to next
			setPath([centerSymbol, symbol]); // the current path is the symbol in the center and the one on the right that was just clicked
			let tirpsConnectedNext = symbolTirpsJson.current[centerSymbol]['next'][symbol]; // new next tirps
			let originalPrefixSymbols = symbolTirpsJson.current[centerSymbol]['prefix'];
			let newPrefixSymbols = HelperFunctions.getPrefixSymbolsConstrains(
				symbol,
				centerSymbol,
				tirpsConnectedNext,
				originalPrefixSymbols
			);//calculating new prefix tirps according to the center symbol, the previous ones and the selected symbol
			setPrefixSymbols(newPrefixSymbols);
			let newMatchTirps = HelperFunctions.getPathTirps(
				[centerSymbol, symbol],
				tirpsConnectedNext
			);
			setPathTirps(newMatchTirps);//setting all possible additional tirps to explore afterwards
			setTirp(tirp);
			let centerIndex = tirp['symbols'].indexOf(centerSymbol);
			setPrefixSymbol(centerIndex === 0 ? null : tirp['symbols'][centerIndex - 1]);
			setIsClearPrefix(centerIndex === 0 ? true : false);
		} else if (prevNext === 'next') {//if the priority was next, and a new next symbol pressed just replace the symbol in the path instead of the current next
			let oldPath = path;
			let centerIndexPath = oldPath.indexOf(centerSymbol);
			if (centerIndexPath === oldPath.length - 1) {
				oldPath = oldPath.concat([symbol]);
			} else {
				oldPath[centerIndexPath + 1] = symbol;
			}
			setPath(oldPath);
			let tirpsConnectedNext = symbolTirpsJson.current[centerSymbol]['next'][symbol];
			let newMatchTirps = HelperFunctions.getPathTirps(oldPath, tirpsConnectedNext);//update new tirps according to the new pressed symbol
			setPathTirps(newMatchTirps);
			let newPrefixSymbols = HelperFunctions.getSymbolsFromTirps(
				newMatchTirps,
				centerSymbol,
				false
			);
			setPrefixSymbols(newPrefixSymbols);
			setTirp(tirp);
			let centerIndex = tirp['symbols'].indexOf(centerSymbol);
			setPrefixSymbol(centerIndex === 0 ? null : tirp['symbols'][centerIndex - 1]);
			setIsClearPrefix(centerIndex === 0 ? true : false);
		} else {
			setTirp(tirp);
			setNextSymbol(symbol);
		}
	};
	// this method is called then one of the symbol tables components
	// are pressed
	const symbolClicked = (symbol, isPrefix, tirp) => {
		if (isPrefix) {
			// array of all tirps that contains the prefix symbol that
			// was just clicked
			handlePrefixClicked(symbol, tirp);
		} else {
			// next symbol pressed
			handleNextClicked(symbol, tirp);
		}
	};

	//the user clicked on the 'prefix' button
	const handlePrefixArrow = () => {
		if (prefixSymbol !== null) {
			if (prevNext === 'prev') {
				//prefix has priority
				// prefix has priority
				if (!isClearNext && path[path.length - 1] !== nextSymbol) {
					//next symbol is pressed but not inserted the to path yet
					// need to add the last symbol before going back
					let newPath = path.concat([nextSymbol]); //adding next symbol to the path
					setPath(newPath);
					let newMatchTirps = HelperFunctions.getPathTirps(newPath, pathTirps);
					setPathTirps(newMatchTirps);
					let newPrefixSymbols = HelperFunctions.getSymbolsFromTirps(
						newMatchTirps,
						prefixSymbol,
						false
					); //calculating the new prefix symbols
					setPrefixSymbols(newPrefixSymbols);
					let j = {};
					j[centerSymbol] = [tirp];
					setNextSymbols(j); //the only next symbol is the one that was previously clicked
					setNextSymbol(centerSymbol);
					let newCenterIndex = tirp['symbols'].indexOf(prefixSymbol);
					setPrefixSymbol(
						newCenterIndex === 0 ? null : tirp['symbols'][newCenterIndex - 1]
					);
					setCenterSymbol(prefixSymbol);
					setIsClearNext(false);
					setIsClearPrefix(newCenterIndex === 0 ? true : false);
					setPrevNext('next');
				} else {
					//there is no next symbol that is pressed, just set the new prefix symbols
					let newPrefixSymbols = HelperFunctions.getSymbolsFromTirps(
						pathTirps,
						prefixSymbol,
						false
					);
					setPrefixSymbols(newPrefixSymbols);
					let j = {};
					j[centerSymbol] = [tirp];
					setNextSymbols(j);
					setNextSymbol(centerSymbol);
					let newCenterIndex = tirp['symbols'].indexOf(prefixSymbol);
					setPrefixSymbol(
						newCenterIndex === 0 ? null : tirp['symbols'][newCenterIndex - 1]
					);
					setCenterSymbol(prefixSymbol);
					setIsClearNext(false);
					setIsClearPrefix(newCenterIndex === 0 ? true : false);
					setPrevNext('next');
					setMode(1);
				}
			} else {
				//next has priority
				let oldPath = path;
				oldPath = [prefixSymbol].concat(oldPath); //adding the prefix symbol to path
				setPath(oldPath);
				let newMatchTirps = HelperFunctions.getPathTirps(oldPath, pathTirps);
				setPathTirps(newMatchTirps);
				let newPrefixSymbols = HelperFunctions.getSymbolsFromTirps(
					newMatchTirps,
					prefixSymbol,
					false
				);
				setPrefixSymbols(newPrefixSymbols);
				let j = {};
				j[centerSymbol] = [tirp];
				setNextSymbols(j);
				setNextSymbol(centerSymbol);
				let newCenterIndex = tirp['symbols'].indexOf(prefixSymbol);
				setPrefixSymbol(newCenterIndex === 0 ? null : tirp['symbols'][newCenterIndex - 1]);
				setCenterSymbol(prefixSymbol);
				setIsClearNext(false);
				setIsClearPrefix(newCenterIndex === 0 ? true : false);
				setPrevNext('next');
			}
		} else {
			invalidOperationAlert('please choose previous symbol to explore first');
		}
	};

	// same as above, in a symmetry - now 'next' button is clicked
	const handleNextArrow = () => {
		if (nextSymbol !== null) {
			if (prevNext === 'next') {
				if (!isClearPrefix && path[0] !== prefixSymbol) {
					// need to add the last symbol before going back
					let newPath = [prefixSymbol].concat(path);
					setPath(newPath);
					let newMatchTirps = HelperFunctions.getPathTirps(newPath, pathTirps);
					setPathTirps(newMatchTirps);
					let newNextSymbols = HelperFunctions.getSymbolsFromTirps(
						newMatchTirps,
						nextSymbol,
						true
					);
					setNextSymbols(newNextSymbols);
					let j = {};
					j[centerSymbol] = [tirp];
					setPrefixSymbols(j);
					setPrefixSymbol(centerSymbol);
					let newCenterIndex = tirp['symbols'].indexOf(nextSymbol);
					setNextSymbol(
						newCenterIndex === tirp['symbols'].length - 1
							? null
							: tirp['symbols'][newCenterIndex + 1]
					);
					setCenterSymbol(nextSymbol);
					setIsClearPrefix(false);
					setIsClearNext(newCenterIndex === tirp['symbols'].length - 1 ? true : false);
					setPrevNext('prev');
				} else {
					let newNextSymbols = HelperFunctions.getSymbolsFromTirps(
						pathTirps,
						nextSymbol,
						true
					);
					setNextSymbols(newNextSymbols);
					let j = {};
					j[centerSymbol] = [tirp];
					setPrefixSymbols(j);
					setPrefixSymbol(centerSymbol);
					let newCenterIndex = tirp['symbols'].indexOf(nextSymbol);
					setNextSymbol(
						newCenterIndex === tirp['symbols'].length - 1
							? null
							: tirp['symbols'][newCenterIndex + 1]
					);
					setCenterSymbol(nextSymbol);
					setIsClearPrefix(false);
					setIsClearNext(newCenterIndex === tirp['symbols'].length - 1 ? true : false);
					setPrevNext('prev');
					setMode(1);
				}
			} else {
				let oldPath = path;
				oldPath = oldPath.concat([nextSymbol]);
				setPath(oldPath);
				let newMatchTirps = HelperFunctions.getPathTirps(oldPath, pathTirps);
				setPathTirps(newMatchTirps);
				let newNextSymbols = HelperFunctions.getSymbolsFromTirps(
					newMatchTirps,
					nextSymbol,
					true
				);
				setNextSymbols(newNextSymbols);
				let j = {};
				j[centerSymbol] = [tirp];
				setPrefixSymbols(j);
				setPrefixSymbol(centerSymbol);
				let newCenterIndex = tirp['symbols'].indexOf(nextSymbol);
				setNextSymbol(
					newCenterIndex === tirp['symbols'].length - 1
						? null
						: tirp['symbols'][newCenterIndex + 1]
				);
				setCenterSymbol(nextSymbol);
				setIsClearPrefix(false);
				setIsClearNext(newCenterIndex === tirp['symbols'].length - 1 ? true : false);
				setPrevNext('prev');
			}
		} else {
			invalidOperationAlert('please choose previous symbol to explore first');
		}
	};
	// this method called when right/left (next/prefix) arrow is presses
	// the method updates the symbols according to the side we want
	// to move to and re-renders
	// this method uses the tirp value so i assume the tirp is
	// always up to date with the correct TIRP
	const arrowClicked = (isPrefix) => {
		if (isPrefix) {
			handlePrefixArrow();
		} else {
			//next arrow was clicked
			handleNextArrow();
		}
	};

	// method called then 'clear all' button is pressed
	// the method unmarks the component that was pressed before
	const handleClearClick = () => {
		setPrefixSymbol(null);
		setNextSymbol(null);
		setIsClearPrefix(true);
		setIsClearNext(true);
		setPrefixSymbols(symbolTirpsJson.current[centerSymbol]['prefix']);
		setNextSymbols(symbolTirpsJson.current[centerSymbol]['next']);
		setTirp(symbolTirpsJson.current[centerSymbol]['next']['null'][0]);
		setPrevNext('');
		setPath([]);
		setPathTirps([]);
	};

	// shoukd transfer to the TIRP's table of guys screen
	const exploreTIRP = () => {
		//casting data to the format of hugobot
		localStorage.PassedFromSearch = true;
		let symbols = tirp['symbols'].reduce((acc, cur) => (acc += cur + '-'), '');
		let relations = tirp['relations'].reduce((acc, cur) => (acc += cur + '.'), '');
		const visualizationId = sessionStorage.getItem('visualizationId');
		findPathOfTirps(symbols, relations, visualizationId).then((data) => {
			let results = data['Path'];
			let path = [];
			for (let i = 0; i < results.length; i++) {
				let tirp = JSON.parse(results[i]);
				path.push(tirp);
			}
			window.pathOfTirps = path;
			setRedirect(true);
		});
	};

	const numEntities0 = localStorage.getItem('num_of_entities');
	const numEntities1 = localStorage.getItem('num_of_entities_class_1');
	const vs0 = originalTIRP['vertical_support_0'];
	const vs1 = originalTIRP['vertical_support_1'];
	const cleanedOriginalTirp = {
		...originalTIRP,
		vertical_support_0: (vs0 / numEntities0) * 100,
		vertical_support_1: (vs1 / numEntities1) * 100,
	};
	const createDropDownSymbols = ()=>{
		let symbolsAndFrequencies = {};
		for(var i=0; i<Object.keys(symbolTirpsJson.current).length; i++){
			let symbol = Object.keys(symbolTirpsJson.current)[i];
			let oneSizedTirp = symbolTirpsJson.current[symbol]['next']['null'][0];
			symbolsAndFrequencies[symbol] = ((oneSizedTirp['vertical_support_0'] / numEntities0) * 100).toFixed(2);
		}
		return symbolsAndFrequencies;
	}

	return (
		<ExploreTreeView
			arrowClicked={arrowClicked}
			bubbleMode={bubbleMode}
			centerSymbol={centerSymbol}
			// exploreTIRP={exploreTIRP}
			handleClearClick={handleClearClick}
			history={history}
			isClearNext={isClearNext}
			isClearPrefix={isClearPrefix}
			markedTirp={tirp}
			metricsTitles={metricsTitles}
			mode={mode}
			nextSymbol={nextSymbol}
			nextSymbols={nextSymbols}
			originalTIRP={cleanedOriginalTirp}
			prefixSymbol={prefixSymbol}
			prefixSymbols={prefixSymbols}
			prevNext={prevNext}
			redirect={redirect}
			setBubbleMode={setBubbleMode}
			setMetricsTitles={setMetricsTitles}
			setMode={setMode}
			symbolClicked={symbolClicked}
			symbolsToNames={symbolsToNames}
			type={props.type}
			newCenterSymbol={setNewCenterSymbol}
			dropDownSymbols={createDropDownSymbols()}
		/>
	);
};

export default ExploreTree;
