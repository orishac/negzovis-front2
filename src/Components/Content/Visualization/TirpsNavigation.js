import React, { Component } from 'react';

import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import { SimpleOverlayTrigger } from '../../MyToolTip';

/**
 * this class is shown the navigation in the tirps functions
 */

class TirpsNavigation extends Component {
	render() {
		const datasetName = sessionStorage.getItem('datasetReadyName');
		const disabledProps = {
			className: 'disabled',
			onClick: (e) => {
				e.preventDefault();
			},
		};
		return (
			<Navbar className={'navbar-tirps'} variant={'light'} style={{ height: 'auto' }}>
				<ul
					style={{
						display: 'flex',
						flexWrap: 'wrap',
						justifyContent: 'space-evenly',
						width: '100%',
					}}
				>
					<li className='vis-nav-links'>
						<NavLink activeClassName='active' to={'/TirpsApp/DatasetInfo'}>
							<i className='fas fa-info'></i> {datasetName}
						</NavLink>
					</li>
					<li className='vis-nav-links'>
						<SimpleOverlayTrigger
							tip={'This tab is for time intervals datasets'}
							placement={'bottom'}
							show={this.props.negative === 'true'}
						>
							<NavLink 
								activeClassName='active' 
								to={'/TirpsApp/States'}
								{...((this.props.two_class && this.props.negative === 'false' ) || this.props.negative === 'true' ? disabledProps : !disabledProps)}
								>
								<i className='fas fa-bars'></i> States
							</NavLink>
						</SimpleOverlayTrigger>
					</li>
					<li className='vis-nav-links'>
						<SimpleOverlayTrigger
							tip={'Add data about the entities to view this tab'}
							placement={'bottom'}
							show={!this.props.entities}
						>
							<NavLink
								activeClassName='active'
								to={'/TirpsApp/Entities'}
								{...(this.props.entities || disabledProps)}
							>
								<i className='fas fa-indent'></i> Entities
							</NavLink>
						</SimpleOverlayTrigger>
					</li>
					<li className='vis-nav-links'>
						<SimpleOverlayTrigger
							tip={'This tab is for time intervals datasets with only one class'}
							placement={'bottom'}
							show={this.props.two_class || this.props.negative === 'true'}
						>
							<NavLink
								activeClassName='active'
								to={'/TirpsApp/TIRPs'}
								{...((this.props.two_class && this.props.negative === 'false') || this.props.negative === 'true' ? disabledProps : !disabledProps)}
							>
								<i className='fas fa-tree'></i> TIRPs
							</NavLink>
						</SimpleOverlayTrigger>
					</li>
					<li className='vis-nav-links'>
						<SimpleOverlayTrigger
							tip={'This tab is for datasets with two classes'}
							placement={'bottom'}
							show={!this.props.two_class}
						>
							<NavLink
								activeClassName='active'
								to={'/TirpsApp/DiscriminativeTIRPs'}
								{...(this.props.two_class || disabledProps)}
							>
								<i className='fas fa-tree'></i> Discriminative TIRPs
							</NavLink>
						</SimpleOverlayTrigger>
					</li>
					<li className='vis-nav-links'>
						<SimpleOverlayTrigger
							tip={'This tab is for negative sequential datasets'}
							placement={'bottom'}
							show={this.props.negative === 'false'}
						>
							<NavLink
								activeClassName='active'
								to={'/TirpsApp/NegativeTirps'}
								{...(this.props.negative === 'true' || disabledProps)}
							>
								<i className='fas fa-tree'></i> NegativeTirps
							</NavLink>
						</SimpleOverlayTrigger>
					</li>
					<li className='vis-nav-links'>
						<SimpleOverlayTrigger
							tip={'This tab is for time intervals datasets with only one class'}
							placement={'bottom'}
							show={this.props.two_class || this.props.negative === 'true'}
						>
							<NavLink
								activeClassName='active'
								to={'/TirpsApp/TIRPsSearch'}
								{...((this.props.two_class && this.props.negative === 'false') || this.props.negative === 'true' ? disabledProps : !disabledProps)}
							>
								<i className='fas fa-search'></i> TIRPs Search
							</NavLink>
						</SimpleOverlayTrigger>
					</li>
					<li className='vis-nav-links'>
						<SimpleOverlayTrigger
							tip={'This tab is for datasets with two classes'}
							placement={'bottom'}
							show={!this.props.two_class}
						>
							<NavLink
								activeClassName='active'
								to={'/TirpsApp/PTIRPsSearch'}
								{...(this.props.two_class || disabledProps)}
							>
								<i className='fas fa-search'></i> Discriminative TIRPs Search
							</NavLink>
						</SimpleOverlayTrigger>
					</li>
					<li className='vis-nav-links'>
						<SimpleOverlayTrigger
							tip={'This tab is for negative sequential datasets'}
							placement={'bottom'}
							show={this.props.negative === 'false'}
						>
							<NavLink
								activeClassName='active'
								to={'/TirpsApp/NTIRPsSearch'}
								{...(this.props.negative === 'true' || disabledProps)}
							>
								<i className='fas fa-search'></i> NTIRPs Search
							</NavLink>
						</SimpleOverlayTrigger>
					</li>
					<li className='vis-nav-links'>
						<SimpleOverlayTrigger
							tip={'This tab is for datasets with only one class'}
							placement={'bottom'}
							show={this.props.two_class}
						>
							<NavLink
								activeClassName='active'
								to={'/TirpsApp/Tali/BTirps'}
								{...((!this.props.two_class && this.props.negative === 'false') || disabledProps)}
							>
								<i className='fas fa-network-wired'></i> Bidirectional Tirps
							</NavLink>
						</SimpleOverlayTrigger>
					</li>
					<li className='vis-nav-links'>
						<SimpleOverlayTrigger
							tip={'This tab is for datasets with two classes'}
							placement={'bottom'}
							show={!this.props.two_class}
						>
							<NavLink
								activeClassName='active'
								to={'/TirpsApp/Tali/BPTirps'}
								{...(this.props.two_class || disabledProps)}
							>
								<i className='fas fa-network-wired'></i> Bidirectional PTirps
							</NavLink>
						</SimpleOverlayTrigger>
					</li>
					{/* <li className='vis-nav-links'>
						<NavLink activeClassName='active' to={'/TirpsApp/RawData'}>
							<i className='fas'></i> Raw Data
						</NavLink>
					</li> */}
					<li className='vis-nav-links'>
						<SimpleOverlayTrigger
							tip={'This tab is only available through TIRPs, TIRPs Search or Bidirectional Tirps'}
							placement={'bottom'}
							show = {this.props.two_class}
						>
							<NavLink activeClassName='active' to={'/TirpsApp/RawData'} onClick= {(e) => {e.preventDefault()}}>
								<i className='fas'></i> Raw Data
							</NavLink>
						</SimpleOverlayTrigger>
					</li>
					{/* <li className='visNavLinks'>
						<NavLink activeClassName='active' to={'/TirpsApp/Tali/SymbolsCorrelation'}>
							<i className='fas fa-th'></i> Symbols Correlation
						</NavLink>
					</li> */}
				</ul>
			</Navbar>
		);
	}
}

export default TirpsNavigation;
