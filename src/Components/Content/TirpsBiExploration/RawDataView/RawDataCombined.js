import React, { useState, useEffect,useRef } from 'react';
import ReactApexCharts from 'react-apexcharts';
import Chart from "react-apexcharts";



const RawDataCombined = (props) => {

  let state = {
    series: [
      {
        name: "bars",
        type: "bar",
        data: [
          {
            x: 'Code',
            y: [
              new Date('2019-03-02').getTime(),
              new Date('2019-03-04').getTime()
            ]
          },
          {
            x: 'Test',
            y: [
              new Date('2019-03-04').getTime(),
              new Date('2019-03-08').getTime()
            ]
          },
          {
            x: 'Validation',
            y: [
              new Date('2019-03-08').getTime(),
              new Date('2019-03-12').getTime()
            ]
          },
          {
            x: 'Deployment',
            y: [
              new Date('2019-03-12').getTime(),
              new Date('2019-03-18').getTime()
            ]
          }
        ]
      },
      // {
      //   name: "bars2",
      //   type: "scatter",
      //   data: [
      //     {
      //       x: new Date('2019-01-01').getTime(),
      //       y: 32
      //     },
      //     {
      //       x: new Date('2019-01-01').getTime(),
      //       y: 25
      //     },
      //     {
      //       x: new Date('2019-01-01').getTime(),
      //       y: 64
      //     },
      //     {
      //       x: new Date('2019-01-01').getTime(),
      //       y: 27
      //     },
      //     {
      //       x: new Date('2019-01-01').getTime(),
      //       y: 78
      //     },
      //     {
      //       x: new Date('2019-01-01').getTime(),
      //       y: 15
      //     }
      //   ]
      // }
    ],
    options: {
      chart: {
        height: 350,
        type: 'rangeBar'
      },
      // plotOptions: {
      //   bar: {
      //     horizontal: true
      //   }
      // },
      xaxis: {
        type: 'datetime'
      }
    },
  
  
  };


    
    return (
      <div className="app">
        <div className="row">
          <div className="mixed-chart">
          <Chart 
          options={state.options} 
          series={state.series} 
          type="rangeBar" 
          height={700}
          width={800} />

          </div>
        </div>
      </div>
       
    )     
}

export default RawDataCombined;