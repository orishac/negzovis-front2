import React, { Component } from 'react';
import Cookies from 'js-cookie';

import { Card, Form, Table } from 'react-bootstrap';

import { getEntities } from '../../../../networking/requests/visualization';

/**
 * this class contains the display of the the table from table content
 */

class Entities extends Component {
	state = {
		filters: {},
		keys: [],
		entities: [],
	};

	constructor(props) {
		super(props);
		this.textInput = React.createRef();
	}

	componentDidMount() {
		if (!Cookies.get('auth-token')) {
			window.open('#/Login', '_self');
		}
		const visualizationId = sessionStorage.getItem('visualizationId');
		getEntities(visualizationId).then((data) => {
			this.getEntitiesKeys(data);
		});
	}

	getEntitiesKeys(tables) {
		const entities = tables.Entities;
		let filters = {};
		let keys = [];
		if (entities.length > 0) {
			const firstEntity = entities[0];
			keys = Object.keys(firstEntity);

			keys.forEach((key) => {
				filters[key] = '';
			});
		}

		this.setState({ keys, filters, entities });
	}

	filter = (key, value) => {
		this.setState((prevState) => ({ filters: { ...prevState.filters, [key]: value } }));
	};

	renderTableHeader = () => {
		return (
			<thead>
				<tr>
					{this.state.keys.map((key, idx) => (
						<th key={idx}>{key}</th>
					))}
				</tr>
			</thead>
		);
	};

	renderTableFilter = () => {
		return (
			<thead>
				<tr>
					{this.state.keys.map((key, idx) => (
						<th key={idx}>
							<Form.Control
								ref={this.textInput}
								onChange={(e) => this.filter(key, e.target.value)}
								placeholder='&#xF002; Filter'
								className={'FontAwesome'}
								type={'text'}
							/>
						</th>
					))}
				</tr>
			</thead>
		);
	};

	renderTableData = () => {
		return this.state.entities.map((iter, idx) => {
			const check = this.check(iter);
			if (check) {
				return (
					<tr key={idx}>
						{this.state.keys.map((key, idx) => (
							<td key={idx}>{iter[key]}</td>
						))}
					</tr>
				);
			} else {
				return null;
			}
		});
	};

	check(iter) {
		for (const key of this.state.keys) {
			const currFilter = this.state.filters[key];
			if (!iter[key].includes(currFilter)) {
				return false;
			}
		}
		return true;
	}

	render() {
		return (
			<Card>
				<Card.Header className={'bg-hugobot'}>
					<Card.Text className={'h3 text-hugobot'}>Entities</Card.Text>
				</Card.Header>
				<Card.Body>
					<div className='vertical-scroll-entities-state vertical-scroll-advanced'>
						<Table striped={true} bordered={true} hover={true}>
							{this.renderTableHeader()}

							{this.renderTableFilter()}
							<tbody>{this.renderTableData()}</tbody>
						</Table>
					</div>
				</Card.Body>
			</Card>
		);
	}
}

export default Entities;
