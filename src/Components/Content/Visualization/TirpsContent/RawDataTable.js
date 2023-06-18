import React, { Component } from 'react';
import Cookies from 'js-cookie';

import { Card, Button, Table } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Axios from 'axios';

import SelectedTIRPTable from './SelectedTIRPTable';
// import WeightsForm from './WeightsForm';
import WeightsPop from './WeightsPop';
import RawDataGraphNew from './RawDataGraph';
import { CircularProgress } from '@material-ui/core';
import RawDataChart from '../../TirpsBiExploration/RawDataView/RawDataChart';
import InfoModal from './InfoModal'
import Select from "react-dropdown-select";

import { getSubTree as getSubTreeRequest } from '../../../../networking/requests/visualization';

const headerSortingStyle = { backgroundColor: '#c8e6c9' };

class RawDataTable extends Component {
	entitiesNumberCls0 = 1;
	entitiesNumberCls1 = 1;
	state = {
		weighted_vs: 34,
		weighted_mhs: 33,
		weighted_mmd: 33,

		currentPath: [],
		currentTirps: [],
		selectedTirp: null,

		modalShowSymbolPop: false,
		weightsModalShow: false,
		modalShow: false,

		sortFunc: undefined,
		sortedCol: null,
		sortAsc: true,

        currentEntity: [],
        selectId: "",
		rawData: {},
		descriteData: {},
		symbols_temporal: {},
		data_recieved: {},
		symbols_ids: {},
		range: {},
		supporting: [],
		supporting_done: false,

		symbolColorsJSON : {
			0: ['#00FFFF', '#7FFFD4', '#6495ED'], //blue
			1: ['#FF00FF', '#FFB6C1', '#800000'], //pink
			2: ['#556B2F', '#FF8C00', '#FF69B4'], //green
		}
		
	};
	
	componentDidMount() {
		if (!Cookies.get('auth-token')) {
			window.open('#/Login', '_self');
		}
		this.entitiesNumber = parseInt(localStorage.num_of_entities);
		this.entitiesNumberClass1 = parseInt(localStorage.num_of_entities_class_1);

		if (localStorage.PassedFromSearch === 'true' && window.pathOfTirps.length > 0) {
			localStorage.PassedFromSearch = false;
			const currentPath = window.pathOfTirps.slice(0, window.pathOfTirps.length - 1);
			const selectedTirp = window.pathOfTirps[window.pathOfTirps.length - 1];
			this.searchTirp(currentPath, selectedTirp);
		} else {
			this.setNewLevel(this.props.table, []);
		}
		this.getSupporting()
	}

	getSupporting(){
		console.log(this.props.table)
		let url = 'http://127.0.0.1:443/supporting';
		const Promise1 = Axios.get(url,{
			params: {
				tirp_name: this.props.table[0]._TIRP__unique_name,
				datasetName: sessionStorage['datasetReadyName'],
				visualizationId : sessionStorage['visualizationId']
			}}).then((supporting) => {
				this.setState(() => ({
					supporting: supporting.data
				}));
			})
		Promise.all([Promise1]).then(()=>{
			this.setState(() => ({
				supporting_done: true
			}))
			console.log("wow")
		})
	}

	getExistedChildren(tirps) {
		return tirps._TIRP__childes.filter(
			(child) =>
				child._TIRP__exist_in_class0 ||
				(child._TIRP__exist_in_class1 && this.props.discriminative)
		);
	}

	async searchTirp(currentPath, selectedTirp) {
		if (currentPath.length === 0) {
			// We are searching for something in the root
			this.setNewLevel(this.props.table, []);
		} else {
			const currentTirp = currentPath[currentPath.length - 1];
			if (currentPath.length === 1) {
				const visualizationId = sessionStorage.getItem('visualizationId');
				await getSubTreeRequest(currentTirp._TIRP__symbols[0], visualizationId).then(
					(data) => {
						const tirpWithChildren = data['TIRPs'];
						const children = this.getExistedChildren(tirpWithChildren);

						this.setNewLevel(children, [currentTirp]);
					}
				);
			} else {
				const children = this.getExistedChildren(currentTirp);
				this.setNewLevel(children, currentPath);
			}
		}
		const unique_name = selectedTirp._TIRP__unique_name;

		this.setState((oldState) => {
			const found = oldState.currentTirps.find(
				(tirp) => tirp._TIRP__unique_name === unique_name
			);

			return found ? { selectedTirp } : {};
		});
	}

