import React, { Component } from 'react';
import Cookies from 'js-cookie';

import { UserEmailContext } from '../contexts';

import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

// import Login from "../Login/Login";
// import {login} from "../../services/authService";
// import HomeData from "../Content/Tables/mainTable";

/**
 * this class is shown the navigation in the top of the website
 */

class Navigation extends Component {
	render() {
		const screen = this.props.location.pathname.split('/')[1];
		const title = screen === 'TirpsApp' ? this.props.title : '';

		return (
			<Navbar fixed='top' className={'bg-hugobot'} variant={'dark'}>
				<div>
					<Link to={'/'} className='mr-4'>
						<i className={'fas fa-home '} /> Home
					</Link>
					<Link to={'/Tutorial'}>
						<i className={'fas fa-book-open'} /> Tutorial
					</Link>
				</div>
				<div className={'row justify-Content-center '}>
					<Navbar.Brand>
						<Link to={'/'}>
							<h4 className={'karmalego-brand'}>
								KarmaLegoWeb{title && ` - ${title}`}
							</h4>
						</Link>
					</Navbar.Brand>
				</div>
				<div className={'navbar navbar-right'}>
					<UserEmailContext.Consumer>
						{({ logged, setLogged }) =>
							logged ? (
								<div>
									<Link to={'/Manage'} className='mr-4'>
										<i className={'fa fa-search'} /> Find & Manage Datasets
									</Link>
									<Link
										to={'/Login'}
										onClick={() => {
											setLogged(false);
											Cookies.remove('auth-token');
										}}
									>
										<i className={'fas fa-sign-out-alt'} /> Sign Out
									</Link>
								</div>
							) : (
								<div>
									<Link to={'/Register'} className='mr-4'>
										<i className={'fas fa-user-plus'} /> Sign Up
									</Link>
									<Link to={'/Login'}>
										<i className={'fas fa-sign-in-alt'} /> Sign In
									</Link>
								</div>
							)
						}
					</UserEmailContext.Consumer>
				</div>
			</Navbar>
		);
	}
}

export default Navigation;
