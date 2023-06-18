import React, { Component} from 'react';
import Highcharts from "highcharts"
import { useEffect, useState } from 'react';
import HighchartsReact from 'highcharts-react-official';
import { CircularProgress } from '@material-ui/core';
require("highcharts/highcharts-more")(Highcharts)



// const options = {
//     chart: {
//         type: 'xrange'
//     },
//     title: {
//         text: 'Highcharts X-range'
//     },
//     accessibility: {
//         point: {
//             descriptionFormatter: function (point) {
//                 var ix = point.index + 1,
//                     category = point.yCategory,
//                     from = new Date(point.x),
//                     to = new Date(point.x2);
//                 return ix + '. ' + category + ', ' + from.toDateString() +
//                     ' to ' + to.toDateString() + '.';
//             }
//         }
//     },
//     xAxis: {
//         type: 'datetime'
//     },
//     yAxis: {
//         title: {
//             text: ''
//         },
//         categories: ['Prototyping', 'Development', 'Testing'],
//         reversed: true
//     },
//     series: [{
//         name: 'Project 1',
//         // pointPadding: 0,
//         // groupPadding: 0,
//         borderColor: 'gray',
//         pointWidth: 20,
//         data: [{
//             x: Date.UTC(2014, 10, 21),
//             x2: Date.UTC(2014, 11, 2),
//             y: 0,
//         }, {
//             x: Date.UTC(2014, 11, 2),
//             x2: Date.UTC(2014, 11, 5),
//             y: 1
//         }, {
//             x: Date.UTC(2014, 11, 8),
//             x2: Date.UTC(2014, 11, 9),
//             y: 2
//         }, {
//             x: Date.UTC(2014, 11, 9),
//             x2: Date.UTC(2014, 11, 19),
//             y: 1
//         }, {
//             x: Date.UTC(2014, 11, 10),
//             x2: Date.UTC(2014, 11, 23),
//             y: 2
//         }],
//         dataLabels: {
//             enabled: true
//         }
//     },{
//         name: 'Project 2',
//         pointWidth: 20,
//         pointHight:1,
//         type: "scatter",
//         data: [[
//             Date.UTC(2014, 10, 21),
//             0,

//         ], [
//             Date.UTC(2014, 10, 27),
//             1,

//         ],[
//             Date.UTC(2014, 11, 6),
//             2,

//         ]],
//         dataLabels: {
//             enabled: true
//         }
//     }]
//     }

