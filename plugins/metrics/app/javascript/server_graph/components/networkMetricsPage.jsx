import { Link } from 'react-router-dom';
import { TransitionGroup } from 'react-transition-group';
import { FadeTransition } from 'lib/components/transitions';

import Graph from './common/Graph'
import ToolBar from './common/ToolBar'

export default class MetricsGraph extends React.Component {

  constructor(props){
  	super(props);
    this.state = {
      resolution: 1100,
    }
  }

  componentDidMount() {
    this.props.loadMetricsDataOnce(this.props.instanceId);
  }

  render(){
    return (
      <div>
        <ToolBar
          resolution={this.state.resolution}
          step={this.props.metrics.step}
          startTime={this.props.metrics.startTime}
          endTime={this.props.metrics.endTime}
          handleStartTimeChange={this.props.handleStartTimeChange}
        />
        { this.props.metrics.isFetching ? <div><span className='spinner'> </span><span>L O A D I N G</span></div> :
        <Graph
          name="Network Bantwidth"
          unit="kb/s"
          enableArea={true}
          data={this.props.metrics.data}
          resolution={this.state.resolution}/>
        }
      </div>
    )
  }
}
