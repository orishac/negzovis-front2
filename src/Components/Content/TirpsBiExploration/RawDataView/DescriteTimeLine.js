import React, { useState, useEffect,useRef } from 'react';
import Chart from "react-google-charts";


const DescriteTimeLine = (props) => {
    let title = props.title;
    let values = props.data;


    return (
        <div style={{marginLeft: '5%'}}>
        {/* <p style={{fontSize: '20px'}}>
            Descritization Method: {descritizationMethod}
        </p> */}
        <Chart
            chartType="Timeline"
            loader={<div>Loading Chart</div>}
            data={[
                title,
                ...values
            ]}
            rootProps={{ 'data-testid': '2' }}
            options={{
                width: '1500',
                height: '800',
                // colors: colors, 
                // timeline: { colorByRowLabel: true }
            }}
        />
        </div>
    )     
}

export default DescriteTimeLine;