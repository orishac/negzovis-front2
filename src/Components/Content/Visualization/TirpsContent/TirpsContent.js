import React, { Component } from 'react';

import { Container } from 'react-bootstrap';
import { Redirect, Route, Switch } from 'react-router-dom';

import DatasetInfo from './DatasetInfo';
import States from './States';
import Entities from './Entities';
import TIRPs from './TIRPs';
import DiscriminativeTIRPs from './DiscriminativeTIRPs';
import TIRPsSearch from './TIRPsSearch';
import RawData from './RawData';
import App from '../../TirpsBiExploration/App';
import SymbolsCorrelation from '../../../Content/TirpsBiExploration/CorrelationMatrixView/symbolsCorrelation';
import RawDataTable from './RawDataTable';
import NegativeTirps from '../Negatives/NegativeTirps'
import NTIRPsSearch from '../Negatives/NTIRPsSearch';

/**
 * in this class you can see the content of the main navbar.
 * it has home, tutorial, Manage, register, log in, upload.
 */

class TirpsContent extends Component {
	render() {
		return (
			<Switch>
				<Route path={'/TirpsApp/DatasetInfo'}>
					<Container fluid>
						<DatasetInfo />
					</Container>
				</Route>
				<Route path={'/TirpsApp/States'}>
					<Container fluid>
						<States />
					</Container>
				</Route>
				<Route path={'/TirpsApp/Entities'}>
					<Container fluid>
						<Entities />
					</Container>
				</Route>
				<Route path={'/TirpsApp/TIRPs'}>
					<Container fluid>
						<TIRPs />
					</Container>
				</Route>
				<Route path={'/TirpsApp/DiscriminativeTIRPs'}>
					<Container fluid>
						<DiscriminativeTIRPs />
					</Container>
				</Route>
				<Route path={'/TirpsApp/TIRPsSearch'}>
					<Container fluid>
						<TIRPsSearch isPredictive={false} />
					</Container>
				</Route>
				<Route path={'/TirpsApp/NTIRPsSearch'}>
					<Container fluid>
						<NTIRPsSearch isPredictive={false} />
					</Container>
				</Route>
				<Route path={'/TirpsApp/NegativeTirps'}>
					<Container fluid>
						<NegativeTirps />	
					</Container>
				</Route>
				<Route path={'/TirpsApp/PTIRPsSearch'}>
					<Container fluid>
						<TIRPsSearch isPredictive />
					</Container>
				</Route>
				<Route path={'/TirpsApp/Tali/SymbolsCorrelation'}>
					<Container fluid>
						<SymbolsCorrelation />
					</Container>
				</Route>
				<Route path={'/TirpsApp/Tali/BTirps'}>
					<Container fluid>
						<App type={'BTirps'} />
					</Container>
				</Route>
				<Route path={'/TirpsApp/Tali/BPTirps'}>
					<Container fluid>
						<App type={'BPTirps'} /> 
					</Container>
				</Route>
				<Route path={'/TirpsApp/RawData'} render={(props) => <Container fluid>
						<RawData {...props}/>
						{/* <TIRPsSearch isPredictive={false} /> */}
					</Container>}>
				</Route>
				<Redirect from={'/TirpsApp'} to={'/TirpsApp/DatasetInfo'} />
			</Switch>
		);
	}
}

export default TirpsContent;
