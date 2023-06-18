import React, { Component } from 'react';
import Chart from 'react-google-charts';
import { ButtonGroup, Card, ToggleButton } from 'react-bootstrap';
import service from './service.js';

class TIRPTimeLine extends Component {
	defaultColors = ['#ff6347', '#ee82ee', '#ffa500', '#6a5acd', '#7f2b47', '#7fffe6', '#ffff10'];

	state = {
		classMode: 0,
	};

	computeColors() {
		const colorsFromSymbols = () =>
			this.symbols.map((symbol, idx) => {
				const colorsPerSymbol = {
					[this.props.prefixSymbol]: 'red',
					[this.props.nextSymbol]: 'green',
					[this.props.centerSymbol]: 'rgb(44, 64, 100)',
				};
				return colorsPerSymbol[symbol] || this.defaultColors[idx];
			});

		return this.props.colorIntervals ? colorsFromSymbols() : [];
	}

	timesToSymbols(times) {
		return times.map((time) => service.getDateForSymbol(time));
	}

	computeDataset = (isDiscriminative, classMode) => {
		const timesCls0 = this.props.tirp._TIRP__mean_offset_from_first_symbol;
		const timesCls1 = this.props.tirp._TIRP__mean_offset_from_first_symbol_class_1;

		const durationFirstIntervalCls0 = this.props.tirp._TIRP__mean_of_first_interval;
		const durationFirstIntervalCls1 = this.props.tirp._TIRP__mean_of_first_interval_class_1;

		const data = this.symbols.map((symbol, i) => {
			const offsetCls1 = durationFirstIntervalCls1;
			const offsetCls0 = durationFirstIntervalCls0;

			const [startTimeCls0, endTimeCls0, startTimeCls1, endTimeCls1] = this.timesToSymbols(
				i === 0
					? [0, offsetCls0, 0, offsetCls1]
					: [
							offsetCls0 + timesCls0[2 * i],
							offsetCls0 + timesCls0[2 * i + 1],
							offsetCls1 + timesCls1[2 * i],
							offsetCls1 + timesCls1[2 * i + 1],
					  ]
			);

			const durationCls0 = this.props.tirp._TIRP__exist_in_class0
				? service.getDiffBetweenDates(startTimeCls0, endTimeCls0)
				: '0';
			const durationCls1 = this.props.tirp._TIRP__exist_in_class1
				? service.getDiffBetweenDates(startTimeCls1, endTimeCls1)
				: '0';
			const duration = isDiscriminative ? `${durationCls0} / ${durationCls1}` : durationCls0;

			const intervalCls1 = [startTimeCls1, endTimeCls1];
			const intervalCls0 = [startTimeCls0, endTimeCls0];
			const [startTime, endTime] = classMode === 1 ? intervalCls1 : intervalCls0;

			return [symbol, `${symbol} - ${duration}`, startTime, endTime];
		});

		return [
			[
				{ type: 'string', id: 'Term' },
				{ type: 'string', id: 'Name' },
				{ type: 'date', id: 'Start' },
				{ type: 'date', id: 'End' },
			],
			...data,
		];
	};

	render() {
		this.symbols = this.props.tirp._TIRP__symbols;
		const isDiscriminative = this.props.type_of_comp === 'disc';
		const existInClass1 = this.props.tirp._TIRP__exist_in_class1;
		const existInClass0 = this.props.tirp._TIRP__exist_in_class0;
		const classMode = !existInClass1 ? 0 : !existInClass0 ? 1 : this.state.classMode;
		const dataset = this.computeDataset(isDiscriminative, classMode);
		const colors = this.computeColors();
		const intervals = dataset.slice(1);
		const ticks = intervals.flatMap((interval) => interval.slice(2, 4));
		const hasHours = ticks.find((tick) => tick.getHours() > 0);
		return (
			<div>
				<Card>
					<Card.Header className={'bg-hugobot'}>
						<Card.Text className={'text-hugobot text-hugoob-advanced'}>
							Mean Presentation
						</Card.Text>
					</Card.Header>
					<Card.Body>
						<Chart
							height={'200px'}
							chartType='Timeline'
							loader={<div>Loading Chart</div>}
							data={dataset}
							options={{
								timeline: {
									rowLabelStyle: {
										fontSize: 16,
										color: '#603913',
										groupByRowLabel: false,
										showBarLabels: false,
									},
								},
								colors: colors.length > 0 ? colors : null,
								hAxis: {
									ticks: { ...ticks },
									format: hasHours ? 'H:mm:ss' : 'm:ss',
								},
							}}
						/>
						{isDiscriminative && (
							<ButtonGroup
								toggle={true}
								style={{ display: 'block', marginLeft: '50%' }}
								size='lg'
							>
								<ToggleButton
									checked={classMode === 0}
									className={'btn-hugobot'}
									onClick={() => this.setState({ classMode: 0 })}
									type={'radio'}
									value={0}
									disabled={!existInClass0}
								>
									{localStorage.class_name}
								</ToggleButton>
								<ToggleButton
									checked={classMode === 1}
									className={'btn-hugobot'}
									onClick={() => this.setState({ classMode: 1 })}
									type={'radio'}
									value={1}
									disabled={!existInClass1}
								>
									{localStorage.second_class_name}
								</ToggleButton>
							</ButtonGroup>
						)}
					</Card.Body>
				</Card>
			</div>
		);
	}
}
export default TIRPTimeLine;
