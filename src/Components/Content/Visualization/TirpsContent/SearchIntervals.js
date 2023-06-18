import React, { Component } from 'react';
import { Table } from 'react-bootstrap';

class SearchIntervals extends Component {
	constructor(props) {
		super(props);
		const intervals = this.props.intervals;
		const stateIDs = Object.keys(intervals);
		this.data = stateIDs.map((stateID) => ({ id: stateID, name: intervals[stateID] }));
		this.state = {
			filter: '',
			selected: stateIDs,
		};
	}

	handleOnSelect = (selected, id) => {
		const newSelected = selected
			? this.state.selected.filter((x) => x !== id)
			: [...this.state.selected, id];

		this.setState({ selected: newSelected });
		this.props.changeList(newSelected);
	};

	handleOnSelectAll = () => {
		const allSelected = this.state.selected.length === this.data.length;
		let newSelected = allSelected ? [] : this.data.map((r) => r.id);
		this.setState({ selected: newSelected });
		this.props.changeList(newSelected);
	};

	render() {
		return (
			<div className='intervals'>
				<div className='vertical-scroll-intervals'>
					<Table
						striped={true}
						bordered={true}
						hover={true}
						className='btable'
						style={{ tableLayout: 'fixed', textAlign: 'center' }}
					>
						<thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
							<tr>
								<th
									onClick={() => this.handleOnSelectAll()}
									style={{ width: '10%' }}
								>
									<input
										type='checkbox'
										checked={this.state.selected.length === this.data.length}
										onChange={() => this.handleOnSelectAll()}
									/>
								</th>
								<th style={{fontSize: 'large'}}>{this.props.title + " Symbol"}</th>
							</tr>
							<tr>
								<th></th>
								<th style={{ paddingBottom: 0, paddingTop: 0 }}>
									<input
										type='text'
										className={'filter-input FontAwesome'}
										style={{ color: '#d7dfdf' }}
										placeholder='&#xF002; Filter'
										value={this.state.filter}
										onChange={(e) => this.setState({ filter: e.target.value })}
									/>
								</th>
							</tr>
						</thead>
						<tbody>
							{this.data
								.filter((symbol) => (symbol.name).toLowerCase().includes((this.state.filter).toLowerCase()))
								.map((symbol, index) => {
									const selected = false;
									const checked =
										this.state.selected.find((id) => id === symbol.id) !==
										undefined;
									return (
										<tr
											key={index}
											onClick={() => this.handleOnSelect(checked, symbol.id)}
											style={selected ? { backgroundColor: '#AED6F1' } : {}}
										>
											<td>
												<input
													type='checkbox'
													checked={checked}
													onChange={() =>
														this.handleOnSelect(checked, symbol.id)
													}
												/>
											</td>
											<td>{symbol.name}</td>
										</tr>
									);
								})}
						</tbody>
					</Table>
				</div>
			</div>
		);
	}
}

export default SearchIntervals;
