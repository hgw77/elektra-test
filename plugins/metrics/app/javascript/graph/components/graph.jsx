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

// https://www.npmjs.com/package/react-datetime#selectable-dates
const isValidDate = (date) =>
  // do not allow dates that are in the future
  !moment(date).isAfter()

export default class MetricsGraph extends React.Component {

  constructor(props){
  	super(props);
    this.state = {
      steps: this.props.metrics.steps,
      detail_resolution: "medium",
      epoch_start_time: this.props.metrics.start_time,
      instance_id: this.props.instanceId,
    }
  }

  // https://reactjs.org/docs/faq-functions.html
  // to access this in the function and to call the function within the component
  // 1. handleChange() {}
  // 2. in the construktor -> this.handleChange = this.handleChange.bind(this);
  // or you can use the arrow function like below
  handleChange = (value) => {
    // write new slider state to local state
    var resolution = "medium";
    if (value > 100 && value < 300) {
      resolution = "ultra"
    }
    else if (value > 301 && value < 500) {
      resolution = "high"
    }
    else if (value > 800 && value < 1000) {
      resolution = "low"
    }

    this.setState({
      steps: value,
      detail_resolution: resolution
    })
    //console.log(this.state);
  }

  handleChangeComplete = () => {
    //console.log('Change event completed')
    this.props.handleStepChange(this.state.steps);
  };

  handleTimeZoomChange = (epoch) => {
    this.setState({
      epoch_start_time: epoch
    })
  }

  handleTimeZoomChangeComplete = () => {
    this.props.handleStartTimeChange(this.state.epoch_time_range);
  }

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
    console.log(this.state.instance_id);
    this.props.loadMetricsDataOnce(this.state.instance_id);
  }

  renderLine(name,unit,data,y_scale = ["auto","auto"],enable_area = false) {
    var timeTickRotation = 0;
    var marginBottom = 40;
    return (
      <div>
        <Line
        width={900}
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
        {this.renderLine("CPU Usage","%",this.props.metrics.data.cpu_usage_average,[0,100])}
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
              value={this.state.epoch_start_time}
              onChange={this.handleTimeZoomChange}
              onChangeComplete={this.handleTimeZoomChangeComplete}
              tooltip={false}
            />
          </div>
          <div>{moment(this.state.epoch_start_time).fromNow()}</div>
          <span className='toolbar-input-divider'>&ndash;</span>
          <div>Resolution</div>
          <div style={{ "width":"250px", "marginRight":"15px" }}>
            <Slider
              min={200}
              max={1000}
              step={5}
              value={this.state.steps}
              onChange={this.handleChange}
              onChangeComplete={this.handleChangeComplete}
              tooltip={false}
            />
          </div>
          <div>{this.state.detail_resolution}</div>
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