	toPercentage(amount, total) {
		return ((amount * 100) / total).toFixed(2);
	}

	getScore = (tirp) => {
		const vs0 = this.toPercentage(tirp._TIRP__vertical_support, this.entitiesNumber);
		const vs1 = this.toPercentage(
			tirp._TIRP__vertical_support_class_1,
			this.entitiesNumberClass1
		);

		const delta_vs = Math.abs(vs0 - vs1);
		const delta_mhs = Math.abs(
			tirp._TIRP__mean_horizontal_support - tirp._TIRP__mean_horizontal_support_class_1
		);
		const delta_mmd = Math.abs(tirp._TIRP__mean_duration - tirp._TIRP__mean_duration_class_1);

		const score =
			this.state.weighted_vs * delta_vs +
			this.state.weighted_mhs * delta_mhs +
			this.state.weighted_mmd * delta_mmd;
		return (score / 100).toFixed(2);
	};

	changeWeightsValue = (value) => {
		this.setState({
			weighted_vs: value[0],
			weighted_mhs: value[1],
			weighted_mmd: value[2],
		});
	};

	Navbar() {
		const lst = [...this.props.table].map((tirp, idx) => (
			<div className='w-25 m-0'>
					{tirp._TIRP__symbols.map((object, i) => {
                        return  (
							<div className='m-0'>
						<button className='btn btn-workflow btn-arrow-right navbar-margin' id={'Info'} key={i}>{object}</button>
						</div>)
                    })}
			</div>
		));
        return lst
	}

	isRoot() {
		return this.state.currentPath.length === 0;
	}

	isSomeTirpSelected() {
		return this.state.selectedTirp !== null;
	}

	setNewLevel(tirps, path) {
		this.setState({
			currentTirps: tirps,
			currentPath: path,
			selectedTirp: tirps[0],
		});
	}

	toRoot() {
		this.setNewLevel(this.props.table, []);
	}

	toLevel(levelNum) {
		if (levelNum === 0) {
			this.toRoot();
		} else {
			const tirp = this.state.currentPath[levelNum - 1];
			if (levelNum === 1) {
				const visualizationId = sessionStorage.getItem('visualizationId');
				getSubTreeRequest(tirp._TIRP__symbols[0], visualizationId).then((data) => {
					const tirpWithChildren = data['TIRPs'];
					const children = this.getExistedChildren(tirpWithChildren);

					this.setNewLevel(children, [tirp]);
				});
			} else {
				const children = this.getExistedChildren(tirp);
				this.setNewLevel(children, this.state.currentPath.slice(0, levelNum));
			}
		}
	}

	descendTree(tirp) {
		if (this.isRoot()) {
			const visualizationId = sessionStorage.getItem('visualizationId');
			getSubTreeRequest(tirp._TIRP__symbols[0], visualizationId).then((data) => {
				const tirpWithChildren = data['TIRPs'];
				const children = this.getExistedChildren(tirpWithChildren);

				this.setNewLevel(children, [...this.state.currentPath, tirp]);
			});
		} else {
			const children = this.getExistedChildren(tirp);
			this.setNewLevel(children, [...this.state.currentPath, tirp]);
		}
	}

	Next(tirp) {
		if (
			(tirp._TIRP__childes.length !== 0 && tirp._TIRP__childes[0] === true) ||
			this.getExistedChildren(tirp).length > 0
		) {
			return (
				<Button
					className={'btn btn-hugobot'}
					id={'toy_example-btn'}
					onClick={() => this.descendTree(tirp)}
				>
					<i className='fas fa-caret-down' id={'toy_example-icon'} />
				</Button>
			);
		} else {
			return '';
		}
	}

	getRelation(tirp) {
		if (tirp._TIRP__rel.length === 0) {
			return '-';
		}
		return tirp._TIRP__rel[tirp._TIRP__rel.length - 1];
	}

