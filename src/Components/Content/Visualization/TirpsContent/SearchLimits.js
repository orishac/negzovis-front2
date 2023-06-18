import React, { Component } from 'react';
import { Button, Table } from 'react-bootstrap';
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react';

class NumInput {
	constructor(name, min, max, value, isPercent = false) {
		this.attributes = { name, min, max, value };
		this.isPercent = isPercent;
	}
}

const RATE_MAX = 0;
const RATE_MIN = 1;
const RATE_MEAN = 2;
class SearchLimits extends Component {
	minVS = parseFloat(localStorage.min_ver_support) * 100;
	rateToName = {
		[RATE_MAX]: 'Max',
		[RATE_MIN]: 'Min',
		[RATE_MEAN]: 'Mean',
	};

	renderDropDownItem(measure, rateType) {
		return (
			<CDropdownItem
				style={{ cursor: 'pointer' }}
				onClick={() => {
					const newMeasureToRate = {
						...this.props.measureToRate,
						[measure]: rateType,
					};
					this.props.changeMeasureToRate(newMeasureToRate);
				}}
			>
				{this.rateToName[rateType]}
			</CDropdownItem>
		);
	}

	renderMeanDropDown(measure) {
		return (
			<CDropdown>
				<CDropdownToggle color='secondary'>
					{this.rateToName[this.props.measureToRate[measure]]}
				</CDropdownToggle>
				<CDropdownMenu>
					{this.renderDropDownItem(measure, RATE_MAX)}
					{this.renderDropDownItem(measure, RATE_MEAN)}
					{this.renderDropDownItem(measure, RATE_MIN)}
				</CDropdownMenu>
			</CDropdown>
		);
	}

	renderCell(numInput) {
		return (
			<td className='shirtcol' key={numInput.attributes.name}>
				<input
					{...numInput.attributes}
					type='number'
					onChange={(e) => this.props.changeParameter(e)}
				/>
				{numInput.isPercent ? '%' : ''}
			</td>
		);
	}
	render() {
		const inputs = {
			cls0: {
				max: [
					new NumInput(
						'maxVSCls0',
						this.minVS,
						100,
						this.props.parameters.maxVSCls0,
						true
					),
					new NumInput('maxHSCls0', 1, 100, this.props.parameters.maxHSCls0),
					new NumInput('maxSizeCls0', 1, 100, this.props.parameters.maxSizeCls0),
				],
				min: [
					new NumInput(
						'minVSCls0',
						this.minVS,
						100,
						this.props.parameters.minVSCls0,
						true
					),
					new NumInput('minHSCls0', 1, 100, this.props.parameters.minHSCls0),
					new NumInput('minSizeCls0', 1, 100, this.props.parameters.minSizeCls0),
				],
			},
			cls1: {
				max: [
					new NumInput(
						'maxVSCls1',
						this.minVS,
						100,
						this.props.parameters.maxVSCls1,
						true
					),
					new NumInput('maxHSCls1', 1, 100, this.props.parameters.maxHSCls1),
					new NumInput('maxSizeCls0', 1, 100, this.props.parameters.maxSizeCls0),
				],
				min: [
					new NumInput(
						'minVSCls1',
						this.minVS,
						100,
						this.props.parameters.minVSCls1,
						true
					),
					new NumInput('minHSCls1', 1, 100, this.props.parameters.minHSCls1),
					new NumInput('minSizeCls0', 1, 100, this.props.parameters.minSizeCls0),
				],
			},
		};
		return (
			<div className='limits'>
				<Table className='limits-table'>
					<thead>
						<tr className='smallcol'>
							{this.props.isPredictive && <th className='shirtcol'></th>}
							<th className='shirtcol'></th>
							<th>V.S</th>
							<th>M.H.S</th>
							<th>TIRP Size</th>
						</tr>
					</thead>

					<tbody>
						<tr>
							{this.props.isPredictive && (
								<td className='shirtcol' rowSpan={3}>
									{localStorage.class_name}
								</td>
							)}
							<td className='shirtcol'>Max</td>
							{inputs.cls0.max.map(this.renderCell.bind(this))}
						</tr>
						<tr>
							<td className='shirtcol'>Min</td>
							{inputs.cls0.min.map(this.renderCell.bind(this))}
						</tr>
						<tr>
							<td className='shirtcol'>Rate By</td>
							<td>{this.renderMeanDropDown('vs0')}</td>
							<td>{this.renderMeanDropDown('mhs0')}</td>
							<td>{this.renderMeanDropDown('size')}</td>
						</tr>
						{this.props.isPredictive && (
							<>
								<tr>
									<td className='shirtcol' rowSpan={3}>
										{localStorage.second_class_name}
									</td>
									<td className='shirtcol'>Max</td>
									{inputs.cls1.max.map(this.renderCell.bind(this))}
								</tr>
								<tr>
									<td className='shirtcol'>Min</td>
									{inputs.cls1.min.map(this.renderCell.bind(this))}
								</tr>
								<tr>
									<td className='shirtcol'>Rate By</td>
									<td>{this.renderMeanDropDown('vs1')}</td>
									<td>{this.renderMeanDropDown('mhs1')}</td>
									<td>{this.renderMeanDropDown('size')}</td>
								</tr>
							</>
						)}
					</tbody>
				</Table>
				<center>
					<Button onClick={() => this.props.searchTirps()}>
						<b>Search</b>
					</Button>
				</center>
			</div>
		);
	}
}

export default SearchLimits;
