import React, { Component } from 'react';
import { Container, ToggleButtonGroup, ToggleButton, Col, Row, Button } from 'react-bootstrap';

import SearchGraph from './SearchGraph';
import SearchIntervals from './SearchIntervals';
import SearchLimits from './SearchLimits';
import SearchTable from './SearchTable';
import SearchMeanPresentation from './SearchMeanPresentation';
import PsearchMeanPresentation from './PsearchMeanPresentation';

import TIRPTimeLine from './TIRPTimeLine';
import TIRPsPie from './TIRPsPie';
import DTirpBarPlot from './DTirpBarPlot';
import SymbolPop from './SymbolPop';

import {
	getSubTree,
	searchTirps1Class,
	searchTirps2Class,
} from '../../../../networking/requests/visualization';

class TIRPsSearch extends Component {
	constructor(props) {
		super(props);

		const tables = JSON.parse(localStorage.States);
		const statesEntries = tables.States.map((state) => {
			const part2 = state.BinLabel ?? state.BinLabel;
			const part1 = state.TemporalPropertyName ?? state.TemporalPropertyID;

			const name = part1 + '.' + part2;

			return [state.StateID, name];
		});
		const statesDict = Object.fromEntries(statesEntries);
		const stateIDs = Object.keys(statesDict);

		this.state = {
			parameters: {
				minSizeCls0: 1,
				maxSizeCls0: 10,
				minHSCls0: 1,
				maxHSCls0: 100,
				minVSCls0: Math.round(parseFloat(localStorage.min_ver_support) * 100),
				maxVSCls0: 100,

				minHSCls1: 1,
				maxHSCls1: 100,
				minVSCls1: Math.round(parseFloat(localStorage.min_ver_support) * 100),
				maxVSCls1: 100,
			},

			minMMD: 0,
			maxMMD: 100,

			startList: stateIDs,
			containList: stateIDs,
			endList: stateIDs,
			dictionary_states: statesDict,
			totalNumSymbols: stateIDs.length,

			showGraph: true,
			canExplore: false,
			searchResults: [],
			selected: [],
			measureToRate: {
				vs0: 2,
				vs1: 2,
				mhs0: 2,
				mhs1: 2,
				size: 2,
			},

			allTirps: {},
			chosenTIRP: undefined,
			modalShowRawPop: false
		};
		this.getAllTirps();
	}

	async getAllTirps() {
		const visualizationId = sessionStorage.getItem('visualizationId');
		const firstLevel = JSON.parse(localStorage.rootElement);
		const subTreesPromises = firstLevel.map(async (tirp) => {
			if (tirp._TIRP__childes.length === 0) return [];

			const data = await getSubTree(tirp._TIRP__symbols[0], visualizationId);
			const tirpsFamily = data['TIRPs'];
			const tirpChildrenArr = tirpsFamily['_TIRP__childes'];
			return tirpChildrenArr;
		});
		const subTressArray = await Promise.all(subTreesPromises);
		const subTress = subTressArray.map((subTree) =>
			this.flatTree(subTree, (tirp) => tirp['_TIRP__childes'])
		);
		const childrenTirps = subTress.flat();

		const allTirps = firstLevel.concat(childrenTirps);
		const allTirpsEntries = allTirps.map((tirp) => [tirp['_TIRP__unique_name'], tirp]);

		this.setState({
			allTirps: Object.fromEntries(allTirpsEntries),
		});
	}

	flatTree(tree, getChildren) {
		return tree.reduce((acc, curr) => {
			const children = getChildren(curr);
			const subTree = this.flatTree(children, getChildren);
			return acc.concat([curr, ...subTree]);
		}, []);
	}

	changeParameter = (event) => {
		const parameterName = event.target.name;
		const parameterRawValue = parseInt(event.target.value);
		// const parameterValue = Math.max(parameterRawValue, event.target.min);
		const parameterValue = Math.max(parameterRawValue, 1);
		const newParameters = { ...this.state.parameters, [parameterName]: parameterValue };
		this.setState({ parameters: newParameters });
	};

