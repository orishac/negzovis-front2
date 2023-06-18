import React, { Component } from 'react';
import Cookies from 'js-cookie';

import { Card, Button, Table } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import DTirpBarPlot from './DTirpBarPlot';
import TIRPsPie from './TIRPsPie';
import TIRPTimeLine from './TIRPTimeLine';
import TirpMatrix from './TirpMatrix';
import SymbolPop from './SymbolPop';
import SelectedTIRPTable from './SelectedTIRPTable';
// import WeightsForm from './WeightsForm';
import WeightsPop from './WeightsPop';

import { getSubTree as getSubTreeRequest } from '../../../../networking/requests/visualization';

const headerSortingStyle = { backgroundColor: '#c8e6c9' };

class TIRPsTable extends Component {
	entitiesNumberCls0 = 1;
	entitiesNumberCls1 = 1;
	state = {
		weighted_vs: 34,
		weighted_mhs: 33,
		weighted_mmd: 33,

		currentPath: [],
		currentTirps: [],
		selectedTirp: null,

		modalShowSymbolPop: false,
		weightsModalShow: false,
		modalShow: false,
		modalShowRawPop: false,

		sortFunc: undefined,
		sortedCol: null,
		sortAsc: true,
	};
	
	componentDidMount() {
		if (!Cookies.get('auth-token')) {
			window.open('#/Login', '_self');
		}
		this.entitiesNumber = parseInt(localStorage.num_of_entities);
		this.entitiesNumberClass1 = parseInt(localStorage.num_of_entities_class_1);

		if (localStorage.PassedFromSearch === 'true' && window.pathOfTirps.length > 0) {
			localStorage.PassedFromSearch = false;
			const currentPath = window.pathOfTirps.slice(0, window.pathOfTirps.length - 1);
			const selectedTirp = window.pathOfTirps[window.pathOfTirps.length - 1];
			this.searchTirp(currentPath, selectedTirp);
		} else {
			this.setNewLevel(this.props.table, []);
		}
	}

	getExistedChildren(tirps) {
		return tirps._TIRP__childes.filter(
			(child) =>
				child._TIRP__exist_in_class0 ||
				(child._TIRP__exist_in_class1 && this.props.discriminative)
		);
	}

	async searchTirp(currentPath, selectedTirp) {
		if (currentPath.length === 0) {
			// We are searching for something in the root
			this.setNewLevel(this.props.table, []);
		} else {
			const currentTirp = currentPath[currentPath.length - 1];
			if (currentPath.length === 1) {
				const visualizationId = sessionStorage.getItem('visualizationId');
				await getSubTreeRequest(currentTirp._TIRP__symbols[0], visualizationId).then(
					(data) => {
						const tirpWithChildren = data['TIRPs'];
						const children = this.getExistedChildren(tirpWithChildren);

						this.setNewLevel(children, [currentTirp]);
					}
				);
			} else {
				const children = this.getExistedChildren(currentTirp);
				this.setNewLevel(children, currentPath);
			}
		}
		const unique_name = selectedTirp._TIRP__unique_name;

		this.setState((oldState) => {
			const found = oldState.currentTirps.find(
				(tirp) => tirp._TIRP__unique_name === unique_name
			);

			return found ? { selectedTirp } : {};
		});
	}

	toPercentage(amount, total) {
		return ((amount * 100) / total).toFixed(2);
	}

	getScore = (tirp) => {
		const vs0 = this.toPercentage(tirp._TIRP__vertical_support, this.entitiesNumber);
		const vs1 = this.toPercentage(
			tirp._TIRP__vertical_support_class_1,
			this.entitiesNumberClass1
		);

		const delta_vs = Math.abs(vs0 - vs1);
		const delta_mhs = Math.abs(
			tirp._TIRP__mean_horizontal_support - tirp._TIRP__mean_horizontal_support_class_1
		);
		const delta_mmd = Math.abs(tirp._TIRP__mean_duration - tirp._TIRP__mean_duration_class_1);

		const score =
			this.state.weighted_vs * delta_vs +
			this.state.weighted_mhs * delta_mhs +
			this.state.weighted_mmd * delta_mmd;
		return (score / 100).toFixed(2);
	};

	changeWeightsValue = (value) => {
		this.setState({
			weighted_vs: value[0],
			weighted_mhs: value[1],
			weighted_mmd: value[2],
		});
	};

	Navbar() {
		return [{ _TIRP__symbols: ['Root'] }, ...this.state.currentPath].map((tirp, idx) => (
			<div className='w-25'>
				<button
					className='btn btn-workflow btn-arrow-right navbar-margin'
					id={'Info'}
					onClick={() => this.toLevel(idx)}
					key={idx}
				>
					{tirp._TIRP__symbols[tirp._TIRP__symbols.length - 1]}
				</button>
			</div>
		));
	}

