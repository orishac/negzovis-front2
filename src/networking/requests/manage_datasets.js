import { post } from '../request';

export function deleteDataset(datasetName) {
	const params = { datasetName: datasetName };
	return post('deleteDataset', params);
}

export function uploadEntities(datasetName, entitiesUuid) {
	const params = { dataset_name: datasetName, entities_uuid: entitiesUuid };
	return post('uploadEntities', params);
}

export function updateDetails(datasetName, description, source, class_0_name, class_1_name) {
	const params = { dataset_name: datasetName, description, source, class_0_name, class_1_name };
	return post('updateDetails', params);
}
