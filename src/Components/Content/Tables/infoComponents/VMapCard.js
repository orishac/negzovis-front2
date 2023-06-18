import React, { Component } from 'react';

import { Card, Table } from 'react-bootstrap';

/**
 * this class contains the variable map card.
 * it has 3 columns- variable id, variable name and variable description.
 */

class VMapCard extends Component {
	constructor(props) {
		super(props);
		this.renderTableData = this.renderTableData.bind(this);
	}

	renderTableHeader = () => {
		return (
			<thead>
				<tr>
					<td className={'h6 font-weight-bold'}>Variable ID</td>
					<td className={'h6 font-weight-bold'}>Variable Name</td>
					<td className={'h6 font-weight-bold'}>Description</td>
				</tr>
			</thead>
		);
	};

	renderTableData = () => {
		return this.props.VMap.slice(1).map((iter, idx) => {
			return (
				<tr key={idx.toString()}>
					<td id={'tdVariableID' + idx}>{iter[0]}</td>
					<td id={'tdVariableName' + idx}>{iter[1]}</td>
					<td id={'tdVariableDescription' + idx}>{iter[2]}</td>
				</tr>
			);
		});
	};

	render() {
		return (
			<Card style={{ width: '100%' }}>
				<Card.Header className={'bg-hugobot'}>
					<Card.Text className={'h3 text-hugobot'}>
						<i className='fas fa-info' /> Variables Information
					</Card.Text>
				</Card.Header>
				<Card.Body as={'small'}>
					<Table striped hover bordered>
						{this.renderTableHeader()}
						<tbody>{this.renderTableData()}</tbody>
					</Table>
				</Card.Body>
			</Card>
		);
	}
}
export default VMapCard;
