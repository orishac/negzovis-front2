import { post } from '../request';

export function visualize(kl_id) {
	const params = {
		kl_id,
	};
	return post('preprocess', params);
}
