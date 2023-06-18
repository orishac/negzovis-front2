import React from 'react';
import { ButtonGroup, Col, Row, ToggleButton } from 'react-bootstrap';
import { HashRouter, Redirect } from 'react-router-dom';

import TIRPTimeLineMine from './TIRPTimeLine';
import BarPlotMine from './BarPlot';
import CenterSymbol from './CenterSymbol';
import CustomNavBar from './CustomNavBar';
import PieChartMine from './PieChart';
import SideSymbolsListController from './SideSymbolsListController';
import BubbleChartController from './BubbleChartController';

const ExploreTreeView = ({
	mode,
	bubbleMode,
	prefixSymbols,
	symbolsToNames,
	isClearPrefix,
	symbolClicked,
	prefixSymbol,
	markedTirp,
	prevNext,
	centerSymbol,
	metricsTitles,
	setMode,
	setBubbleMode,
	nextSymbols,
	isClearNext,
	nextSymbol,
	type,
	redirect,
	history,
	exploreTIRP,
	arrowClicked,
	handleClearClick,
	originalTIRP,
	setMetricsTitles,
	newCenterSymbol,
	dropDownSymbols,
}) => {
	const renderPrefixTirps = () => {
		return mode === 0 ? null : bubbleMode === false ? (
			<SideSymbolsListController
				symbolTirpsList={prefixSymbols}
				isPrefix={true}
				symbolToNames={symbolsToNames}
				needToClear={isClearPrefix}
				symbolClicked={symbolClicked}
				chosenSymbol={prefixSymbol}
				markedTirp={markedTirp}
				prevNext={prevNext}
				centerSymbol={centerSymbol}
				clickedTitles={metricsTitles}
				mode={mode}
				type={type}
			/>
		) : (
			<BubbleChartController
				symbolTirpsList={prefixSymbols}
				isPrefix={true}
				symbolToNames={symbolsToNames}
				needToClear={isClearPrefix}
				symbolClicked={symbolClicked}
				chosenSymbol={prefixSymbol}
				markedTirp={markedTirp}
				prevNext={prevNext}
				centerSymbol={centerSymbol}
				mode={mode}
				type={type}
			/>
		);
	};
	const renderNextTirps = () => {
		if (mode === 2) return null;
		return !bubbleMode ? (
			<SideSymbolsListController
				symbolTirpsList={nextSymbols}
				isPrefix={false}
				symbolToNames={symbolsToNames}
				needToClear={isClearNext}
				symbolClicked={symbolClicked}
				chosenSymbol={nextSymbol}
				type={type}
				markedTirp={markedTirp}
				prevNext={prevNext}
				centerSymbol={centerSymbol}
				clickedTitles={metricsTitles}
				mode={mode}
			/>
		) : (
			<BubbleChartController
				symbolTirpsList={nextSymbols}
				isPrefix={false}
				symbolToNames={symbolsToNames}
				needToClear={isClearNext}
				symbolClicked={symbolClicked}
				chosenSymbol={nextSymbol}
				type={type}
				markedTirp={markedTirp}
				prevNext={prevNext}
				centerSymbol={centerSymbol}
				mode={mode}
			/>
		);
	};

	const renderRadiosMode = () => {
		return (
			<div>
				<ButtonGroup toggle={true} size='lg' className='w-100'>
					<ToggleButton
						checked={mode === 2}
						className={'btn-hugobot radio-btn-label'}
						onClick={() => setMode(2)}
						type={'radio'}
						value={2}
					>
						Ends
					</ToggleButton>
					<ToggleButton
						checked={mode === 1}
						className={'btn-hugobot radio-btn-label'}
						onClick={() => setMode(1)}
						type={'radio'}
						value={1}
					>
						Default
					</ToggleButton>
					<ToggleButton
						checked={mode === 0}
						className={'btn-hugobot radio-btn-label'}
						onClick={() => setMode(0)}
						type={'radio'}
						value={0}
					>
						Starts
					</ToggleButton>
				</ButtonGroup>
			</div>
		);
	};

	const renderVisualizationMode = () => {
		return (
			<ButtonGroup toggle={true} size='lg' className='w-100 mb-4'>
				<ToggleButton
					checked={!bubbleMode}
					className={'btn-hugobot radio-btn-label'}
					onClick={() => setBubbleMode(false)}
					type={'radio'}
					value={0}
				>
					Table
				</ToggleButton>
				<ToggleButton
					checked={bubbleMode}
					className={'btn-hugobot radio-btn-label'}
					onClick={() => setBubbleMode(true)}
					type={'radio'}
					value={1}
				>
					Graph
				</ToggleButton>
			</ButtonGroup>
		);
	};

	return redirect ? (
		<HashRouter>
			<Redirect to='/TirpsApp/TIRPs' />
		</HashRouter>
	) : (
		<>
			<Row>
				<CustomNavBar
					rawData={() => history.push({ pathname: '/TirpsApp/Tali/RawData' })}
					// exploreTIRP={() => exploreTIRP()}
					arrowClicked={arrowClicked}
					handleClearClick={handleClearClick}
					backDisabled={prefixSymbol === null}
					nextDisabled={nextSymbol === null}
					symbolsToNames={symbolsToNames}
					centerSymbol={centerSymbol}
					newCenterSymbol={newCenterSymbol}
					dropDownSymbols={dropDownSymbols}
				/>
			</Row>
			<Row>
				<Col sm={5} className='pl-0 pr-0'>
					{renderPrefixTirps()}
				</Col>
				<Col sm={2}>
					<button className='btn w-100 mb-4 clear-btn' onClick={() => handleClearClick()}>
						<i className='fas fa-undo mr-2'></i>
						Clear
					</button>
					{renderVisualizationMode()}
					<CenterSymbol
						symbol={centerSymbol}
						symbolName={
							markedTirp['symbols_names'][markedTirp['symbols'].indexOf(centerSymbol)]
						}
						tirp={isClearNext && isClearPrefix ? originalTIRP : markedTirp}
						type={type}
						titleClicked={(newTitles) => setMetricsTitles(newTitles)}
					/>
					{renderRadiosMode()}
				</Col>
				<Col sm={5} className='pl-0 pr-0'>
					{renderNextTirps()}
				</Col>
			</Row>
			<Row>
				<Col lg={3}>
					<PieChartMine
						tirp={isClearNext && isClearPrefix ? originalTIRP : markedTirp}
						type={type}
					/>
				</Col>
				{type === "BPTirps" ?
					<Col lg={3}>
						<BarPlotMine tirp={markedTirp} />
					</Col>
				:null}
				<Col lg={type === "BTirps" ? 9 : 6} className='timeline-container'>
					<TIRPTimeLineMine
						tirp={markedTirp}
						type={type}
						prefixSymbol={symbolsToNames[prefixSymbol]}
						nextSymbol={symbolsToNames[nextSymbol]}
						centerSymbol={symbolsToNames[centerSymbol]}
					/>
				</Col>
			</Row>
		</>
	);
};

export default ExploreTreeView;
