import React, { Component } from 'react';

import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';

import { addNewDisc } from '../../../../networking/requests/discretization';
import { errorAlert, successAlert } from '../../../SweetAlerts';

/**
 * this class is responsible for uploading and downloading the data about the discretization.
 * if you upload the discretization you can do it by knowledge based or by grdient file or by regular way.
 * it also gets, interpolation gap, paa window size, number of bins and method of dicretization
 */

class AddDiscretizationCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			PAA: '1',
			AbMethod: 'Equal Frequency',
			NumStates: '2', // num of bins
			binsNames: [],
			InterpolationGap: '1',
			Binning: 'regular',
			KnowledgeBasedFile: null,
			GradientFile: null,
			StatesFile: undefined,
			PreprocessingFile: null,
			TemporalAbstractionFile: null,
			GradientWindowSize: '2',
			datasetName: props.datasetName,
		};
	}

	AbMethodOptions = [
		'Equal Frequency',
		'Equal Width',
		'Persist',
		'KMeans',
		'SAX',
		'Knowledge-Based',
		'Gradient',
		'TD4C-Cosine',
		'TD4C-Diffmax',
		'TD4C-Diffsum',
		'TD4C-Entropy',
		'TD4C-Entropy-IG',
		'TD4C-SKL',
		'Abstraction Per Property',
		'Sequential'
	];

	optionsToRender = this.AbMethodOptions.map((option) => <option key={option}>{option}</option>);

	handleSubmit = (event) => {
		event.preventDefault();
		if (
			(this.state.Binning === 'regular') &&
			new Set(this.state.binsNames).size !== this.state.binsNames.length
		) {
			errorAlert('bins names should be unique!');
		} else {
			this.sendDisc(
				this.state.PAA,
				this.state.NumStates,
				this.state.InterpolationGap,
				this.state.AbMethod,
				this.state.KnowledgeBasedFile,
				this.state.GradientFile,
				this.state.GradientWindowSize,
				this.state.binsNames
			)
				.then((disc_id) => {
					this.props.addDiscretization(
						disc_id,
						this.state.NumStates,
						this.state.InterpolationGap,
						this.state.AbMethod,
						this.state.PAA
					);
					successAlert(
						'Success',
						'Discretization is running, When the operation is complete, you will receive an email notification'
					);
				})
				.catch(errorAlert);
		}
	};

	sendDisc = (
		PAA,
		NumStates,
		InterpolationGap,
		AbMethod,
		KnowledgeBasedFile,
		GradientFile,
		GradientWindowSize,
		binsNames
	) => {
		return addNewDisc(
			AbMethod,
			this.state.Binning === 'perProperty' ? -1 : PAA,
			this.state.Binning === 'perProperty' ? -1 : InterpolationGap,
			this.state.datasetName,
			this.state.Binning === 'regular' || this.state.Binning === 'kbGradient' ? NumStates : undefined,
			this.state.Binning === 'kbGradient' ? GradientFile : undefined,
			this.state.Binning === 'kbGradient' ? GradientWindowSize : undefined,
			this.state.Binning === 'kbValue' ? KnowledgeBasedFile : undefined,
			this.state.Binning === 'regular' || this.state.Binning === 'kbGradient' ? binsNames.toString() : undefined,
			this.state.Binning === 'perProperty' ? this.state.PreprocessingFile : undefined,
			this.state.Binning === 'perProperty' ? this.state.TemporalAbstractionFile : undefined,
			this.state.Binning === 'perProperty' ? this.state.StatesFile : undefined
		);
	};

	onPAAChange = (e) => {
		this.setState({ PAA: e.target.value });
	};

	onAbMethodChange = (e) => {
		const abstraction = e.target.value;

		const bKB = abstraction === 'Knowledge-Based';
		const bGrad = abstraction === 'Gradient';
		const bPerProperty = abstraction === 'Abstraction Per Property';
		const bEmpty = abstraction === 'Sequential';

		let binning;

		if (bKB) {
			binning = 'kbValue';
		} else if (bGrad) {
			binning = 'kbGradient';
		} else if (bPerProperty) {
			binning = 'perProperty';
		} else if (bEmpty) {
			binning = 'empty'
		} else {
			binning = 'regular';
		}

		//update application state
		this.setState({
			AbMethod: abstraction,
			Binning: binning,
			KnowledgeBasedFile: bKB ? this.state.KnowledgeBasedFile : null,
			GradientFile: bGrad ? this.state.GradientFile : null,
			GradientWindowSize: bGrad ? this.state.GradientWindowSize : '2',
			NumStates: bKB || bGrad ? '2' : this.state.NumStates,
			StatesFile: bPerProperty ? this.state.StatesFile : undefined,
			PreprocessingFile: bPerProperty ? this.state.PreprocessingFile : null,
			TemporalAbstractionFile: bPerProperty ? this.state.TemporalAbstractionFile : null,
		});

		//update UI elements
		if (!bKB) document.getElementById('KB-File').value = null;
		if (!bGrad) document.getElementById('Gradient-File').value = null;
		if (!bPerProperty) document.getElementById('Preprocessing-File').value = null;
		if (!bPerProperty) document.getElementById('Temporal-Abstraction-File').value = null;
		if (!bPerProperty) document.getElementById('States-File').value = null;
		document.getElementById('GradientWindowInput').value = null;

		if (bKB || bGrad) {
			// reset the regular disc. UI to its defaults
			document.getElementById('NumStatesInput').value = '';
		}
	};

	onNumStatesChange = (e) => {
		this.setState({ NumStates: e.target.value });
	};

	onInterpolationGapChange = (e) => {
		this.setState({ InterpolationGap: e.target.value });
	};

	onGradientFileChange = (e) => {
		const csvFile = document.getElementById("Gradient-File");
		const input = csvFile.files[0];

		const reader = new FileReader();
		reader.onload = (event) => {
			const csvToArray = (str, delimiter = ",") => {
				// slice from start of text to the first \n index
				// use split to create an array from string by delimiter
				const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
			  
				// slice from \n index + 1 to the end of the text
				// use split to create an array of each csv value row
				const rows = str.slice(str.indexOf("\n") + 1).split("\n");
			  
				// Map the rows
				// split values from each row into an array
				// use headers.reduce to create an object
				// object properties derived from headers:values
				// the object passed as an element of the array
				const arr = rows.map(function (row) {
				  const values = row.split(delimiter);
				  const el = headers.reduce(function (object, header, index) {
					object[header] = values[index];
					return object;
				  }, {});
				  return el;
				});
			  
				// return the array
				return arr;
			  }
	
			const getNumberBins = (parsedData) => {
				var maxNumberOfBins = 0
				for (let i = 0 ; i < parsedData.length; i++){
					if (parsedData[i]["StateID"] != ""){
						maxNumberOfBins = Math.max(parsedData[i]["BinID"], maxNumberOfBins)
					}
				}
				return maxNumberOfBins + 1
			}
			const text = event.target.result;
			var array_data = csvToArray(text)
			var numBins = getNumberBins(array_data)
			this.setState({ GradientFile: e.target.files[0] , NumStates: numBins });
		};
		reader.readAsText(input)
	};

	onPreprocessingFileChange = (e) => {
		this.setState({ PreprocessingFile: e.target.files[0] });
	};

	onTemporalAbstractionFileChange = (e) => {
		this.setState({ TemporalAbstractionFile: e.target.files[0] });
	};

	onStatesFileChange = (e) => {
		this.setState({ StatesFile: e.target.files[0] });
	};

	onGradientWindowSizeChange = (e) => {
		this.setState({ GradientWindowSize: e.target.value });
	};

	onKnowledgeBasedFileChange = (e) => {
		this.setState({ KnowledgeBasedFile: e.target.files[0] });
	};

	renderOptions(minValue, arraySize) {
		var rows = [];
		for (var i = minValue; i < arraySize; i++) {
			rows.push(<option key={i}>{i}</option>);
		}
		return rows;
	}

	renderBinsNames() {
		let colsArr = [];
		for (var i = 0; i < +this.state.NumStates; i++) {
			colsArr.push(
				<Col md={1}>
					<input type={'text'} name={i} onChange={(e) => this.setBinName(e)} />
				</Col>
			);
		}
		return colsArr;
	}

	setBinName(e) {
		let binIndex = +e.target.name;
		let newBinsNames = this.state.binsNames;
		newBinsNames[binIndex] = e.target.value;
		this.setState({ binsNames: newBinsNames });
	}

	render() {
		return (
			<Card style={{ width: 'auto' }}>
				<Card.Header className={'bg-hugobot'}>
					<Card.Text className={'h4 text-hugobot'}>
						Create a New Temporal Abstraction
					</Card.Text>
				</Card.Header>
				<Card.Body>
					<Form onSubmit={this.handleSubmit}>
						<Container fluid={true}>
							<Row>
								<Col md={2} className={'margin-disc-input'}>
									<Form.Label className={'h5 font-weight-bold text-dark'}>
										Abstraction Method
									</Form.Label>
									<Form.Control
										as={'select'}
										id={'AbMethodInput'}
										name={'AbMethodInput'}
										onChange={this.onAbMethodChange}
										placeholder={''}
									>
										{this.optionsToRender}
									</Form.Control>
									<div
										hidden={
											this.state.Binning.localeCompare('kbGradient') !== 0
										}
									>
										<br />
										<Form.Text className={'text-muted'}>
											NOTE: Gradient discretizations can take a while
										</Form.Text>
									</div>
								</Col>
								<Col
									hidden={this.state.Binning.localeCompare('regular') !== 0}
									md={1.5}
									className={'margin-input'}
								>
									<Form.Label className={'h5 font-weight-bold text-dark'}>
										Number of Bins
									</Form.Label>
									<Form.Control
										id={'NumStatesInput'}
										name={'NumStatesInput'}
										onChange={this.onNumStatesChange}
										as='select'
										defaultValue='Choose...'
									>
										{this.renderOptions(2, 21)}
									</Form.Control>

									<Form.Text className={'text-muted'}></Form.Text>
								</Col>
								<Col xs={1}></Col>
								<Col
									md={1.5}
									className={'margin-input'}
									hidden={this.state.Binning === 'perProperty' || this.state.Binning === 'empty'}
								>
									<Form.Label className={'h5 font-weight-bold text-dark'}>
										PAA Window Size
									</Form.Label>
									<Form.Control
										id={'PAAInput'}
										name={'PAAInput'}
										onChange={this.onPAAChange}
										as='select'
										defaultValue='Choose...'
									>
										{this.renderOptions(1, 21)}
									</Form.Control>

									<Form.Text className={'text-muted'}></Form.Text>
								</Col>
								<Col xs={1}></Col>

								<Col md={1.5} hidden={this.state.Binning === 'perProperty' || this.state.Binning === 'empty'}>
									<Form.Label className={'h5 font-weight-bold text-dark'}>
										Interpolation Gap
									</Form.Label>
									<Form.Control
										id={'InterpolationInput'}
										name={'InterpolationInput'}
										onChange={this.onInterpolationGapChange}
										as='select'
										defaultValue='Choose...'
									>
										{this.renderOptions(1, 21)}
									</Form.Control>

									<Form.Text className={'text-muted'}></Form.Text>
								</Col>
								<Col md={2}>
									<Container
										fluid
										className={'margin-run-btn row justify-content-md-center'}
									>
										<Button
											className={'btn btn-hugobot btn-lg'}
											type={'submit'}
											size='sm'
										>
											<i className={'fas fa-play'} /> Run
										</Button>
									</Container>
								</Col>
							</Row>
							<Row hidden={this.state.Binning.localeCompare('kbGradient') !== 0}>
								<Col md={4}>
									<Form.Label className={'font-weight-bold text-dark'}>
										Gradient File
									</Form.Label>
									<Form.Control
										accept={'.csv'}
										id={'Gradient-File'}
										type={'file'}
										onChange={this.onGradientFileChange}
									/>
								</Col>
								<Col md={4}>
									<Form.Label className={'font-weight-bold'}>
										Gradient Window Size
									</Form.Label>
									<Form.Control
										id={'GradientWindowInput'}
										name={'GradientWindowInput'}
										onChange={this.onGradientWindowSizeChange}
										placeholder={'2'}
										type={'text'}
									/>
									<Form.Text className={'text-muted'}>
										Window size must be at least 2
									</Form.Text>
								</Col>
							</Row>
							<Row hidden={this.state.GradientFile == null && (this.state.Binning.localeCompare('kbGradient') == 0 || this.state.Binning.localeCompare('empty') == 0)}>
								{/* {this.getNumberBins(this.state.GradientFile)} */}
								{this.renderBinsNames()}
							</Row>
							<Row hidden={this.state.Binning.localeCompare('perProperty') !== 0}>
								<Col md={3}>
									<Form.Label className={'font-weight-bold text-dark'}>
										Preprocessing File
									</Form.Label>
									<Form.Control
										accept={'.csv'}
										id={'Preprocessing-File'}
										type={'file'}
										onChange={this.onPreprocessingFileChange}
									/>
								</Col>
								<Col md={3}>
									<Form.Label className={'font-weight-bold text-dark'}>
										Temporal Abstraction File
									</Form.Label>
									<Form.Control
										accept={'.csv'}
										id={'Temporal-Abstraction-File'}
										type={'file'}
										onChange={this.onTemporalAbstractionFileChange}
									/>
								</Col>
								<Col md={3}>
									<Form.Label className={'font-weight-bold text-dark'}>
										States File (If you are using the Gradient or Knowledge
										Based methods)
									</Form.Label>
									<Form.Control
										accept={'.csv'}
										id={'States-File'}
										type={'file'}
										onChange={this.onStatesFileChange}
									/>
								</Col>
							</Row>
							<Row>
								<Col
									hidden={this.state.Binning.localeCompare('kbValue') !== 0}
									md={4}
								>
									<Form.Label className={'font-weight-bold'}>
										Knowledge-Based States File
									</Form.Label>
									<Form.Control
										accept={'.csv'}
										id={'KB-File'}
										type={'file'}
										onChange={this.onKnowledgeBasedFileChange}
									/>
								</Col>
								<Col md={2}></Col>
							</Row>
							<Row
								hidden={this.state.Binning !== 'regular' || this.state.Binning}
								md={+this.state.NumStates}
							>
								{this.renderBinsNames()}
							</Row>
						</Container>
					</Form>
				</Card.Body>
			</Card>
		);
	}
}
export default AddDiscretizationCard;
