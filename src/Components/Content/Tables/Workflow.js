import React, { Component } from 'react';

import { Link } from 'react-router-dom';

/**
 * this the sub-main workflow of the site.
 * it contains the time interval minings page, the info page,
 * the discretization page and the visualization page
 */

class Workflow extends Component {
	constructor(props) {
		super(props);
		sessionStorage.setItem('Workflow', 'Info');
	}

	changeTab = (e) => {
		sessionStorage.setItem('Workflow', e.target.id);
		this.forceUpdate();
	};

	render() {
		return (
			<div className='karma-nav-bar'>
				<div className='workflow-container'>
					<div className='flex-fill'>
						<Link
							className={
								sessionStorage.getItem('Workflow').localeCompare('Info') === 0
									? 'btn btn-workflow-active btn-arrow-right'
									: 'btn btn-workflow btn-arrow-right'
							}
							id={'Info'}
							onClick={this.changeTab}
							to={`/Process/${this.props.discretizationId}/Info`}
						>
							{this.props.datasetName} Info
						</Link>
					</div>
					<div className='flex-fill'>
						<Link
							className={
								sessionStorage.getItem('Workflow').localeCompare('Disc') === 0
									? 'btn btn-workflow-active btn-arrow-right'
									: 'btn btn-workflow btn-arrow-right'
							}
							id={'Disc'}
							onClick={this.changeTab}
							to={`/Process/${this.props.discretizationId}/Disc`}
						>
							Temporal Abstraction
						</Link>
					</div>
					<div className='flex-fill'>
						<Link
							className={
								sessionStorage.getItem('Workflow').localeCompare('TIM') === 0
									? 'btn btn-workflow-active btn-arrow-right'
									: 'btn btn-workflow btn-arrow-right'
							}
							id={'TIM'}
							onClick={this.changeTab}
							to={`/Process/${this.props.discretizationId}/TIM`}
						>
							Time Intervals Mining
						</Link>
					</div>
					<div className='flex-fill'>
						<Link
							className={
								sessionStorage.getItem('Workflow').localeCompare('Visual') === 0
									? 'btn btn-workflow-active btn-arrow-right'
									: 'btn btn-workflow btn-arrow-right'
							}
							id={'Visual'}
							onClick={this.changeTab}
							to={`/Process/${this.props.discretizationId}/Visualization`}
						>
							Visualization
						</Link>
					</div>
				</div>
			</div>
		);
	}
}
export default Workflow;
