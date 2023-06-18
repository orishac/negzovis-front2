import { useState } from 'react';

export function useAPI(apiFunc) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');
	const [data, setData] = useState(null);

	const request = (...params) => {
		setLoading(true);
		setError(false);
		setErrorMsg('');
		setData(null);

		return apiFunc(...params)
			.then((data) => {
				setData(data);
				return data;
			})
			.catch((errorMsg) => {
				setError(true);
				setErrorMsg(errorMsg);
				return Promise.reject(errorMsg);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	return { request, loading, error, errorMsg, data };
}