	computeTableData() {
		return this.getExistedChildren({ _TIRP__childes: this.state.currentTirps }).map(
			(tirp, idx) => {
				const vs0 = tirp['_TIRP__vertical_support'];
				const vs1 = tirp['_TIRP__vertical_support_class_1'];
				const min_vs = Math.round(Number.parseFloat(localStorage.min_ver_support) * 100);
				return {
					id: idx,
					next: this.Next(tirp),
					relation: this.getRelation(tirp),
					symbol: tirp['_TIRP__symbols'][tirp['_TIRP__symbols'].length - 1],
					VS0:
						vs0 !== 0
							? this.toPercentage(vs0, this.entitiesNumber) + '%'
							: `< ${min_vs}%`,
					VS1:
						vs1 !== 0
							? this.toPercentage(vs1, this.entitiesNumberClass1) + '%'
							: `< ${min_vs}%`,
					MHS0: vs0 !== 0 ? tirp['_TIRP__mean_horizontal_support'].toFixed(2) : 'x',
					MHS1:
						vs1 !== 0 ? tirp['_TIRP__mean_horizontal_support_class_1'].toFixed(2) : 'x',
					MMD0: vs0 !== 0 ? tirp['_TIRP__mean_duration'].toFixed(2) : 'x',
					MMD1: vs1 !== 0 ? tirp['_TIRP__mean_duration_class_1'].toFixed(2) : 'x',
					score: this.getScore(tirp) + '%',
					tirp,
				};
			}
		);
	}

    addToEntity(e) {
		console.log(e)
        if (this.state.currentEntity.includes(e)){
            return
        }
        if (e >= 1 && e <=this.state.selectedTirp['_TIRP__vertical_support']){
            let entities = this.state.currentEntity
			this.getData(e)
            entities.push(this.state.selectId)
            this.setState(() => ({
                currentEntity: entities
            }));
        }
    }

    selectNumber(e) {
		for (const [key,value] of Object.entries(e)){
			this.setState(() => ({
				selectId: value["id"]
			}));
			break	
		}
        
    }

	getdatavalues(id,interval) {
		let dataOfIdentity = this.state.descriteData[id]
		let temporal = this.state.symbols_temporal[interval]
		let bins = []
		for (const [key,value] of Object.entries(this.state.symbols_temporal)){
			if (value[0]==temporal[0]){
				bins.push(key)
			}
		}
		let bins_ids = {}
		for (let j=0 ; j< bins.length; j++){
			let result = dataOfIdentity[this.state.symbols_ids[bins[j]]]
    		let values = (typeof result !== "undefined") ? result : [];
			bins_ids[bins[j]] = values
			
		}
		return bins_ids
	}

	creeatedescriteorder(descrite_dict) {
		let temp_lst = []
		for (const [key,value] of Object.entries(descrite_dict)){
			for (let j = 0; j<value.length ; j++){
				temp_lst.push([value[j][0],value[j][1],key])
			}
		}
		return temp_lst
	}

	organize(bins) {
		let symbols = {}
		for (const [key,value] of Object.entries(bins)){
			symbols[key] = [this.state.symbols_temporal[key][1],this.state.symbols_temporal[key][2]]
		}
		return symbols
	}

	getRange(data) {
		let y_max = 0
		let y_min = 20000000
		// console.log(data)
		// console.log(this.state.rawData[281]["6"])
		// console.log(this.state.symbols_temporal)
		if (data == undefined){
			return [0,68,0,200]
		}
		for (let j = 0 ; j< data.length ; j++){
			if (data[j][1] < y_min){
				y_min = data[j][1]
			}
			if (data[j][1] > y_max){
				y_max = data[j][1]
			}
		}
		// return [y_min, y_max]
		let max = 0
		let min = 20000000
		for (let j = 0 ; j< data.length ; j++){
			if (data[j][0] < min){
				min = data[j][0]
			}
			if (data[j][0] > max){
				max = data[j][0]
			}
		}
		console.log([min, max, y_min, y_max])
		return [min, max, y_min, y_max]
	}

