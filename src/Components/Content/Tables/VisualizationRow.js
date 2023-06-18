import React, { Component } from 'react';
import { Tooltip } from 'react-bootstrap';
import { getVisualizationDetails } from '../../../networking/requests/datasetsStats';
import { deleteVisualization } from '../../../networking/requests/visualization';
import { errorAlert, irreversibleOperationAlert, successAlert } from '../../SweetAlerts';

import MyToolTip from '../../MyToolTip';

class VisualizationRow extends Component {
	constructor(props) {
		super(props);
		this.state = {
			details: null,
			showDetails: false,
		};
	}

	componentDidMount() {
		if (!this.props.visualization['imported']) {
			getVisualizationDetails(this.props.visualization['id']).then((data) =>
				this.setState({ details: data })
			);
		}
	}

	renderTooltip = (props) => {
		delete props.show;
		return (
			<Tooltip {...props}>
				This dataset was manually imported by a user and may not work as expected
			</Tooltip>
		);
	};
	renderDetails() {
		const discretization = this.state.details.discretization;
		const karmalego = this.state.details.karmalego;
		const Property = ({ name, value }) => (
			<p>
				<strong>{name}</strong>: {value}
			</p>
		);
		return (
			<>
				<tr className='visualization-details-row'>
					<td colSpan={1}>
						<Property name={'Method'} value={discretization.method} />
						<Property name={'PAA'} value={discretization.paa} />
						<Property name={'No. of Bins'} value={discretization.number_of_bins} />
						<Property name={'Interpolation'} value={discretization.interpolation_gap} />
					</td>
					<td colSpan={2}>
						<Property
							name={'Min. Vertical Support (%)'}
							value={karmalego.min_ver_support * 100}
						/>
						<Property name={'Max Gap'} value={karmalego.max_gap} />
						<Property name={'No. of Relations'} value={karmalego.num_relations} />
						<Property name={'Epsilon'} value={karmalego.epsilon} />
						<Property name={'Max TIRP Length'} value={karmalego.max_tirp_length} />
						<Property name={'Index Same'} value={String(karmalego.index_same)} />
					</td>
				</tr>
			</>
		);
	}

	render() {
		const imported = this.props.visualization['imported'];
		return (
			<>
				<tr
					onClick={() => {
						if (this.props.visualization['success']) {
							sessionStorage.setItem('Workflow', 'Info');
							this.props.StartVisualization(
								this.props.visualization['data_set_name'],
								this.props.visualization['id']
							);
						}
					}}
				>
					<td>
						<div className='more-btn-container mr-2'>
							<i
								className='fas fa-trash more-btn'
								onClick={(e) => {
									irreversibleOperationAlert(
										`Are you sure you want to delete visualization for "${this.props.visualization['data_set_name']}"?`,
										'Yes, delete',
										'No, cancel'
									).then((result) => {
										if (result.isConfirmed) {
											deleteVisualization(this.props.visualization['id'])
												.then(() =>
													this.props.removeVisualization(
														this.props.visualization['id']
													)
												)
												.then(() => {
													successAlert(
														'Deleted',
														`The visualization for "${this.props.visualization['data_set_name']}" was deleted successfully`
													);
												})
												.catch(errorAlert);
										}
									});
									e.stopPropagation();
								}}
							/>
						</div>
						<div className='more-btn-container mr-2'>
							<i
								className={`fas fa-chevron-circle-${
									this.state.showDetails ? 'up' : 'down'
								} more-btn`}
								style={imported ? { color: 'transparent' } : {}}
								onClick={
									imported
										? null
										: (e) => {
												this.setState({
													showDetails: !this.state.showDetails,
												});
												e.stopPropagation();
										  }
								}
							/>
						</div>
						{this.props.visualization['data_set_name']}
						{this.props.visualization['success'] || '- failed to create'}
						{this.props.visualization['imported'] && (
							<MyToolTip
								icon={'fa-exclamation-circle'}
								tip={
									'This dataset was manually imported by a user and may not work as expected'
								}
							/>
						)}
					</td>
					<td>{this.props.visualization['category']}</td>
					<td>{this.props.visualization['owner']}</td>
				</tr>
				{this.state.details && this.state.showDetails && this.renderDetails()}
			</>
		);
	}
}

export default VisualizationRow;
