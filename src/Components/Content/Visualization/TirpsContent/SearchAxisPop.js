import React, { Component } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
// import WeightsForm from "./WeightsForm";

/*
props = {
	axes: [{ string: string}]
	options: [{string: string[]}]
	onChange: ([{ string: string}]) => void 
}
*/
class SearchAxisPop extends Component {
	render() {
		return (
			<div className='axis'>
				<Row>
					{Object.entries(this.props.axes).map(([axis, measure]) => {
						return (
							<Col key={axis}>
								<Form.Label className={'text-bold-black'}>{axis}</Form.Label>

								<Form.Control
									className={'font-weight-bold'}
									as='select'
									defaultValue={measure}
									onChange={(e) => {
										const newAxes = {
											...this.props.axes,
											[axis]: e.target.value,
										};
										this.props.onChange(newAxes);
									}}
								>
									{this.props.options[axis].map((measure, index) => (
										<option value={measure} key={index}>
											{this.props.measureToTitles[measure]}
										</option>
									))}
								</Form.Control>
							</Col>
						);
					})}
					{/* <Col>
						<Form.Label className={'text-bold-black'}>Bubble Size </Form.Label>
						<span
							style={{
								color: '#495057',
								lineHeight: 1.5,
								fontWeight: 700,
								display: 'block',
							}}
						>
							Rating
						</span>
					</Col> */}
				</Row>
			</div>
		);
	}
}

export default SearchAxisPop;
