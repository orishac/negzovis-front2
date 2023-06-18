import React, { Component } from 'react';

import { Card } from 'react-bootstrap';

/**
 * this card contains the size the views and the downloads about a dataset
 */

class StatsCard extends Component {
	render() {
		return (
			<Card>
				<Card.Header className={'h3 bg-hugobot'}>
					<Card.Text className={'text-hugobot'}>
						<i className='fas fa-chart-pie' /> Statistics
					</Card.Text>
				</Card.Header>
				<Card.Body as={'small'}>
					<Card.Text className={'h6 margin-info-down'}>
						<b>Size: </b> {this.props.Size}
					</Card.Text>
					<Card.Text className={'h6 margin-info-down'}>
						<b>Views: </b> {this.props.Views}
					</Card.Text>
					<Card.Text className={'h6 margin-info-down'}>
						<b>Downloads: </b> {this.props.Downloads}
					</Card.Text>
				</Card.Body>
			</Card>
		);
	}
}
export default StatsCard;
