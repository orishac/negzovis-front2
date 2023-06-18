import { get } from '../request';

export function getUserName() {
	const params = {};
	return get('getUserName', params);
}
