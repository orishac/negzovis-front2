import React, { Component } from 'react';
import Cookies from 'js-cookie';

import { Card, Button, Table } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DTirpBarPlot from '../TirpsContent/DTirpBarPlot';
import TIRPsPie from '../TirpsContent/TIRPsPie';
import NTIRPTimeLine from './NTIRPTimeLine';
import WeightsPop from '../TirpsContent/WeightsPop';
import NTirpMatrix from './NTIRPMatrix';
import SelectedNTirpsTable from './SelectedNTIRPsTable'
import { errorAlert } from '../../../SweetAlerts';


const headerSortingStyle = { backgroundColor: '#c8e6c9' };

class NTIRPsTable extends Component {
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

		//our params:
		path: [],
		outputAlgoritm: [],
		currentLevel: 0, 
		currentTirp: {0: []}, 
		tirp : {},
		numOfSymbolInSelctedPath: 0, 
		numOfSymbolsInLevel0: 0, 
		NmodalShow: false,
		vnames: [], 
		id: 0,
	};

	async open_route() {
		let symbolLevel0 = this.getRootEntitiesSize()
		this.setState({
			numOfSymbolInSelctedPath: symbolLevel0,
			numOfSymbolsInLevel0: symbolLevel0
		})
	}

	getRootEntitiesSize(){
		const firstSymbol = this.state.outputAlgoritm.filter((row) => {
			if(row.elements.length === 1 && row.elements[0].length === 1){
				return true
			}
			return false
		})
		return firstSymbol.length
	}

	// Find all the patterns the the current pattern extends
	findAllPreviousPatterns(pathOfTirps) {
		const myDict = JSON.parse(localStorage.rootElement);
		let previousPatterns;

		previousPatterns = myDict.filter((row) => {
			if (row !== undefined) {
				if (row.elements.length > pathOfTirps.elements.length) {
					return false
				}
				for (let i = 0; i < row.elements.length; i++) {
					if (row.elements[i].length > pathOfTirps.elements[i].length) {
						return false;
					}
					for (let j = 0; j < row.elements[i].length; j++) {
						if (row.elements[i][j] !== pathOfTirps.elements[i][j]) {
							return false;
						}
					}
				}
				return true;
			}
			return false
		})
		
		return previousPatterns
	}
	
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
			this.setNewLevel(this.props.ntable, []);
		}


		if (localStorage.negative === 'true') {
			const myDict = JSON.parse(localStorage.rootElement);
			const entities = JSON.parse(localStorage.VMapFile)
			this.setState({
				outputAlgoritm: myDict,
				vnames: entities
			})
		}

		// This is being used when directed from NTirpSearch component,
		// it is being used to start the visualization from a certain pattern,
		// and not from the root
		if ((window.pathOfTirps) && Object.keys(window.pathOfTirps).length > 0) {
			const previousPatterns = this.findAllPreviousPatterns(window.pathOfTirps)
			this.setState({ 
				path: window.pathOfTirps.elements, 
				tirp: window.pathOfTirps,
				currentLevel: window.pathOfTirps.elements.flat().length,
				currentTirp: {
					0: [], 
					...previousPatterns
				}
			})
			window.pathOfTirps = undefined
		}

		this.open_route()
	}

	changeWeightsValue = (value) => {
		this.setState({
			weighted_vs: value[0],
			weighted_mhs: value[1],
			weighted_mmd: value[2],
		});
	};

	// Renders nav buttons according to the path we are exploring,
	// Where each button when clicked will take us back in the patterns tree
	Navbar() {
		return (
		<div style={{ display: 'flex' }}>
			{[["Root"], ...this.state.path].map((tirp, index) => (
			<div className='w-25'>
				{tirp.length <= 1 ? (
					<button
						className='btn btn-workflow btn-arrow-right navbar-margin'
						key={tirp.id}
						onClick={() => {
							this.toNLevel([["Root"], ...this.state.path].slice(0, index + 1))
							let newTirp = Object.fromEntries(Object.entries(this.state.currentTirp).slice(0, index+1))
							this.setState({
								currentLevel: index, 
								currentTirp: newTirp,
								tirp: newTirp[index], 
								numOfSymbolInSelctedPath: index === 0 ? this.state.numOfSymbolsInLevel0 : 
																	   this.getNextLevelByElements(newTirp[index].elements).length, 
							})
						}}
					>
						{typeof(tirp[0]) === "string" ? "ROOT" : this.state.vnames[tirp]}
					</button>) :
					(tirp.map((sub, jndex) => (
							<button
								className='btn btn-workflow btn-arrow-right navbar-margin'
								key={sub.id}
								onClick={() => {
									this.toNLevelSub([["Root"], ...this.state.path].slice(0, index + 1), jndex)
									let newTirp = Object.fromEntries(Object.entries(this.state.currentTirp).slice(0, index+1))
									this.setState({
										currentLevel: index, 
										currentTirp: newTirp,
										tirp: newTirp[index], 
										numOfSymbolInSelctedPath: index === 0 ? this.state.numOfSymbolsInLevel0  : 
																			this.getNextLevelByElements(newTirp[index].elements).length,
									})
								}}
							>
								{this.state.vnames[sub]}
							</button> 
						))
					)
				}
			</div>
		))}
		</div>)
	}

	// Return whether we are on the root or not
	isRoot() {
		return this.state.currentPath.length === 0;
	}

	isSomeTirpSelected() {
		return this.state.selectedTirp !== null;
	}

	setNewLevel(tirps, path) {
		try {
			const firstLevelTirps = tirps.filter((row) => {
				if (row.elements.length === 1) {
					return true
				} else {
					return false
				}
			})
			this.setState({
				currentTirps: tirps,
				currentPath: path,
				selectedTirp: firstLevelTirps[0][0],
			});
		} catch (e) {
			errorAlert(e)
		}
	}

	// When clicking on nav button this function is being used to calculate based on
	// Which button was clicked what is the current path and set path accordingly
	toNLevel(level) {
	// eslint-disable-next-line
		if (level == "Root") {
			this.setState({
				path: []
			})
		} else {
			const new_path = level.slice(1, level.length)
			this.setState({
				path: new_path
			})
		}
	}

	// Returns the path of the current level
	toNLevelSub(level, index) {
		// eslint-disable-next-line
		const new_path = level.slice(1, level.length)
		new_path[new_path.length - 1] = new_path[new_path.length - 1].slice(0, index + 1)
		this.setState({
			path: new_path
		})
	}
	
	// Renders a button that when is being clicked, it computes all the patterns of next level
	NegativeNext(tirp) {
		if (this.getNextLevelByElements(tirp.elements).length > 0) {
			return (
				<Button
					className={'btn btn-hugobot'}
					id={'toy_example-btn'}
					data-testid='next-button'
					onClick={() => {
						this.setState({ 
							path: tirp.elements, 
							currentLevel: this.state.currentLevel + 1,
							numOfSymbolInSelctedPath: this.getNextLevelByElements(tirp.elements).length,
						})
					}}
				>
					<i className='fas fa-caret-down' id={'toy_example-icon'} />
				</Button>
			);
		} else {
			return '';
		}
	}

	arrayEquals(a, b) {
		return Array.isArray(a) &&
		  Array.isArray(b) &&
		  a.length === b.length &&
		  a.every((val, index) => val === b[index]);
	  }
	
	// Returns all the patterns that extends current level
	getNextLevel(){
		try {
			const nextPatterns = this.state.outputAlgoritm.filter((row) => {
				if (row.elements.length === this.state.path.length + 1 && row.elements[this.state.path.length].length === 1){
					for(let i = 0; i < this.state.path.length; i++){
						if(!this.arrayEquals(row.elements[i], this.state.path[i])){
							return false
						}
					}
					return true
				}
				else{
					if (!this.arrayEquals(row.elements, this.state.path) && row.elements.length === this.state.path.length){
						for(let i = 0; i < this.state.path.length - 1; i++){
							if(!this.arrayEquals(row.elements[i], this.state.path[i])){
								return false
							}
						}
						let last = this.state.path.length - 1
						if (this.state.path[last].length !== row.elements[last].length - 1){
							return false
						}
						for(let i = 0; i < this.state.path[last].length; i++){
							if(String(row.elements[last][i]) !== String(this.state.path[last][i])){
								return false
							}
						}
						return true
					}
				}
				return false
			} )
			return nextPatterns
		} catch (e) {
			errorAlert(e)
			return []
		}
	}

	// Return all the patterns extends the current pattern 
	getNextLevelByElements(elements){ 
		const nextPatterns = this.state.outputAlgoritm.filter((row) => {
			if (row.elements.length === elements.length + 1 && row.elements[elements.length].length === 1){
				for(let i = 0; i < elements.length; i++){
					if(!this.arrayEquals(row.elements[i], elements[i])){
						return false
					}
				}
				return true
			}
			else{
				if (!this.arrayEquals(row.elements, elements) && row.elements.length === elements.length){
					for(let i = 0; i < elements.length - 1; i++){
						if(!this.arrayEquals(row.elements[i], elements[i])){
							return false
						}
					}
					let last = elements.length - 1
					if (elements[last].length !== row.elements[last].length - 1){
						return false
					}
					for(let i = 0; i < elements[last].length; i++){
						if(String(row.elements[last][i]) !== String(elements[last][i])){
							return false
						}
					}
					return true
				}
			}
			return false
		} )
		return nextPatterns
	}
	

	render() {
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
								<div className='vertical-scroll-tirp' style={{ height: '100%'}}>
									<Table
										striped={true}
										bordered={true}
										hover={true}
										style={{ tableLayout: 'fixed', textAlign: 'center' }}
									>
										<thead>
											<tr>
												<th>Next</th>
												<th>P/N</th>
												{renderColumn('relation', 'Relation', false)}
												{renderColumn('symbol', 'Symbol')}
												{renderColumn('VS', 'VS')}
												{renderColumn('MHS', 'MHS')}
												{renderColumn('MMD', 'MMD')}
											</tr>
										</thead>
										<tbody>
											{this.getNextLevel().map((tirp, index) => {
												return (
													<tr
														key={index}
														onClick={() => {
															
															let numOfEntites = this.getNextLevelByElements(tirp.elements).length
															let newCurrentTirp = this.state.currentTirp
															newCurrentTirp[this.state.currentLevel + 1] = tirp

															this.setState({ 
																tirp: tirp, 
													            currentTirp: newCurrentTirp, 
																numOfSymbolInSelctedPath: numOfEntites
															})
															
														}}
													>
														<td>{this.NegativeNext(tirp)}</td>
														<td>{tirp.negatives[this.state.path.length] ? "Negative" : "Positive"}</td>
														<td>{this.state.currentLevel === 0 ? "-" :
														         tirp.elements[tirp.elements.length - 1].length === 1 ? "before" : "equals"}</td>
														<td>{Object.keys(this.state.vnames).length > 0 && 
														     this.state.vnames[tirp.elements[tirp.elements.length - 1][tirp.elements[tirp.elements.length - 1].length - 1]]}</td>
														<td>{Number.parseFloat(tirp['support'] / this.state.outputAlgoritm.length).toFixed(2) * 100 + "%"}</td>
														<td>{Number.parseFloat(tirp['mean horizontal support']).toFixed(2)}</td>
														<td>{Number.parseFloat(tirp['mean mean duration']).toFixed(2)}</td>
													</tr>
												)
											})}
										</tbody>
									</Table>
								</div>
							</Card.Body>
						</Card>
					</Col>
					<Col sm={3}>
						{(
							<>
							{this.state.tirp && (
								<SelectedNTirpsTable 
									currentLevel={this.state.currentLevel}
									currentTirp={this.state.tirp}
									numOfSymbolInSelctedPath={this.state.numOfSymbolInSelctedPath}
							
								></SelectedNTirpsTable> 
								)}
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
									disabled={Object.keys(this.state.tirp).length === 0}
									style={{ width: '100%' }}
									variant='primary'
									onClick={() => this.setState({ NmodalShow: true })}
								>
									Get Relations
								</Button>
								<NTirpMatrix
									show={this.state.NmodalShow}
									tirp={this.state.tirp}
									vnames={this.state.vnames}
									currentlevel={this.state.currentLevel}
									onHide={() => this.setState({ NmodalShow: false })}
								/>

								<Button
									className={'tirp-table-buttons'}
									variant='primary'
									/*disabled={!this.isSomeTirpSelected()}*/
									disabled={this.isRoot()}
									onClick={() => this.setState({ modalShowSymbolPop: true })}
								>
									Explore Symbols
								</Button>
								{/* <SymbolPop
									show={this.state.modalShowSymbolPop}
									row={this.state.selectedTirp}
									onHide={() => this.setState({ modalShowSymbolPop: false })}
									type={this.props.discriminative ? 'BPTirps' : 'BTirps'}
								/> */}
								<Button
									className={'tirp-table-buttons'}
									variant='primary'
									/*disabled={!this.isSomeTirpSelected()}*/
									disabled={this.isRoot()}
									onClick={() => this.setState({ modalShowRawPop: true })}
								>
									See Raw Data
								</Button>
								{/* <SymbolPop
									show={this.state.modalShowRawPop}
									path={this.state.currentPath}
									row={this.state.selectedTirp}
									onHide={() => this.setState({ modalShowRawPop: false })}
									type={this.props.discriminative ? 'RawData' : 'RawData'}
								/> */}
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
					<Col xl={9} lg={6}>
						{Object.keys(this.state.tirp).length > 0 && (
							<NTIRPTimeLine
								tirp={this.state.tirp}
								vnames={this.state.vnames}
							/>
						)}
					</Col>
				</Row>
			</Container>
		);
	}
}

export default NTIRPsTable;
