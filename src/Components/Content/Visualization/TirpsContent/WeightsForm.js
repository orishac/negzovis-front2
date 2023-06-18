import React, { Component } from 'react';
import { Form, Row, Button, Col } from 'react-bootstrap';
import { invalidOperationAlert } from '../../../SweetAlerts';

class WeightsForm extends Component {
	constructor() {
		super();
		this.state = {
			weighted_vs: 34,
			weighted_mhs: 33,
			weighted_mmd: 33,
		};
		this.onSubmit = this.onSubmit.bind(this);
		this.onChange = this.onChange.bind(this);
	}

	onSubmit = (event) => {
		event.preventDefault();
		if (this.state.weighted_vs + this.state.weighted_mhs + this.state.weighted_mmd !== 100) {
			invalidOperationAlert('all inputs must reach total of 100%');
		} else {
			const weightedAsArray = [
				this.state.weighted_vs,
				this.state.weighted_mhs,
				this.state.weighted_mmd,
			];
			this.props.onUpdate(weightedAsArray);
		}
	};

	onChange = (event) => {
		const name = event.target.name;
		const val = Number.parseInt(event.target.value);
		if (Number.isInteger(val)) {
			this.setState({ [name]: val });
		} else {
			invalidOperationAlert('all inputs must be a number');
		}
	};

	render() {
		return (
			<Form onSubmit={this.onSubmit}>
				<Row>
					<Col>
						<Form.Label className={'text-bold-black'}>VS</Form.Label>
						<Form.Control
							type='number'
							name='weighted_vs'
							placeholder='34'
							onChange={this.onChange}
						/>
					</Col>
					<Col>
						<Form.Label className={'text-bold-black fat-label'}>MHS </Form.Label>
						<Form.Control
							type='number'
							name='weighted_mhs'
							placeholder='33'
							onChange={this.onChange}
						/>
					</Col>
					<Col className='ml-3'>
						<Form.Label className={'text-bold-black'}>MMD </Form.Label>
						<Form.Control
							type='number'
							name='weighted_mmd'
							placeholder='33'
							onChange={this.onChange}
						/>
					</Col>
					<Col>
						<Button className={'bg-hugobot fix-margin'} type='submit'>
							Submit
						</Button>
					</Col>
				</Row>
			</Form>
		);
	}
}

export default WeightsForm;
