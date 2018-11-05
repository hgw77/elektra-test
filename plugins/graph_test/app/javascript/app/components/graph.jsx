import { Link } from 'react-router-dom';
import { TransitionGroup } from 'react-transition-group';
import { FadeTransition } from 'lib/components/transitions';
// http://nivo.rocks/line/
import { Line } from '@nivo/line';
// https://www.npmjs.com/package/react-datetime
import Datetime from 'react-datetime'
// https://whoisandy.github.io/react-rangeslider/
import Slider from 'react-rangeslider'
// https://www.npmjs.com/package/react-moment
import moment from 'moment'

const isValidDate = (date) =>
  // do not allow dates that are in the future
  !moment(date).isAfter()

export default class MetricsGraph extends React.Component {

  constructor(props){
  	super(props);
    this.state = {
      value: 360
    }
  }

  handleChange = (value) => {
    this.setState({
      value: value
    })
  }

  handleChangeStart = () => {
    console.log('Change event started')
  };

  handleChangeComplete = () => {
    console.log('Change event completed')
  };

  // This method is called when props are passed to the Component instance.
  // https://developmentarc.gitbooks.io/react-indepth/content/life_cycle/update/component_will_receive_props.html
  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps');
    console.log(nextProps);
  }

  // https://reactjs.org/docs/react-component.html#componentdidmount
  // is invoked immediately after a component is mounted (inserted into the tree).
  // Initialization that requires DOM nodes should go here. If you need to load data
  // from a remote endpoint, this is a good place to instantiate the network request.
  componentDidMount() {
    console.log('componentDidMount');
    var server_id = "3f769d10-cc4f-4b78-a8c7-22f418fb35b9";
    this.props.loadMetricsDataOnce(server_id);
  }

  // Remove keys to have just an array of objects
  // Reverse array to go from the past to the present
  // getData = () => {
  //  const data = this.props.metrics.data
  //  let resultArray = Object.keys(data).map(i => data[i])
  //  console.log(resultArray.length)
  //  return resultArray
  // }

  renderGraph() {
    console.log('renderGraph');
    // console.log(this.getData());
    var timeTickRotation = 0;
    var marginBottom = 40;
    if(this.props.metrics.data.length>700 || this.props.metrics.data.length<400){
      timeTickRotation = 90;
      marginBottom = 90;
    }
    return (
      <div>
        <h3>CPU Usage Average</h3>
        <Line
          width={900}
          height={400}
          margin={{
            top: 20,
            right: 50,
            bottom: marginBottom,
            left: 80
          }}
          data={[{
            id: 'CPU Usage Average',
              "data": this.props.metrics.data
            }
          ]}
          animate={true}
          enableDots={false}
          curve="linear"
          // https://github.com/plouc/nivo/issues/283
          // https://github.com/d3/d3-scale
          xScale={{type: 'time',format: "%Y-%m-%d %H:%M:%S" ,precision: 'minute'}}
          axisBottom={{
            "orient": "bottom",
            "tickSize": 5,
            "tickPadding": 15,
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
              "legend": "CPU Usage Average(%)",
              "legendOffset": -45,
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
        />
      </div>

    )
  };

  toolBar() {
    const { value } = this.state
    return (
      <div>
        <div className='toolbar toolbar-controlcenter'>
          <label>Time range:</label>
          <Datetime
            value=""
            inputProps={{placeholder: 'Select start time'}}
            isValidDate={isValidDate}
            onChange={(e) => this.props.handleStartTimeChange(e)}/>
          <span className='toolbar-input-divider'>&ndash;</span>
          <Datetime
            value=""
            inputProps={{placeholder: 'Select end time'}}
            isValidDate={isValidDate}
            onChange={(e) => this.props.handleEndTimeChange(e)}/>
          <span className='toolbar-input-divider'>&ndash;</span>
          <div style={{ "width":"250px", "marginRight":"15px" }}>
            <Slider
              min={10}
              max={500}
              step={1}
              value={value}
              onChangeStart={this.handleChangeStart}
              onChange={this.handleChange}
              onChangeComplete={this.handleChangeComplete}
            />
          </div>
          <div>Steps - {value}</div>
        </div>
      </div>
    )
  }

  render(){
    console.log('render MetricsGraph');
    return (

      <div>
        { this.toolBar() }
        { this.props.metrics.isFetching ? <div><span className='spinner'> </span><span>L O A D I N G</span></div> : this.renderGraph() }
      </div>
    )
  }
}
