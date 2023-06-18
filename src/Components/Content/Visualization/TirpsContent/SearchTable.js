import React, { Component } from 'react';
import { Row, Col, Table } from 'react-bootstrap';

const headerSortingStyle = { backgroundColor: '#c8e6c9' };

class Tirp {
	constructor(symbols, rawSymbols, relations, size, vs0, vs1, mhs0, mhs1, mmd0, mmd1) {
		this.symbols = symbols;
		this.rawSymbols = rawSymbols;
		this.relations = relations;
		this.size = size;
		this.vs0 = vs0;
		this.mhs0 = mhs0;
		this.mmd0 = mmd0;
		this.vs1 = vs1;
		this.mhs1 = mhs1;
		this.mmd1 = mmd1;
	}
}

class SearchTable extends Component {
	state = {
		sortFunc: undefined,
		sortedCol: null,
		sortAsc: true,
		selectedTirp: null,
	};

	computeStates() {
		const statesTable = JSON.parse(localStorage.States);
		const statesEntries = statesTable.States.map((state) => {
			const property = state.TemporalPropertyName ?? state.TemporalPropertyID;
			const bin = state.BinLabel ?? state.BinID;
			const name = property + '.' + bin;
			return [state.StateID, name];
		});
		return Object.fromEntries(statesEntries);
	}

	parseTirps() {
		return this.props.tirps.map((raw_tirp) => {
			const vs0 = raw_tirp[4];
			const vs0_percentage = ((vs0 / parseInt(localStorage.num_of_entities)) * 100).toFixed(
				2
			);
			const vs1 = raw_tirp[10];
			const vs1_percentage = (
				(vs1 / parseInt(localStorage.num_of_entities_class_1)) *
				100
			).toFixed(2);

			const rawSymbols = raw_tirp[0];
			const symbols = this.getSymbols(rawSymbols);
			const relations = raw_tirp[1];
			const size = raw_tirp[2];
			const mhs0 = parseFloat(raw_tirp[5]).toFixed(2);
			const mhs1 = parseFloat(raw_tirp[11]).toFixed(2);
			const mmd0 = parseFloat(raw_tirp[7]).toFixed(2);
			const mmd1 = parseFloat(raw_tirp[13]).toFixed(2);

			return new Tirp(
				symbols,
				rawSymbols,
				relations,
				size,
				vs0_percentage,
				vs1_percentage,
				mhs0,
				mhs1,
				mmd0,
				mmd1
			);
		});
	}

	getSymbols(symbolsRawStr) {
		// symbolsRawStr of format: '(11-12-'
		const states = this.computeStates();
		const cleanedSymbolsRawStr = symbolsRawStr.substring(1, symbolsRawStr.length - 1);
		const symbols = cleanedSymbolsRawStr.split('-');
		const symbolsNames = symbols.map((symbol) => states[symbol]);
		return symbolsNames.join('-');
	}

	handleOnSelect = (tirp, index) => {
		const selected = this.props.isPredictive
			? [
					tirp.vs1,
					tirp.vs0,
					tirp.mhs1,
					tirp.mhs0,
					tirp.mmd1,
					tirp.mmd0,
					tirp.size,
					tirp.rawSymbols,
					tirp.relations,
			  ]
			: [
					Number.parseFloat(tirp.vs0),
					Number.parseFloat(tirp.mhs0),
					Number.parseFloat(tirp.mmd0),
					Number.parseInt(tirp.size),
					tirp.rawSymbols,
					tirp.relations,
			  ];
		this.setState({ selectedTirp: index });
		this.props.handleOnSelect(selected);
	};

	render() {
		const data = this.parseTirps().sort(this.state.sortFunc);
		const stringSort = (a, b, numeric) => {
			return a.localeCompare(b, navigator.languages[0] || navigator.language, {
				numeric,
				ignorePunctuation: true,
			});
		};

		const renderColumn = (columnName, columnTitle, numeric = true) => {
			const selected = this.state.sortedCol === columnName;
			const attributes = {
				onClick: () => {
					const sortFunc = (a, b) => {
						return this.state.sortAsc
							? stringSort(a[columnName], b[columnName], numeric)
							: stringSort(b[columnName], a[columnName], numeric);
					};
					this.setState((state) => ({
						sortFunc,
						sortedCol: columnName,
						sortAsc: !state.sortAsc,
					}));
				},
				style: selected ? headerSortingStyle : {},
			};
			return (
				<th {...attributes}>
					{selected && <i className='fa fa-sort mr-2'></i>}
					{columnTitle}
				</th>
			);
		};
		return (
			<Row>
				<Col>
					<div className='search-table'>
						<Table
							striped={true}
							bordered={true}
							hover={true}
							style={{ tableLayout: 'fixed', textAlign: 'center' }}
						>
							<thead>
								<tr>
									{renderColumn('size', 'Size')}
									{renderColumn('symbols', 'Symbols')}
									{renderColumn('relations', 'Relations')}
									{this.props.isPredictive && renderColumn('vs1', 'V.S.1', true)}
									{renderColumn('vs0', 'V.S.0', true)}
									{this.props.isPredictive &&
										renderColumn('mhs1', 'M.H.S.1', true)}
									{renderColumn('mhs0', 'M.H.S.0', true)}
									{this.props.isPredictive &&
										renderColumn('mmd1', 'M.M.D.1', true)}
									{renderColumn('mmd0', 'M.M.D.0', true)}
								</tr>
							</thead>
							<tbody>
								{data.map((tirp, index) => {
									const selected = this.state.selectedTirp === index;
									return (
										<tr
											key={index}
											onClick={() => {
												this.handleOnSelect(tirp, index);
											}}
											style={selected ? { backgroundColor: '#AED6F1' } : {}}
										>
											<td>{tirp.size}</td>
											<td>{tirp.symbols}</td>
											<td>{tirp.relations}</td>
											{this.props.isPredictive && <td>{tirp.vs1 + '%'}</td>}
											<td>{tirp.vs0 + '%'}</td>
											{this.props.isPredictive && <td>{tirp.mhs1}</td>}
											<td>{tirp.mhs0}</td>
											{this.props.isPredictive && <td>{tirp.mmd1}</td>}
											<td>{tirp.mmd0}</td>
										</tr>
									);
								})}
								{data.length === 0 && (
									<tr>
										<td colSpan={this.props.isPredictive ? 10 : 6}>Empty</td>
									</tr>
								)}
							</tbody>
						</Table>
					</div>
				</Col>
			</Row>
		);
	}
}
export default SearchTable;
