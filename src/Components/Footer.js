import React, { Component } from 'react';

import { Navbar } from 'react-bootstrap';

/**
 * this class contains the footer that Shown in the bottom of the website
 */

class Footer extends Component {
	render() {
		return (
			<Navbar fixed='bottom' className={'bg-hugobot footer-hugobot'}>
				<div>
					© {new Date().getFullYear()} Copyright:{' '}
					<a
						href='https://www.ise.bgu.ac.il/cdalab/'
						target='_blank'
						rel='noopener noreferrer'
					>
						CDALab BGU
					</a>
				</div>
			</Navbar>
		);
	}
}
export default Footer;
