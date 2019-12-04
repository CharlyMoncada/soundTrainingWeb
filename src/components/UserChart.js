import React, { Component } from 'react';
import { Form  }  from 'antd';
import axios from "axios";

import CanvasJSReact from './canvasjs.react.js';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
 
var dataPoints =[];

class UserChart extends Component {
 
	render() {	
    const options = {
			title: {
				text: "Frequencies Chart"
      },
      axisY: {
            title: "Ocurrency Percentage (%)",
            suffix: "%",
        		includeZero: false
                },
          axisX: {
        		title: "Frequency (HZ)",
        		includeZero: false
        	},
			data: [
			{
				type: "column",
				dataPoints: dataPoints
			}
			]
		}

		return (
		<div>
			<CanvasJSChart options = {options} 
				 onRef={ref => this.chart = ref}
			/>
			{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
		</div>
		);
	}
	
    async componentDidMount() {
        var chart = this.chart
        dataPoints =[]
        const {data} = await axios.get('http://c63b6c0e.ngrok.io/api/history/users/frequencies/1');
        console.log(data)
        for (var i = 0; i < data.Frequency.length; i++) {
           	dataPoints.push({
                label: data.Frequency[i].Frecuency,
                y: data.Frequency[i].Percentaje
            });
        }
        chart.render();
      }
};
 
const UserChartDinamic = Form.create({ name: 'user_chart' })(UserChart);
export default UserChartDinamic