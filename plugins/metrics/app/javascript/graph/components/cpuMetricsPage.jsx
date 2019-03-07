import { Link } from 'react-router-dom';
import { TransitionGroup } from 'react-transition-group';
import { FadeTransition } from 'lib/components/transitions';
// http://nivo.rocks/line/
import { Line, ResponsiveLine } from '@nivo/line';
// https://www.npmjs.com/package/react-datetime
import Datetime from 'react-datetime'
// https://whoisandy.github.io/react-rangeslider/
import Slider from 'react-rangeslider'
// https://www.npmjs.com/package/react-moment
import moment from 'moment'

// https://www.npmjs.com/package/react-datetime#selectable-dates
const isValidDate = (date) =>
  // do not allow dates that are in the future
  !moment(date).isAfter()

export default class MetricsGraph extends React.Component {

  constructor(props){
  	super(props);
    // used for the slider
    this.state = {
      step: this.props.metrics.step,
      resolution: 1000,
      epochStartTime: this.props.metrics.startTime,
    }
  }

  // TIMEZOME SLIDER
  handleTimeZoomChange = (epoch) => {
    var timeFrame = (this.props.metrics.endTime - epoch)/1000; // epoch comes in milliseconds
    var newStep = parseInt(timeFrame / this.state.resolution);
    if (newStep < 30) newStep = 30;
    this.setState({
      epochStartTime: epoch,
      step: newStep
    })
  }

  handleTimeZoomChangeComplete = () => {
    this.props.handleStartTimeChange(this.state.epochStartTime,this.state.step);
  }

  // BASIC REACT FUNCTIONS
  // This method is called when props are passed to the Component instance.
  // https://developmentarc.gitbooks.io/react-indepth/content/life_cycle/update/component_will_receive_props.html
  componentWillReceiveProps(nextProps) {
    //console.log('componentWillReceiveProps');
    //console.log(nextProps);
  }

  // https://reactjs.org/docs/react-component.html#componentdidmount
  // is invoked immediately after a component is mounted (inserted into the tree).
  // Initialization that requires DOM nodes should go here. If you need to load data
  // from a remote endpoint, this is a good place to instantiate the network request.
  componentDidMount() {
    console.log('componentDidMount');
    this.props.loadMetricsDataOnce(this.props.instanceId);
  }

  renderLine(name,unit,data,y_scale = ["auto","auto"],enable_area = false) {
    var timeTickRotation = 0;
    var marginBottom = 40;
    return (
      <div>
        <Line
        width={1100}
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
        enableArea={enable_area}
        // https://github.com/plouc/nivo/issues/283
        // https://github.com/d3/d3-scale
        // http://nivo.rocks/line
        xScale={{type: 'time',format: "%Y-%m-%d %H:%M:%S" ,precision: 'minute'}}
        yScale={{type: 'linear',stacked: false, "min": y_scale[0],"max": y_scale[1]}}
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
            "legend": name+" ("+unit+")",
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
  }

  renderGraph() {
    // console.log('renderGraph');
    // console.log(this.getData());
    var timeTickRotation = 0;
    var marginBottom = 40;
    if(this.props.metrics.data.length>700 || this.props.metrics.data.length<400){
      timeTickRotation = 90;
      marginBottom = 90;
    }
    // auslagern in eigene componente
    return (
      <div>
        {this.renderLine("CPU Usage","%",this.props.metrics.data,[0,100])}
        {/*this.renderLine("Memory Usage","%",this.props.metrics.data.mem_usage_average,[0,100],true)*/}
        {/*this.renderLine("Network Usage ","Kb/s",this.props.metrics.data.net_usage_average,["auto","auto"],true)*/}
      </div>
    )
  };

  toolBar() {
    return (
      <div>
        <div className='toolbar toolbar-controlcenter'>
          <div>Time Zoom</div>
          <div style={{ "width":"250px", "marginRight":"15px" }}>
            <Slider
              min={parseInt(moment().subtract(7, 'days').format('x'))}
              max={parseInt(moment().subtract(1, 'hour').format('x'))}
              step={600}
              value={this.state.epochStartTime}
              onChange={this.handleTimeZoomChange}
              onChangeComplete={this.handleTimeZoomChangeComplete}
              tooltip={false}
            />
          </div>
          <div>{moment(this.state.epochStartTime).fromNow()}</div>
          <span className='toolbar-input-divider'>&ndash;</span>
          <div>messure point every {this.state.step}s</div>
        </div>
      </div>
    )
  }

  render(){
    //console.log('render MetricsGraph');
    return (
      <div>
        { this.toolBar() }
        { this.props.metrics.isFetching ? <div><span className='spinner'> </span><span>L O A D I N G</span></div> : this.renderGraph() }
      </div>
    )
  }
}
