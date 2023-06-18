import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import TIRPsTable from './TIRPsTable';

class TIRPs extends Component {
	render() {
		return (
			<Container fluid>
				<TIRPsTable table={JSON.parse(localStorage.rootElement)} discriminative={false} />
			</Container>
		);
	}
}

export default TIRPs;
