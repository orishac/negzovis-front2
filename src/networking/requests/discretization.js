import { post } from '../request';

export function addNewDisc(
	AbMethod,
	PAA,
	InterpolationGap,
	datasetName,
	NumStates,
	GradientFile,
	GradientWindowSize,
	KnowledgeBasedFile,
	binsNames,
	PreprocessingFile,
	AbstractionMethodFile,
	StatesFile
) {
	const params = {
		AbMethod,
		PAA,
		InterpolationGap,
		datasetName,
		NumStates,
		GradientFile,
		GradientWindowSize,
		KnowledgeBasedFile,
		binsNames,
		PreprocessingFile,
		AbstractionMethodFile,
		StatesFile,
	};
	return post('addNewDisc', params);
}

export function getDiscritization(disc_id) {
	const params = { disc_id };
	return post('getDISC', params, true);
}

export function delteDescretization(disc_id, datasetName) {
	const params = { disc_id: disc_id, datasetName: datasetName };
	return post('deleteDescritization', params);
}