const RawDataGraphNew = (props) => {
    const [options, setOptions] = useState({});
    const [rawData, setRawdata] = useState([]);
    const [descriteData, setDescritedata] = useState([]);
    const [range, setRange] = useState([]);
    const [bins, setBins] = useState({});
    const [force,forceUpdate] = useState(0)

    const createOptions = (series, name) => {
        let show = true
        let options = {
            chart: {
                type: 'scatter',
                height: 200,
                events: {
                    load() {
                      this.showHideFlag = true;
                    }
                  }
            },
            legend: {
                align: "right",
                layout: 'vertical',
                verticalAlign: 'middle',
                width: '10%',
                floating: false
            },
            accessibility: {
                point: {
                    // descriptionFormatter: function (point) {
                    //     var ix = point.index + 1,
                    //         category = point.yCategory,
                    //         from = new Date(point.x),
                    //         to = new Date(point.x2);
                    //     return ix + '. ' + category + ', ' + from.toDateString() +
                    //         ' to ' + to.toDateString() + '.';
                    // }
                }
            },
            plotOptions:{
                series:{
                    events: {
                        legendItemClick: function (){
                            let chart = this.chart
                            // series = chart.series;
                            // if (this.index === 0) {
                            //     if (series[0].options.dataLabels.enabled == true){

                            //         this.chart.series[0].options.dataLabels.enabled = false
                            //     }
                            //     else{
                            //         this.chart.series[0].options.dataLabels.enabled = true
                            //     }
                            //     console.log(this.chart.series[0].options.dataLabels.enabled)
                            //     forceUpdate(force+1)
                            // }
                            chart.showHideFlag = !chart.showHideFlag
                            show = !show
                            chart.redraw()
                            // console.log(chart.showHideFlag)
                            return false
                        },
                        showCheckbox: true
                    },
                },
                arearange:{
                    allowPointSelect: false,
                    enableMouseTracking: false,  
                }
            },
            xAxis: {
                // min: range[0],
                // max: range[1]
                // title: {
                //     text: 'Time Stamp'
                // }
            },
            yAxis: [
            {
                title: {
                    text: name
                }
                // ,
                // categories: ["low","high"]
            }],
            title: {
                text: ""
            },
            series: [{
                name: 'Raw Data',
                type: "scatter",
                data: rawData,
                color: 'black',
                zIndex: 1,
                dataLabels: {
                    enabled: show
                },
                showInLegend: true
            },
            ...series]
            }
            return options

        }

    
    
    useEffect(() => {
        //
        setRawdata(props.rawData[props.symbol_id])
        setRange(props.range)
        setBins(props.binValues)
        let symbols = []
        let counter = 0
        let range_series = []
        let name = ""
        for (const [key,value] of Object.entries(props.binValues)){
            name = key.split(".")[0]
            break
        }
        
        //let colors = ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1']
        let colors = ['#2b908f','#f45b5b','#90ed7d','#f7a35c', '#8085e9']
        for (const [key,value] of Object.entries(props.descriteData)){
            let shown_once = false
            let descrite_daataa = value.map((iter) => {
                // if (bins[key]!= undefined){
                // if (shown_once == true){
                //     range_series.push({name: key + " [" + bins[key][0] + ":" + bins[key][1] + "]",type: 'arearange', data:[[parseInt(iter[0]),range[0],range[1]],[parseInt(iter[1]),range[0],range[1]]], color:colors[counter], dataLabels: {enabled: false}, showInLegend: false, zIndex: 0, linkedTo: key})
                // }
                // else{
                //     range_series.push({id:key, name: key + " [" + bins[key][0] + ":" + bins[key][1] + "]",type: 'arearange', data:[[parseInt(iter[0]),range[0],range[1]],[parseInt(iter[1]),range[0],range[1]]], color:colors[counter], dataLabels: {enabled: false}, showInLegend: true, zIndex: 0})
                // }
                // if (shown_once == false){
                //     shown_once= true
                // }
                // }
                if (bins[key]!= undefined){
                    if (shown_once == true){
                        //console.log(bins[key])
                        if (bins[key][0] == "-inf"){
                            range_series.push({name: key + " [" + bins[key][0] + ":" + parseFloat(bins[key][1]).toFixed(2) + "]",type: 'arearange', data:[[parseInt(iter[0]),range[2] - 1,parseFloat(bins[key][1])],[parseInt(iter[1]),range[2] - 1,parseFloat(bins[key][1])]], color:colors[counter], dataLabels: {enabled: false}, showInLegend: false, zIndex: 0, linkedTo: key})
                        }
                        else if (bins[key][1] == "inf"){
                            range_series.push({name: key + " [" + parseFloat(bins[key][0]).toFixed(2) + ":" + bins[key][1] + "]",type: 'arearange', data:[[parseInt(iter[0]),parseFloat(bins[key][0]),range[3] + 1],[parseInt(iter[1]),parseFloat(bins[key][0]),range[3]+1]], color:colors[counter], dataLabels: {enabled: false}, showInLegend: false, zIndex: 0, linkedTo: key})
                        }
                        else {
                            range_series.push({name: key + " [" + parseFloat(bins[key][0]).toFixed(2) + ":" + parseFloat(bins[key][1]).toFixed(2) + "]",type: 'arearange', data:[[parseInt(iter[0]),parseFloat(bins[key][0]),parseFloat(bins[key][1])],[parseInt(iter[1]),parseFloat(bins[key][0]),parseFloat(bins[key][1])]], color:colors[counter], dataLabels: {enabled: false}, showInLegend: false, zIndex: 0, linkedTo: key})
                        }  
                    }
                    else{
                        if (bins[key][0] == "-inf"){
                            range_series.push({id: key, name: key + " [" + bins[key][0] + ":" + parseFloat(bins[key][1]).toFixed(2) + "]",type: 'arearange', data:[[parseInt(iter[0]),range[2] - 1,parseFloat(bins[key][1])],[parseInt(iter[1]),range[2] - 1,parseFloat(bins[key][1])]], color:colors[counter], dataLabels: {enabled: false}, showInLegend: true, zIndex: 0})
                        }
                        else if (bins[key][1] == "inf"){
                            range_series.push({id: key, name: key + " [" + parseFloat(bins[key][0]).toFixed(2) + ":" + bins[key][1] + "]",type: 'arearange', data:[[parseInt(iter[0]),parseFloat(bins[key][0]),range[3] + 1],[parseInt(iter[1]),parseFloat(bins[key][0]),range[3]+1]], color:colors[counter], dataLabels: {enabled: false}, showInLegend: true, zIndex: 0})
                        }
                        else {
                            range_series.push({id: key, name: key + " [" + parseFloat(bins[key][0]).toFixed(2) + ":" + parseFloat(bins[key][1]).toFixed(2) + "]",type: 'arearange', data:[[parseInt(iter[0]),parseFloat(bins[key][0]),parseFloat(bins[key][1])],[parseInt(iter[1]),parseFloat(bins[key][0]),parseFloat(bins[key][1])]], color:colors[counter], dataLabels: {enabled: false}, showInLegend: true, zIndex: 0})
                        }
                    }
                    if (shown_once == false){
                            shown_once= true
                        }
                }
                // else{
                //     console.log("wtf")
                //     range_series.push({name:key + " [" + props.binValues[key][0] + ":" + props.binValues[key][1] + "]",type: 'arearange',color:colors[counter], visible:false, zIndex: 0})
                // }
                // else{
                //     range_series.push({name:key + " [" + bins[key][0] + ":" + bins[key][1] + "]"})
                // }
                return {x:iter[0],x2:iter[1], y:0, color:colors[counter]}
            })
            counter+=1
            symbols.push(...descrite_daataa)
            
            
		}

        setDescritedata(symbols)
        
        let series = [
        // ,{
        //     name: 'Intervals',
        //     pointPadding: 0,
        //     groupPadding: 0,
        //     borderColor: 'gray',
        //     pointWidth: 20,
        //     type: 'xrange',
        //     grouping: true,
        //     data: descriteData,
        //     dataLabels: {
        //         enabled: true
        //     }
        // }
        ]
        series.push(...range_series)
        let res = createOptions(series,name)
        setOptions(res)
        // forceUpdate()
        //
        //
        //
        //
        //
        //
        //
        //
        
	}, [rawData]);

    if (options == []){
        return (
            <CircularProgress style={{ color: 'purple', marginLeft: '45%', marginTop: '20%', width: 75 }}/>
        )
    }
    return (
            <HighchartsReact highcharts={Highcharts} options= {options}></HighchartsReact>
    )
}

