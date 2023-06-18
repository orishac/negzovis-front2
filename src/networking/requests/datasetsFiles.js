import { get } from '../request';

export function getVMapFile(datasetName) {
	const params = { datasetName: datasetName };
	return get('getVMapFile', params);
}
export function getDatasetFiles(dataset_id) {
	const params = { dataset_id };
	return get('getDatasetFiles', params, true);
}

export function getRawDataFile(id) {
	const params = { id };
	return get('getRawDataFile', params, true);
}

export function getStatesFile(dataset_id, disc_id) {
	const params = { dataset_id, disc_id };
	return get('getStatesFile', params, true);
}

export function getKLOutput(dataset_id, disc_id, kl_id, classNum = undefined) {
	const params = { dataset_id, disc_id, kl_id, class: classNum };
	return get('getKLOutput', params);
}
