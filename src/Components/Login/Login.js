import React, { Component } from 'react';

import { Button, Container, Form } from 'react-bootstrap';
import cookies from 'js-cookie';

import { errorAlert } from '../SweetAlerts';
import FormElement from './FormElement';
import { login } from '../../networking/requests/auth';
import { UserEmailContext } from '../../contexts';

/**
 * this class is responsible for the log in component.
 * when a user logs in he enters a username and a password and gets in return a token,
 * so he will be able to access his resources in the application.
 * the token is being saved in the cookies storage
 */

class Login extends Component {
	handleSubmit = async (email, pass) => {
		return login(email, pass).then((data) => {
			sessionStorage.setItem('Workflow', 'Info');
			cookies.set('auth-token', data['token']);
			window.open('#/Home', '_self');
		});
	};

	render() {
		return (
			<Container id='login' fluid={true}>
				<h3>Login</h3>
				<Form>
					<FormElement name={'Email'} type={'email'} />
					<FormElement name={'Password'} type={'password'} />
					<div className='buttons'>
						<UserEmailContext.Consumer>
							{({ setLogged }) => (
								<Button
									className={'bg-hugobot'}
									onClick={() =>
										this.handleSubmit(
											document.getElementById('Email').value,
											document.getElementById('Password').value
										)
											.then(() => setLogged(true))
											.catch(errorAlert)
									}
								>
									Login
								</Button>
							)}
						</UserEmailContext.Consumer>
						<Button className={'bg-hugobot'} type={'reset'}>
							Clear
						</Button>
					</div>
				</Form>
				<br />
				<br />
			</Container>
		);
	}
}

export default Login;
