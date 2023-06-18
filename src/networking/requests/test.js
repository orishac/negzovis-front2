import { get } from '../request';

export function ping() {
	const params = {};
	return get('ping5', params);
}
