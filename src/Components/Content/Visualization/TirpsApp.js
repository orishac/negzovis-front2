import React, { Component } from 'react';

import TiprsContent from './TirpsContent/TirpsContent';
import TirpsNavigation from './TirpsNavigation';

import { getEntities, getStates, initiateTirps } from '../../../networking/requests/visualization';
import { getVisualizationInfo } from '../../../networking/requests/datasetsStats';

/**
 * root class- every class gets its data from this class
 */
class TirpsApp extends Component {
	state = {
		two_class: false,
		entities: false,
	};
	
	componentDidMount() {
		const visualizationId = sessionStorage.getItem('visualizationId');
		this.initilizeRootScope(visualizationId);
	}

	initilizeRootScope = (visualizationId) => {
		this.getRoot(visualizationId);
		this.getFullEntities(visualizationId);
		this.getFullStates(visualizationId);
		this.getMetaData(visualizationId);
		localStorage.States = [];
		window.pathOfTirps = [];
	};

	// get metadata on dataset
	async getMetaData(id) {
		getVisualizationInfo(id).then((dataSetInfo) => {
			localStorage.min_ver_support = dataSetInfo.min_ver_support;
			localStorage.class_name = dataSetInfo.class_0_name;
			localStorage.second_class_name = dataSetInfo.class_1_name;
			localStorage.timestamp = dataSetInfo.timestamp;
			this.setState({
				two_class: dataSetInfo.two_class,
				entities: dataSetInfo.has_entities,
			});
		});
	}

	//get root for the TIRPs page
	async getRoot(visualizationId) {
		const data = await initiateTirps(visualizationId);

		const arrOfRoot = data.Root;
		let jsons = [];
		for (let i = 0; i < arrOfRoot.length; i++) {
			let tirp = arrOfRoot[i];
			jsons.push(tirp);
		}
		localStorage.rootElement = JSON.stringify(jsons);
	}

	//Entities
	getFullEntities(visualizationId) {
		getEntities(visualizationId).then((data) => {
			let table = JSON.stringify(data);
			localStorage.entities = table;
			this.forceUpdate();
		});
	}

	//States
	getFullStates(visualizationId) {
		getStates(visualizationId).then((data) => {
			let table = JSON.stringify(data);
			localStorage.States = table;
			this.forceUpdate();
		});
	}

	render() {
		return (
			<div className='TirpsApp'>
				<TirpsNavigation entities={this.state.entities} two_class={this.state.two_class} />
				<TiprsContent />
			</div>
		);
	}
}

export default TirpsApp;
