import React, { Component } from 'react';
import { Table } from 'react-bootstrap';

class NSearchIntervals extends Component {
	constructor(props) {
		super(props);
		this.state = {
			filter: '',
			selected: [],
      vnames: [],
		};
	}


    componentDidMount() {
			let allVnames = []  
			if (localStorage.negative === 'true') {
				const entities = JSON.parse(localStorage.VMapFile);
				for (const [key, value] of Object.entries(entities)) {
					allVnames.push(value)
					allVnames.push(String.fromCharCode(172) + value)
				}
				this.setState({
					vnames: allVnames,
					selected: allVnames
				});
			}
	}

	handleOnSelect = (selected, name) => {
		const newSelected = selected
			? this.state.selected.filter((x) => x !== name)
			: [...this.state.selected, name];

		this.setState({ selected: newSelected });
		this.props.changeList(newSelected);
	};

	handleOnSelectAll = () => {
		const allSelected = this.state.selected.length === this.state.vnames.length;
		let newSelected = allSelected ? [] : this.state.vnames;
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
										checked={this.state.selected.length === this.state.vnames.length}
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
							{this.state.vnames
								.filter((symbol) => (symbol).toLowerCase().includes((this.state.filter).toLowerCase()))
								.map((symbol, index) => {
									const selected = false;
									const checked = this.state.selected.find((s) => symbol === s) !== undefined
									return (
										<tr
											key={index}
											onClick={() => this.handleOnSelect(checked, symbol)}
											style={selected ? { backgroundColor: '#AED6F1' } : {}}
										>
											<td>
												<input
													type='checkbox'
													checked={checked}
													onChange={() =>
														this.handleOnSelect(checked, symbol)
													}
												/>
											</td>
											<td>{symbol}</td>
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

export default NSearchIntervals;