	async searchTirps() {
		const visualizationId = sessionStorage.getItem('visualizationId');
		const data = this.props.isPredictive
			? await searchTirps2Class(
					true,
					this.state.startList,
					this.state.containList,
					this.state.endList,
					this.state.parameters.minHSCls0,
					this.state.parameters.maxHSCls0,
					this.state.parameters.minVSCls0,
					this.state.parameters.maxVSCls0,
					this.state.parameters.minHSCls1,
					this.state.parameters.maxHSCls1,
					this.state.parameters.minVSCls1,
					this.state.parameters.maxVSCls1,
					visualizationId,
					this.state.startList.length !== this.state.totalNumSymbols,
					this.state.containList.length !== this.state.totalNumSymbols,
					this.state.endList.length !== this.state.totalNumSymbols
			  )
			: await searchTirps1Class(
					'',
					this.state.startList,
					this.state.containList,
					this.state.endList,
					this.state.parameters.minHSCls0,
					this.state.parameters.maxHSCls0,
					this.state.parameters.minVSCls0,
					this.state.parameters.maxVSCls0,
					visualizationId,
					this.state.startList.length !== this.state.totalNumSymbols,
					this.state.containList.length !== this.state.totalNumSymbols,
					this.state.endList.length !== this.state.totalNumSymbols
			  );

		// const SIZE_IDX = 2;
		const searchResults = data['Results'].map((result) => result.split(','));
		// .filter(
		// 	(result) =>
		// 		parseInt(result[SIZE_IDX]) >= this.state.parameters.minSizeCls0 &&
		// 		parseInt(result[SIZE_IDX]) <= this.state.parameters.maxSizeCls0 &&
		// 		parseInt(result[SIZE_IDX]) >= this.state.parameters.minSizeCls1 &&
		// 		parseInt(result[SIZE_IDX]) <= this.state.parameters.maxSizeCls1
		// );

		this.setState({ searchResults });
		const scrollToElement = document.querySelector('.results-container');
		scrollToElement.scrollIntoView({ behavior: 'smooth' });
	}

	showTableOrGraph = () => {
		const radios = ['Graph', 'Table'];
		return (
			<Col sm={12} className='mb-4'>
				<ToggleButtonGroup defaultValue={0} name='options' style={{ width: '100%' }}>
					{radios.map((radio, idx) => (
						<ToggleButton
							className={'bg-hugobot-toggle-button'}
							key={idx}
							type='radio'
							color='info'
							name='radio'
							value={idx}
							onChange={() => this.setState({ showGraph: radio === 'Graph' })}
						>
							{radio}
						</ToggleButton>
					))}
				</ToggleButtonGroup>
			</Col>
		);
	};

	handleOnSelect(newSelected) {
		const rawSymbols = newSelected[this.props.isPredictive ? 7 : 4];
		const symbols = rawSymbols.slice(1, rawSymbols.length - 1);
		const rawRelations = newSelected[this.props.isPredictive ? 8 : 5];
		const relations = rawRelations.slice(0, rawRelations.length - 1);
		const unique_name = symbols + '|' + relations;

		this.setState({
			selected: newSelected,
			canExplore: true,
			chosenTIRP: this.state.allTirps[unique_name],
		});
	}

