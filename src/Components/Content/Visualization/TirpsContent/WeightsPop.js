import React, { Component } from 'react';

import Modal from 'react-bootstrap/Modal';
import WeightsForm from './WeightsForm';

class WeightsPop extends Component {
	state = {
		weighted_vs: 34,
		weighted_mhs: 33,
		weighted_mmd: 33,
	};

	changeWeightsValue2 = (value) => {
		this.setState({
			weighted_vs: value[0],
			weighted_mhs: value[1],
			weighted_mmd: value[2],
		});

		this.props.onUpdate(value);
		this.props.onHide(true);
	};

	render() {
		return (
			<Modal show={this.props.show} onHide={this.props.onHide} centered>
				<Modal.Header className={'bg-hugobot'}>
					<Modal.Title className={'text-hugobot text-hugoob-advanced'}>
						Select Weights
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<WeightsForm onUpdate={this.changeWeightsValue2} />
				</Modal.Body>
			</Modal>
		);
	}
}

export default WeightsPop;
