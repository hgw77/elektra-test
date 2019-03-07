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
// render graph
import Graph from './common/Graph'

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
      resolution: 1100,
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
    console.log('componentWillReceiveProps');
    console.log(nextProps);
  }

  // https://reactjs.org/docs/react-component.html#componentdidmount
  // is invoked immediately after a component is mounted (inserted into the tree).
  // Initialization that requires DOM nodes should go here. If you need to load data
  // from a remote endpoint, this is a good place to instantiate the network request.
  componentDidMount() {
    console.log('componentDidMount');
    this.props.loadMetricsDataOnce(this.props.instanceId);
  }

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
        { this.props.metrics.isFetching ? <div><span className='spinner'> </span><span>L O A D I N G</span></div> :
        <Graph
          name="Memory Usage"
          unit="%"
          data={this.props.metrics.data}
          resolution={this.state.resolution}/>
        }
      </div>
    )
  }
}
