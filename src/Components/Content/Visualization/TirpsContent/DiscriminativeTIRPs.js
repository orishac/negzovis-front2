import React, { Component } from 'react';
import TirpsTable from './TIRPsTable';
import Container from 'react-bootstrap/Container';

class DiscriminativeTIRPs extends Component {
	render() {
		return (
			<Container fluid>
				<TirpsTable table={JSON.parse(localStorage.rootElement)} discriminative />
			</Container>
		);
	}
}

export default DiscriminativeTIRPs;
