import React, { Component } from 'react';
import Cookies from 'js-cookie';

import { Card, Form, Table } from 'react-bootstrap';
import Loader from '../../Loader';
import { errorAlert, successAlert, irreversibleOperationAlert } from '../../SweetAlerts';
import { deleteDataset } from '../../../networking/requests/datasetsStats';

/**
 * this class contains the display of the the table from table content
 */

class HomeTable extends Component {
	state = {
		filterDatasetName: '',
		filterCategory: '',
		filterSize: '0',
		filterOwner: '',
		filterPublicPrivate: '',
	};

	filter = () => {
		this.setState({
			filterCategory: document.getElementById('category').value,
			filterDatasetName: document.getElementById('datasetName').value,
			filterSize: document.getElementById('size').value,
			filterOwner: document.getElementById('owner').value,
			filterPublicPrivate: document.getElementById('publicPrivate').value,
		});
		this.forceUpdate();
	};

	componentDidMount() {
		if (!Cookies.get('auth-token')) {
			window.open('#/Login', '_self');
		}
	}

	renderTableHeader = () => {
		return (
			<thead>
				<tr>
					<th style={{ width: '20%' }}>
						<Form.Control
							className={'font-weight-bold'}
							id={'datasetName'}
							onChange={this.filter}
							placeholder={'Dataset Name'}
							type={'text'}
						/>
					</th>
					<th style={{ width: '20%' }}>
						<Form.Control
							className={'font-weight-bold'}
							id={'category'}
							onChange={this.filter}
							placeholder={'Category'}
							type={'text'}
						/>
					</th>
					<th style={{ width: '20%' }}>
						<Form.Control
							className={'font-weight-bold'}
							id={'size'}
							onChange={this.filter}
							placeholder={'Size (MB)'}
							type={'text'}
						/>
					</th>
					<th style={{ width: '20%' }}>
						<Form.Control
							className={'font-weight-bold'}
							id={'owner'}
							onChange={this.filter}
							placeholder={'Owner'}
							type={'text'}
						/>
					</th>
					<th style={{ width: '20%' }}>
						<Form.Control
							className={'font-weight-bold'}
							id={'publicPrivate'}
							onChange={this.filter}
							placeholder={'Access'}
							type={'text'}
						/>
					</th>
				</tr>
			</thead>
		);
	};

	renderTableData = () => {
		const tables = this.props.datasets;
		return tables.rows.map((iter, idx) => {
			const filterSize = parseFloat(this.state.filterSize);
			if (
				(isNaN(filterSize) || filterSize <= parseFloat(iter['Size'])) &&
				iter['DatasetName'].includes(this.state.filterDatasetName) &&
				iter['Category'].includes(this.state.filterCategory) &&
				iter['Owner'].includes(this.state.filterOwner) &&
				iter['PublicPrivate'].includes(this.state.filterPublicPrivate)
			) {
				return (
					<tr
						key={idx.toString()}
						onClick={() => {
							sessionStorage.setItem('Workflow', 'Info');
							this.props.CollectData(iter['DatasetName']);
						}}
					>
						<td>
							{iter['DatasetName']}
							<div className='more-btn-container mr-2'>
								<i
									className='fas fa-trash more-btn'
									onClick={(e) => {
										irreversibleOperationAlert(
											`Are you sure you want to delete Discretization for "${iter['DatasetName']}"?`,
											'Yes, delete',
											'No, cancel'
										).then((result) => {
											if (result.isConfirmed) {
												deleteDataset(iter['DatasetName'])
													.then(() =>
														this.props.deleteDataset(
															iter['DatasetName']
														)
													)
													.then(() => {
														successAlert(
															'Deleted',
															`The KarmaLego for "${iter['DatasetName']}" was deleted successfully`
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
						<td>{iter['Category']}</td>
						<td>{iter['Size']}</td>
						<td>{iter['Owner']}</td>
						<td>{iter['PublicPrivate']}</td>
					</tr>
				);
			} else {
				return null;
			}
		});
	};

	render() {
		let that = this;
		window.addEventListener('ReloadHomeTable', function () {
			that.forceUpdate();
		});
		return (
			<Card>
				<Card.Header className={'bg-hugobot'}>
					<Card.Text className={'h3 text-hugobot'}>Datasets</Card.Text>
				</Card.Header>
				<Card.Body>
					<br />
					<Table striped bordered hover>
						{this.renderTableHeader()}
						<tbody>
							{this.props.datasets ? (
								this.renderTableData()
							) : (
								<tr>
									<td colSpan='5' className='w-100 align-loader'>
										<Loader />
									</td>
								</tr>
							)}
						</tbody>
					</Table>
				</Card.Body>
			</Card>
		);
	}
}

export default HomeTable;
