import { get, post } from '../request';

export function getAllDatasets() {
	const params = {};
	return get('getAllDataSets', params);
}

export function deleteDataset(datasetName){
	const params = { datasetName: datasetName };
	return post('deleteDataset', params);
}
export function getDataOnDataset(datasetName) {
	const params = { datasetName: datasetName };
	return get('getDataOnDataset', params);
}


export function getIsSequential(datasetName) {
	const params = { datasetName: datasetName };
	return get('getIsSequential', params);
}

export function getVisualizationDetails(visualizationID) {
	const params = { visualization_id: visualizationID };
	return get('getVisualizationDetails', params);
}

export function getVisualizationInfo(visualizationID) {
	const params = { visualization_id: visualizationID };
	return get('getVisualizationInfo', params);
}

export function getAllVisualizations() {
	const params = {};
	return get('getVisualizations', params);
}

export function getInfo(datasetName) {
	const params = { datasetName: datasetName };
	return get('getInfo', params);
}

export function incrementViews(datasetName) {
	const params = {datasetName: datasetName };
	return post('incrementViews', params);
}

// TODO: delete this request... the downloads needs to be incremented when downloaded and not when requested to increment...
export function incrementDownloads(datasetID) {
	const params = { dataset_id: datasetID };
	return post('incrementDownload', params);
}
