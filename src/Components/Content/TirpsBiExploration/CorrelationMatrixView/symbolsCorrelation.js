import React, { useState, useEffect, useRef } from 'react';
import { Table, ButtonGroup, Col, Row, ToggleButton } from 'react-bootstrap';
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react';
import Axios from 'axios';

const SymbolsCorrelation = (props) => {
	const [symbols, setSymbols] = useState([]);
	const [ready, setReady] = useState(false);

	const relationsJson = {
		All: 'All',
		before: '<',
		meets: 'm',
		overlaps: 'o',
		starts: 's',
		contains: 'c',
		'finished-by': 'f',
		equal: '=',
	};
	const [relationFilter, setRelationFilter] = useState('before');
	const correlatedSymbols = useRef({});
	const relationMaxCorrelation = useRef({});
	const [mode, setMode] = useState(0);

	useEffect(() => {
		let url = `${window.base_url}/correlatedSymbols`;
		Axios.get(url, {
			params: {
				datasetName: sessionStorage['datasetReadyName'],
				visualization_id: sessionStorage.getItem('visualizationId'),
			},
		}).then((correlatedJson) => {
			correlatedSymbols.current = correlatedJson.data;
			relationMaxCorrelation.current = returnMaxCorrelation(correlatedJson.data);
			setSymbols(Object.keys(correlatedJson.data));
			setReady(true);
		});
	}, []);

	function pickHex(color1, color2, location) {
		var w1 = location;
		var w2 = 1 - w1;
		var [r, g, b] = [
			Math.round(color1[0] * w1 + color2[0] * w2),
			Math.round(color1[1] * w1 + color2[1] * w2),
			Math.round(color1[2] * w1 + color2[2] * w2),
		];
		return `rgb(${r},${g},${b})`;
	}
	// returns a json for example: {
	// '<': [2, 10],
	// 'm': [1, 2]
	// }
	// for every temporal relation there is a tuple t.
	// t[0] is the max number of tirps that two symbols have this relation between them in class 0
	// t[1] is the max number of tirps that two symbols have this relation between them in class 1
	const returnMaxCorrelation = (symbolCorrelatationJson) => {
		let relationMaxJson = {};
		relationMaxJson['All'] = [0, 0];
		Object.keys(symbolCorrelatationJson).forEach((symbol1) => {
			let symbol1Json = symbolCorrelatationJson[symbol1];
			Object.keys(symbol1Json).forEach((symbol2) => {
				let symbol1Symbol2Json = symbol1Json[symbol2];
				Object.keys(symbol1Symbol2Json).forEach((relation) => {
					let symbol1Symbol2RelationCorr = symbol1Symbol2Json[relation];
					if (!relationMaxJson.hasOwnProperty(relation)) {
						relationMaxJson[relation] = symbol1Symbol2RelationCorr;
					} else {
						if (relationMaxJson[relation][0] < symbol1Symbol2RelationCorr[0]) {
							// number of TIRPs that symbol1,symbol2 with this relation > max number of TIRPs seen till now in class 0
							relationMaxJson[relation][0] = symbol1Symbol2RelationCorr[0];
						}
						if (relationMaxJson['All'][0] < symbol1Symbol2RelationCorr[0]) {
							// check if we need to update the 'All' entry in the json (global max tirps for all relations class 0)
							relationMaxJson['All'][0] = symbol1Symbol2RelationCorr[0];
						}
						if (relationMaxJson[relation][1] < symbol1Symbol2RelationCorr[1]) {
							// number of TIRPs that symbol1,symbol2 with this relation > max number of TIRPs seen till now in class 1
							relationMaxJson[relation][1] = symbol1Symbol2RelationCorr[1];
						}
						if (relationMaxJson['All'][1] < symbol1Symbol2RelationCorr[1]) {
							// check if we need to update the 'All' entry in the json (global max tirps for all relations class 1)
							relationMaxJson['All'][1] = symbol1Symbol2RelationCorr[1];
						}
					}
				});
			});
		});
		return relationMaxJson;
	};
	const getCorrelationCoef = (rowSymbol, colSymbol) => {
		let relation = relationsJson[relationFilter];
		let corrNum = 0;
		let maxCorr = 1;

		if (
			rowSymbol === colSymbol ||
			correlatedSymbols.current[rowSymbol][colSymbol] === undefined ||
			(relation !== 'All' &&
				correlatedSymbols.current[rowSymbol][colSymbol][relation] === undefined)
		) {
			return 0;
		}

		if (relation === 'All') {
			if (mode === 0) {
				Object.keys(correlatedSymbols.current[rowSymbol][colSymbol]).forEach((relation) => {
					corrNum += correlatedSymbols.current[rowSymbol][colSymbol][relation][0];
				});
			}
			if (mode === 1) {
				Object.keys(correlatedSymbols.current[rowSymbol][colSymbol]).forEach((relation) => {
					corrNum += correlatedSymbols.current[rowSymbol][colSymbol][relation][1];
				});
			}
			if (mode === 2) {
				let corr0 = 0;
				let corr1 = 0;
				Object.keys(correlatedSymbols.current[rowSymbol][colSymbol]).forEach((relation) => {
					corr0 += correlatedSymbols.current[rowSymbol][colSymbol][relation][0];
				});
				Object.keys(correlatedSymbols.current[rowSymbol][colSymbol]).forEach((relation) => {
					corr1 += correlatedSymbols.current[rowSymbol][colSymbol][relation][1];
				});
				corrNum = Math.abs(corr0 - corr1);
			}
		} else {
			corrNum =
				mode === 0
					? correlatedSymbols.current[rowSymbol][colSymbol][relation][0]
					: mode === 1
					? correlatedSymbols.current[rowSymbol][colSymbol][relation][1]
					: Math.abs(
							correlatedSymbols.current[rowSymbol][colSymbol][relation][0] -
								correlatedSymbols.current[rowSymbol][colSymbol][relation][1]
					  );
		}
		maxCorr =
			mode === 0
				? relationMaxCorrelation.current[relation][0]
				: mode === 1
				? relationMaxCorrelation.current[relation][1]
				: Math.max(
						relationMaxCorrelation.current[relation][0],
						relationMaxCorrelation.current[relation][1]
				  );
		return maxCorr !== 0 ? corrNum / maxCorr : corrNum / (maxCorr + 1);
	};

	const getCorrAll = (rowSymbol, colSymbol) => {
		let corrNum = 0;
		if (mode === 0) {
			Object.keys(correlatedSymbols.current[rowSymbol][colSymbol]).forEach((relation) => {
				corrNum += correlatedSymbols.current[rowSymbol][colSymbol][relation][0];
			});
			return corrNum;
		}
		if (mode === 1) {
			Object.keys(correlatedSymbols.current[rowSymbol][colSymbol]).forEach((relation) => {
				corrNum += correlatedSymbols.current[rowSymbol][colSymbol][relation][1];
			});
			return corrNum;
		}
		if (mode === 2) {
			let corr0 = 0;
			let corr1 = 0;
			Object.keys(correlatedSymbols.current[rowSymbol][colSymbol]).forEach((relation) => {
				corr0 += correlatedSymbols.current[rowSymbol][colSymbol][relation][0];
			});
			Object.keys(correlatedSymbols.current[rowSymbol][colSymbol]).forEach((relation) => {
				corr1 += correlatedSymbols.current[rowSymbol][colSymbol][relation][1];
			});
			return corr0 + '/' + corr1;
		}
	};

	const getCorrText = (rowSymbol, colSymbol) => {
		let relation = relationsJson[relationFilter];
		if (
			rowSymbol === colSymbol ||
			correlatedSymbols.current[rowSymbol][colSymbol] === undefined ||
			(relation !== 'All' &&
				correlatedSymbols.current[rowSymbol][colSymbol][relation] === undefined)
		) {
			return '';
		}
		if (relation === 'All') {
			return getCorrAll(rowSymbol, colSymbol);
		}
		if (mode === 0) {
			return correlatedSymbols.current[rowSymbol][colSymbol][relation][0];
		}
		if (mode === 1) {
			return correlatedSymbols.current[rowSymbol][colSymbol][relation][1];
		}
		if (mode === 2) {
			return (
				correlatedSymbols.current[rowSymbol][colSymbol][relation][0] +
				'/' +
				correlatedSymbols.current[rowSymbol][colSymbol][relation][1]
			);
		}
	};
	return ready ? (
		<div className='correlationMatrix'>
			<div
				className='menu'
				style={{ display: 'flex', flexDirection: 'row', marginBottom: '1%' }}
			>
				<CDropdown>
					<CDropdownToggle color='secondary'>{relationFilter}</CDropdownToggle>
					<CDropdownMenu>
						{Object.keys(relationsJson).map((relation) => {
							return (
								<CDropdownItem
									style={{ cursor: 'pointer' }}
									onClick={() => {
										setRelationFilter(relation);
									}}
								>
									{relation}
								</CDropdownItem>
							);
						})}
					</CDropdownMenu>
				</CDropdown>
				<ButtonGroup toggle={true} size='lg' className='w-50' style={{ marginLeft: '20%' }}>
					<ToggleButton
						type={'radio'}
						className={'btn-hugobot radio-btn-label'}
						checked={mode === 0}
						onClick={() => setMode(0)}
					>
						{localStorage.class_name}
					</ToggleButton>
					<ToggleButton
						type={'radio'}
						className={'btn-hugobot radio-btn-label'}
						checked={mode === 1}
						onClick={() => setMode(1)}
					>
						{localStorage.second_class_name}
					</ToggleButton>
					<ToggleButton
						type={'radio'}
						className={'btn-hugobot radio-btn-label'}
						checked={mode === 2}
						onClick={() => setMode(2)}
					>
						Discriminative
					</ToggleButton>
				</ButtonGroup>
			</div>
			<Table responsive style={{ tableLayout: 'fixed', overflowWrap: 'break-word' }}>
				<thead>
					<tr>
						<th>#</th>
						{symbols.map((symbol, index) => (
							<th key={index} style={{ borderRight: '1px solid #000' }}>
								{symbol}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{symbols.map((rowSymbol, rowIdx) => (
						<tr>
							<th>{rowSymbol}</th>
							{symbols.map((columnSymbol, colIdx) => (
								<td
									style={{
										textAlign: 'center',
										backgroundColor: pickHex(
											[255, 0, 0],
											[255, 255, 255],
											getCorrelationCoef(rowSymbol, columnSymbol)
										),
										borderRight: '1px solid #000',
										borderTop: '1px solid #000',
									}}
								>
									{getCorrText(rowSymbol, columnSymbol)}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</Table>
			<div className='correlationGradient'>
				{/* <p>High</p>
                    <Colorscale
                        colorscale={viridisColorscale}
                        onClick={() => {}}
                        width={300}
                    />
                    <p>Low</p> */}
			</div>

			{/* <ColorscalePicker 
                    onChange={()=>console.log("hahaha")}
                    colorscale={viridisColorscale}
                /> */}
		</div>
	) : null;
};

export default SymbolsCorrelation;