	getData(id) {
		let all_data = this.state.data_recieved
		all_data[id] = false
		this.setState(()=>({
			data_recieved: all_data
		}))
		let url = 'http://127.0.0.1:443/rawData';
		const Promise1 = Axios.get(url,{
			params: {
				datasetName: sessionStorage['datasetReadyName'],
				id_number: id
			}}).then((raw_Data) => {
				let tmp_lst = this.state.rawData
				let tmp_raw_raw = []
				for (const [key,value] of Object.entries(raw_Data.data)){
					tmp_raw_raw=value
				}
				tmp_lst[id] = tmp_raw_raw
				this.setState(() => ({
					rawData: tmp_lst
				}));
				console.log(this.state.rawData)
			})
		url = 'http://127.0.0.1:443/descriteData';
		const Promise2 = Axios.get(url,{
			params: {
				datasetName: sessionStorage['datasetReadyName'],
				visualizationId : sessionStorage['visualizationId'],
				id_number: id
			}}).then((des_Data) => {
				console.log(des_Data)
				let tmp_lst = this.state.descriteData
				tmp_lst[id] = des_Data.data["descriteData"]
				console.log(tmp_lst[id])
				let tmp_range = this.state.range
				tmp_range[id] = des_Data.data["range"]
				console.log(tmp_lst)
				this.setState(() => ({
					descriteData: tmp_lst,
					range: tmp_range
				}));
			})
		url = 'http://127.0.0.1:443/symbols_values_data';
		const Promise3 = Axios.get(url,{
			params: {
				datasetName: sessionStorage['datasetReadyName'],
				visualizationId : sessionStorage['visualizationId'],
			}}).then((symbols) => {
				this.setState(() => ({
					symbols_temporal: symbols.data["state_temporal"],
					symbols_ids: symbols.data["name_symbol"]
				}));
			})
		Promise.all([Promise1, Promise2, Promise3]).then(()=>{ 
			let all_data = this.state.data_recieved
			all_data[id] = true
			this.setState(()=>({
				data_recieved: all_data
			}))

		})		
	}

	removeDubles(symbols) {
		let lst = []
		for (let j=0 ; j< symbols.length ; j++){
			let flag = false
			for (let i = j ; i<symbols.length; i++){
				if (j != i){
					console.log([...symbols[j]["_TIRP__symbols"]].reverse()[0].split(".")[0])
					if ([...symbols[j]["_TIRP__symbols"]].reverse()[0].split(".")[0]==[...symbols[i]["_TIRP__symbols"]].reverse()[0].split(".")[0]){
						flag = true
					}
				}
			}
			if (flag == false){
				lst.push(symbols[j])
			}
		}
		// symbols.map((tirp1)=>{
		// 	let lst = symbols.map((tirp2)=>{
		// 		if (tirp1["_TIRP__symbols"].split(".")[0] == tirp2["_TIRP__symbols"].split(".")[0]){
		// 			return tirp2
		// 		}
		// 		return
		// 	})
		// })
		console.log(lst)
		return lst

	}

