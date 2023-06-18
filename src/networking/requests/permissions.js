import { get } from '../request';

export function askPermission(dataset) {
	const params = { dataset };
	return get('askPermission', params);
}
export function acceptPermission(dataset, userEmail) {
	const params = { dataset, userEmail };
	return get('acceptPermission', params);
}

export function getEmail() {
	const params = {};
	return get('getEmail', params);
}

export function rejectPermission(dataset, userEmail) {
	const params = { dataset, userEmail };
	return get('rejectPermission', params);
}

export function loadMail() {
	const params = {};
	return get('loadMail', params);
}
