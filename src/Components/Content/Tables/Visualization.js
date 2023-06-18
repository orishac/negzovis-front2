import React, { Component } from 'react';

import { Button, Col, Card, Table } from 'react-bootstrap';

import { visualize } from '../../../networking/requests/preprocessing';
import { errorAlert, notifyAlert, successAlert } from '../../SweetAlerts';

class Visualization extends Component {
	constructor(props) {
		super(props);
		this.data = this.getVisualizationData();
		this.state = {
			kl_id: null,
		};
	}

	getVisualizationData() {
		return this.props.TIMTable.filter(
			(iter) => iter.status.finished && iter.status.success
		).map((iter) => ({
			dataset_name: this.props.datasetName,
			interpolation_method:
				iter['PAAWindowSize'] +
				'-' +
				iter['BinsNumber'] +
				'-' +
				iter.InterpolationGap +
				'-' +
				iter['MethodOfDiscretization'],
			mvs: iter['VerticalSupport'] * 100,
			max_tirp_length: iter['maxTirpLength'],
			kl_id: iter['karma_id'],
		}));
	}

	handleVisualRequest = () => {
		notifyAlert(
			'Visualization is running, When the operation is complete, you will receive an email notification',
			'Visualization'
		);
		visualize(this.state.kl_id)
			.then(() =>
				successAlert('New Visualization!', 'Your requested visualization is ready!')
			)
			.catch(errorAlert);
	};

	render() {
		return (
			<div>
				<Card style={{ width: 'auto' }}>
					<Card.Header className={'bg-hugobot'}>
						<Card.Text className={'text-hugobot text-hugoob-advanced'}>
							Datasets ready for visualization
						</Card.Text>
					</Card.Header>
					<Card.Body className={'text-hugobot'}>
						<div className='vertical-scroll-tirp'>
							<Table striped={true} bordered={true} hover={true}>
								<thead>
									<tr>
										<th>Dataset Name</th>
										<th>Interpolation Method</th>
										<th>Min Vertical Support</th>
										<th>Max TIRP Length</th>
									</tr>
								</thead>
								<tbody>
									{this.data.map((visualization, index) => {
										const selected = this.state.kl_id === visualization.kl_id;
										return (
											<tr
												key={index}
												onClick={() =>
													this.setState({
														kl_id: selected
															? null
															: visualization.kl_id,
													})
												}
												style={
													selected ? { backgroundColor: '#AED6F1' } : {}
												}
											>
												<td>{visualization.dataset_name}</td>
												<td>{visualization.interpolation_method}</td>
												<td>{visualization.mvs}</td>
												<td>{visualization.max_tirp_length}</td>
											</tr>
										);
									})}
								</tbody>
							</Table>
						</div>
					</Card.Body>
				</Card>

				<Col md={12}>
					<Button
						disabled={this.state.kl_id === null}
						block={true}
						className={'bg-hugobot'}
						onClick={this.handleVisualRequest}
						type={'submit'}
						size='lg'
					>
						Visualize TIM
					</Button>
				</Col>
			</div>
		);
	}
}
export default Visualization;
