import React, { useEffect, useRef, useState } from 'react';
import Axios from 'axios';
// import TIRP from './DataStructures/TIRP';
import { CircularProgress } from '@material-ui/core';
import ExploreTreeController from './TreeView/ExploreTreeController';

const App = (props) => {
	const [tirpsReady, setTirpsReady] = useState(false);
	const [readyToExplore, setReadyToExplore] = useState(false);
	const symbolsToNames = useRef({});
	const [symbolsToTirps, setSymbolsToTirps] = useState({});

	const findSymbolFromProps = () => {
		if (sessionStorage.getItem('ExploreSymbol') === null) {
			// no TIRP is initially chosen for exploration
			return JSON.parse(localStorage.rootElement)[0]['_TIRP__unique_name'].split('|')[0];
		}
		let symbolFromProps = JSON.parse(sessionStorage['ExploreSymbol']);
		for (var i = 0; i < Object.keys(symbolsToNames.current).length; i++) {
			let symbol = Object.keys(symbolsToNames.current)[i];
			let name = symbolsToNames.current[symbol];
			if (name === symbolFromProps) {
				return symbol;
			}
		}
		// an initial TIRP was once chosen but not this time, so return the default one
		return JSON.parse(localStorage.rootElement)[0]['_TIRP__unique_name'].split('|')[0];
	};

	const deserializeSymbolTirps = (serializedJson) => {
		return serializedJson;
	};


	useEffect(() => {
		let url = `${window.base_url}/symbols_to_names`;
		const promise1 = Axios.get(url, {
			params: {
				datasetName: sessionStorage['datasetReadyName'],
				visualization_id: sessionStorage.getItem('visualizationId'),
			},
		}).then((symbolsToNamesJSON) => {
			symbolsToNames.current = symbolsToNamesJSON.data;
			setTirpsReady(true);
		});
		url = `${window.base_url}/get_symbol_TIRPs`;
		const promise2 = Axios.get(url, {
			params: {
				datasetName: sessionStorage['datasetReadyName'],
				visualization_id: sessionStorage.getItem('visualizationId'),
			},
		}).then((symbolsTirpsData) => {
			let symbolsTirpsTemp = symbolsTirpsData.data;
			setSymbolsToTirps(deserializeSymbolTirps(symbolsTirpsTemp));
		});
		Promise.all([promise1, promise2]).then(() => setReadyToExplore(true));
	}, []);
	console.log(props.type)
	return tirpsReady && readyToExplore ? (
		<ExploreTreeController
			focusSymbol={findSymbolFromProps()}
			symbolsToNames={symbolsToNames.current}
			symbolTirpsJson={symbolsToTirps}
			type={props.type}
		/>
	) : (
		<CircularProgress
			style={{ color: 'purple', marginLeft: '45%', marginTop: '20%', width: 150 }}
		/>
	);
};

export default App;