	render() {
		const type_of_comp = this.props.isPredictive ? 'disc' : 'tirp';
		return (
			<Container fluid>
				<Row>
					<Col sm={8}>
						<Row style={{ position: 'absolute', height: '100%' }}>
							<Col sm={4} style={{ height: '100%' }}>
								<SearchIntervals
									title='First'
									intervals={this.state.dictionary_states}
									changeList={(startList) => this.setState({ startList })}
								/>
							</Col>
							<Col sm={4} style={{ height: '100%' }}>
								<SearchIntervals
									title='Intermediate'
									intervals={this.state.dictionary_states}
									changeList={(containList) => this.setState({ containList })}
								/>
							</Col>
							<Col sm={4} style={{ height: '100%' }}>
								<SearchIntervals
									title='Last'
									intervals={this.state.dictionary_states}
									changeList={(endList) => this.setState({ endList })}
								/>
							</Col>
						</Row>
					</Col>
					<Col sm={4}>
						<SearchLimits
							searchTirps={this.searchTirps.bind(this)}
							measureToRate={this.state.measureToRate}
							changeMeasureToRate={(measureToRate) =>
								this.setState({ measureToRate })
							}
							parameters={this.state.parameters}
							changeParameter={this.changeParameter}
							isPredictive={this.props.isPredictive}
						/>
					</Col>
				</Row>
				<Row className='results-container'>
					<Col sm={8}>
						{this.showTableOrGraph()}
						{this.state.showGraph ? (
							<SearchGraph
								isPredictive={this.props.isPredictive}
								minVS0={this.state.parameters.minVSCls0}
								maxVS0={this.state.parameters.maxVSCls0}
								minHS0={this.state.parameters.minHSCls0}
								maxHS0={this.state.parameters.maxHSCls0}
								minSize0={this.state.parameters.minSizeCls0}
								maxSize0={this.state.parameters.maxSizeCls0}
								minVS1={this.state.parameters.minVSCls1}
								maxVS1={this.state.parameters.maxVSCls1}
								minHS1={this.state.parameters.minHSCls1}
								maxHS1={this.state.parameters.maxHSCls1}
								handleOnSelect={this.handleOnSelect.bind(this)}
								measureToRate={this.state.measureToRate}
								selectedSymbols={
									this.state.selected[this.props.isPredictive ? 7 : 4]
								}
								selectedRelations={
									this.state.selected[this.props.isPredictive ? 8 : 5]
								}
								tirps={this.state.searchResults}
								dictionary_states={this.state.dictionary_states}
							/>
						) : (
							<SearchTable
								handleOnSelect={this.handleOnSelect.bind(this)}
								isPredictive={this.props.isPredictive}
								tirps={this.state.searchResults}
							/>
						)}
					</Col>
					<Col sm={4}>
						<Row>
							<Col sm={1}></Col>
							<Col sm={11}>
								{this.props.isPredictive ? (
									<PsearchMeanPresentation
										canExplore={this.state.canExplore}
										vs1={this.state.selected[1]}
										vs0={this.state.selected[0]}
										mmd1={this.state.selected[4]}
										mmd0={this.state.selected[5]}
										mhs1={this.state.selected[2]}
										mhs0={this.state.selected[3]}
										currentLevel={this.state.selected[6]}
										symbols={this.state.selected[7]}
										relations={this.state.selected[8]}
									/>
								) : (
									<SearchMeanPresentation
										canExplore={this.state.canExplore}
										vs={this.state.selected[0]}
										mhs={this.state.selected[1]}
										mmd={this.state.selected[2]}
										currentLevel={this.state.selected[3]}
										symbols={this.state.selected[4]}
										relations={this.state.selected[5]}
										row={this.state.selected}
									/>
								)}
							</Col>
						</Row>
					</Col>
				</Row>
				{this.state.chosenTIRP && (
					<Row>
						<Col sm={4}>
							<TIRPsPie row={this.state.chosenTIRP} type_of_comp={type_of_comp} />
						</Col>
						{this.props.isPredictive && (
							<Col lg={3}>
								<DTirpBarPlot row={this.state.chosenTIRP} />
							</Col>
						)}
						<Col sm={this.props.isPredictive ? 5 : 8}>
							<TIRPTimeLine
								tirp={this.state.chosenTIRP}
								type_of_comp={type_of_comp}
							/>
						</Col>
					</Row>
				)}
			</Container>
		);
	}
}

export default TIRPsSearch;
