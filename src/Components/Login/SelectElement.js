import React, { Component } from 'react';

import { Col, Row } from 'react-bootstrap';

/**
 * this class raps all the classes of the select elements
 */

class SelectElement extends Component {
	static defaultProps = {
		options: ['select'],
	};

	optionsConst = this.props.options;
	optionsToRender = this.optionsConst.map((option) => <option key={option}>{option}</option>);

	render() {
		return (
			<Row>
				<Col md={5}>
					{this.props.name}
					<select
						id={this.props.name}
						className={'form-control'}
						onChange={this.props.onChange}
						{...(this.props.value ? { value: this.props.value } : {})}
					>
						{this.optionsToRender}
					</select>
				</Col>
				<Col md={7}>{/*feedback*/}</Col>
			</Row>
		);
	}
}
export default SelectElement;
