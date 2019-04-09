import { Line, ResponsiveLine } from '@nivo/line';

const Graph = ({name,data,yScale = ["auto","auto"],enableArea = false,resolution,legendUnit = ""}) => {
  var timeTickRotation = 0;
  var marginBottom = 40;
  return (
    <div>
      <Line
      width={resolution}
      height={400}
      margin={{
        top: 20,
        right: 50,
        bottom: marginBottom,
        left: 80
      }}
      data={data}
      animate={true}
      enableDots={false}
      curve="basis"
      enableArea={enableArea}
      areaBlendMode='difference'
      stacked={false}
      // https://github.com/plouc/nivo/issues/283
      // https://github.com/d3/d3-scale
      // http://nivo.rocks/line
      xScale={{type: 'time',format: "%Y-%m-%d %H:%M:%S" ,precision: 'minute'}}
      yScale={{type: 'linear',stacked: false, "min": yScale[0],"max": yScale[1]}}
      axisBottom={{
        "orient": "bottom",
        "tickSize": 5,
        "tickPadding": 20,
        "tickRotation": timeTickRotation,
        "legend": "",
        "legendOffset": 40,
        "legendPosition": "center",
        "format":'%b %d %H:%M'}}
      axisLeft={{
          "orient": "left",
          "tickSize": 5,
          "tickPadding": 10,
          "tickRotation": 0,
          "legend": name+" ("+legendUnit+")",
          "legendOffset": -60,
          "legendPosition": "center"
      }}
      axisRight={{
          "orient": "right",
          "tickSize": 5,
          "tickPadding": 10,
          "tickRotation": 0,
          "legend": "",
          "legendOffset": -45,
          "legendPosition": "center"
      }}
      tooltipFormat={ value =>
        `${value} ${legendUnit}`
      }
    />
  </div>
  )
}

export default Graph
