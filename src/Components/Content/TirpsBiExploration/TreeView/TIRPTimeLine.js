import React, { useEffect, useState } from 'react';
import TIRPTimeLine from '../../Visualization/TirpsContent/TIRPTimeLine';

const TIRPTimeLineMine = (props) => {
	let type = props.type;

	const [row, setRow] = useState({
		_TIRP__mean_offset_from_first_symbol: Array.isArray(
			props.tirp['mean_offset_from_first_symbol_0']
		)
			? props.tirp['mean_offset_from_first_symbol_0']
			: [],
		_TIRP__mean_offset_from_first_symbol_class_1: props.tirp['mean_offset_from_first_symbol_1'],
		_TIRP__mean_of_first_interval: Array.isArray(props.tirp['mean_of_first_interval_0'])
			? 0
			: props.tirp['mean_of_first_interval_0'],
		_TIRP__mean_of_first_interval_class_1: props.tirp['mean_of_first_interval_1'],
		_TIRP__mean_duration: props.tirp['mean_duration_0'],
		_TIRP__mean_duration_class_1: props.tirp['mean_duration_1'],
		_TIRP__exist_in_class0: props.tirp['exist_in_class0'],
		_TIRP__exist_in_class1: props.tirp['exist_in_class1'],
		durationOfFirstInterval: props.tirp['mean_duration_0'],
		durationOfFirstIntervalClass1: props.tirp['mean_duration_1'],
		_TIRP__symbols: props.tirp['symbols_names'],
	});

	useEffect(() => {
		setRow({
			_TIRP__mean_offset_from_first_symbol: Array.isArray(
				props.tirp['mean_offset_from_first_symbol_0']
			)
				? props.tirp['mean_offset_from_first_symbol_0']
				: [],
			_TIRP__mean_offset_from_first_symbol_class_1:
				props.tirp['mean_offset_from_first_symbol_1'],
			_TIRP__mean_of_first_interval: Array.isArray(props.tirp['mean_of_first_interval_0'])
				? 0
				: props.tirp['mean_of_first_interval_0'],
			_TIRP__mean_of_first_interval_class_1: props.tirp['mean_of_first_interval_1'],
			_TIRP__mean_duration: props.tirp['mean_duration_0'],
			_TIRP__mean_duration_class_1: props.tirp['mean_duration_1'],
			_TIRP__exist_in_class0: props.tirp['exist_in_class0'],
			_TIRP__exist_in_class1: props.tirp['exist_in_class1'],
			_TIRP__symbols: props.tirp['symbols_names'],
		});
	}, [props.tirp]);

	return (
		<TIRPTimeLine
			tirp={row}
			type_of_comp={type === "BTirps" ? 'tirp' : 'disc'}
			colorIntervals={true}
			prefixSymbol={props.prefixSymbol}
			nextSymbol={props.nextSymbol}
			centerSymbol={props.centerSymbol}
		/>
	);
};

export default TIRPTimeLineMine;
