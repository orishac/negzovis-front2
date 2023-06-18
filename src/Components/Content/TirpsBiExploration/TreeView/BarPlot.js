import React, { useEffect, useState } from 'react';
import DTirpBarPlot from '../../Visualization/TirpsContent/DTirpBarPlot';

const BarPlotMine = (props) => {
	const [row, setRow] = useState({
        _TIRP__vertical_support: props.tirp['vertical_support_0'],
        _TIRP__vertical_support_class_1: props.tirp['vertical_support_1'],
        _TIRP__mean_horizontal_support: props.tirp['mean_horizontal_support_0'],
        _TIRP__mean_horizontal_support_class_1: props.tirp['mean_horizontal_support_1'],
        _TIRP__hs_confidence_interval_low_class_1: props.tirp['hs_confidence_interval_low_class_1'],
        _TIRP__hs_confidence_interval_high_class_1: props.tirp['hs_confidence_interval_high_class_1'],
        _TIRP__hs_confidence_interval_low_class_0: props.tirp['hs_confidence_interval_low'],
        _TIRP__hs_confidence_interval_high_class_0: props.tirp['hs_confidence_interval_high'],
		_TIRP__mean_duration: props.tirp['mean_duration_0'],
		_TIRP__mean_duration_class_1: props.tirp['mean_duration_1'],
        _TIRP__md_confidence_interval_low_class_1: props.tirp['md_confidence_interval_low_class_1'],
        _TIRP__md_confidence_interval_high_class_1: props.tirp['md_confidence_interval_high_class_1'],
        _TIRP__md_confidence_interval_low_class_0: props.tirp['md_confidence_interval_low'],
        _TIRP__md_confidence_interval_high_class_0: props.tirp['md_confidence_interval_high']
	});

	useEffect(() => {
		setRow({
            _TIRP__vertical_support: props.tirp['vertical_support_0'],
            _TIRP__vertical_support_class_1: props.tirp['vertical_support_1'],
            _TIRP__mean_horizontal_support: props.tirp['mean_horizontal_support_0'],
            _TIRP__mean_horizontal_support_class_1: props.tirp['mean_horizontal_support_1'],
            _TIRP__hs_confidence_interval_low_class_1: props.tirp['hs_confidence_interval_low_class_1'],
            _TIRP__hs_confidence_interval_high_class_1: props.tirp['hs_confidence_interval_high_class_1'],
            _TIRP__hs_confidence_interval_low_class_0: props.tirp['hs_confidence_interval_low'],
            _TIRP__hs_confidence_interval_high_class_0: props.tirp['hs_confidence_interval_high'],
            _TIRP__mean_duration: props.tirp['mean_duration_0'],
            _TIRP__mean_duration_class_1: props.tirp['mean_duration_1'],
            _TIRP__md_confidence_interval_low_class_1: props.tirp['md_confidence_interval_low_class_1'],
            _TIRP__md_confidence_interval_high_class_1: props.tirp['md_confidence_interval_high_class_1'],
            _TIRP__md_confidence_interval_low_class_0: props.tirp['md_confidence_interval_low'],
            _TIRP__md_confidence_interval_high_class_0: props.tirp['md_confidence_interval_high']
		});
	}, [props.tirp]);

	return (
		<DTirpBarPlot
			row={row}
		/>
	);
};

export default BarPlotMine;
