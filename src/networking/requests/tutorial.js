import { get } from '../request';

export function getExampleFile(file) {
	const params = { file };
	return get('getExampleFile', params);
}
