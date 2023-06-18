import React, { Component } from 'react';
import Cookies from 'js-cookie';

import { Card, Form, Table } from 'react-bootstrap';

class States extends Component {
	state = {
		filters: [],
		keys: [],
	};
	constructor(props) {
		super(props);
		this.textInput = React.createRef();
		this.getStatesKeys();
	}

	getStatesKeys() {
		const tables = JSON.parse(localStorage.States);
		this.state.keys = Object.keys(tables.States[0]);
		this.state.filters = this.state.keys.map((key) => ({ key, value: '' }));
	}

	filter = () => {
		let newFilter = [...this.state.filters];

		for (let key in this.state.keys) {
			let keyName = this.state.keys[key];
			newFilter[key] = {
				...newFilter[key],
				value: document.getElementById(keyName).value,
			};
		}
		this.state.filters = newFilter;

		this.setState((prevState) => ({
			filters: [...prevState.filters],
		}));

		this.forceUpdate();
	};

	componentDidMount() {
		if (!Cookies.get('auth-token')) {
			window.open('#/Login', '_self');
		}
	}

	renderTableHeader = () => {
		return (
			<thead>
				<tr>
					{this.state.keys.map((key, index) => (
						// {window.statesKeys.map((key) => (
						<th key={index} style={{ width: '2%' }}>
							{key}
						</th>
					))}
				</tr>
			</thead>
		);
	};

	renderTableFilter = () => {
		return (
			<thead>
				<tr>
					{this.state.keys.map((key, index) => (
						<th key={index} style={{ width: '2%' }}>
							<Form.Control
								key={index}
								ref={this.textInput}
								id={key}
								onChange={this.filter}
								className={'FontAwesome'}
								placeholder='&#xF002; Filter'
								type={'text'}
							/>
						</th>
					))}
				</tr>
			</thead>
		);
	};

	renderTableData = () => {
		const tables = JSON.parse(localStorage.States);
		return tables.States.map((state, idx) => {
			if (this.check(state)) {
				return (
					<tr key={idx}>
						{this.state.keys.map((key, index) => {
							const numbered = Number.parseFloat(state[key]);

							const numberToDisplay = (num) =>
								Number.isInteger(num) ? num : num.toFixed(2);
							const valueToDisplay = (value) =>
								value === 'inf'
									? '+infinity'
									: value === '-inf'
									? '-infinity'
									: value;

							const displayedValue = isNaN(numbered)
								? valueToDisplay(state[key])
								: numberToDisplay(numbered);

							return <td key={index}>{displayedValue}</td>;
						})}
					</tr>
				);
			} else {
				return null;
			}
		});
	};

	check(iter) {
		for (const key in this.state.keys) {
			if (
				this.state.filters[key].value !== '' &&
				!iter[this.state.keys[key]].includes(this.state.filters[key].value)
			) {
				return false;
			}
		}

		return true;
	}

	render() {
		return (
			<Card>
				<Card.Header className={'bg-hugobot'}>
					<Card.Text className={'h3 text-hugobot '}>States </Card.Text>
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

export default States;
