import { post } from '../request';

export function login(email, password) {
	const params = { Email: email, Password: password };
	return post('login', params);
}

export function register(firstName, lastName, email, password, institute, degree) {
	const params = {
		Fname: firstName,
		Lname: lastName,
		Email: email,
		Password: password,
		Institute: institute,
		Degree: degree,
	};
	return post('register', params);
}
