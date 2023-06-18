import React, { Component } from 'react';

import { Button, Col, Container, Row } from 'react-bootstrap';

import InfoCard from './InfoCard';
import StatsCard from './StatsCard';
import VMapCard from './VMapCard';
import {
	getInfo,
	incrementDownloads,
	incrementViews,
} from '../../../../networking/requests/datasetsStats';
import { getDatasetFiles, getVMapFile } from '../../../../networking/requests/datasetsFiles';
import { errorAlert, irreversibleOperationAlert, successAlert } from '../../../SweetAlerts';
import { deleteDataset, uploadEntities } from '../../../../networking/requests/manage_datasets';
import FileUploader from '../../UploadDataset/FileUploader';

/**
 * this class contains all the other classes.
 * it contains the info card, the states card, and the vmap card.
 */

class Info extends Component {
	constructor(props) {
		super(props);

		this.state = {
			DatasetName: '',
			Category: '',
			Owner: '',
			Source: '',
			Description: '',
			Size: '',
			Views: '',
			Downloads: '',
			VMapFile: [],
			entitiesUuid: undefined,
			class0Name: '',
			class1Name: '',
		};

		let datasetName = props.datasetName;

		getInfo(datasetName)
			.then((data) => {
				this.setState({
					DatasetName: data['Name'],
					Category: data['category'],
					Owner: data['owner_name'],
					Source: data['source'],
					Description: data['Description'],
					Size: data['size'],
					Views: data['views'] + 1,
					Downloads: data['downloads'],
					class0Name: data['class_0_name'],
					class1Name: data['class_1_name'],
				});
			})
			.catch(errorAlert);

		getVMapFile(datasetName)
			.then((data) => {
				let csvRows = data.split('\n');
				let csv = [];
				for (let i = 0; i < csvRows.length; i++) {
					csv.push(csvRows[i].split(','));
				}
				this.setState({
					VMapFile: csv,
				});
			})
			.catch(errorAlert);

		incrementViews(datasetName).catch(errorAlert);
	}

	handleDownloadRequest = () => {
		let datasetName = this.props.datasetName;

		getDatasetFiles(datasetName)
			.then((data) => {
				let blob = new Blob([data], {
					type: 'application/octet-stream',
				});

				let a = document.createElement('a');
				a.style = 'display: none';
				document.body.appendChild(a);

				let url = window.URL.createObjectURL(blob);
				a.href = url;
				a.download = datasetName + '.zip';

				a.click();
				//

				window.URL.revokeObjectURL(url);
			})
			.catch(errorAlert);

		incrementDownloads(datasetName)
			.then((data) => this.setState({ Downloads: data['downloads'] }))
			.catch(errorAlert);
	};

	render() {
		return (
			<Container fluid={true}>
				<Row>
					<Col md={2}>
						<InfoCard
							DatasetName={this.state.DatasetName}
							Category={this.state.Category}
							Owner={this.state.Owner}
							Source={this.state.Source}
							Description={this.state.Description}
							updateDetails={(property, value) => {
								this.setState({
									[property]: value,
								});
							}}
							class0Name={this.state.class0Name}
							class1Name={this.state.class1Name}
						/>
						<StatsCard
							Size={this.state.Size}
							Views={this.state.Views}
							Downloads={this.state.Downloads}
						/>
						<Button
							className={'btn btn-hugobot mb-3 w-100'}
							onClick={this.handleDownloadRequest}
						>
							<i className='fas fa-download mr-2' /> Download Dataset Files
						</Button>
						<Button
							className={'btn btn-hugobot-error w-100 mb-4'}
							onClick={() => {
								irreversibleOperationAlert(
									`Are you sure you want to delete ${this.state.DatasetName}?`,
									'Yes, delete',
									'No, cancel'
								).then((result) => {
									if (result.isConfirmed) {
										deleteDataset(this.state.DatasetName)
											.then(() => {
												successAlert(
													'Deleted',
													`The dataset "${this.state.DatasetName}" was deleted successfully`
												).finally(() => window.open('#/Home', '_self'));
											})
											.catch(errorAlert);
									}
								});
							}}
						>
							<i className='fas fa-trash mr-2' /> Delete Dataset
						</Button>
						<FileUploader
							acceptedFiles='.csv'
							onUpload={(uuid) => {
								this.setState({
									entitiesUuid: uuid,
								});
							}}
							title='Drop Here Your Entities File'
						/>
						<Button
							className='btn btn-hugobot w-100'
							disabled={!this.state.entitiesUuid}
							onClick={() => {
								uploadEntities(this.state.DatasetName, this.state.entitiesUuid)
									.then(() => {
										successAlert(
											'Uploaded',
											`Uploaded an entities file successfully`
										).finally(() => window.open('#/Home', '_self'));
									})
									.catch(errorAlert);
							}}
						>
							Upload Entities
						</Button>
					</Col>
					<Col md={10}>
						<VMapCard VMap={this.state.VMapFile} />
					</Col>
				</Row>
			</Container>
		);
	}
}
export default Info;
