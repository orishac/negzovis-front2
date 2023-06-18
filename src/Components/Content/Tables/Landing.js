import React, { Component } from 'react';
import Cookies from 'js-cookie';

import { Button, Card } from 'react-bootstrap';

class Landing extends Component {
	componentDidMount() {
		if (!Cookies.get('auth-token')) {
			window.open('#/Login', '_self');
		}
	}

	toUpload = () => {
		window.open('#/Upload', '_self');
	};
	toProcess = () => {
		window.open('#/Process', '_self');
	};
	toVisualization = () => {
		window.open('#/Visualize', '_self');
	};

	render() {
		return (
			<Card style={{ width: 'auto' }} className='text-center main-card'>
				<Card.Header className={'bg-hugobot'}>
					<Card.Text className={'text-hugobot'}> </Card.Text>
				</Card.Header>

				<Card.Header className={'text-hugoob-advanced'}>
					<h1 className='main-text'>{'Welcome, choose your next step'}</h1>
				</Card.Header>

				<Card.Body>
					<Button className='bg-hugobot big-btn' onClick={this.toUpload}>
						<i className='fas fa-upload' /> Upload New Data
					</Button>
					<Button className='bg-hugobot big-btn' onClick={this.toProcess}>
						<i className='fas fa-hammer' /> Process Your Data
					</Button>
					<Button className='bg-hugobot big-btn' onClick={this.toVisualization}>
						<i className='fas fa-book-reader' /> Visualize Your Data
					</Button>
				</Card.Body>
			</Card>
		);
	}
}

export default Landing;
