import React, { Component } from 'react';

import { Button, Card, Table } from 'react-bootstrap';

import {
	getDiscritization,
	delteDescretization,
} from '../../../networking/requests/discretization';
import { errorAlert, successAlert, irreversibleOperationAlert } from '../../SweetAlerts';
/**
 * this class loads the table of the discretizations that already been created
 */

class DiscretizationTable extends Component {
	constructor(props) {
		super(props);

		this.currConfigHeadElement = this.currConfigHeadElement.bind(this);
		this.renderTableHeader = this.renderTableHeader.bind(this);
		this.renderTableData = this.renderTableData.bind(this);
		this.handleDownloadRequest = this.handleDownloadRequest.bind(this);
	}

	handleDownloadRequest(e) {
		let idx = parseInt(e.target.id.split('-')[1]);
		let disc = this.props.discretizations;
		let id = disc[idx]['id'];

		getDiscritization(id)
			.then((data) => {
				successAlert();

				let blob = new Blob([data], {
					type: 'application/octet-stream',
				});

				let a = document.createElement('a');
				a.style = 'display: none';
				document.body.appendChild(a);

				let url = window.URL.createObjectURL(blob);
				a.href = url;
				a.download = 'discretization.zip';

				a.click();

				window.URL.revokeObjectURL(url);
			})
			.catch(errorAlert);
	}

	currConfigHeadElement() {
		return (
			<Card.Header className={'bg-hugobot'}>
				<Card.Text className={'h4 text-hugobot'}>Use an Existing Configuration</Card.Text>
			</Card.Header>
		);
	}

	renderTableHeader = () => {
		return (
			<tr>
				<td className={'font-weight-bold'}>Abstraction Method</td>
				<td className={'font-weight-bold'}>Bins Number</td>
				<td className={'font-weight-bold'}>PAA Window Size</td>
				<td className={'font-weight-bold'}>Interpolation Gap</td>
				<td className={'font-weight-bold'}>Status/Download Link</td>
			</tr>
		);
	};

	renderTableData = () => {
		return this.props.discretizations.map((iter, idx) => {
			return (
				<tr key={idx.toString()}>
					<td id={'tdAbMethod' + idx}>
						<div className='more-btn-container mr-2'>
							<i
								className={`fas fa-trash more-btn`}
								onClick={(e) => {
									irreversibleOperationAlert(
										`Are you sure you want to delete Discretization for "${this.props.datasetName}"?`,
										'Yes, delete',
										'No, cancel'
									).then((result) => {
										if (result.isConfirmed) {
											delteDescretization(iter['id'], this.props.datasetName)
												.then(() => this.props.removeDiscretization(iter))
												.then(() => {
													successAlert(
														'Deleted',
														`The discretization for "${this.props.datasetName}" was deleted successfully`
													);
												})
												.catch(errorAlert);
										}
									});
									e.stopPropagation();
								}}
							/>
						</div>
						{iter.MethodOfDiscretization}
					</td>
					<td id={'tdNumStates' + idx}>{iter.BinsNumber}</td>
					<td id={'tdPAA' + idx}>{iter.PAAWindowSize}</td>
					<td id={'tdInterpolationGap' + idx}>{iter.InterpolationGap}</td>
					<td>
						{iter.status.finished ? (
							iter.status.success ? (
								<Button
									className='bg-hugobot'
									id={'download-' + idx}
									onClick={this.handleDownloadRequest}
								>
									<i className='fas fa-download' id={'downloadIcon-' + idx} />{' '}
									Download
								</Button>
							) : (
								'Discretization failed'
							)
						) : (
							'Discretization in progress'
						)}
					</td>
				</tr>
			);
		});
	};

	render() {
		let that = this;
		window.addEventListener('ReloadTable', function () {
			that.forceUpdate();
		});
		return (
			<Card style={{ width: 'auto' }}>
				<Card.Header className={'bg-hugobot'}>
					<Card.Text className={'h4 text-hugobot'}>
						Download an Existing Temporal Abstraction
					</Card.Text>
				</Card.Header>
				<Card.Body>
					<Table striped={true} bordered={true} hover={true}>
						<tbody>
							{this.renderTableHeader()}
							{this.renderTableData()}
						</tbody>
					</Table>
				</Card.Body>
			</Card>
		);
	}
}

export default DiscretizationTable;
