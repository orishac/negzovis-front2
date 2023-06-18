import React, { Component } from 'react';

import { Card, Button, Form } from 'react-bootstrap';
import { updateDetails } from '../../../../networking/requests/manage_datasets';

/**
 * in this card you can see the data set name, the category, the owner, the source and the descreption.
 */
const ShowAndEdit = ({ name, edit = false, value, updateDetails }) => (
	<Card.Text className={'h6 margin-info-down info-line'}>
		<b>{name}:</b>
		{edit ? (
			<Form.Control
				value={value}
				style={{ display: 'inline' }}
				onInput={(e) => updateDetails(e.target.value)}
			/>
		) : (
			value
		)}
	</Card.Text>
);

class InfoCard extends Component {
	constructor(props) {
		super(props);

		this.state = {
			editMode: false,
		};
	}

	render() {
		console.log(this.props);
		return (
			<Card>
				<Card.Header className={'h3 bg-hugobot'}>
					<Card.Text className={'text-hugobot'}>
						<i className='fas fa-info' /> Basic Information
					</Card.Text>
				</Card.Header>
				<Card.Body as={'small'}>
					<Card.Text className={'h6 margin-info-down info-line'}>
						<b>Dataset name:</b> {this.props.DatasetName}
					</Card.Text>
					<Card.Text className={'h6 margin-info-down info-line'}>
						<b>Category:</b> {this.props.Category}
					</Card.Text>
					<Card.Text className={'h6 margin-info-down info-line'}>
						<b>Owner:</b> {this.props.Owner}
					</Card.Text>
					<ShowAndEdit
						name='Source'
						edit={this.state.editMode}
						value={this.props.Source}
						updateDetails={(value) => this.props.updateDetails('Source', value)}
					/>
					<ShowAndEdit
						name='Description'
						edit={this.state.editMode}
						value={this.props.Description}
						updateDetails={(value) => this.props.updateDetails('Description', value)}
					/>
					<ShowAndEdit
						name='Class 0 - Name'
						edit={this.state.editMode}
						value={this.props.class0Name}
						updateDetails={(value) => this.props.updateDetails('class0Name', value)}
					/>
					<ShowAndEdit
						name='Class 1 - Name'
						edit={this.state.editMode}
						value={this.props.class1Name}
						updateDetails={(value) => this.props.updateDetails('class1Name', value)}
					/>
				</Card.Body>
				<Card.Footer>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: this.state.editMode ? 'center' : 'flex-end',
						}}
					>
						{this.state.editMode ? (
							<Button
								className='btn-hugobot'
								style={{ width: '50%' }}
								onClick={() => {
									updateDetails(
										this.props.DatasetName,
										this.props.Description,
										this.props.Source,
										this.props.class0Name,
										this.props.class1Name
									).then(() => {
										this.setState({ editMode: false });
									});
								}}
							>
								apply
							</Button>
						) : (
							<div
								className='more-btn-container'
								onClick={() => this.setState({ editMode: true })}
							>
								<i class='fas fa-pen more-btn' />
							</div>
						)}
					</div>
				</Card.Footer>
			</Card>
		);
	}
}
export default InfoCard;