	render() {
		let that = this;
		window.addEventListener('ReloadHomeTable', function () {
			that.forceUpdate();
		});
		const data = this.computeTableData().sort(this.state.sortFunc);
		const stringSort = (a, b, numeric) => {
			return a.localeCompare(b, navigator.languages[0] || navigator.language, {
				numeric,
				ignorePunctuation: true,
			});
		};

		// const renderColumn = (columnName, columnTitle, numeric = true) => {
		// 	const selected = this.state.sortedCol === columnName;
		// 	const attributes = {
		// 		onClick: () => {
		// 			const sortFunc = (a, b) => {
		// 				return this.state.sortAsc
		// 					? stringSort(a[columnName], b[columnName], numeric)
		// 					: stringSort(b[columnName], a[columnName], numeric);
		// 			};
		// 			this.setState((state) => ({
		// 				sortFunc,
		// 				sortedCol: columnName,
		// 				sortAsc: !state.sortAsc,
		// 			}));
		// 		},
		// 		style: selected ? headerSortingStyle : {},
		// 	};
		// 	return (
		// 		<th {...attributes} style={{ width: "6.5%" }}>
		// 			{selected && <i className='fa fa-sort mr-2' />}
		// 			{columnTitle}
		// 		</th>
		// 	);
		// };
		return (
			<Container fluid className='mt-2'>
				<Row>
					
						<Card style={{ position: 'absolute', height: '78%' , width: '95%'}}>
							<Card.Header className={'bg-hugobot'}>
								<Card.Text className={'text-hugobot text-hugoob-advanced'}>
									Tirp's Table
									
									<>
                                {/* <input type={'number'} style={{ width: '10%' , float: 'right'}} placeholder= {"Entity Id"} onChange={(e) => this.selectNumber(e)} /> */}
								

							</>
								</Card.Text>
							</Card.Header>
							<Card.Body className={'text-hugobot'}>
								<div className='vertical-scroll-tirp' style={{ height: '100%' }}>
								<InfoModal Navbar={this.props.table} table={this.state.selectedTirp}
									type_of_comp={this.props.discriminative ? 'disc' : 'tirp'}></InfoModal>
									{this.state.supporting_done ? <Select options={this.state.supporting} 
																		onChange={(values) => this.selectNumber(values)} 
																		labelField="name"
            															valueField="name"
																		searchable = {true}
																		style={{ width: '17%' , float: 'right', color:'black'}}/> : <></>}
								
								<Button
									disabled={!this.isSomeTirpSelected()}
									style={{ width: '2%' , float: 'right'}}
									variant='primary'
									onClick={() => this.addToEntity(this.state.selectId)}
								>
									+
								</Button>
									<Table
										striped={true}
										bordered={true}
										// hover={true}
										style={{ tableLayout: 'fixed', textAlign: 'center' }}
									>
										<thead>
											<tr>
                                                {/* change to sort -----------------------------------------*/}
                                                {/* <th style={{ width: "5%" }}>{renderColumn('id', 'Id', false)}</th> */}
                                                <th style={{ width: "3%" }}>Data</th> 
												<th>Graph</th> 
											</tr>
										</thead>
										<tbody>
                                             {this.state.currentEntity.map((id,entityindex) => {
                                                let lst = []
                                                if(this.props.path){
                                                    lst = this.props.path
                                                }
                                                lst = lst.concat(this.props.table)
												lst = this.removeDubles(lst)
                                                return lst.map((tirp,index) => {
                                                    return (
                                                        <tr key = {3*entityindex + index}>
                                                            <td>Entity Id: {id}
                                                                {[tirp._TIRP__symbols].map((i) => {
                                                                    return (<tr>
                                                                        Type: {i[i.length - 1].split(".")[0]}
                                                                    </tr>
                                                                    )
                                                                })}
																{/* <Button
																	disabled={!this.isSomeTirpSelected()}
																	style={{ width: '2%' ,  verticalAlign: 'bottom'}}
																	variant='primary'
																	onClick={() => this.addToEntity(this.state.selectId)}
																>
																</Button> */}
                                                            </td>
                                                            <td>
                                                                {this.state.data_recieved[id] === true ? [tirp._TIRP__symbols].map((i) => {
                                                                    return (<>
																		{/* <RawDataChart
																			values={this.state.rawData[id][this.state.symbols_temporal[i[i.length - 1]][0]]}
																			descriteValues={
																				this.creeatedescriteorder(this.getdatavalues(id,i[i.length - 1]))
																			}
																			symbol={i[i.length - 1].split(".")[0]}
																			key={i[i.length - 1].split(".")[0]}
																			binValues={
																				this.organize(this.getdatavalues(id,i[i.length - 1]))
																			}
																			colorsArr={['#556B2F', '#FF8C00', '#FF69B4']}
																			// descritizationMethod={descritizationMethod}
																		/> */}
																		{this.state.rawData[id][this.state.symbols_temporal[i[i.length - 1]][0]] != undefined ?
																		<div style={{width:"100%"}}>
																		<RawDataGraphNew 
																		rawData={this.state.rawData[id]} 
																		symbol_id= {this.state.symbols_temporal[i[i.length - 1]][0]} 
																		descriteData={this.getdatavalues(id,i[i.length - 1])}
																		range= {this.getRange(this.state.rawData[id][this.state.symbols_temporal[i[i.length - 1]][0]])}
																		binValues = {this.organize(this.getdatavalues(id,i[i.length - 1]))}
																		>
																		</RawDataGraphNew></div>: <>No Data</>}
																		
                                                                    </>
                                                                    )
                                                                }) : (
																	[tirp._TIRP__symbols].map((i) => {
																		return (<tr>
																			<figure class="highcharts-figure">
																			<CircularProgress
																		style={{ color: 'purple', marginLeft: '45%', marginTop: '20%', width: 75 }}
																	/>
																			</figure>
																		</tr>
																		)
																	})
																)}
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                                
                                            })}
										</tbody>
									</Table>
								</div>
							</Card.Body>
						</Card>
					
					
				</Row>
			</Container>
		);
	}
}

export default RawDataTable;
