import React, { Component } from 'react';
import { Container } from 'react-bootstrap';

import ImportDataset from './ImportDataset';
import UploadNewDataset from './UploadNewDataset';

/**
 * this class is responsible for uploading the dataset file
 */

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
					/>
				) : (
					<ImportDataset
						details={this.state.datasetDetails}
						setDetails={(newDetails) => this.setState({ datasetDetails: newDetails })}
						toUpload={() => this.setState({ mode: UPLOAD })}
					/>
				)}
			</Container>
		);
	}
}
export default UploadScreen;
