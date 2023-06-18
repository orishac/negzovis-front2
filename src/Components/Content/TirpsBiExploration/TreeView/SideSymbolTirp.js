import * as HelperFunctions from './SideSymbolListHelper';

const SideSymbolTirp = (props) => {
	let tirp = props.tirp;
	let type = props.type;

	const isPredictive = type === '"BPTirps"';

	const rare =
		isPredictive && (tirp['vertical_support_0'] === 0 || tirp['vertical_support_1'] === 0);
	const marked = HelperFunctions.equalTirps(props.markedTirp, tirp);

	const rareClass = rare ? 'rare-tirp-row ' : '';
	const markedClass = marked ? 'marked-tirp ' : '';
	const orderClass = props.isPrefix ? 'prefix ' : 'suffix ';
	const className = rareClass + markedClass + orderClass;

	const getTitleStyle = (titles) => {
		return {
			fontWeight: titles.some((r) => props.clickedTitles.includes(r)) ? 'bold' : 'normal',
		};
	};

	// if BTIRPS we present only class0, so if the TIRP does not appear in class0, dont show it.
	if (!isPredictive && tirp['num_supporting_entities_0'] === 0) {
		return null;
	}

	return (
		<tr
			onClick={() => {
				props.handleSymbolClicked(tirp['connectedSymbol'], props.isPrefix, tirp);
			}}
			className={className}
		>
			<td style={getTitleStyle(['name'])}>{tirp.symbol}</td>
			<td>{tirp.relation}</td>
			<td style={getTitleStyle(['size'])}>
				{tirp.symbols.indexOf(tirp['connectedSymbol']) + 1 + '/' + tirp.size}
			</td>
			<td hidden={type !== '"BPTirps"'} style={getTitleStyle(['score'])}>
				{tirp.score}%
			</td>
			<td style={getTitleStyle(['vs0'])}>{tirp['vertical_support_0'].toFixed(1) + '%'}</td>
			<td hidden={type !== '"BPTirps"'} style={getTitleStyle(['vs1'])}>
				{tirp['vertical_support_1'].toFixed(1) + '%'}
			</td>
			<td style={getTitleStyle(['mhs0'])}>{tirp['mean_horizontal_support_0'].toFixed(1)}</td>
			<td hidden={type !== '"BPTirps"'} style={getTitleStyle(['mhs1'])}>
				{tirp['mean_horizontal_support_1'].toFixed(1)}
			</td>
			<td style={getTitleStyle(['mmd0'])}>{tirp['mean_duration_0'].toFixed(1)}</td>
			<td hidden={type !== '"BPTirps"'} style={getTitleStyle(['mmd1'])}>
				{tirp['mean_duration_1'].toFixed(1)}
			</td>
			<td style={getTitleStyle(['entities0'])}>
				{Math.round(tirp['num_supporting_entities_0'])}
			</td>
			<td hidden={type !== '"BPTirps"'} style={getTitleStyle(['entities1'])}>
				{Math.round(tirp['num_supporting_entities_1'])}
			</td>
		</tr>
	);
};

export default SideSymbolTirp;
