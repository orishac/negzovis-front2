import React, { useEffect, useState } from 'react';
import TIRPsPie from '../../Visualization/TirpsContent/TIRPsPie';

const PieChartMine = (props) => {
	let type = props.type;

	const [row, setRow] = useState({
		_TIRP__mean_offset_from_first_symbol: props.tirp['mean_offset_from_first_symbol_0'],
		_TIRP__mean_offset_from_first_symbol_class_1: props.tirp['mean_offset_from_first_symbol_1'],
		_TIRP__mean_of_first_interval: props.tirp['mean_of_first_interval_0'],
		_TIRP__mean_of_first_interval_class_1: props.tirp['mean_of_first_interval_1'],
		_TIRP__mean_duration: props.tirp['mean_duration_0'],
		_TIRP__mean_duration_class_1: props.tirp['mean_duration_1'],
		_TIRP__exist_in_class0: props.tirp['exist_in_class0'],
		_TIRP__exist_in_class1: props.tirp['exist_in_class1'],
		durationOfFirstInterval: props.tirp['mean_duration_0'],
		durationOfFirstIntervalClass1: props.tirp['mean_duration_1'],
		_TIRP__symbols: props.tirp['symbols_names'],
		_TIRP__supporting_entities_properties: props.tirp['supporting_entities_properties_0'],
		_TIRP__supporting_entities_properties_class_1:
			props.tirp['supporting_entities_properties_1'],
	});

	useEffect(() => {
		const supporting_entities_properties_0 = {};
		for (const property in props.tirp['supporting_entities_properties_0']) {
			const values_counts = {};
			for (const value_count of props.tirp['supporting_entities_properties_0'][property]) {
				const value = Object.keys(value_count)[0];
				const count = Object.values(value_count)[0];
				values_counts[value] = count;
			}
			supporting_entities_properties_0[property] = values_counts;
		}

		const supporting_entities_properties_1 = {};
		for (const property in props.tirp['supporting_entities_properties_1']) {
			const values_counts = {};
			for (const value_count of props.tirp['supporting_entities_properties_1'][property]) {
				const value = Object.keys(value_count)[0];
				const count = Object.values(value_count)[0];
				values_counts[value] = count;
			}
			supporting_entities_properties_1[property] = values_counts;
		}
		setRow({
			_TIRP__mean_offset_from_first_symbol: props.tirp['mean_offset_from_first_symbol_0'],
			_TIRP__mean_offset_from_first_symbol_class_1:
				props.tirp['mean_offset_from_first_symbol_1'],
			_TIRP__mean_of_first_interval: props.tirp['mean_of_first_interval_0'],
			_TIRP__mean_of_first_interval_class_1: props.tirp['mean_of_first_interval_1'],
			_TIRP__mean_duration: props.tirp['mean_duration_0'],
			_TIRP__mean_duration_class_1: props.tirp['mean_duration_1'],
			_TIRP__exist_in_class0: props.tirp['exist_in_class0'],
			_TIRP__exist_in_class1: props.tirp['exist_in_class1'],
			_TIRP__symbols: props.tirp['symbols_names'],
			_TIRP__supporting_entities_properties: supporting_entities_properties_0,
			_TIRP__supporting_entities_properties_class_1: supporting_entities_properties_1,
		});
	}, [props.tirp]);

	return row['_TIRP__supporting_entities_properties'] !== undefined &&
		row['_TIRP__supporting_entities_properties'] !== null ? (
		<TIRPsPie row={row} type_of_comp={type === "BTirps" ? 'tirp' : 'disc'} />
	) : null;
};

export default PieChartMine;
