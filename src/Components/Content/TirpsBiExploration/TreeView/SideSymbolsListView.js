import React from 'react';
import * as ReactBootstrap from 'react-bootstrap';

import StatModal from './StatisticsModal';
import SideSymbolTirp from './SideSymbolTirp';

const SideSymbolsListView = ({
	allTirpsArr,
	prevNext,
	isPrefix,
	markedTirp,
	type,
	centerSymbol,
	handleSymbolClicked,
	clickedTitles,
	symbolFilter,
	setSymbolFilter,
	numberOfTIRPsPresented,
	showPie,
	setShowPie,
	symbolTirpsCountJson,
	setSortBy,
	sortBy,
	ascending,
	showSameSymbol,
	setSameSymbol
}) => {
	const isPredictive = type === '"BPTirps"';

	const borderStyle =
		(prevNext === 'prev' && isPrefix) || (prevNext === 'next' && isPrefix === false)
			? '1px solid black'
			: null;

	const Tirp = ({ tirp }) => (
		<SideSymbolTirp
			tirp={tirp}
			markedTirp={markedTirp}
			isPrefix={isPrefix}
			type={type}
			centerSymbol={centerSymbol}
			handleSymbolClicked={handleSymbolClicked}
			clickedTitles={clickedTitles}
		/>
	);

	const TableHead = ({ property = null, style = {}, titles = [], children, ...otherProps }) => {
		return (
			<th
				style={{
					fontWeight: titles.some((r) => clickedTitles.includes(r)) ? 'bold' : 'normal',
					...style,
				}}
				className={'side-symbols-header' + (property ? ' can-sort' : '')}
				{...otherProps}
				onClick={() => {
					if (property) {
						setSortBy(property);
					}
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'baseline',
						justifyContent: 'center',
					}}
				>
					<span className='mr-3' hidden={sortBy !== property} style={{ height: 13 }}>
						<i
							className={
								'fa fa-sort-down sort-icon' +
								(sortBy === property && ascending ? ' sorted' : '')
							}
						/>
						<i
							className={
								'fa fa-sort-up sort-icon' +
								(sortBy === property && !ascending ? ' sorted' : '')
							}
						/>
					</span>

					{children}
				</div>
			</th>
		);
	};

	const renderTableHead = () => {
		return (
			<thead id="thead">
				<tr className='filter-container'>
					{/* symbol name , relation ,  tirp size*/}
					<th colSpan={3}>
						<span className='input-filter-container' search='{'>
							<i className='fas fa-search'></i>
							<input
								type='text'
								placeholder='Search'
								className='input-filter'
								value={symbolFilter}
								onChange={(e) => setSymbolFilter(e.target.value)}
							/>
						</span>
					</th>
					{/* score , VS1 , MHS1 , MMD1 , entities1 , VS0 , MHS0 , MMD0 , entities0*/}
					<th
						colSpan={isPredictive ? 9 : 4}
						style={{ textAlign: 'end', paddingRight: '20px' }}
					>
						{'Showing ' + numberOfTIRPsPresented + ' TIRPs'}
					</th>
				</tr>
				<tr>
					<TableHead
						rowSpan={isPredictive ? 2 : 1}
						style={{ verticalAlign: 'top' }}
						titles={['name']}
						property='symbol'
					>
						Symbol Name
					</TableHead>
					<TableHead
						rowSpan={isPredictive ? 2 : 1}
						style={{ verticalAlign: 'top' }}
						titles={['relation']}
						property='relation'
					>
						Relation
					</TableHead>
					<TableHead
						rowSpan={isPredictive ? 2 : 1}
						style={{ verticalAlign: 'top' }}
						titles={['size']}
						property='size'
					>
						Size
					</TableHead>
					<TableHead
						rowSpan={isPredictive ? 2 : 1}
						style={{ verticalAlign: 'top' }}
						hidden={!isPredictive}
						titles={['score']}
						property='score'
					>
						Score
					</TableHead>
					<TableHead
						colSpan={isPredictive ? '2' : '1'}
						titles={['vs0', 'vs1']}
						property={isPredictive ? null : 'vertical_support_0'}
					>
						V.S
					</TableHead>
					<TableHead
						colSpan={isPredictive ? '2' : '1'}
						titles={['mhs0', 'mhs1']}
						property={isPredictive ? null : 'mean_horizontal_support_0'}
					>
						M.H.S
					</TableHead>
					<TableHead
						colSpan={isPredictive ? '2' : '1'}
						titles={['mmd0', 'mmd1']}
						property={isPredictive ? null : 'mean_duration_0'}
					>
						M.M.D
					</TableHead>
					<TableHead
						colSpan={isPredictive ? '2' : '1'}
						titles={['entities0', 'entities1']}
						property={isPredictive ? null : 'vertical_support_0'}
					>
						Entities
					</TableHead>
				</tr>
				<tr hidden={!isPredictive}>
					<TableHead titles={['vs0']} property='vertical_support_0'>
						0
					</TableHead>
					<TableHead titles={['vs1']} property='vertical_support_1'>
						1
					</TableHead>
					<TableHead titles={['mhs0']} property='mean_horizontal_support_0'>
						0
					</TableHead>
					<TableHead titles={['mhs1']} property='mean_horizontal_support_1'>
						1
					</TableHead>
					<TableHead titles={['mmd0']} property='mean_duration_0'>
						0
					</TableHead>
					<TableHead titles={['mmd1']} property='mean_duration_1'>
						1
					</TableHead>
					<TableHead titles={['entities0']} property='vertical_support_0'>
						0
					</TableHead>
					<TableHead titles={['entities1']} property='vertical_support_1'>
						1
					</TableHead>
				</tr>
			</thead>
		);
	};

	return (
		<div className='side-symbols-container'>
			<div className='side-symbols-table-container' style={{ border: borderStyle }}>
				<div className='side-symbols-table-scrollable'>
					<ReactBootstrap.Table className='side-symbols-table'>
						{renderTableHead()}
						<tbody>
							{allTirpsArr.map((current, index) => (
								<Tirp key={index} tirp={current} />
							))}
						</tbody>
					</ReactBootstrap.Table>
				</div>
			</div>

			{/* <div className='pie-chart mt-4'>
				<div style={{display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center'}}>
				<ReactBootstrap.Button onClick={() => setShowPie(!showPie)}>
					Symbols Statistics
				</ReactBootstrap.Button>
				<ReactBootstrap.Button style={{marginLeft: '10%', backgroundColor: showSameSymbol ? 'blue' : null}} onClick={() => setSameSymbol(!showSameSymbol)}>
					Show Same Symbol
				</ReactBootstrap.Button>
				</div>
				<div className={'pie-opening-container' + (showPie ? ' open' : '')}>
					<div className='mt-4'>
						<StatModal
							symbolTirpsCountJson={symbolTirpsCountJson}
							setSymbolFilter={setSymbolFilter}
							symbolFilter={symbolFilter}
						/>
					</div>
				</div>
			</div> */}
		</div>
	);
};

export default SideSymbolsListView;
