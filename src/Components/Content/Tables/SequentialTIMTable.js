import React, { Component } from 'react';

import { Button, ButtonGroup, Card, Form, Table, ToggleButton } from 'react-bootstrap';

import { addSequentialTIM, getTIM, deleteKarmaLego, getNegativeTIM } from '../../../networking/requests/dataMining';
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

class SequentialTIMTable extends Component {
	constructor(props) {
		super(props);

		this.state = {
			Allen: new Map(),
			Class: new Map(),
			selectedButton: 'true',
			selectedSecondButton: 'true',
			negative: "true",
			tims: {
				mvs: 0,
				gap: 1,
				negative: 'false',
				mn: 1,
				ofo: 'true',
				as: 'false',
				bc: 'false',
			},
		};

		this.onChange = this.onChange.bind(this);
		this.handleDownloadRequest = this.handleDownloadRequest.bind(this);
		this.handleDownloadRequest0 = this.handleDownloadRequest0.bind(this);
		this.handleDownloadRequest1 = this.handleDownloadRequest1.bind(this);
		this.handleNegativeDownloadRequest = this.handleNegativeDownloadRequest.bind(this);
		this.handleButtonClick = this.handleButtonClick.bind(this);
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

	handleNegativeDownloadRequest(e) {
		let idx = parseInt(e.target.id.split('-')[1]);
		let tim = this.props.NegativesTable
		let id = tim[idx]['karma_id'];

		getNegativeTIM(id)
			.then((data) => {
				let blob = new Blob([JSON.stringify(data)], { type: 'application/json' });

				let url = window.URL.createObjectURL(blob);

				let link = document.createElement('a');
				link.href = url;
				link.download = 'negative_output.json';
				document.body.appendChild(link);

				link.click();

				document.body.removeChild(link)

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

	handleSubmit = (isVisualization) => {
		// isVisualization: false indicates the user only wants to mine with KL
		// if true, the user wants to activate KL and automatically after it visualization as well
		// TODO: Holy shit who wrote this? needs to get fixed asap.
		// * A success message should be displayed only if the operation was indeed successful
		const values = this.state.tims

		window.onload = setTimeout(
			() =>
				notifyAlert(
					'KarmaLego is running, When the operation is complete, you will receive an email notification'
				),
			3000
		);
		addSequentialTIM(
			values.gap,
			values.mvs,
			this.state.negative,
			values.mn,
			values.ofo,
			values.as,
			values.bc,
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

	handleButtonClick(buttonType) {
		this.setState({
		  selectedButton: buttonType,
		  negative: buttonType,
		  selectedSecondButton: buttonType,
		});
	}

	HeadElement = (Heading) => {
		return (
			<Card.Header className={'bg-hugobot'}>
				<Card.Text className={'text-hugobot'}>{Heading}</Card.Text>
			</Card.Header>
		);
	};

	onChange(key, e) {
		const current_values = this.state.tims
		const new_values = { ...current_values, [key]: e.target.value };
		this.setState({ tims: new_values });
	}

	//<editor-fold desc="Render functions">
	renderAddRunHeader = () => {
        return (
            <thead>
                <tr>
                    <td className={'font-weight-bold'}>
                        MVS (%)
                        <MyToolTip
                            icon={'fa-exclamation-circle'}
                            tip={'Minimum Vertical Support'}
                        />
                    </td>
                    <td className={'font-weight-bold'}>Max Gap</td>
                    <td className={'font-weight-bold'}>Maximum Negatives</td>
                    <td className={'font-weight-bold'}>
                        OFO
                        <MyToolTip
                            icon={'fa-exclamation-circle'}
                            tip={'One for One'}
                        />
                    </td>
                    <td className={'font-weight-bold'}>
                        AS
                        <MyToolTip
                            icon={'fa-exclamation-circle'}
                            tip={'Allow Same'}
                        />
                    </td>
                    <td className={'font-weight-bold'}>
                        BC
                        <MyToolTip
                            icon={'fa-exclamation-circle'}
                            tip={'Boundry Constraint'}
                        />
                    </td>
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
		return (
			<tr>
				<td>
					<Form.Control
						as='select'
						defaultValue='Choose...'
						onChange={(e) => this.onChange('mvs', e)}
					>
						{this.renderOptions(0, 100)}
					</Form.Control>
				</td>
				<td>
					<Form.Control
						as='select'
						defaultValue='Choose...'
						onChange={(e) => this.onChange('gap', e)}
					>
						{this.renderOptions(1, 21)}
					</Form.Control>
				</td>
				<td>
					<Form.Control
						as='select'
						defaultValue='Choose...'
						onChange={(e) => this.onChange('mn', e)}
					>
						{this.renderOptions(1, 21)}
					</Form.Control>
				</td>
				<td>
					<ButtonGroup toggle={true}>
						<ToggleButton
							checked={this.state.tims.ofo === 'true'}
							className={'btn-hugobot'}
							onChange={(e) => this.onChange('ofo', e)}
							type={'radio'}
							value={true}
						>
							True
						</ToggleButton>
						<ToggleButton
							checked={this.state.tims.ofo === 'false'}
							className={'btn-hugobot'}
							onChange={(e) => this.onChange('ofo', e)}
							type={'radio'}
							value={false}
						>
							False
						</ToggleButton>
					</ButtonGroup>
				</td>
				<td>
					<ButtonGroup toggle={true}>
						<ToggleButton
							checked={this.state.tims.as === 'true'}
							className={'btn-hugobot'}
							onChange={(e) => this.onChange('as', e)}
							type={'radio'}
							value={true}
						>
							True
						</ToggleButton>
						<ToggleButton
							checked={this.state.tims.as === 'false'}
							className={'btn-hugobot'}
							onChange={(e) => this.onChange('as', e)}
							type={'radio'}
							value={false}
						>
							False
						</ToggleButton>
					</ButtonGroup>
				</td>
				<td>
					<ButtonGroup toggle={true}>
						<ToggleButton
							checked={this.state.tims.bc === 'true'}
							className={'btn-hugobot'}
							onChange={(e) => this.onChange('bc', e)}
							type={'radio'}
							value={true}
						>
							True
						</ToggleButton>
						<ToggleButton
							checked={this.state.tims.bc === 'false'}
							className={'btn-hugobot'}
							onChange={(e) => this.onChange('bc', e)}
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
						onClick={() => this.handleSubmit(false)}
					>
						Mine
						<i className={'fas fa-play ml-2'} style={{ fontSize: 15 }} />
					</Button>
				</td>

				<td>
					<Button
						className={'btn btn-hugobot'}
						onClick={() => this.handleSubmit(true)}
					>
						{'Mine&Visualize'}
						<i className={'fas fa-play ml-2'} style={{ fontSize: 15 }} />
					</Button>
				</td>
			</tr>
		);
	};

	renderExistingRunsHeader = () => {
			return (
				<thead>
					<tr>
						<td className={'font-weight-bold'}>PAA</td>
						<td className={'font-weight-bold'} style={{ width: 60 }}>
							MS (%)
							<MyToolTip
								icon={'fa-exclamation-circle'}
								tip={'Minimum Vertical Support'}
							/>
						</td>
						<td className={'font-weight-bold'}>Max Gap</td>
						<td className={'font-weight-bold'}>Maximun Negatives</td>
						<td className={'font-weight-bold'}>OFO</td>
						<td className={'font-weight-bold'}>AS</td>
						<td className={'font-weight-bold'}>BC</td>
						<td className={'font-weight-bold'}>Download</td>
					</tr>
				</thead>
			);
	};

	renderExistingRunsData = () => {
			return this.props.NegativesTable.map((iter, index) => {
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
						</td>
						<td>{iter['VerticalSupport'] * 100}</td>
						<td>{iter['MaxGap']}</td>
						<td>{iter['MaximumNegatives']}</td>
						<td>{iter['ofo']}</td>
						<td>{iter['as']}</td>
						<td>{iter['bc']}</td>

						{iter.status.finished && iter.status.success ? (
							<>
								<td>
									<Button
										className='bg-hugobot'
										id={'downloadNegative-' + index}
										onClick={this.handleNegativeDownloadRequest}
									>
										<i className='fas fa-download' id={'downloadIcon2-' + index} />{' '}
										Download
									</Button>
								</td>
							</>
						) : iter.status.finished ? (
							<>
								<td>Karmalego failed</td>
							</>
						) : (
							<>
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
							Add a New Sequential Pattern Mining Configuration
						</Card.Text>
					</Card.Header>
					{/* {this.HeadElement('')} */}
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

export default SequentialTIMTable;
