import React, { Component } from 'react';

import { Button, Card, Col, Form, Row } from 'react-bootstrap';

import FormElement from '../../Login/FormElement';
import SelectElement from '../../Login/SelectElement';
import { uploadDataset } from '../../../networking/requests/upload';
import { errorAlert, successAlert } from '../../SweetAlerts';
import FileUploader from './FileUploader';
import Swal from 'sweetalert2';

/**
 * this class is the actual form of the dataset upload,
 * is gets dataset name, category, description, is it public or private, dataset source.
 * the format of the dataset file is csv and it checks the csv format
 */

class UploadNewDataset extends Component {
	onFormSubmit(e) {
		e.preventDefault(); // Stop form submit
		Swal.fire({
			title: 'Preparing Your Data...',
			didOpen: () => {
				Swal.showLoading();
			},
			allowOutsideClick: false,
			allowEscapeKey: false,
			allowEnterKey: false,
		});
		uploadDataset(
			this.props.details.datasetName,
			this.props.details.category,
			this.props.details.publicPrivate,
			this.props.details.file,
			this.props.details.description,
			this.props.details.datasetSource,
			this.props.details.rawDataUuid,
			this.props.details.vmapUuid,
			this.props.details.entitiesUuid
		)
			.finally(() => Swal.close())
			.then(() => {
				successAlert(
					'New Dataset!',
					`Your dataset, ${this.props.details.datasetName}, as been uploaded successfully`
				).finally(() => {
					window.open('#/Home', '_self');
				});
			})
			.catch(errorAlert);
	}

	change(e, key) {
		this.props.setDetails({ ...this.props.details, [key]: e.target.value });
	}

	render() {
		return (
			<Card>
				<Card.Header className={'bg-hugobot header-container'}>
					<Card.Text className={'h3 text-hugobot in-line'}>Upload New Dataset</Card.Text>
					<Button className={'ml-4'} onClick={() => this.props.toImport()}>
						Import Dataset
					</Button>
					<Button className={'ml-4'} onClick={() => this.props.toSequential()}>
						Upload Sequential Dataset
					</Button>
				</Card.Header>
				<Card.Body className='upload-form-container'>
					<Form onSubmit={(e) => this.onFormSubmit(e)} className='upload-form'>
						<FormElement
							name={'Dataset Name'}
							onChange={(e) => this.change(e, 'datasetName')}
							value={this.props.details.datasetName}
							required
						/>
						<SelectElement
							name={'Category'}
							onChange={(e) => this.change(e, 'category')}
							options={['Medical', 'Financial', 'Psychological', 'Other']}
							value={this.props.details.category}
						/>
						<SelectElement
							name={'Public/Private'}
							onChange={(e) => this.change(e, 'publicPrivate')}
							options={['Public', 'Private']}
							value={this.props.details.publicPrivate}
						/>
						<Row>
							<Col md={5}>
								<div className='uploader-container'>
									<div>
										Raw Data
										<FileUploader
											onUpload={(uuid) => {
												this.props.setDetails({
													...this.props.details,
													rawDataUuid: uuid,
												});
											}}
										/>
									</div>
									<div>
										Variables Map
										<FileUploader
											onUpload={(uuid) => {
												this.props.setDetails({
													...this.props.details,
													vmapUuid: uuid,
												});
											}}
										/>
									</div>
									<div>
										Entities (Optional)
										<FileUploader
											onUpload={(uuid) => {
												this.props.setDetails({
													...this.props.details,
													entitiesUuid: uuid,
												});
											}}
										/>
									</div>
								</div>
							</Col>
						</Row>
						<FormElement
							as={'textarea'}
							name={'Description'}
							onChange={(e) => this.change(e, 'description')}
							rows={'5'}
							value={this.props.details.description}
						/>
						<FormElement
							name={'Dataset Source'}
							onChange={(e) => this.change(e, 'datasetSource')}
							value={this.props.details.datasetSource}
						/>
						<Button
							className={'bg-hugobot mr-4'}
							type={'submit'}
							style={{ marginLeft: 15 }}
						>
							Upload & Validate Data
						</Button>
					</Form>
				</Card.Body>
			</Card>
		);
	}
}
export default UploadNewDataset;
