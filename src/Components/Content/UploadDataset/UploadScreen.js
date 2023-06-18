import React, { Component } from 'react';
import { Container } from 'react-bootstrap';

import ImportDataset from './ImportDataset';
import UploadNewDataset from './UploadNewDataset';
import UploadSequentialDataset from './UploadSequentialDataset';

/**
 * this class is responsible for uploading the dataset file
 */

const SEQUENTIAL = 2;
const IMPORT = 1;
const UPLOAD = 0;

class UploadScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			datasetDetails: {
				datasetName: '',
				category: 'Medical',
				publicPrivate: 'Public',
				description: '',
				datasetSource: '',
				rawDataUuid: undefined,
				vmapUuid: undefined,
				entitiesUuid: undefined,
				zipUuid: undefined,
			},
			mode: UPLOAD,
		};
	}

	render() {
		return (
			<Container fluid={true}>
				{this.state.mode === UPLOAD ? (
					<UploadNewDataset
						details={this.state.datasetDetails}
						setDetails={(newDetails) => this.setState({ datasetDetails: newDetails })}
						toImport={() => this.setState({ mode: IMPORT })}
						toSequential={() => this.setState({ mode: SEQUENTIAL })}
					/>
				) : this.state.mode === IMPORT ? (
					<ImportDataset
						details={this.state.datasetDetails}
						setDetails={(newDetails) => this.setState({ datasetDetails: newDetails })}
						toUpload={() => this.setState({ mode: UPLOAD })}
						toSequential={() => this.setState({ mode: SEQUENTIAL })}
					/>
				) : (
					<UploadSequentialDataset
						details={this.state.datasetDetails}
						setDetails={(newDetails) => this.setState({ datasetDetails: newDetails })}
						toUpload={() => this.setState({ mode: UPLOAD })}
						toImport={() => this.setState({ mode: IMPORT })}
					/>
				)}
			</Container>
		);
	}
}
export default UploadScreen;
