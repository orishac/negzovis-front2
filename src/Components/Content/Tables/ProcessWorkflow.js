import React, { useEffect, useState } from 'react';

import { Route, Redirect, Switch } from 'react-router-dom';

import AddDiscretizationCard from './discComponents/AddConfigCard';
import DiscretizationTable from './DiscretizationTable';
import Info from './infoComponents/Info';
import Visualization from './Visualization';
import Workflow from './Workflow';
import TIMTable from './TIMTable';
import { getDataOnDataset } from '../../../networking/requests/datasetsStats';
import { errorAlert } from '../../SweetAlerts';

function ProcessWorkflow(props) {
	const [datasetName, setDatasetName] = useState(props.datasetName);
	const [discretizations, setDiscretizations] = useState([]);
	const [tims, setTims] = useState([]);
	useEffect(() => {
		setDatasetName(datasetName);
		getDataOnDataset(datasetName)
			.then((data) => {
				setDiscretizations(data['disc']);
				setTims(data['karma']);

				window.open(`#/Process/${datasetName}/Info`, '_self');
			})
			.catch((e) => {
				errorAlert(e).finally(() => {
					window.open(`#/Process`, '_self');
				});
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [datasetName]);

	function addDiscretization(id, NumStates, InterpolationGap, AbMethod, PAA) {
		const discretization = {
			id: id,
			BinsNumber: NumStates,
			InterpolationGap: InterpolationGap,
			MethodOfDiscretization: AbMethod,
			PAAWindowSize: PAA,
			status: { finished: false, success: false },
		};
		const newDiscretizations = [discretization, ...discretizations];
		setDiscretizations(newDiscretizations);
	}

	function removeKarmaLego(iter) {
		setTims((oldTims) => oldTims.filter((timRow) => timRow.karma_id !== iter.karma_id));
	}

	function removeDiscretization(iter) {
		console.log(discretizations);
		setDiscretizations((oldDescrits) =>
			oldDescrits.filter((descriteRow) => descriteRow.id !== iter.id)
		);
	}

	return (
		<>
			<Workflow datasetName={datasetName} />
			<Switch>
				<Route path={'/Process/:discretizationId/Info'}>
					<Info datasetName={datasetName} />
				</Route>
				<Route path={'/Process/:discretizationId/Disc'}>
					<AddDiscretizationCard
						addDiscretization={addDiscretization}
						datasetName={datasetName}
					/>
					<DiscretizationTable
						discretizations={discretizations}
						datasetName={datasetName}
						removeDiscretization={removeDiscretization}
					/>
				</Route>
				<Route path={'/Process/:discretizationId/TIM'}>
					<TIMTable
						discretizations={discretizations}
						TIMTable={tims}
						datasetName={datasetName}
						removeKarmaLego={removeKarmaLego}
					/>
				</Route>
				<Route path={'/Process/:discretizationId/Visualization'}>
					<Visualization TIMTable={tims} datasetName={datasetName} />
				</Route>
				<Redirect
					from='/Process/:discretizationId'
					to={`/Process/:discretizationId/Info`}
				/>
			</Switch>
		</>
	);
}

export default ProcessWorkflow;
