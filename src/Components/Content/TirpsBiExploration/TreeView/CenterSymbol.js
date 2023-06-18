import React, { useState } from 'react';
import * as ReactBootstrap from 'react-bootstrap';

import * as HelperFunctions from './SideSymbolListHelper';

const CenterSymbol = (props) => {
	let type = props.type;

	const [clickedTitles, setClickedTitles] = useState([]);

	const isTitleMarked = (title) => {
		return clickedTitles.includes(title);
	};

	const titleClicked = (title) => {
		if (clickedTitles.includes(title)) {
			const newTitles = clickedTitles.filter((oldTitle) => oldTitle !== title);
			setClickedTitles(newTitles);
			props.titleClicked(newTitles);
		} else {
			const newTitles = [...clickedTitles, title];
			setClickedTitles(newTitles);
			props.titleClicked(newTitles);
			setClickedTitles(newTitles);
		}
	};

	const isPredictive = type === '"BPTirps"';

	const CenterRow = ({ title, titleToShow, value, hidden = false }) => (
		<tr hidden={hidden}>
			<th
				className={'center-symbol-title' + (isTitleMarked(title) ? ' marked' : '')}
				onClick={() => titleClicked(title)}
			>
				{titleToShow}
			</th>
			<th className={isTitleMarked(title) ? 'marked' : ''}>{value}</th>
		</tr>
	);
	return (
		<ReactBootstrap.Table className='metrics-table'>
			<tbody>
				<CenterRow title={'name'} titleToShow={'Symbol Name'} value={props.symbolName} />
				<CenterRow
					title={'size'}
					titleToShow={'Size Name'}
					value={`${props.tirp['symbols'].indexOf(props.symbol) + 1}/${
						props.tirp['size']
					}`}
				/>
				<CenterRow
					title={'score'}
					titleToShow={'Score'}
					value={`${HelperFunctions.TIRPScore(
						props.tirp,
						localStorage.num_of_entities,
						localStorage.num_of_entities_class_1
					)}%`}
					hidden={!isPredictive}
				/>
				<CenterRow
					title={'vs0'}
					titleToShow={isPredictive ? 'V.S 0' : 'V.S'}
					value={`${props.tirp['vertical_support_0'].toFixed(1)}%`}
				/>
				<CenterRow
					title={'vs1'}
					titleToShow={'V.S 1'}
					value={`${props.tirp['vertical_support_1'].toFixed(1)}%`}
					hidden={!isPredictive}
				/>
				<CenterRow
					title={'mhs0'}
					titleToShow={isPredictive ? 'M.H.S 0' : 'M.H.S'}
					value={props.tirp['mean_horizontal_support_0'].toFixed(1)}
				/>
				<CenterRow
					title={'mhs1'}
					titleToShow={'M.H.S 1'}
					value={props.tirp['mean_horizontal_support_1'].toFixed(1)}
					hidden={!isPredictive}
				/>
				<CenterRow
					title={'mmd0'}
					titleToShow={isPredictive ? 'M.M.D 0' : 'M.M.D'}
					value={props.tirp['mean_duration_0'].toFixed(1)}
				/>
				<CenterRow
					title={'mmd1'}
					titleToShow={'M.M.D 1'}
					value={props.tirp['mean_duration_1'].toFixed(1)}
					hidden={!isPredictive}
				/>
				<CenterRow
					title={'entities0'}
					titleToShow={isPredictive ? 'Entities 0' : 'Entities'}
					value={Math.round(props.tirp['num_supporting_entities_0'])}
				/>
				<CenterRow
					title={'entities1'}
					titleToShow={'Entities 1'}
					value={Math.round(props.tirp['num_supporting_entities_1'])}
					hidden={!isPredictive}
				/>
			</tbody>
		</ReactBootstrap.Table>
	);
};

export default CenterSymbol;