class RawDataGraph extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id : props.symbol_id,
            options: {}
        }
    }
    
    componentDidMount(){
        this.createOptions(this.props.rawData)
    }

    createOptions = (data) => {
        let dat = [[]]
        if (this.props.rawData && this.props.rawData){
            let dat = data[this.state.id]
            let options = {
                chart: {
                    type: 'scatter'
                },
                accessibility: {
                    point: {
                        // descriptionFormatter: function (point) {
                        //     var ix = point.index + 1,
                        //         category = point.yCategory,
                        //         from = new Date(point.x),
                        //         to = new Date(point.x2);
                        //     return ix + '. ' + category + ', ' + from.toDateString() +
                        //         ' to ' + to.toDateString() + '.';
                        // }
                    }
                },
                xAxis: {
                    type: 'datetime'
                },
                yAxis: [{
                    title: {
                        text: 'categories'
                    },
                }],
                series: [{
                    name: 'Project 1',
                    pointPadding: 0,
                    groupPadding: 0,
                    borderColor: 'gray',
                    pointWidth: 20,
                    type: 'xrange',
                    grouping: true,
                    data: [{
                        x: Date.UTC(2014, 10, 21),
                        x2: Date.UTC(2014, 11, 2),
                        y: 0,
                    }, {
                        x: Date.UTC(2014, 11, 2),
                        x2: Date.UTC(2014, 11, 5),
                        y: 1
                    }, {
                        x: Date.UTC(2014, 11, 8),
                        x2: Date.UTC(2014, 11, 9),
                        y: 2
                    }, {
                        x: Date.UTC(2014, 11, 9),
                        x2: Date.UTC(2014, 11, 19),
                        y: 1
                    }, {
                        x: Date.UTC(2014, 11, 10),
                        x2: Date.UTC(2014, 11, 23),
                        y: 1
                    }],
                    dataLabels: {
                        enabled: true
                    }
                },{
                    name: 'Project 2',
                    type: "scatter",
                    data: data[this.state.id].map((x_y) => {
                        return x_y
                    }),
                    dataLabels: {
                        enabled: true
                    }
                }]
                }
                this.setState(() => ({
                    options: options
                }));
        }
        
        
            
    }
    
	render() {
        console.log(this.props.rawData)
        // console.log(this.props.symbol_id)
        
		return (
                <HighchartsReact highcharts={Highcharts} options= {this.state.options}></HighchartsReact>
		);
	}
}

export default RawDataGraphNew;