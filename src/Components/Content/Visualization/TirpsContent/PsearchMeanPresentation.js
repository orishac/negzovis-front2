import React, { Component } from 'react';
// import Chart from "react-google-charts";
import { Card, Table, Button } from 'react-bootstrap';

import { Redirect } from 'react-router-dom';

import { findPathOfTirps } from '../../../../networking/requests/visualization';

class PSearchMeanPresentation extends Component {
	state = {
		redirect: false,
	};

	findTirp() {
		localStorage.PassedFromSearch = true;
		const visualizationId = sessionStorage.getItem('visualizationId');
		findPathOfTirps(
			this.props.symbols.replace('(', ''),
			this.props.relations,
			visualizationId
		).then((data) => {
			let results = data['Path'];
			let path = [];
			for (let i = 0; i < results.length; i++) {
				let tirp = JSON.parse(results[i]);
				path.push(tirp);
			}
			window.pathOfTirps = path;
			this.state.redirect = true;
			this.forceUpdate();
		});
	}

	render() {
		let that = this;
		window.addEventListener('ReloadTirpTable', function () {
			that.forceUpdate();
		});
		const { redirect } = this.state;
		if (redirect) {
			return <Redirect to='/TirpsApp/DiscriminativeTIRPs' />;
		}
		return (
			<Card className='presentation-card'>
				<Card.Header className={'bg-hugobot'}>
					<Card.Text className={'text-hugobot text-hugoob-advanced'}>
						Selected TIRP info
					</Card.Text>
				</Card.Header>
				<Card.Body className={'text-hugobot'}>
					<div className='vertical-scroll vertical-scroll-advanced'>
						<Table responsive={true} striped={true} bordered={true}>
							<thead>
								<tr>
									<th>Metric</th>
									<th>{localStorage.class_name}</th>
									<th>{localStorage.second_class_name}</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<th>Current Level</th>
									<td>{this.props.currentLevel}</td>
									<td>{this.props.currentLevel}</td>
								</tr>
								<tr>
									<th>V.S</th>
									<td>
										{this.props.vs1
											? parseFloat(this.props.vs1).toFixed(2)
											: ''}
									</td>
									<td>
										{this.props.vs0
											? parseFloat(this.props.vs0).toFixed(2)
											: ''}
									</td>
								</tr>
								<tr>
									<th>M.H.S</th>
									<td>
										{this.props.mhs1
											? parseFloat(this.props.mhs1).toFixed(2)
											: ''}
									</td>
									<td>
										{this.props.mhs0
											? parseFloat(this.props.mhs0).toFixed(2)
											: ''}
									</td>
								</tr>
								<tr>
									<th>M.M.D</th>
									<td>
										{this.props.mmd1
											? parseFloat(this.props.mmd1).toFixed(2)
											: ''}
									</td>
									<td>
										{this.props.mmd0
											? parseFloat(this.props.mmd0).toFixed(2)
											: ''}
									</td>
								</tr>
							</tbody>
						</Table>
					</div>
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

export default PSearchMeanPresentation;
