import React, { Component } from 'react';
import Chart from 'react-google-charts';
import { ToggleButtonGroup, ToggleButton, Card } from 'react-bootstrap';

const METRICS = {
	VS: 0,
	MHS: 1,
	MMD: 2,
};
class DTirpBarPlot extends Component {
	state = {
		selectedMetric: METRICS.VS,
	};

	ToggleButtonBar = () => {
		const metricsNames = ['VS', 'MHS', 'MMD'];
		const myStyle = {
			width: '100%',
			marginBottom: '3%',
		};
		return (
			<ToggleButtonGroup value={this.state.selectedMetric} name='options' style={myStyle}>
				{metricsNames.map((metricName, idx) => (
					<ToggleButton
						className={'bg-hugobot'}
						key={idx}
						type='radio'
						color='info'
						name='radio'
						value={idx}
						onChange={() =>
							this.setState({
								selectedMetric: idx,
							})
						}
					>
						{metricName}
					</ToggleButton>
				))}
			</ToggleButtonGroup>
		);
	};

	calculateData() {
		let currTirp = this.props.row;
		let labelClass0 = localStorage.class_name !== '' ? localStorage.class_name : 'Class 0';
		let labelClass1 =
			localStorage.second_class_name !== '' ? localStorage.second_class_name : 'Class 1';

		if (this.state.selectedMetric === METRICS.MHS) {
			const MHS0 = currTirp._TIRP__mean_horizontal_support;
			const MHS1 = currTirp._TIRP__mean_horizontal_support_class_1;
			const LOW1 = currTirp._TIRP__hs_confidence_interval_low_class_1;
			const HIGH1 = currTirp._TIRP__hs_confidence_interval_high_class_1;
			const LOW0 = currTirp._TIRP__hs_confidence_interval_low_class_0;
			const HIGH0 = currTirp._TIRP__hs_confidence_interval_high_class_0;

			return [
				['Class', '', '', '', ''],
				[labelClass0, LOW0, MHS0, MHS0, HIGH0],
				[labelClass1, LOW1, MHS1, MHS1, HIGH1],
			];
		} else if (this.state.selectedMetric === METRICS.MMD) {
			const MMD0 = currTirp._TIRP__mean_duration;
			const MMD1 = currTirp._TIRP__mean_duration_class_1;
			const LOW1 = currTirp._TIRP__md_confidence_interval_low_class_1;
			const HIGH1 = currTirp._TIRP__md_confidence_interval_high_class_1;
			const LOW0 = currTirp._TIRP__md_confidence_interval_low_class_0;
			const HIGH0 = currTirp._TIRP__md_confidence_interval_high_class_0;

			return [
				['Class', '', '', '', ''],
				[labelClass0, LOW0, MMD0, MMD0, HIGH0],
				[labelClass1, LOW1, MMD1, MMD1, HIGH1],
			];
		} else {
			let VS0 =
				(currTirp._TIRP__vertical_support / parseInt(localStorage.num_of_entities)) * 100;
			let VS1 =
				(currTirp._TIRP__vertical_support_class_1 /
					parseInt(localStorage.num_of_entities_class_1)) *
				100;
			return [
				['', labelClass0, labelClass1],
				['Vertical Support', VS0, VS1],
			];
		}
	}

	VSChart() {
		const options = {
			position: 'top',
			vAxis: {
				minValue: 0,
				maxValue: 100,
			},
		};

		return (
			<Chart
				height={'200px'}
				chartType={'ColumnChart'}
				loader={<div>Loading Chart</div>}
				data={this.calculateData()}
				options={options}
			/>
		);
	}

	ConfidenceChart() {
		return (
			<Chart
				height={'200px'}
				chartType={'CandlestickChart'}
				loader={<div>Loading Chart</div>}
				data={this.calculateData()}
				options={{}}
			/>
		);
	}

	render() {
		return (
			<div>
				<Card>
					<Card.Header className={'bg-hugobot'}>
						<Card.Text className={'text-hugobot text-hugoob-advanced'}>
							Population Comparison
						</Card.Text>
					</Card.Header>
					<Card.Body>
						{this.ToggleButtonBar()}
						{this.state.selectedMetric === METRICS.VS
							? this.VSChart()
							: this.ConfidenceChart()}
					</Card.Body>
				</Card>
			</div>
		);
	}
}

export default DTirpBarPlot;
