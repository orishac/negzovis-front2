import React, { Component } from 'react';
import Chart from 'react-google-charts';
import { Card } from 'react-bootstrap';

class NTIRPTimeLine extends Component {
	defaultColors = ['#ff6347', '#ee82ee', '#ffa500', '#6a5acd', '#7f2b47', '#7fffe6', '#ffff10'];

	state = {
		classMode: 0,
	};
	

	createCustomHTMLContent(title, duration, time, fourth) {
		return ('<div style="padding:5px 5px 5px 5px;">' +
		// eslint-disable-next-line
		'<b>' + title + '</b>' + '<br>' + duration +
		// eslint-disable-next-line
		(time == 1 ? 1 : time) + 
		// eslint-disable-next-line
		(time == 1 ? " Time Unit" : fourth) +
		'</div>')
	}


	// Compute the dataset and set all the argumments the charts need accordingly
    computeNDataset = (vnames, elements, negatives, timezone, gap) => {
        const columns = [
            { type: "string", id: "Elements" },
			{ type: "string", id: "dummy bar label" },
       		{ type: "string", role: "tooltip" ,'p': {'html': true}},
            { type: "number", id: "Start" },
            { type: "number", id: "End" },
        ];

        const dataset = []
        let startTime = 0
        for(let i = 0; i< elements.length; i++) {
            const endTime = startTime + (timezone[i] * 1000)
			if (elements[i].length > 1) {
				for(let j = 0; j < elements[i].length; j++) {
					const row = [vnames[elements[i][j]], '',
					this.createCustomHTMLContent(vnames[elements[i][j]], "Duration: ", 
					String(((endTime - startTime)/ 1000).toFixed(2))," Time Units"),
					startTime, 
					endTime]
					dataset.push(row)
				}
			} else {
				if (negatives[i]) {
					const row = [String.fromCharCode(172) + vnames[elements[i]], '',
					this.createCustomHTMLContent(String.fromCharCode(172) + vnames[elements[i]], "Duration: ",
					String(((endTime - startTime)/ 1000).toFixed(2)), " Time Units"),
					startTime, 
					endTime]
					dataset.push(row)
				} else {
					const row = [vnames[elements[i]], '',
					this.createCustomHTMLContent(vnames[elements[i]], " Duration: ",
					String(((endTime - startTime)/ 1000).toFixed(2)), " Time Units"), 
					startTime, 
					endTime]
					dataset.push(row)
				}
			}
			startTime = endTime + (gap[i] * 1000)
        }
        const data = [columns, ...dataset];
        return data

		};
	render() {
		const vnames = this.props.vnames;
		const elements = this.props.tirp.elements;
		const negatives = this.props.tirp.negatives;
		const timezone = this.props.tirp.durations;
		const gap = this.props.tirp.gaps;
		const dataset = this.computeNDataset(vnames, elements, negatives, timezone, gap);
		const intervals = dataset.slice(1);
        const options = {
            hAxis: {
              ticks: intervals.map(([label, start, end]) => [start, end]),
            },
			timeline: { 
				colorByRowLabel: true,
			},
			tooltip: {isHtml: true},
          };
		return (
			<div>
				<Card>
					<Card.Header className={'bg-hugobot'}>
						<Card.Text className={'text-hugobot text-hugoob-advanced'}>
							Mean Presentation
						</Card.Text>
					</Card.Header>
					<Card.Body>
						<Chart
							height={'200px'}
							chartType='Timeline'
							loader={<div>Loading Chart</div>}
							data={dataset}
                            options={options}
						/>
					</Card.Body>
				</Card>
			</div>
		);
	}
}

export default NTIRPTimeLine;
