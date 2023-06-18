import { post } from '../request';

export function getTIM(kl_id, class_num) {
	const params = { kl_id, class_num };
	return post('getTIM', params);
}
export function addTIM(
	discretizationId,
	epsilon,
	gap,
	minVerSupport,
	numRelations,
	maxTirpLength,
	indexSame,
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
		to_visualize: isVisualization,
	};
	return post('addTIM', params);
}

export function deleteKarmaLego(iter, datasetName){
	const params = {
		karma_id: iter['karma_id'],
		disc_id: iter['discId'],
		datasetName: datasetName,
	};
	return post('deleteKarmaLego', params);
}
