import React, { Component } from 'react';

import { Card, Col, Container, Form, Row } from 'react-bootstrap';

import { getVisualizationInfo } from '../../../../networking/requests/datasetsStats';

/**
 * this class is responsible for uploading and downloading the data about the discretization.
 * if you upload the discretization you can do it by knowledge based or by grdient file or by regular way.
 * it also gets, interpolation gap, paa window size, number of bins and method of dicretization
 */

class DatasetInfo extends Component {
	state = {
		DataSetName: 'name',
		UserName: '',
		ClassName: '',
		ClassEntitiesAmount: '',
		granularity: '',
		Class0Name: '',
		Class0EntitiesAmount: '',
	};
	constructor(props) {
		super(props);
		this.datasetInfo = [];
		const visualizationId = sessionStorage.getItem('visualizationId');

		getVisualizationInfo(visualizationId).then((info) => {
			this.setState({
				DataSetName: info.data_set_name,
				UserName: info.owner,
				ClassName: info.class_1_name,
				ClassEntitiesAmount: info.num_of_entities_class_1,
				granularity: info.timestamp,
				Class0Name: info.class_0_name,
				Class0EntitiesAmount: info.num_of_entities_class_0,
				description: info.description,
			});
			// window.num_of_entities = info.num_of_entities;
			// window.num_of_entities_class_1 = info.num_of_entities_class_1;
			localStorage.num_of_entities = info.num_of_entities_class_0;
			localStorage.num_of_entities_class_1 = info.num_of_entities_class_1;
			this.forceUpdate();
		});
	}

	granularityOptions = ['Years', 'Months', 'Days', 'Hours', 'Minutes', 'Seconds'];

	optionsToRender = this.granularityOptions.map((option) => (
		<option key={option}>{option}</option>
	));

	render() {
		return (
			<Card style={{ width: 'auto' }}>
				<Card.Header className={'bg-hugobot'}>
					<Card.Text className={'h3 text-hugobot'}>DataSet information</Card.Text>
				</Card.Header>
				<Card.Body>
					<Form>
						<Container fluid={true}>
							<Row>
								<Col md={6}>
									<Form.Label className={'h4 font-weight-bold text-dark'}>
										DataSet Name
									</Form.Label>
									<Form.Control
										id={'DataSetName'}
										name={'DataSetName'}
										placeholder={' ' + this.state.DataSetName}
										disabled
									/>
								</Col>
								<Col md={6}>
									<Form.Label className={'h4 font-weight-bold text-dark'}>
										DataSet Owner
									</Form.Label>
									<Form.Control
										id={'UserName'}
										name={'UserName'}
										placeholder={' ' + this.state.UserName}
										disabled
									/>
								</Col>
							</Row>
							<Row>
								<Col md={6}>
									<Form.Label className={'h4 font-weight-bold text-dark'}>
										Class 0 - Name
									</Form.Label>
									<Form.Control
										id={'Class0Name'}
										name={'Class0Name'}
										placeholder={' ' + this.state.Class0Name}
										disabled
									/>
								</Col>
								<Col md={6}>
									<Form.Label className={'h4 font-weight-bold text-dark'}>
										Class 1 - Name
									</Form.Label>
									<Form.Control
										id={'ClassName'}
										name={'ClassName'}
										placeholder={' ' + this.state.ClassName}
										disabled
									/>
								</Col>
							</Row>
							<Row>
								<Col md={6}>
									<Form.Label className={'h4 font-weight-bold text-dark'}>
										Maximal granularity
									</Form.Label>
									<Form.Control
										id={'granularity'}
										name={'granularity'}
										placeholder={' ' + this.state.granularity}
										disabled
									/>
								</Col>
								<Col md={6}>
									<Form.Label className={'h4 font-weight-bold text-dark'}>
										Description
									</Form.Label>
									<Form.Control
										placeholder={' ' + this.state.description}
										disabled
									/>
								</Col>
							</Row>
							<Row>
								<Col md={6}>
									<Form.Label className={'h4 font-weight-bold text-dark'}>
										Number of Entities - {this.state.Class0Name}
									</Form.Label>
									<Form.Control
										id={'Class0EntitiesAmount'}
										name={'Class0EntitiesAmount'}
										placeholder={' ' + this.state.Class0EntitiesAmount}
										disabled
									/>
								</Col>
								<Col md={6}>
									<Form.Label className={'h4 font-weight-bold text-dark'}>
										Number of Entities - {this.state.ClassName}
									</Form.Label>
									<Form.Control
										id={'ClassEntitiesAmount'}
										name={'ClassEntitiesAmount'}
										placeholder={' ' + this.state.ClassEntitiesAmount}
										disabled
									/>
								</Col>
							</Row>
						</Container>
					</Form>
				</Card.Body>
			</Card>
		);
	}
}
export default DatasetInfo;
