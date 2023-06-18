import React from 'react';
import * as ReactBootstrap from 'react-bootstrap';

const TirpMatrix = (props) => {
	const relationsJson = {
		'<': 'before (<)',
		c: 'contains (c)',
		m: 'meet (m)',
		s: 'starts(s)',
		o: 'overlap(o)',
		f: 'finished-by(f)',
		'=': 'equal(=)',
	};
	const tirp = props.tirp;
	const symbols = tirp['symbols'];
	const relations = tirp['relations'];
	const matrixRowsIndexes = new Array(symbols.length - 1).fill(0);
	const matrixColumnsIndexes = new Array(symbols.length).fill(0);

	// this method keeps track of the next relation to be presented
	// in the half matrix :
	// every call the index theat points to the next relation grows.
	let relationIndex = 0;
	const get_approprite_relation = () => {
		relationIndex++;
		return relations[relationIndex - 1];
	};

	return (
		<div className='tirpMatrix'>
			{relations.length > 0 ? (
				<ReactBootstrap.Table className='tirp-matrix-table' style={{ height: '370pxF' }}>
					<thead>
						<tr>
							{symbols.map((_, index) => {
								return [
									<td style={{ width: 'fit-content' }} key={index}>
										{index === 0 ? null : props.symbolsToNames[symbols[index]]}
									</td>,
								];
							})}
						</tr>
					</thead>
					<tbody>
						{matrixRowsIndexes.map((_, i) => {
							return [
								<tr style={{ height: 'fit-content' }} key={i}>
									{matrixColumnsIndexes.map((_, j) => {
										return [
											<td
												className='cell'
												key={j}
												style={
													j === 0
														? { fontWeight: 'bold', fontSize: 'large' }
														: { fontSize: 'large' }
												}
											>
												{j === 0
													? props.symbolsToNames[symbols[i]]
													: //  half matrix is empty
													i > 0 && i >= j
													? null
													: relationsJson[get_approprite_relation()]}
											</td>,
										];
									})}
								</tr>,
							];
						})}
					</tbody>
				</ReactBootstrap.Table>
			) : null}
		</div>
	);
};

export default TirpMatrix;
