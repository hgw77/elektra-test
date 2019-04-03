import { Link } from 'react-router-dom';
import { TransitionGroup } from 'react-transition-group';
import { FadeTransition } from 'lib/components/transitions';

import Graph from './common/Graph'
import ToolBar from './common/ToolBar'

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

  componentDidMount() {
    this.props.loadMetricsDataOnce(this.props.instanceId);
  }

  render(){
    return (
      <div>
        <ToolBar
          state={this.state}
          onChange={this.handleTimeZoomChange}
          onChangeComplete={this.handleTimeZoomChangeComplete}
        />
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
