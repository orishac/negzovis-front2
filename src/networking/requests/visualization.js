import { post } from '../request';

export function deleteVisualization(visualizationId) {
	const params = { visualization: visualizationId };
	return post('deleteVisualization', params);
}

export function initiateTirps(visualizationId) {
	const params = { visualization: visualizationId };
	return post('initiateTirps', params);
}

export function getEntities(visualizationId) {
	const params = { visualization: visualizationId };
	return post('getEntities', params);
}

export function getVMapFile(visualizationId) {
	const params = { visualization: visualizationId };
	return post('getVMapFileFromVisualization', params);
}


export function getStates(visualizationId) {
	const params = { visualization: visualizationId };
	return post('getStates', params);
}

export function getSubTree(TIRP, visualizationId) {
	const params = { TIRP, visualization: visualizationId };
	return post('getSubTree', params);
}

export function findPathOfTirps(symbols, relations, visualizationId) {
	const params = { symbols, relations, visualization: visualizationId };
	return post('find_Path_of_tirps', params);
}

export function searchTirps2Class(
	search_in_class_1,
	startsList,
	containList,
	endsList,
	minHS0,
	maxHS0,
	minVS0,
	maxVS0,
	minHS1,
	maxHS1,
	minVS1,
	maxVS1,
	visualizationId,
	needToFilterStart,
	needToFilterContains,
	needToFilterEnd,
) {
	const params = {
		search_in_class_1,
		startsList,
		containList,
		endsList,
		minHS0,
		maxHS0,
		minVS0,
		maxVS0,
		minHS1,
		maxHS1,
		minVS1,
		maxVS1,
		visualization: visualizationId,
		needToFilterStart:needToFilterStart,
		needToFilterContains:needToFilterContains,
		needToFilterEnd:needToFilterEnd,
	};
	return post('searchTirps', params);
}

export function searchTirps1Class(
	search_in_class_1,
	startsList,
	containList,
	endsList,
	minHS,
	maxHS,
	minVS,
	maxVS,
	visualizationId,
	needToFilterStart,
	needToFilterContains,
	needToFilterEnd,
) {
	const params = {
		search_in_class_1,
		startsList,
		containList,
		endsList,
		minHS,
		maxHS,
		minVS,
		maxVS,
		visualization: visualizationId,
		needToFilterStart:needToFilterStart,
		needToFilterContains:needToFilterContains,
		needToFilterEnd:needToFilterEnd,
	};
	return post('searchTirps', params);
}