	isRoot() {
		return this.state.currentPath.length === 0;
	}

	isSomeTirpSelected() {
		return this.state.selectedTirp !== null;
	}

	setNewLevel(tirps, path) {
		this.setState({
			currentTirps: tirps,
			currentPath: path,
			selectedTirp: tirps[0],
		});
	}

	toRoot() {
		this.setNewLevel(this.props.table, []);
	}

	toLevel(levelNum) {
		if (levelNum === 0) {
			this.toRoot();
		} else {
			const tirp = this.state.currentPath[levelNum - 1];
			if (levelNum === 1) {
				const visualizationId = sessionStorage.getItem('visualizationId');
				getSubTreeRequest(tirp._TIRP__symbols[0], visualizationId).then((data) => {
					const tirpWithChildren = data['TIRPs'];
					const children = this.getExistedChildren(tirpWithChildren);

					this.setNewLevel(children, [tirp]);
				});
			} else {
				const children = this.getExistedChildren(tirp);
				this.setNewLevel(children, this.state.currentPath.slice(0, levelNum));
			}
		}
	}

	descendTree(tirp) {
		if (this.isRoot()) {
			const visualizationId = sessionStorage.getItem('visualizationId');
			getSubTreeRequest(tirp._TIRP__symbols[0], visualizationId).then((data) => {
				const tirpWithChildren = data['TIRPs'];
				const children = this.getExistedChildren(tirpWithChildren);

				this.setNewLevel(children, [...this.state.currentPath, tirp]);
			});
		} else {
			const children = this.getExistedChildren(tirp);
			this.setNewLevel(children, [...this.state.currentPath, tirp]);
		}
	}

	Next(tirp) {
		if (
			(tirp._TIRP__childes.length !== 0 && tirp._TIRP__childes[0] === true) ||
			this.getExistedChildren(tirp).length > 0
		) {
			return (
				<Button
					className={'btn btn-hugobot'}
					id={'toy_example-btn'}
					onClick={() => this.descendTree(tirp)}
				>
					<i className='fas fa-caret-down' id={'toy_example-icon'} />
				</Button>
			);
		} else {
			return '';
		}
	}

	getRelation(tirp) {
		if (tirp._TIRP__rel.length === 0) {
			return '-';
		}
		return tirp._TIRP__rel[tirp._TIRP__rel.length - 1];
	}

	computeTableData() {
		return this.getExistedChildren({ _TIRP__childes: this.state.currentTirps }).map(
			(tirp, idx) => {
				const vs0 = tirp['_TIRP__vertical_support'];
				const vs1 = tirp['_TIRP__vertical_support_class_1'];
				const min_vs = Math.round(Number.parseFloat(localStorage.min_ver_support) * 100);
				return {
					id: idx,
					next: this.Next(tirp),
					relation: this.getRelation(tirp),
					symbol: tirp['_TIRP__symbols'][tirp['_TIRP__symbols'].length - 1],
					VS0:
						vs0 !== 0
							? this.toPercentage(vs0, this.entitiesNumber) + '%'
							: `< ${min_vs}%`,
					VS1:
						vs1 !== 0
							? this.toPercentage(vs1, this.entitiesNumberClass1) + '%'
							: `< ${min_vs}%`,
					MHS0: vs0 !== 0 ? tirp['_TIRP__mean_horizontal_support'].toFixed(2) : 'x',
					MHS1:
						vs1 !== 0 ? tirp['_TIRP__mean_horizontal_support_class_1'].toFixed(2) : 'x',
					MMD0: vs0 !== 0 ? tirp['_TIRP__mean_duration'].toFixed(2) : 'x',
					MMD1: vs1 !== 0 ? tirp['_TIRP__mean_duration_class_1'].toFixed(2) : 'x',
					score: this.getScore(tirp) + '%',
					tirp,
				};
			}
		);
	}

