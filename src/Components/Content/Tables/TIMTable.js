import React, { Component } from 'react';

import { Button, ButtonGroup, Card, Form, Table, ToggleButton } from 'react-bootstrap';

import { addTIM, getTIM, deleteKarmaLego } from '../../../networking/requests/dataMining';
import MyToolTip from '../../MyToolTip';
import {
	errorAlert,
	notifyAlert,
	successAlert,
	irreversibleOperationAlert,
} from '../../SweetAlerts';

/**
 * this class is the time interval minings class.
 * it sends to the server number of relations, PAA, Bins, Interpolation, Method,
 * Min. Vertical Support (%), max gap, epsilon, Max TIRP Length (Integer), index same.
 * it allows you do download the tim interval minings.
 */

const defaultValues = {
	mvs: 0,
	gap: 1,
	relations: '3',
	epsilon: 0,
	tirps_len: 2,
	index: 'true',
};

class TIMTable extends Component {
	constructor(props) {
		super(props);

		this.state = {
			Allen: new Map(),
			Class: new Map(),

			tims: {},
		};

		this.onChange = this.onChange.bind(this);
		this.handleDownloadRequest = this.handleDownloadRequest.bind(this);
		this.handleDownloadRequest0 = this.handleDownloadRequest0.bind(this);
		this.handleDownloadRequest1 = this.handleDownloadRequest1.bind(this);
	}

	handleDownloadRequest(e) {
		let idx = parseInt(e.target.id.split('-')[1]);
		let tim = this.props.TIMTable;
		let id = tim[idx]['karma_id'];

		getTIM(id, 'KL.txt')
			.then((data) => {
				let blob = new Blob([data], { type: 'text/plain' });

				let a = document.createElement('a');
				a.style = 'display: none';
				document.body.appendChild(a);

				let url = window.URL.createObjectURL(blob);
				a.href = url;
				a.download = 'KL.txt';

				a.click();

				window.URL.revokeObjectURL(url);
			})
			.catch(errorAlert);
	}

	handleDownloadRequest1(e) {
		let idx = parseInt(e.target.id.split('-')[1]);
		let tim = this.props.TIMTable;
		let id = tim[idx]['karma_id'];

		getTIM(id, 'KL-class-1.0.txt')
			.then((data) => {
				let blob = new Blob([data], { type: 'text/plain' });

				let a = document.createElement('a');
				a.style = 'display: none';
				document.body.appendChild(a);

				let url = window.URL.createObjectURL(blob);
				a.href = url;
				a.download = 'KL-class-1.0.txt';

				a.click();

				window.URL.revokeObjectURL(url);
			})
			.catch(errorAlert);
	}

	handleDownloadRequest0(e) {
		let idx = parseInt(e.target.id.split('-')[1]);
		let tim = this.props.TIMTable;
		let id = tim[idx]['karma_id'];
		getTIM(id, 'KL-class-0.0.txt')
			.then((data) => {
				let blob = new Blob([data], { type: 'text/plain' });

				let a = document.createElement('a');
				a.style = 'display: none';
				document.body.appendChild(a);

				let url = window.URL.createObjectURL(blob);
				a.href = url;
				a.download = 'KL-class-0.0.txt';

				a.click();

				window.URL.revokeObjectURL(url);
			})
			.catch(errorAlert);
	}

	handleSubmit = (id, isVisualization) => {
		// isVisualization: false indicates the user only wants to mine with KL
		// if true, the user wants to activate KL and automatically after it visualization as well
		// TODO: Holy shit who wrote this? needs to get fixed asap.
		// * A success message should be displayed only if the operation was indeed successful
		const values = this.getValues(id);

		window.onload = setTimeout(
			() =>
				notifyAlert(
					'KarmaLego is running, When the operation is complete, you will receive an email notification'
				),
			3000
		);
		addTIM(
			id,
			values.epsilon,
			values.gap,
			values.mvs,
			values.relations,
			values.tirps_len,
			values.index,
			this.props.datasetName,
			isVisualization
		)
			.then(() =>
				successAlert(
					'Success',
					'Your requested time interval mining operation as been completed!'
				)
			)
			.catch(errorAlert);
	};

	HeadElement = (Heading) => {
		return (
			<Card.Header className={'bg-hugobot'}>
				<Card.Text className={'text-hugobot'}>{Heading}</Card.Text>
			</Card.Header>
		);
	};

	onChange(discretization_id, key, e) {
		const current_values = this.getValues(discretization_id);
		const new_values = { ...current_values, [key]: e.target.value };
		this.setState({ tims: { ...this.state.tims, [discretization_id]: new_values } });
	}

