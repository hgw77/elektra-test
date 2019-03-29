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
