import React, { Component } from 'react';
import Cookies from 'js-cookie';

import { Card, Form, Table } from 'react-bootstrap';
import { getAllVisualizations } from '../../../networking/requests/datasetsStats';

import VisualizationRow from './VisualizationRow';
import { errorAlert } from '../../SweetAlerts';
import Loader from '../../Loader';
import { SetTitleContext } from '../../../contexts';
/**
 * this class contains the display of the the table from table content
 */

class HomeTable extends Component {
	static contextType = SetTitleContext;
	state = {
		filterDatasetName: '',
		filterCategory: '',
		filterSize: '',
		filterOwner: '',
		filterPublicPrivate: '',
		rows: null,
	};

	filter = () => {
		this.setState({
			filterCategory: document.getElementById('category').value,
			filterDatasetName: document.getElementById('datasetName').value,
			filterOwner: document.getElementById('owner').value,
			filterPublicPrivate: document.getElementById('permission').value,
		});
		this.forceUpdate();
	};

	componentDidMount() {
		if (!Cookies.get('auth-token')) {
			window.open('#/Login', '_self');
		}

		getAllVisualizations()
			.then((data) => {
				this.setState({ rows: data.DataSets });
			})
			.catch(errorAlert);
	}

	renderTableHeader = () => {
		return (
			<thead>
				<tr>
					<th>
						<Form.Control
							className={'font-weight-bold'}
							id={'datasetName'}
							onChange={this.filter}
							placeholder={'Dataset Name'}
							type={'text'}
						/>
					</th>
					<th>
						<Form.Control
							className={'font-weight-bold'}
							id={'category'}
							onChange={this.filter}
							placeholder={'Category'}
							type={'text'}
						/>
					</th>
					<th>
						<Form.Control
							className={'font-weight-bold'}
							id={'owner'}
							onChange={this.filter}
							placeholder={'Owner'}
							type={'text'}
						/>
					</th>
				</tr>
			</thead>
		);
	};

	renderTableData = () => {
		return this.state.rows.map((iter, idx) => (
			<VisualizationRow
				StartVisualization={this.StartVisualization}
				visualization={iter}
				key={idx}
				removeVisualization={(visualizationID) => {
					this.setState((state) => ({
						rows: state.rows.filter(
							(visualization) => visualization.id !== visualizationID
						),
					}));
				}}
			/>
		));
	};

	onClick = () => {
		window.open('#/Upload/Metadata', '_self');
	};

	StartVisualization = (id, visualizationId) => {
		sessionStorage.setItem('datasetReadyName', id);
		sessionStorage.setItem('visualizationId', visualizationId);
		this.context(id);
		window.open('#/TirpsApp', '_self');
	};

	render() {
		return (
			<Card>
				<Card.Header className={'bg-hugobot'}>
					<Card.Text className={'h3 text-hugobot'}>Visualization DataSets</Card.Text>
				</Card.Header>
				<Card.Body>
					<Table striped={true} bordered={true} hover={true}>
						{this.renderTableHeader()}
						<tbody>
							{this.state.rows ? (
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
