import React, { Component } from 'react';
import { Card, Table } from 'react-bootstrap';

class SelectedTIRPTable extends Component {
	state = {
		currentRow: this.props.table,
	};

	renderSelectedTirp = () => {
		if (this.props.table._TIRP__symbols !== this.state.currentRow._TIRP__symbols) {
			this.state.currentRow = this.props.table;
		}
		let iter = this.state.currentRow;
		if (this.props.type_of_comp === 'tirp') {
			return this.renderTirpTable(iter);
		} else {
			return this.renderDiscTirpTable(iter);
		}
	};

	renderTirpTable = (iter) => {
		return (
			<>
				<thead>
					<tr>
						<th style={{ textAlign: 'left' }}>Metric</th>
						<th>Value</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th style={{ textAlign: 'left' }}>Current level</th>
						<td>{iter['_TIRP__tirp_size']}</td>
					</tr>
					<tr>
						<th style={{ textAlign: 'left' }}>Vertical support</th>
						<td>
							{(
								(iter['_TIRP__vertical_support'] /
									// window.window.num_of_entities) *
									parseInt(localStorage.num_of_entities)) *
								100
							).toFixed(1)}
							%
						</td>
					</tr>
					<tr>
						<th>Mean horizontal_support</th>
						<td>{iter['_TIRP__mean_horizontal_support'].toFixed(2)}</td>
					</tr>
					<tr>
						<th style={{ textAlign: 'left' }}>Mean mean duration</th>
						<td>{iter['_TIRP__mean_duration'].toFixed(2)}</td>
					</tr>
					<tr>
						<th style={{ textAlign: 'left' }}>Entities</th>
						<td>{iter['_TIRP__vertical_support']}</td>
					</tr>
				</tbody>
			</>
		);
	};

	renderDiscTirpTable = (iter) => {
		return (
			<>
				<thead>
					<tr>
						<th>Metric</th>
						<th>{localStorage.class_name}</th>
						<th>{localStorage.second_class_name}</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th>Current level</th>
						<td>{iter['_TIRP__tirp_size']}</td>
						<td>{iter['_TIRP__tirp_size']}</td>
					</tr>
					<tr>
						<th>Vertical support</th>
						<td>
							{(
								(iter['_TIRP__vertical_support'] /
									// window.window.num_of_entities) *
									parseInt(localStorage.num_of_entities)) *
								100
							).toFixed(1)}
							%
						</td>
						<td>
							{(
								(iter['_TIRP__vertical_support_class_1'] /
									// window.window.num_of_entities_class_1) *
									parseInt(localStorage.num_of_entities)) *
								100
							).toFixed(2)}
							%
						</td>
					</tr>
					<tr>
						<th>Mean horizontal_support</th>
						<td>{iter['_TIRP__mean_horizontal_support'].toFixed(2)}</td>
						<td>{iter['_TIRP__mean_horizontal_support_class_1'].toFixed(2)}</td>
					</tr>
					<tr>
						<th>Mean mean duration</th>
						<td>{iter['_TIRP__mean_duration'].toFixed(2)}</td>
						<td>{iter['_TIRP__mean_duration_class_1'].toFixed(2)}</td>
					</tr>
					<tr>
						<th>Entities</th>
						<td>{iter['_TIRP__vertical_support']}</td>
						<td>{iter['_TIRP__vertical_support_class_1']}</td>
					</tr>
				</tbody>
			</>
		);
	};

	buttonMatrixDisabled = () => {
		if (this.state.currentRow['_TIRP__tirp_size'] < 2) {
			return true;
		}
		return false;
	};

	render() {
		let that = this;
		window.addEventListener('ReloadTirpTable', function () {
			that.forceUpdate();
		});
		return (
			<Card>
				<Card.Header className={'bg-hugobot'}>
					<Card.Text className={'text-hugobot text-hugoob-advanced'}>
						Selected TIRP info
					</Card.Text>
				</Card.Header>
				<Card.Body className={'text-hugobot'}>
					<div className='vertical-scroll vertical-scroll-advanced'>
						<Table responsive={true} striped={true} bordered={true}>
							{this.renderSelectedTirp()}
						</Table>
					</div>
				</Card.Body>
			</Card>
		);
	}
}
export default SelectedTIRPTable;
