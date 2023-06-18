import React, { Component } from 'react';
import { Card } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';

class NTirpMatrix extends Component {
	state = {
		matrix: [],
		tirp: {},
        currentlevel: 0,
		vnames: [], 
	};
	constructor(props) {
		super(props);
		this.state.tirp = this.props.tirp;
        this.state.currentlevel = this.props.currentlevel
	}

	componentDidMount() {
		if (this.props.show && this.props.currentlevel > 0) {
			this.DrawMatrix();
		}
		if (localStorage.negative === 'true') {
			const entities = JSON.parse(localStorage.VMapFile);
			this.setState({
				vnames: entities
			});
		}
	}

	// This function is responsible for drawing the matrix -> setting the arrays correctly and from those array the matrix if formed
	DrawMatrix = () => {
		let currTirp = this.props.tirp;
			let symbols = this.props.currentlevel > 0 ? currTirp.elements : [[]];
			const elements = [].concat(...symbols);

			const mapping = symbols.reduce((acc, innerArray, arrayIndex) => {
				return acc.concat(innerArray.map((value, valueIndex) => ({
				value,
				arrayIndex,
				valueIndex: acc.length + valueIndex + 1,
				})));
			}, []);
		
			const matrix = [];
			let mElements = elements.slice(1, elements.length + 1);
			mElements = [""].concat(mElements)

			// Add the first row with the elements in their order
			matrix.push(mElements);

			for (let i = 0; i < elements.length - 1; i++) {
			matrix[i + 1] = [String(this.state.vnames[elements[i]])];
			}
			for (let i = 1; i < elements.length; i++) {
			for (let j = 1; j < elements.length; j++) {
				let row_element;
				mapping.forEach(element => {
					if (element.valueIndex === j) {
						row_element = element.arrayIndex
					}
				});
				let col_element;
				mapping.forEach(element => {
					if (element.valueIndex - 1 === i) {
						col_element = element.arrayIndex
					}
				});
				if(row_element === col_element) {
					matrix[j][i] = "equals"
				}
				if(row_element < col_element) { 
					matrix[j][i] = "before"
				}
				if(row_element > col_element) { 
					matrix[j][i] = ""
				}
				if(j > i) {
					matrix[j][i] = ""
				}
			}
			}
			for (let j = 1; j < elements.length; j++) {
				matrix[0][j] = String(this.state.vnames[matrix[0][j]])
			}
			// eslint-disable-next-line
			this.state.matrix = matrix
	};

	draw = () => {
        this.DrawMatrix();
		return this.state.matrix.map((line, i) => (
			<tr key={i}>
				{line.map((num, j) => (
					<td key={j}>{String(num)}</td>
				))}
			</tr>
		));
	};

	render() {
		return (
			<Modal
				{...this.props}
				size='lg'
				aria-labelledby='contained-modal-title-vcenter'
				centered
			>
				<Modal.Header className={'bg-hugobot'} closeButton>
					<Card.Text id="relations-header" className={'text-hugobot text-hugoob-advanced'}>Relations</Card.Text>
				</Modal.Header>
				<Modal.Body>
					<table
						style={{
							borderWidth: '2px',
							borderColor: '#aaaaaa',
							borderStyle: 'solid',
						}}
						data-testid='test-matrix'
					>
						<tbody>
							{this.draw()}
						</tbody>
					</table>
				</Modal.Body>
			</Modal>
		);
	}
}

export default NTirpMatrix;