	render() {
		const data = this.computeTableData().sort(this.state.sortFunc);
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
					{selected && <i className='fa fa-sort mr-2' />}
					{columnTitle}
				</th>
			);
		};

		return (
			<Container fluid className='mt-2'>
				{this.Navbar()}
				<Row>
					<Col sm={9}>
						<Card style={{ position: 'absolute', height: '100%' }}>
							<Card.Header className={'bg-hugobot'}>
								<Card.Text className={'text-hugobot text-hugoob-advanced'}>
									Tirp's Table
								</Card.Text>
							</Card.Header>
							<Card.Body className={'text-hugobot'}>
								<div className='vertical-scroll-tirp' style={{ height: '100%' }}>
									<Table
										striped={true}
										bordered={true}
										hover={true}
										style={{ tableLayout: 'fixed', textAlign: 'center' }}
									>
										<thead>
											<tr>
												<th>Next</th>
												{renderColumn('relation', 'Relation', false)}
												{renderColumn('symbol', 'Symbol', false)}
												{this.props.discriminative &&
													renderColumn('score', 'Score')}
												{renderColumn('VS0', 'VS0')}
												{this.props.discriminative &&
													renderColumn('VS1', 'VS1')}
												{renderColumn('MHS0', 'MHS0')}
												{this.props.discriminative &&
													renderColumn('MHS1', 'MHS1')}
												{renderColumn('MMD0', 'MMD0')}
												{this.props.discriminative &&
													renderColumn('MMD1', 'MMD1')}
											</tr>
										</thead>
										<tbody>
											{data.map((tirp, index) => {
												const selected =
													this.state.selectedTirp?._TIRP__unique_name ===
													tirp.tirp._TIRP__unique_name;
												return (
													<tr
														key={index}
														onClick={() => {
															this.setState({
																selectedTirp: tirp.tirp,
															});
														}}
														style={
															selected
																? { backgroundColor: '#AED6F1' }
																: {}
														}
													>
														<td>{tirp.next}</td>
														<td>{tirp.relation}</td>
														<td>{tirp.symbol}</td>
														{this.props.discriminative && (
															<td>{tirp.score}</td>
														)}
														<td>{tirp.VS0}</td>
														{this.props.discriminative && (
															<td>{tirp.VS1}</td>
														)}
														<td>{tirp.MHS0}</td>
														{this.props.discriminative && (
															<td>{tirp.MHS1}</td>
														)}
														<td>{tirp.MMD0}</td>
														{this.props.discriminative && (
															<td>{tirp.MMD1}</td>
														)}
													</tr>
												);
											})}
										</tbody>
									</Table>
								</div>
							</Card.Body>
						</Card>
					</Col>
					<Col sm={3}>
						{this.state.selectedTirp && (
							<>
								<SelectedTIRPTable
									table={this.state.selectedTirp}
									type_of_comp={this.props.discriminative ? 'disc' : 'tirp'}
								></SelectedTIRPTable>
								{this.props.discriminative && (
									<>
										<Button
											variant='primary'
											style={{ width: '100%' }}
											className='mb-4'
											onClick={() =>
												this.setState({
													weightsModalShow: true,
												})
											}
										>
											Select Weights
										</Button>
										<WeightsPop
											show={this.state.weightsModalShow}
											onHide={() =>
												this.setState({
													weightsModalShow: false,
												})
											}
											onUpdate={(value) => this.changeWeightsValue(value)}
										/>
									</>
								)}
								<Button
									disabled={this.isRoot()}
									style={{ width: '100%' }}
									variant='primary'
									onClick={() => this.setState({ modalShow: true })}
								>
									Get Relations
								</Button>
								<TirpMatrix
									show={this.state.modalShow}
									row={this.state.selectedTirp}
									onHide={() => this.setState({ modalShow: false })}
								/>

								<Button
									className={'tirp-table-buttons'}
									variant='primary'
									disabled={!this.isSomeTirpSelected()}
									onClick={() => this.setState({ modalShowSymbolPop: true })}
								>
									Explore Symbols
								</Button>
								<SymbolPop
									show={this.state.modalShowSymbolPop}
									row={this.state.selectedTirp}
									onHide={() => this.setState({ modalShowSymbolPop: false })}
									type={this.props.discriminative ? 'BPTirps' : 'BTirps'}
								/>
								<Button
									className={'tirp-table-buttons'}
									variant='primary'
									disabled={!this.isSomeTirpSelected()}
									onClick={() => this.setState({ modalShowRawPop: true })}
								>
									See Raw Data
								</Button>
								<SymbolPop
									show={this.state.modalShowRawPop}
									path={this.state.currentPath}
									row={this.state.selectedTirp}
									onHide={() => this.setState({ modalShowRawPop: false })}
									type={this.props.discriminative ? 'RawData' : 'RawData'}
								/>
							</>
						)}
					</Col>
				</Row>

				<Row>
					<Col xl={5} lg={12}>
						{this.state.selectedTirp && (
							<TIRPsPie
								row={this.state.selectedTirp}
								type_of_comp={this.props.discriminative ? 'disc' : 'tirp'}
							></TIRPsPie>
						)}
					</Col>
					{this.props.discriminative && (
						<Col xl={3} lg={6}>
							{this.state.selectedTirp && (
								<DTirpBarPlot row={this.state.selectedTirp}></DTirpBarPlot>
							)}
						</Col>
					)}
					<Col xl={4} lg={6}>
						{this.state.selectedTirp && (
							<TIRPTimeLine
								tirp={this.state.selectedTirp}
								type_of_comp={this.props.discriminative ? 'disc' : 'tirp'}
							/>
						)}
					</Col>
				</Row>
			</Container>
		);
	}
}

export default TIRPsTable;
