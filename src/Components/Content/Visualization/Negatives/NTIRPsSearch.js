import React, { Component } from 'react';
import { Container, ToggleButtonGroup, ToggleButton, Col, Row } from 'react-bootstrap';

import NSearchGraph from './NSearchGraph';
import NSearchMeanPresentation from './NSearchMeanPresentation'
import NTIRPTimeLine from './NTIRPTimeLine'
import NSearchTable from './NSearchTable';
import NSearchIntervals from './NSearchIntervals';
import SearchNLimits from './SearchNLimits';


class NTIRPsSearch extends Component {
	constructor(props) {
		super(props);

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
			modalShowRawPop: false,


			/////// OUR //////////
			outputAlgoritm : [],
			vnames : [],
			startNList: [],
			containNList: [],
			endNList: [],
			NmeasureToRate: {
				vs0: 2,
				mhs0: 2,
				size: 2,
			},
			Nparameters: {
				minSizeCls0: 1,
				maxSizeCls0: 10,
				minHSCls0: 1,
				maxHSCls0: 100,
				minVSCls0: 1,
				maxVSCls0: 100,
			},
			NSelected: []
		};
	}

	componentDidMount() {
		if (localStorage.negative === 'true') {
			const myDict = JSON.parse(localStorage.rootElement);
			const entities = JSON.parse(localStorage.VMapFile)
			this.setState({
				outputAlgoritm: myDict,
				vnames: entities
			})
		}
	}

	// This function is resposible for changing the value for the M.H.S, V.S and M.M.D the user chose
	changeNParameter = (event) => {
		const parameterName = event.target.name;
		const parameterRawValue = parseInt(event.target.value);
		// const parameterValue = Math.max(parameterRawValue, event.target.min);
		const parameterValue = Math.max(parameterRawValue, 1);
		const newParameters = { ...this.state.Nparameters, [parameterName]: parameterValue };
		this.setState({ Nparameters: newParameters });
	};


	// This function is responsible for searching the data for patterns that are matching the filtering option the user chose
	async searchNTirps() {
		let searchResults = this.state.outputAlgoritm

		// Filter based on the 'first symbol' the user chose
		if(this.state.startNList.length > 0){
			searchResults = searchResults.filter((row) =>
				row.negatives[0] ? 
						this.state.startNList.includes(String.fromCharCode(172) + this.state.vnames[row.elements[0][0]])
					:
						this.state.startNList.includes(this.state.vnames[row.elements[0][0]])
			) 
		}

		// Filter based on the 'end symbol' the user chose
		if(this.state.endNList.length > 0 ){
			searchResults = searchResults.filter((row) =>
				row.negatives[row.elements.length - 1] ? 
						this.state.endNList.includes(String.fromCharCode(172) + this.state.vnames[row.elements[row.elements.length - 1][row.elements[row.elements.length - 1].length - 1]])
					:
						this.state.endNList.includes(this.state.vnames[row.elements[row.elements.length - 1][row.elements[row.elements.length - 1].length - 1]])
				
			) 
		}

		// Filter based on the 'intermidiate symbol' the user chose
		if(this.state.containNList.length > 0 ){
			searchResults = searchResults.filter((row) => {
				let found = false
				let copyrow = []
				for (var i = 0; i < row.elements.length; i++)
    					copyrow[i] = row.elements[i].slice();

				copyrow[0] = copyrow[0].slice(1)
				copyrow[copyrow.length - 1] = copyrow[0].slice(0, copyrow.length - 1)

				copyrow.forEach( (row_i, index_i) => {
					row_i.forEach(element_j => {
						if (!found){
							found = row.negatives[index_i] ? 
									this.state.containNList.includes(String.fromCharCode(172) + this.state.vnames[element_j])
								:
									this.state.containNList.includes(this.state.vnames[element_j])
						}
					})
				})
				return found
			}) 
		}

		searchResults = searchResults.filter((row) =>
							this.state.Nparameters.minSizeCls0 <= row.elements.flat().length && row.elements.flat().length <= this.state.Nparameters.maxSizeCls0 && 
							this.state.Nparameters.minHSCls0 <= row['mean horizontal support']  && row['mean horizontal support'] <= this.state.Nparameters.maxHSCls0 
							// this.state.Nparameters.minVSCls0 <= (row['support'] / this.state.outputAlgoritm) * 100  &&
							//                                     (row['support'] / this.state.outputAlgoritm) * 100 <= this.state.Nparameters.maxVSCls0
		)


		this.setState({ searchResults });
		const scrollToElement = document.querySelector('.results-container');
		scrollToElement.scrollIntoView({ behavior: 'smooth' });
	}


	// This function is responsible for changing the graph to table or viseversa
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
		this.setState({
			NSelected: newSelected.row,
			canExplore: true
		});
	}

	render() {
		return (
			<Container fluid>
				<Row>
					<Col sm={8}>
						<Row style={{ position: 'absolute', height: '100%' }}>
							<Col sm={4} style={{ height: '100%' }}>
								<NSearchIntervals
									title='First'
									vnames = {this.state.vnames}
									changeList={(startNList) => this.setState({ startNList })}
								/>
							</Col>
							<Col sm={4} style={{ height: '100%' }}>
								<NSearchIntervals
									title='Intermediate'
									vnames = {this.state.vnames}
									changeList={(containNList) => this.setState({ containNList })}
								/>
							</Col>
							<Col sm={4} style={{ height: '100%' }}>
								<NSearchIntervals
									title='Last'
									vnames = {this.state.vnames}
									changeList={(endNList) => this.setState({ endNList })}
								/>
							</Col>
						</Row>
					</Col>
					<Col sm={4}>
						<SearchNLimits
							searchTirps={this.searchNTirps.bind(this)}
							NmeasureToRate={this.state.NmeasureToRate}
							changeMeasureToRate={(NmeasureToRate) =>
								this.setState({ NmeasureToRate })
							}
							parameters={this.state.Nparameters}
							changeParameter={this.changeNParameter}
							isPredictive={this.props.isPredictive}
						/>
					</Col>
				</Row>
				<Row className='results-container'>
					<Col sm={8}>
						{this.showTableOrGraph()}
						{this.state.showGraph ? (
							<NSearchGraph
								handleOnSelect={this.handleOnSelect.bind(this)}
								tirps={this.state.searchResults}
							/>) 
						:
						(
							<NSearchTable
								handleOnSelect={this.handleOnSelect.bind(this)}
								tirps={this.state.searchResults}
							/>
						)}
					</Col>
					<Col sm={4}>
						<Row>
							<Col sm={1}></Col>
							<Col sm={11}>
								{Object.keys(this.state.NSelected).length > 0  && (
									<NSearchMeanPresentation
										canExplore={this.state.canExplore}
										tirp={this.state.NSelected}
								/>
								)}
								{/* {this.props.isPredictive ? (
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
								)} */}
							</Col>
						</Row>
					</Col>
				</Row>
				{Object.keys(this.state.NSelected).length > 0 && (
					<Row>
						{/* <Col sm={4}>
							<TIRPsPie row={null} type_of_comp={'disc'} />
						</Col> */}
						{/* {this.props.isPredictive && (
							<Col lg={3}>
								<DTirpBarPlot row={this.state.chosenTIRP} />
							</Col>
						)} */}
						<Col sm={8}>
							<NTIRPTimeLine
								tirp={this.state.NSelected}
								vnames={this.state.vnames}
							/>
						</Col>
					</Row>
				)}
			</Container>
		);
	}
}

export default NTIRPsSearch;
