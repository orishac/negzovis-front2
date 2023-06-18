import React, { Component } from 'react';

import { Col, Form, Row } from 'react-bootstrap';

/**
 * this class is tge rapper that contains all the other forms
 */

class FormElement extends Component {
	static defaultProps = {
		as: 'input',
		rows: '1',
		type: 'text',
	};

	render() {
		return (
			<Row>
				<Col md={5}>
					{this.props.name} {this.props.warningText}
					<Form.Control
						id={this.props.name}
						onChange={this.props.onChange}
						rows={this.props.rows}
						type={this.props.type}
						value={this.props.value}
						required={this.props.required ?? false}
						autocomplete='on'
					/>
					<span
						style={{
							fontSize: 18,
							color: 'red',
							fontWeight: 600,
						}}
					>
						{this.props.error}
					</span>
				</Col>
			</Row>
		);
	}
}
export default FormElement;
