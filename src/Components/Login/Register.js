import React, { Component } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import FormElement from './FormElement';
import SelectElement from './SelectElement';
import { register } from '../../networking/requests/auth';
import { errorAlert, successAlert } from '../SweetAlerts';
import Swal from 'sweetalert2';

/**
 * this class is the register class.
 * the form gets first name, last name, institute, degree, email, password.
 * it sends the elements to the server and gets in return success message.
 */

class Register extends Component {
	state = {
		firstName: '',
		lastName: '',
		institute: '',
		degree: 'B.Sc',
		email: '',
		password: '',
		confirmPassword: '',
		passwordsDidNotMatch: undefined,
		passwordNotInFormat: undefined,
		loading: false,
	};

	constructor(props) {
		super(props);
		this.onChange.bind(this);
	}

	handleSubmit = () => {
		const { firstName, lastName, institute, degree, email, password, confirmPassword } =
			this.state;
		if (
			institute !== '' &&
			firstName !== '' &&
			lastName !== '' &&
			degree !== '' &&
			email !== '' &&
			password !== '' &&
			confirmPassword !== ''
		) {
			const passwordsMatch = password === confirmPassword;
			const passwordIsStrong = this.checkPassword2(password);
			this.setState({
				passwordsDidNotMatch: passwordsMatch
					? ''
					: 'The passwords didn’t match. Try again.',
			});

			this.setState({
				passwordNotInFormat: passwordIsStrong
					? ''
					: 'Password must contain a minimum of 6 characters, at least 1 digit and one letter.',
			});

			if (passwordsMatch && passwordIsStrong) {
				Swal.fire({
					title: 'Preparing Your Account...',
					didOpen: () => {
						Swal.showLoading();
					},
					allowOutsideClick: false,
					allowEscapeKey: false,
					allowEnterKey: false,
				});
				this.setState({
					loading: true,
				});
				register(firstName, lastName, email, password, institute, degree)
					.finally(() => {
						Swal.close();
						this.setState({
							loading: false,
						});
					})
					.then(() => {
						successAlert(
							'Welcome',
							'You have registered successfully to KarmaLego Web'
						).finally(() => {
							this.props.history.push({ pathname: '/login' });
						});
					})
					.catch(errorAlert);
			}
		}
	};
	checkPassword = (password) => {
		return !!password.match(
			// eslint-disable-next-line no-useless-escape
			/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%* #+=\(\)\^?&])[A-Za-z\d$@$!%* #+=\(\)\^?&]{3,}$/
		);
	};
	checkPassword2 = (password) => {
		return !!password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d$@$!%* #+=\(\)\^?&]{6,}$/);
	};

	onChange(key) {
		return (e) => {
			this.setState({ [key]: e.target.value });
		};
	}

	render() {
		return (
			<Container id='register' fluid={true}>
				<h3>Register</h3>
				<Form
					onSubmit={(e) => {
						e.preventDefault();
						this.handleSubmit();
					}}
				>
					<FormElement
						name={'First Name'}
						value={this.state['firstName']}
						onChange={this.onChange('firstName')}
						required
					/>
					<FormElement
						name={'Last Name'}
						value={this.state['lastName']}
						onChange={this.onChange('lastName')}
						required
					/>
					<FormElement
						name={'Institute'}
						value={this.state.institute}
						onChange={this.onChange('institute')}
						required
					/>
					<SelectElement
						name={'Degree'}
						options={['B.Sc', 'M.Sc', 'Ph.D']}
						value={this.state.degree}
						onChange={this.onChange('degree')}
						required
					/>
					<FormElement
						name={'Email'}
						type={'email'}
						value={this.state.email}
						onChange={this.onChange('email')}
						required
					/>
					<FormElement
						name={'Password'}
						type={'password'}
						warningText={' (not your organizational password)'}
						value={this.state.password}
						onChange={this.onChange('password')}
						required
						error={this.state.passwordNotInFormat}
					/>
					<FormElement
						name={'Confirm Password'}
						type={'password'}
						value={this.state['confirmPassword']}
						onChange={this.onChange('confirmPassword')}
						required
						error={this.state.passwordsDidNotMatch}
					/>

					<div className='buttons'>
						<Button
							className={'bg-hugobot' + (this.state.loading ? ' disabled' : '')}
							type='submit'
						>
							Register
						</Button>
						<Button className={'bg-hugobot'} type={'reset'}>
							Clear
						</Button>
					</div>
				</Form>
			</Container>
		);
	}
}
export default withRouter(Register);
