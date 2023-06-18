import axios from 'axios';
import cookies from 'js-cookie';

let logout = () => {};
export const setLogout = (callback) => {
	logout = callback;
};

function request(endPoint, params, GET, downloadRequest) {
	console.debug(`Request ${endPoint}`, GET ? params : Array.from(params.entries()));

	const responseType = downloadRequest ? 'blob' : '';
	const headers = {
		'content-type': 'multipart/form-data',
		'x-access-token': cookies.get('auth-token'),
	};
	const url = `${window.base_url}/${endPoint}`;
	const requestPromise = GET
		? axios.get(url, { params, headers, responseType })
		: axios.post(url, params, { headers, responseType });

	// https://axios-http.com/docs/handling_errors
	return requestPromise.then(handleResponse).catch(handleError);
}

function handleResponse(response) {
	if (response.status === 401) {
		cookies.remove('auth-token');
		logout();
		window.open('#/Login', '_self');
		return Promise.reject('Session expired, please log in');
	} else if (response.status < 400) {
		console.debug(`The server response`, response.data);
		if (response.data.message) {
			return Promise.resolve(response.data.message);
		}
		return Promise.resolve(response.data);
	} else {
		if (request.data.message) {
			return Promise.reject(response.data.message);
		}
		return Promise.reject(response.data);
	}
}

function handleError(error) {
	console.error(error.toJSON());
	console.error(error.request);
	if (error.response) {
		// The request was made and the server responded with a status code
		// that falls out of the range of 2xx
		if (error.response.status === 401) {
			cookies.remove('auth-token');
			logout();
			window.open('#/Login', '_self');
			return Promise.reject('Session expired, please log in');
		}
		const response_unparsed = error.response.request.response;
		try {
			const response = JSON.parse(response_unparsed);
			if (response.message) {
				return Promise.reject(response.message);
			}
		} catch (e) {
			if (response_unparsed) {
				return Promise.reject(response_unparsed);
			}
		}
		if (error.response.status === 500) {
			return Promise.reject(
				'Oops, an error occurred at the server, please try again or call for technical support'
			);
		}
		return Promise.reject(error.message);
	} else if (error.request) {
		// The request was made but no response was received
		// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
		// http.ClientRequest in node.js
		return Promise.reject(`Could not get a response from the server, try again later`);
	} else {
		// Something happened in setting up the request that triggered an Error
		return Promise.reject(`Could not send a request, try again later\n${error.message}`);
	}
}

export function get(endPoint, params = {}, downloadRequest = false) {
	return request(endPoint, params, true, downloadRequest);
}
export function post(endPoint, params = {}, downloadRequest = false) {
	const formParams = new FormData();

	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined) {
			formParams.append(key, value);
		}
	}
	return request(endPoint, formParams, false, downloadRequest);
}
