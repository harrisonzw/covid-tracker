import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";

export default function LineGraph() {
  const [data, setData] = useState({});

  const buildChartData = (data, casesType = "cases") => {
    const chartData = [];
    let lastDataPoint;

    data[casesType].cases.forEach(date => {
      if (lastDataPoint) {
        const newDataPoint = {
          x: date,
          y: data[casesType][data] - lastDataPoint
        };
        chartData.push(newDataPoint);
      }
      lastDataPoint = data[casesType][date];
    });
    return chartData;
  };

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
      .then(response => response.json())
      .then(data => {
        const chartData = buildChartData(data);
        setData(chartData);
      });
  });

  return (
    <div>
      <Line />
    </div>
  );
}
