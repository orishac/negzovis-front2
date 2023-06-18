import { post } from '../request';

export function getTIM(kl_id, class_num) {
	const params = { kl_id, class_num };
	return post('getTIM', params);
}
export function getNegativeTIM(kl_id) {
	const params = { kl_id };
	return post('getNegativeTIM', params);
}
export function addTIM(
	discretizationId,
	epsilon,
	gap,
	minVerSupport,
	numRelations,
	maxTirpLength,
	indexSame,
	negativeMining,
	maximumNegative,
	ofo,
	as,
	bc,
	datasetName,
	isVisualization,
) {
	const params = {
		Epsilon: epsilon,
		'Max Gap': gap,
		min_ver_support: minVerSupport,
		num_relations: numRelations,
		DiscretizationId: discretizationId,
		'max Tirp Length': maxTirpLength,
		index_same: indexSame,
		datasetName: datasetName,
		class_name: 'Cohort',
		second_class_name: 'Control',
		timestamp: 'Minutes',
		comments: 'no comments',
		negative_mining: negativeMining,
		maximum_negatives: maximumNegative,
		ofo: ofo,
		as: as,
		bc: bc,
		to_visualize: isVisualization,
	};
	return post('addTIM', params);
}

export function addSequentialTIM(
	gap,
	minVerSupport,
	negativeMining,
	maximumNegative,
	ofo,
	as,
	bc,
	datasetName,
	isVisualization,
) {
	const params = {
		'Max Gap': gap,
		min_ver_support: minVerSupport,
		datasetName: datasetName,
		negative_mining: negativeMining,
		maximum_negatives: maximumNegative,
		ofo: ofo,
		as: as,
		bc: bc,
		to_visualize: isVisualization,
	};
	return post('addSequentialTIM', params);
}

export function deleteKarmaLego(iter, datasetName){
	const params = {
		karma_id: iter['karma_id'],
		disc_id: iter['discId'],
		datasetName: datasetName,
	};
	return post('deleteKarmaLego', params);
}
