import React, { useState, useEffect, useRef } from 'react';
import Axios from 'axios';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import RawDataChart from './RawDataChart';
import CircularProgress from '@material-ui/core/CircularProgress';

const RawData = (props) => {
	const [rawData, setRawData] = useState();
	const [descriteData, setDescriteData] = useState();

	// const [convertedRawData, setConvertedRawData] = useState();
	// const [convertedDescriteData, setConvertedDescriteData] = useState();

	const symbolsToValues = useRef();
	// const [descritizationMethod, setDescriteMethod] = useState('');

	const [entityID, setEntityID] = useState(-1);
	const [symbols, setSymbols] = useState([]);

	// const [isEntityOn, setEntityOn] = useState(true);

	// const [symbol, setSymbol] = useState(null);
	// const [entities, setEntities] = useState([]);

	const [indexToShow, setIndexToShow] = useState(5);

	// const joinTwoJsons = (json1, json2) => {
	// 	let joinedJson = {
	// 		...json1,
	// 		...json2,
	// 	};
	// 	return joinedJson;
	// };

	const loadMoreEntities = () => {
		setIndexToShow(indexToShow + 5);
	};

	let symbolColorsJSON = {
		0: ['#00FFFF', '#7FFFD4', '#6495ED'], //blue
		1: ['#FF00FF', '#FFB6C1', '#800000'], //pink
		2: ['#556B2F', '#FF8C00', '#FF69B4'], //green
	};

	useEffect(() => {
		let url = 'http://127.0.0.1:8080/symbols_values_data';
		Axios.get(url).then((symbolToNames) => {
			url = 'http://127.0.0.1:8080/rawData';
			Axios.get(url).then((rawData) => {
				url = 'http://127.0.0.1:8080/descriteData';
				Axios.get(url).then((descriteData) => {
					// url = 'http://127.0.0.1:8080/get_descritization_method';
					// Axios.get(url).then(
					// (descritizationMethod)=>{
					symbolsToValues.current = symbolToNames.data;
					setRawData(rawData.data);
					setDescriteData(descriteData.data);
					// setDescriteMethod(descritizationMethod.data);
				});
				// })
			});
		});
	}, []);

	return rawData !== null && rawData !== undefined ? (
		<div>
			<div style={{ display: 'flex', flexDirection: 'row' }}>
				<FormControl>
					<InputLabel
						style={{ fontSize: '25px', fontWeight: 'bold' }}
						id='demo-mutiple-checkbox-label'
					>
						Entity ID
					</InputLabel>
					<Select
						style={{ width: '200px' }}
						value={entityID !== -1 ? entityID : ''}
						labelId='demo-mutiple-checkbox-label'
						id='demo-mutiple-checkbox'
						onChange={(e) => {
							e.target.value === 'Load more'
								? loadMoreEntities()
								: setEntityID(e.target.value);
						}}
					>
						{Object.keys(rawData)
							.slice(0, indexToShow)
							.map((entityID) => (
								<MenuItem key={entityID} value={entityID}>
									<ListItemText primary={entityID} />
								</MenuItem>
							))}
						{
							<MenuItem key={'Load more'} value={'Load more'}>
								<ListItemText primary={'Load more'} />
							</MenuItem>
						}
					</Select>
				</FormControl>
				<FormControl style={{ marginLeft: '5%' }}>
					<InputLabel
						style={{ fontSize: '25px', fontWeight: 'bold' }}
						id='demo-mutiple-checkbox-label'
					>
						Variables
					</InputLabel>
					{entityID !== -1 ? (
						<Select
							style={{ width: '200px', marginTop: '15%' }}
							labelId='demo-mutiple-checkbox-label'
							id='demo-mutiple-checkbox'
							multiple
							input={<Input />}
							renderValue={(selected) => selected.join(', ')}
							defaultValue={[]}
							onChange={(e) => setSymbols(e.target.value)}
						>
							{Object.keys(rawData[entityID]).map((symbol) => (
								<MenuItem key={symbol} value={symbol}>
									<Checkbox checked={symbols.includes(symbol)} />
									<ListItemText primary={symbol} />
								</MenuItem>
							))}
						</Select>
					) : null}
				</FormControl>
			</div>
			{symbols.map((symbol) => {
				return (
					<RawDataChart
						values={rawData[entityID][symbol]}
						descriteValues={
							descriteData[entityID] !== null && descriteData[entityID] !== undefined
								? descriteData[entityID][symbol]
								: []
						}
						symbol={symbol}
						key={symbol}
						binValues={
							Object.values(symbolsToValues.current)[
								Object.keys(symbolsToValues.current).indexOf(symbol)
							]
						}
						colorsArr={symbolColorsJSON[symbols.indexOf(symbol) % 3]}
						// descritizationMethod={descritizationMethod}
					/>
				);
			})}
		</div>
	) : (
		<CircularProgress
			style={{ color: 'purple', marginLeft: '45%', marginTop: '20%', width: 150 }}
		/>
	);
};

export default RawData;
