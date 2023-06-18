import React, { Component } from 'react';
// import Chart from "react-google-charts";
import { Card, Table, Button } from 'react-bootstrap';

import { Redirect } from 'react-router-dom';
import { findPathOfTirps } from '../../../../networking/requests/visualization';

class SearchMeanPresentation extends Component {
	state = {
		redirect: false,
		modalShowSymbolPop: false,
		currentRow: [],
	};

	findTirp() {
		const formData = new FormData();
		// window.PassedFromSearch = true;
		localStorage.PassedFromSearch = true;
		formData.append('data_set_name', window.selectedDataSet);
		formData.append('symbols', this.props.symbols.replace('(', ''));
		formData.append('relations', this.props.relations);

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
			return <Redirect to='/TirpsApp/TIRPs' />;
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
								<td>{this.props.currentLevel}</td>
							</tr>
							<tr>
								<th>V.S</th>
								<td>
									{typeof this.props.vs !== 'undefined'
										? this.props.vs.toFixed(2)
										: this.props.vs}
								</td>
							</tr>
							<tr>
								<th>M.H.S</th>
								<td>
									{typeof this.props.mhs !== 'undefined'
										? this.props.mhs.toFixed(2)
										: ''}
								</td>
							</tr>
							<tr>
								<th>M.M.D</th>
								<td>
									{typeof this.props.mmd !== 'undefined'
										? this.props.mmd.toFixed(2)
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

export default SearchMeanPresentation;
