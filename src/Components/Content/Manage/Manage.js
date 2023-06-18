import Cookies from 'js-cookie';
import React, { Component } from 'react';

import { Button, Container, Form, Nav, Table } from 'react-bootstrap';
import {
	acceptPermission,
	askPermission,
	loadMail as loadMailRequest,
	rejectPermission,
} from '../../../networking/requests/permissions';
import { errorAlert } from '../../SweetAlerts';
/**
 * this is the mail module.
 * here you can ask for access to a dataset and approve a request for a data set.
 * moreover you can see witch data sets have been approved and witch one is yours.
 */

class Manage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pageLoc: 'myDatasets',
			filterDatasetName: '',
			filterCategory: '',
			filterSize: '',
			filterOwner: '',
			filterPublicPrivate: '',
		};

		this.askPermissionHandler = this.askPermissionHandler.bind(this);
		this.acceptPermissionHandler = this.acceptPermissionHandler.bind(this);
		this.rejectPermissionHandler = this.rejectPermissionHandler.bind(this);

		this.loadMail();
	}

	filter = () => {
		this.setState({
			filterCategory: document.getElementById('category').value,
			filterDatasetName: document.getElementById('datasetName').value,
			filterSize: document.getElementById('size').value,
			filterOwner: document.getElementById('owner').value,
			filterPublicPrivate: document.getElementById('publicPrivate').value,
		});
		this.forceUpdate();
	};

	askPermissionHandler(e) {
		//get td id and extract inner html
		let id = e.target.id.split('-')[1];
		let datasetName = document.getElementById('managePermissionDatasetName-' + id).innerHTML;

		askPermission(datasetName)
			.then(() => this.loadMail())
			.catch(errorAlert);
	}

	acceptPermissionHandler(e) {
		//get td id and extract inner html
		let id = e.target.id.split('-')[1];
		let datasetName = document.getElementById('managePermissionDatasetName-' + id).innerHTML;
		let email = document.getElementById('managePermissionGrantee-' + id).innerHTML;

		acceptPermission(datasetName, email)
			.then(() => this.loadMail())
			.catch(errorAlert);
	}

	rejectPermissionHandler(e) {
		//get td id and extract inner html
		let id = e.target.id.split('-')[1];
		let datasetName = document.getElementById('managePermissionDatasetName-' + id).innerHTML;
		let email = document.getElementById('managePermissionGrantee-' + id).innerHTML;

		rejectPermission(datasetName, email).catch(errorAlert);
		this.loadMail();
	}

	loadMail() {
		loadMailRequest()
			.then((data) => {
				let i;
				let restablesToExplore = data['tablesToExplore'];

				let tablesToExplore = { rows: [] };
				for (i = 0; i < data['tablesToExploreLen']; i++) {
					let y = restablesToExplore[parseInt(i)];
					tablesToExplore.rows.push(y);
				}

				sessionStorage.setItem('tablesToExplore', JSON.stringify(tablesToExplore));

				let resMyDatasets = data['myDatasets'];
				let myDatasets = { rows: [] };
				for (i = 0; i < data['myDatasetsLen']; i++) {
					let y = resMyDatasets[parseInt(i)];
					myDatasets.rows.push(y);
				}

				sessionStorage.setItem('myDatasets', JSON.stringify(myDatasets));

				let resMyPermissions = data['myPermissions'];
				let myPermissions = { rows: [] };
				for (i = 0; i < data['myPermissionsLen']; i++) {
					let y = resMyPermissions[parseInt(i)];
					myPermissions.rows.push(y);
				}

				sessionStorage.setItem('myPermissions', JSON.stringify(myPermissions));

				// let fullName = response.data['User_full_name']
				let resAskPermissions = data['askPermissions'];
				let askPermissions = { rows: [] };
				for (i = 0; i < data['askPermissionsLen']; i++) {
					let y = resAskPermissions[parseInt(i)];
					//if he is the owner, then it's a request that he needs to approve.
					//else, it's a request that he asked for and no further action is available
					// if(y['Owner'].localeCompare(fullName) === 0)
					//     approve.rows.push(y);
					// else
					askPermissions.rows.push(y);
				}

				sessionStorage.setItem('askPermissions', JSON.stringify(askPermissions));

				let resApprove = data['approve'];
				let approve = { rows: [] };
				for (i = 0; i < data['approveLen']; i++) {
					let y = resApprove[parseInt(i)];
					approve.rows.push(y);
				}
				sessionStorage.setItem('approve', JSON.stringify(approve));
				window.dispatchEvent(new Event('ReloadMail'));
			})
			.catch(errorAlert);
	}

	clicked = (id) => {
		this.setState({ pageLoc: id });
		this.forceUpdate();
	};

	isInTab = (tab, datasetName) => {
		let flag = false;
		JSON.parse(sessionStorage.getItem(tab)).rows.find(
			(iter) => (flag |= datasetName.localeCompare(iter['DatasetName']) === 0)
		);
		return flag;
	};

	isInExploreTab = (datasetName) => {
		return !(
			this.isInTab('myDatasets', datasetName) ||
			this.isInTab('myPermissions', datasetName) ||
			this.isInTab('askPermissions', datasetName) ||
			this.isInTab('approve', datasetName)
		);
	};

	componentDidMount() {
		if (!Cookies.get('auth-token')) {
			window.open('/Login', '_self');
		}
	}

	renderTableHeader = () => {
		return (
			<thead>
				<tr>
					<td>
						<Form.Control
							id={'datasetName'}
							onChange={this.filter}
							placeholder={'Dataset Name'}
							type={'text'}
						/>
					</td>
					<td>
						<Form.Control
							id={'category'}
							onChange={this.filter}
							placeholder={'Category'}
							type={'text'}
						/>
					</td>
					<td>
						<Form.Control
							id={'size'}
							onChange={this.filter}
							placeholder={'Size'}
							type={'text'}
						/>
					</td>
					<td>
						<Form.Control
							id={'owner'}
							onChange={this.filter}
							placeholder={'Owner'}
							type={'text'}
						/>
					</td>
					<td>
						<Form.Control
							id={'publicPrivate'}
							onChange={this.filter}
							placeholder={'Public/Private'}
							type={'text'}
						/>
					</td>
					<td hidden={this.state.pageLoc.localeCompare('tablesToExplore') !== 0}>
						Request Access
					</td>
					<td hidden={this.state.pageLoc.localeCompare('approve') !== 0}>Grantee</td>
					<td hidden={this.state.pageLoc.localeCompare('approve') !== 0}>Grant Access</td>
					<td hidden={this.state.pageLoc.localeCompare('approve') !== 0}>Deny Access</td>
				</tr>
			</thead>
		);
	};

	renderTableRow = (row, index) => {
		return (
			<tr key={index.toString()}>
				<td id={'managePermissionDatasetName-' + index}>{row['DatasetName']}</td>
				<td>{row['Category']}</td>
				<td>{row['Size']}</td>
				<td>{row['Owner']}</td>
				<td>{row['PublicPrivate']}</td>
				<td hidden={this.state.pageLoc.localeCompare('tablesToExplore') !== 0}>
					<Button
						className={'btn-hugobot'}
						id={'askPermission-' + index}
						onClick={this.askPermissionHandler}
					>
						Access
					</Button>
				</td>
				<td
					hidden={this.state.pageLoc.localeCompare('approve') !== 0}
					id={'managePermissionGrantee-' + index}
				>
					{row['Grantee']}
				</td>
				<td hidden={this.state.pageLoc.localeCompare('approve') !== 0}>
					<Button
						className={'btn-hugobot'}
						id={'acceptPermission-' + index}
						onClick={this.acceptPermissionHandler}
					>
						Grant Access
					</Button>
				</td>
				<td hidden={this.state.pageLoc.localeCompare('approve') !== 0}>
					<Button
						className={'btn-hugobot'}
						id={'rejectPermission-' + index}
						onClick={this.rejectPermissionHandler}
					>
						Deny Access
					</Button>
				</td>
			</tr>
		);
	};

	renderTableData = () => {
		let canLaunch =
			'approve' in sessionStorage &&
			'askPermissions' in sessionStorage &&
			'askPermissions' in sessionStorage &&
			'askPermissions' in sessionStorage;

		if (canLaunch) {
			return JSON.parse(sessionStorage.getItem(this.state.pageLoc)).rows.map(
				(iter, index) => {
					if (
						this.state.pageLoc.localeCompare('tablesToExplore') !== 0 ||
						this.isInExploreTab(iter['DatasetName'])
					) {
						if (
							(this.state.filterSize.localeCompare('') === 0 ||
								parseFloat(this.state.filterSize) > parseFloat(iter['Size'])) &&
							(this.state.filterDatasetName.localeCompare('') === 0 ||
								iter['DatasetName'].includes(this.state.filterDatasetName)) &&
							(this.state.filterCategory.localeCompare('') === 0 ||
								iter['Category'].includes(this.state.filterCategory)) &&
							(this.state.filterOwner.localeCompare('') === 0 ||
								iter['Owner'].includes(this.state.filterOwner)) &&
							(this.state.filterPublicPrivate.localeCompare('') === 0 ||
								iter['PublicPrivate'].includes(this.state.filterPublicPrivate))
						) {
							return this.renderTableRow(iter, index);
						} else {
							return null;
						}
					} else {
						return null;
					}
				}
			);
		}
	};

	render() {
		let that = this;
		window.addEventListener('ReloadMail', function () {
			that.forceUpdate();
		});
		return (
			<Container fluid={true}>
				<br />
				<br />
				<Nav variant={'tabs'}>
					<Button
						active={this.state.pageLoc.localeCompare('myDatasets') === 0}
						id={'myDatasets'}
						className={'nav-link btn-hugobot'}
						onClick={this.clicked.bind(null, 'myDatasets')}
					>
						My Datasets
					</Button>
					<Button
						active={this.state.pageLoc.localeCompare('approve') === 0}
						id={'approve'}
						className={'nav-link btn-hugobot'}
						onClick={this.clicked.bind(null, 'approve')}
					>
						Approve
					</Button>
					<Button
						active={this.state.pageLoc.localeCompare('myPermissions') === 0}
						id={'myPermissions'}
						className={'nav-link btn-hugobot'}
						onClick={this.clicked.bind(null, 'myPermissions')}
					>
						Shared with me
					</Button>
					<Button
						active={this.state.pageLoc.localeCompare('askPermissions') === 0}
						id={'askPermissions'}
						className={'nav-link btn-hugobot'}
						onClick={this.clicked.bind(null, 'askPermissions')}
					>
						Pending Approval
					</Button>
					<Button
						active={this.state.pageLoc.localeCompare('tablesToExplore') === 0}
						id={'tablesToExplore'}
						className={'nav-link btn-hugobot'}
						onClick={this.clicked.bind(null, 'tablesToExplore')}
					>
						Explore...
					</Button>
				</Nav>
				<br />
				<Table striped={true} bordered={true} hover={true}>
					{this.renderTableHeader()}
					<tbody>{this.renderTableData()}</tbody>
				</Table>
			</Container>
		);
	}
}
export default Manage;
