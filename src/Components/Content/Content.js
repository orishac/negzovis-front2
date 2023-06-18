import React, { Component } from 'react';

import { Container } from 'react-bootstrap';
import { Redirect, Route, Switch } from 'react-router-dom';

import Login from '../Login/Login';
import Manage from './Manage/Manage';
import Register from '../Login/Register';
import ProcessSection from './Tables/ProcessSection';
import Tutorial from './Tutorial';
import TirpsApp from './Visualization/TirpsApp';
import Landing from './Tables/Landing';
import HomeTableReady from './Tables/HomeTableReady';
import UploadScreen from './UploadDataset/UploadScreen';

/**
 * in this class you can see the content of the main navbar.
 * it has home, tutorial, Manage, register, log in, upload.
 */

class Content extends Component {
	render() {
		return (
			<div className='content'>
				<Switch>
					<Route path={'/Upload'}>
						<UploadScreen />
					</Route>
					<Route path={'/Home'}>
						<Landing />
					</Route>
					<Route path='/Tutorial'>
						<Container>
							<Tutorial />
						</Container>
					</Route>
					<Route path='/Manage'>
						<Container>
							<Manage />
						</Container>
					</Route>
					<Route path='/Register'>
						<Container>
							<Register />
						</Container>
					</Route>
					<Route path='/Login'>
						<Container>
							<Login />
						</Container>
					</Route>
					<Route path='/TirpsApp'>
						<TirpsApp />
					</Route>
					<Route path='/Process'>
						<ProcessSection />
					</Route>
					<Route path='/Visualize'>
						<HomeTableReady />
					</Route>
					<Redirect from={'/'} to={'/Home'} />
				</Switch>
			</div>
		);
	}
}

export default Content;
