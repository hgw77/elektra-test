import { Link } from 'react-router-dom';
import { TransitionGroup } from 'react-transition-group';
import { FadeTransition } from 'lib/components/transitions';
import moment from 'moment';
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
    this.props.loadMetricsDataOnce(this.props.instanceId,parseInt(moment().format('X')));
  }

  render(){
    return (
      <div>
        <div>
          <span className="fa fa-question-circle-o" style={{paddingLeft:"20px", paddingRight:"5px"}}></span>
          VirtualDisk read/write average reported by VCenter
        </div>
        <ToolBar
          resolution={this.state.resolution}
          step={this.props.metrics.step}
          sliderValue={this.props.metrics.sliderValue}
          handleSliderValueChange={this.props.handleSliderValueChange}
          isFetching={this.props.metrics.isFetching}
        />
        <Graph
          name="Disk Read/Write"
          enableArea={true}
          data={this.props.metrics.data}
          resolution={this.state.resolution}
          legendUnit="kb/s"
        />
      </div>
    )
  }
}
