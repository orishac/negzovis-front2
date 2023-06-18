import { get, post } from '../request';

export function uploadEntities(file, datasetName) {
	const params = { file, datasetName };
	return post('stepthree', params);
}

export function uploadDataset(
	datasetName,
	category,
	publicPrivate,
	file,
	description,
	datasetSource,
	rawDataUuid,
	vmapUuid,
	entitiesUuid
) {
	const params = {
		datasetName,
		category,
		publicPrivate,
		file,
		description,
		datasetSource,
		rawDataUuid,
		vmapUuid,
		entitiesUuid,
	};
	return post('upload', params);
}

export function importDataset(
	datasetName,
	category,
	publicPrivate,
	zip,
	description,
	datasetSource,
	zipUuid
) {
	const params = {
		datasetName,
		category,
		publicPrivate,
		zip,
		description,
		datasetSource,
		zipUuid,
	};
	return post('import_data', params);
}

export function getVariableListVMap(dataset_id) {
	const params = { dataset_id };
	return get('getVariableList', params);
}
