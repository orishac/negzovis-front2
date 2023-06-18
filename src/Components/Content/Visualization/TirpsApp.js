import React, { Component } from 'react';

import TiprsContent from './TirpsContent/TirpsContent';
import TirpsNavigation from './TirpsNavigation';

import { getEntities, getStates, initiateTirps, getVMapFile } from '../../../networking/requests/visualization';
import { getVisualizationInfo } from '../../../networking/requests/datasetsStats';

/**
 * root class- every class gets its data from this class
 */
class TirpsApp extends Component {
	state = {
		two_class: false,
		entities: false,
		negative: false,
	};
	
	componentDidMount() {
		const visualizationId = sessionStorage.getItem('visualizationId');
		this.initilizeRootScope(visualizationId);
	}

	initilizeRootScope = (visualizationId) => {
		this.getRoot(visualizationId);
		this.getFullEntities(visualizationId);
		if (localStorage.negative === 'false') {
			this.getFullStates(visualizationId);
		}
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

		let negative = true;
		const stringied = JSON.parse(JSON.stringify(data));
		console.log(typeof stringied)
		if (stringied.hasOwnProperty('Root')) {
			negative = false
		}
		const VMAPFile = await getVMapFile(visualizationId)

		if (negative) {
			localStorage.rootElement = JSON.stringify(data);
			localStorage.negative = 'true'
			this.setState({
				negative: 'true'
			});
			localStorage.VMapFile = JSON.stringify(VMAPFile)
		}
		else {
			this.setState({
				negative: 'false'
			});
			const arrOfRoot = data.Root;
			let jsons = [];
			for (let i = 0; i < arrOfRoot.length; i++) {
				let tirp = arrOfRoot[i];
				jsons.push(tirp);
			}
			localStorage.rootElement = JSON.stringify(jsons);
			localStorage.negative = 'false'
		}
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
			console.log(data)
			let table = JSON.stringify(data);
			localStorage.States = table;
			this.forceUpdate();
		});
	}

	render() {
		return (
			<div className='TirpsApp'>
				<TirpsNavigation entities={this.state.entities} two_class={this.state.two_class} negative={this.state.negative} />
				<TiprsContent />
			</div>
		);
	}
}

export default TirpsApp;
