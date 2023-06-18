import React, { Component } from 'react';
// import Chart from "react-google-charts";
import { Card, Table, Button } from 'react-bootstrap';

import { Redirect } from 'react-router-dom';

class NSearchMeanPresentation extends Component {
	state = {
		redirect: false,
		modalShowSymbolPop: false,
		currentRow: [],
	};

	findTirp() {
		window.pathOfTirps = this.props.tirp;
		this.state.redirect = true;
		this.forceUpdate();
	}

	setModalShowSymbolPop(value) {
		this.state.modalShowSymbolPop = value;
		this.forceUpdate();
	}

	render() {
		let that = this;
		window.addEventListener('ReloadTirpTable', function () {
			that.forceUpdate();
		});
		const { redirect } = this.state;
		if (redirect) {
			return <Redirect to='/TirpsApp/NegativeTirps' />;
		}
		return (
			<Card className='presentation-card'>
				<Card.Header className={'bg-hugobot'}>
					<Card.Text className={'text-hugobot text-hugoob-advanced'}>
						Selected TIRP info
					</Card.Text>
				</Card.Header>
				<Card.Body className={'text-hugobot'}>
					<Table responsive={true} striped={true} bordered={true}>
						<thead>
							<tr>
								<th>Metric</th>
								<th>Value</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<th>Total Levels</th>
								<td>{this.props.tirp.elements.flat().length}</td>
							</tr>
							<tr>
								<th>V.S</th>
								<td>
									{typeof this.props.tirp['support'] !== 'undefined'
										? this.props.tirp['support'].toFixed(2)
										: this.props.vs}
								</td>
							</tr>
							<tr>
								<th>M.H.S</th>
								<td>
									{typeof this.props.tirp['mean horizontal support'] !== 'undefined'
										? this.props.tirp['mean horizontal support'].toFixed(2)
										: ''}
								</td>
							</tr>
							<tr>
								<th>M.M.D</th>
								<td>
									{typeof this.props.tirp['mean mean duration'] !== 'undefined'
										? this.props.tirp['mean mean duration'].toFixed(2)
										: ''}
								</td>
							</tr>
						</tbody>
					</Table>
					<Button
						className='btn btn-primary'
						style={{ width: '100%' }}
						variant='primary'
						onClick={() => this.findTirp()}
						disabled={!this.props.canExplore}
					>
						Explore TIRP
					</Button>
				</Card.Body>
			</Card>
		);
	}
}

export default NSearchMeanPresentation;
