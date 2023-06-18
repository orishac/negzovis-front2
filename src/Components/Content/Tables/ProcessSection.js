import React, { Component } from 'react';

import { Container } from 'react-bootstrap';
import { Route } from 'react-router-dom';

import HomeTable from './HomeTable';
import { getAllDatasets } from '../../../networking/requests/datasetsStats';
import ProcessWorkflow from './ProcessWorkflow';
import { errorAlert } from '../../SweetAlerts';

/**
 * this class renders all the data of the home page.
 * it creates the main table which contains dataset name,
 * category, description, is it public or private, dataset source.
 */

class ProcessSection extends Component {
	state = {
		datasets: null,
		datasetName: '',
	};

	componentDidMount() {
		getAllDatasets()
			.then((data) => {
				let myData = { rows: [] };
				for (let i = 0; i < data['lengthNum']; i++) {
					let y = data[i];
					myData.rows.push(y);
				}
				this.setState({ datasets: myData });
			})
			.catch(errorAlert);
	}

	CollectData = (id) => {
		this.setState((prevState) => ({ ...prevState, datasetName: id }));
		window.open(`#/Process/${id}/Info`, '_self');
	};

	deleteDataset(datasetName) {
		let currentData = this.state.datasets;
		let newDatasets = currentData['rows'].filter((dataset)=>dataset['DatasetName'] !== datasetName);
		let myData = { rows: newDatasets };
		this.setState({ datasets: myData });
	}
	render() {
		return (
			<Container fluid>
				<Route exact path={'/Process'}>
					<HomeTable CollectData={this.CollectData} datasets={this.state.datasets} deleteDataset={this.deleteDataset.bind(this)}/>
				</Route>
				<Route path={'/Process/:discretizationId'}
					render={props =>
					<ProcessWorkflow
						{...props}
						discretizations={this.state.discretizations}
						TIMTable={this.state.TIMTable}
						datasetName={this.state.datasetName}
					/>
					}
				/>
			</Container>
		);
	}
}
export default ProcessSection;
