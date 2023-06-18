import React, { Component } from 'react';
import Chart from 'react-google-charts';
import { ToggleButtonGroup, ToggleButton, Card, Col, Row } from 'react-bootstrap';

class TIRPsPie extends Component {
	state = {
		pie1_prop: [],
		pie1_propAsArray: [],
		pie0_prop: [],
		pie0_propAsArray: [],
		idxChoosen: 0,
		has_entities: false,
		has_entities_1: false,
	};
	constructor(props) {
		super(props);
		let supporting_entities = this.props.row._TIRP__supporting_entities_properties;
		if (Object.keys(supporting_entities).length > 0) {
			this.state.has_entities = true;
		}
		let supporting_entities1 = this.props.row._TIRP__supporting_entities_properties_class_1;
		if (Object.keys(supporting_entities1).length > 0) {
			this.state.has_entities_1 = true;
		}
		if (this.props.row._TIRP__exist_in_class1) {
			this.state.pie1_prop = this.props.row._TIRP__supporting_entities_properties_class_1;
		}
		if (this.props.row._TIRP__exist_in_class0) {
			this.state.pie0_prop = this.props.row._TIRP__supporting_entities_properties;
		}
	}

	ToggleButtonPie = () => {
		let radios = [];
		if (this.state.has_entities) {
			radios = Object.keys(this.state.pie0_prop); // does not metter is pie0 o pie1
		} else if (this.state.has_entities_1) {
			radios = Object.keys(this.state.pie1_prop);
		} else {
			// no entities propertoes at all
			radios = ['No entities file'];
		}

		return (
			<ToggleButtonGroup defaultValue={0} name='options' style={{ width: '100%' }}>
				{radios.map((radio, idx) => (
					<ToggleButton
						className={'bg-hugobot'}
						key={idx}
						type='radio'
						color='info'
						name='radio'
						value={idx}
						onChange={(e) => this.propertyClicked(radio, idx)}
					>
						{radio}
					</ToggleButton>
				))}
			</ToggleButtonGroup>
		);
	};

	propertyClicked = (propertyName, idx) => {
		this.updatePieValues(propertyName);
		this.state.idxChoosen = idx;
		this.propertyNameChosen = propertyName;
		this.forceUpdate();
	};

	updatePieValues = () => {
		let properyName_0 = Object.keys(this.state.pie0_prop)[this.state.idxChoosen];
		let properyName_1 = Object.keys(this.state.pie1_prop)[this.state.idxChoosen];
		let propertoes_class_0 = this.state.pie0_prop[properyName_0];
		let properties_class_1 = this.state.pie1_prop[properyName_1];

		this.state.pie0_propAsArray = propertoes_class_0 ? Object.entries(propertoes_class_0) : [];
		this.state.pie0_propAsArray = this.state.pie0_propAsArray.sort((entry1, entry2) =>
			entry1[0].localeCompare(entry2[0])
		);
		this.state.pie0_propAsArray = [['Property', 'Value'], ...this.state.pie0_propAsArray];

		this.state.pie1_propAsArray = properties_class_1 ? Object.entries(properties_class_1) : [];
		this.state.pie1_propAsArray = this.state.pie1_propAsArray.sort((entry1, entry2) =>
			entry1[0].localeCompare(entry2[0])
		);
		this.state.pie1_propAsArray = [['Property', 'Value'], ...this.state.pie1_propAsArray];
	};

	drawPie = () => {
		const pie_title0 = localStorage.class_name;
		if (this.props.type_of_comp === 'tirp') {
			return this.renderTirpPie(this.state.pie0_propAsArray, pie_title0, '100%', false);
		} else {
			const pie_title1 = localStorage.second_class_name;
			if (this.state.has_entities || this.state.has_entities_1) {
				// draw pie if the tirp has entities in at least one of the classes
				return this.renderDiscTirpPie(pie_title0, pie_title1);
			}
		}
	};

	renderTirpPie = (data, pie_title, width) => {
		return (
			<Chart
				width={width}
				height={'200px'}
				chartType='PieChart'
				loader={<div>Loading Chart</div>}
				data={data}
				options={{
					title: pie_title,
					titleTextStyle: {
						fontSize: 20,
						bold: true,
						italic: false,
					},
				}}
			/>
		);
	};

	renderDiscTirpPie = (pie_title0, pie_title1) => {
		return (
			<Row>
				<Col sm={3} style={{ marginRight: '20%' }}>
					{this.state.has_entities &&
						this.renderTirpPie(this.state.pie0_propAsArray, pie_title0, '350px', false)}
				</Col>

				<Col sm={3} style={{ zIndex: '0' }}>
					{this.state.has_entities_1 &&
						this.renderTirpPie(this.state.pie1_propAsArray, pie_title1, '350px', true)}
				</Col>
			</Row>
		);
	};

	// getEntitieskeys() {
	// 	let tables;
	// 	try {
	// 		tables = JSON.parse(localStorage.entities);
	// 	} catch {
	// 		tables = { Entities: {} };
	// 	}
	// 	let keys = [];
	// 	let entities = tables.Entities;
	// 	keys = Object.keys(entities);
	// 	if (keys.length === 0) {
	// 		keys.push('No entities file');
	// 	} else {
	// 		keys.shift();
	// 	}
	// 	return keys;
	// }

	render() {
		this.state.pie0_prop = this.props.row._TIRP__supporting_entities_properties;
		this.state.pie1_prop = this.props.row._TIRP__supporting_entities_properties_class_1;
		if (Object.keys(this.props.row._TIRP__supporting_entities_properties).length > 0) {
			this.state.has_entities = true;
		} else {
			this.state.has_entities = false;
		}
		if (Object.keys(this.props.row._TIRP__supporting_entities_properties_class_1).length > 0) {
			this.state.has_entities_1 = true;
		} else {
			this.state.has_entities_1 = false;
		}
		this.updatePieValues();

		// let that = this;
		window.addEventListener('ReloadTirpTable', function () {
			this.forceUpdate();
		});
		return (
			<div>
				<Card>
					<Card.Header className={'bg-hugobot'}>
						<Card.Text className={'text-hugobot text-hugoob-advanced'}>
							Properties Distribution
						</Card.Text>
					</Card.Header>
					<Card.Body>
						{this.ToggleButtonPie()}
						{this.drawPie()}
					</Card.Body>
				</Card>
			</div>
		);
	}
}

export default TIRPsPie;