	getValues(discretization_id) {
		return this.state.tims[discretization_id] ?? defaultValues;
	}

	//<editor-fold desc="Render functions">
	renderAddRunHeader = () => {
		return (
			<thead>
				<tr>
					<td className={'font-weight-bold'}>PAA</td>
					<td className={'font-weight-bold'}>Bins</td>
					<td className={'font-weight-bold'}>Interpolation</td>
					<td className={'font-weight-bold'}>Method</td>
					<td className={'font-weight-bold'}>
						MVS (%)
						<MyToolTip
							icon={'fa-exclamation-circle'}
							tip={'Minimum Vertical Support'}
						/>
					</td>
					<td className={'font-weight-bold'}>Max Gap</td>
					<td className={'font-weight-bold'}>Relations (#)</td>
					<td className={'font-weight-bold'}>Epsilon</td>
					<td className={'font-weight-bold'}>Max TIRP Length</td>
					<td className={'font-weight-bold'}>Index Same</td>
					<td className={'font-weight-bold'}>Mine</td>
					<td className={'font-weight-bold'}>{'Mine and Visualize'}</td>
				</tr>
			</thead>
		);
	};

	renderOptions(min, arraySize) {
		var rows = [];
		for (var i = min; i < arraySize; i++) {
			rows.push(<option key={i}>{i}</option>);
		}
		return rows;
	}

	renderAddRunData = () => {
		return this.props.discretizations
			.filter((iter) => iter.status.finished && iter.status.success)
			.map((iter, index) => {
				return (
					<tr key={index}>
						<td>{iter['PAAWindowSize']}</td>
						<td>{iter['BinsNumber']}</td>
						<td>{iter['InterpolationGap']}</td>
						<td>{iter['MethodOfDiscretization']}</td>
						<td>
							<Form.Control
								as='select'
								defaultValue='Choose...'
								onChange={(e) => this.onChange(iter.id, 'mvs', e)}
							>
								{this.renderOptions(0, 100)}
							</Form.Control>
						</td>
						<td>
							<Form.Control
								as='select'
								defaultValue='Choose...'
								onChange={(e) => this.onChange(iter.id, 'gap', e)}
							>
								{this.renderOptions(1, 21)}
							</Form.Control>
						</td>
						<td>
							<ButtonGroup toggle={true} style={{ display: 'block' }}>
								<ToggleButton
									checked={this.getValues(iter.id).relations === '3'}
									className={'btn-hugobot'}
									onChange={(e) => this.onChange(iter.id, 'relations', e)}
									type={'radio'}
									value={3}
								>
									3
								</ToggleButton>
								<ToggleButton
									checked={this.getValues(iter.id).relations === '7'}
									className={'btn-hugobot'}
									onChange={(e) => this.onChange(iter.id, 'relations', e)}
									type={'radio'}
									value={7}
								>
									7
								</ToggleButton>
							</ButtonGroup>
						</td>
						<td>
							<Form.Control
								as='select'
								defaultValue='Choose...'
								onChange={(e) => this.onChange(iter.id, 'epsilon', e)}
							>
								{this.renderOptions(0, 11)}
							</Form.Control>
						</td>
						<td>
							<Form.Control
								as='select'
								defaultValue='Choose...'
								onChange={(e) => this.onChange(iter.id, 'tirps_len', e)}
							>
								{this.renderOptions(2, 21)}
							</Form.Control>
						</td>
						<td>
							<ButtonGroup toggle={true}>
								<ToggleButton
									checked={this.getValues(iter.id).index === 'true'}
									className={'btn-hugobot'}
									onChange={(e) => this.onChange(iter.id, 'index', e)}
									type={'radio'}
									value={true}
								>
									True
								</ToggleButton>
								<ToggleButton
									checked={this.getValues(iter.id).index === 'false'}
									className={'btn-hugobot'}
									onChange={(e) => this.onChange(iter.id, 'index', e)}
									type={'radio'}
									value={false}
								>
									False
								</ToggleButton>
							</ButtonGroup>
						</td>
						<td>
							<Button
								className={'btn btn-hugobot'}
								onClick={() => this.handleSubmit(iter.id, false)}
							>
								Mine
								<i className={'fas fa-play ml-2'} style={{ fontSize: 15 }} />
							</Button>
						</td>

						<td>
							<Button
								className={'btn btn-hugobot'}
								onClick={() => this.handleSubmit(iter.id, true)}
							>
								{'Mine&Visualize'}
								<i className={'fas fa-play ml-2'} style={{ fontSize: 15 }} />
							</Button>
						</td>
					</tr>
				);
			});
	};

	renderExistingRunsHeader = () => {
		return (
			<thead>
				<tr>
					<td className={'font-weight-bold'}>PAA</td>
					<td className={'font-weight-bold'}>Bins</td>
					<td className={'font-weight-bold'}>Interpolation</td>
					<td className={'font-weight-bold'}>Method</td>
					<td className={'font-weight-bold'} style={{ width: 60 }}>
						MVS (%)
						<MyToolTip
							icon={'fa-exclamation-circle'}
							tip={'Minimum Vertical Support'}
						/>
					</td>
					<td className={'font-weight-bold'}>Max Gap</td>
					<td className={'font-weight-bold'}>No. of Relations</td>
					<td className={'font-weight-bold'}>Epsilon</td>
					<td className={'font-weight-bold'}>Max TIRP Length</td>
					<td className={'font-weight-bold'}>Index Same</td>
					<td className={'font-weight-bold'}>Download class0</td>
					<td className={'font-weight-bold'}>Download class1</td>
					<td className={'font-weight-bold'}>Download Both</td>
				</tr>
			</thead>
		);
	};

	renderExistingRunsData = () => {
		return this.props.TIMTable.map((iter, index) => {
			return (
				<tr key={index}>
					<td>
						<div className='more-btn-container mr-2'>
							<i
								className='fas fa-trash more-btn'
								onClick={(e) => {
									irreversibleOperationAlert(
										`Are you sure you want to delete KarmaLego for "${this.props.datasetName}"?`,
										'Yes, delete',
										'No, cancel'
									).then((result) => {
										if (result.isConfirmed) {
											deleteKarmaLego(iter, this.props.datasetName)
												.then(() => this.props.removeKarmaLego(iter))
												.then(() => {
													successAlert(
														'Deleted',
														`The KarmaLego for "${this.props.datasetName}" was deleted successfully`
													);
												})
												.catch(errorAlert);
										}
									});
									e.stopPropagation();
								}}
							/>
						</div>

						{iter['PAAWindowSize']}
					</td>
					<td>{iter['BinsNumber']}</td>
					<td>{iter['InterpolationGap']}</td>
					<td>{iter['MethodOfDiscretization']}</td>
					<td>{iter['VerticalSupport'] * 100}</td>
					<td>{iter['MaxGap']}</td>
					<td>{iter['numRelations']}</td>
					<td>{Number.parseFloat(iter['epsilon']).toFixed(0)}</td>
					<td>{iter['maxTirpLength']}</td>
					<td>{iter['indexSame']}</td>
					{iter.status.finished && iter.status.success ? (
						<>
							<td>
								<Button
									className='bg-hugobot'
									id={'download0-' + index}
									onClick={this.handleDownloadRequest0}
								>
									<i className='fas fa-download' id={'downloadIcon0-' + index} />{' '}
									Download
								</Button>
							</td>
							<td>
								<Button
									className='bg-hugobot'
									id={'download1-' + index}
									onClick={this.handleDownloadRequest1}
								>
									<i className='fas fa-download' id={'downloadIcon1-' + index} />{' '}
									Download
								</Button>
							</td>
							<td>
								<Button
									className='bg-hugobot'
									id={'download2-' + index}
									onClick={this.handleDownloadRequest}
								>
									<i className='fas fa-download' id={'downloadIcon2-' + index} />{' '}
									Download
								</Button>
							</td>
						</>
					) : iter.status.finished ? (
						<>
							<td>Karmalego failed</td>
							<td>Karmalego failed</td>
							<td>Karmalego failed</td>
						</>
					) : (
						<>
							<td>Karmalego inprogress</td>
							<td>Karmalego inprogress</td>
							<td>Karmalego inprogress</td>
						</>
					)}
				</tr>
			);
		});
	};
	//</editor-fold>

	render() {
		return (
			<small>
				<Card style={{ width: 'auto' }}>
					<Card.Header className={'bg-hugobot'}>
						<Card.Text className={'h4 text-hugobot '}>
							Add a New Time Intervals Mining Configuration
						</Card.Text>
					</Card.Header>
					{this.HeadElement('')}
					<Card.Body>
						<Table hover>
							{this.renderAddRunHeader()}
							<tbody>{this.renderAddRunData()}</tbody>
						</Table>
					</Card.Body>
				</Card>
				<Card style={{ width: 'auto' }}>
					<Card.Header className={'bg-hugobot'}>
						<Card.Text className={'h4 text-hugobot '}>Discovered Patterns</Card.Text>
					</Card.Header>
					<Card.Body>
						<Table hover>
							{this.renderExistingRunsHeader()}
							<tbody>{this.renderExistingRunsData()}</tbody>
						</Table>
					</Card.Body>
				</Card>
			</small>
		);
	}
}

export default TIMTable;
