import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import TIRPsTable from './TIRPsTable';
import RawDataTable from './RawDataTable';

class RawData extends Component {
	render() {
        try{
            if (this.props.history.location.state.table){
                return (
                    <Container fluid>
                        <RawDataTable table={[this.props.history.location.state.table]} path ={this.props.history.location.state.path} discriminative={false}/>
                    </Container>
                );
            }
        }
        catch{

        }
		return (
			<Container fluid>
                <RawDataTable table={JSON.parse(localStorage.rootElement)} discriminative={false}/>
			</Container>
		);
	}
}

export default RawData;
