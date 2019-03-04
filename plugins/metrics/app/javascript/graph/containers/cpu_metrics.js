import { connect } from  'react-redux';
// helper to map actions to props
import { bindActionCreators } from 'redux';
import GraphData from '../components/cpu_graph.jsx';

// import actions
import {
  handleActionStartTimeChange,
  handleActionStepsChange,
  fetchMetricsDataIfNeeded,
} from '../actions/metrics'

function mapStateToProps(state) {
  // return an object, each prop on the object will become prop on the container
  return {
    metrics:    state.metrics,
    startTime:  state.startTime,
    endTime:    state.endTime,
    isFetching: state.isFetching
  };
}

function mapDispatchToProps(dispatch) {
  // return an object, each prop on the object will become prop on the container
  return {
      //  will bind the loadMetricsDataOnce function to props so we can call it with "this.props.loadMetricsDataOnce"
      // other way without bindActionCreators -> loadMetricsDataOnce: (instanceId) => dispatch(fetchMetricsDataIfNeeded(instanceId))
      loadMetricsDataOnce:   bindActionCreators(fetchMetricsDataIfNeeded,dispatch),
      handleStepChange:      bindActionCreators(handleActionStepsChange,dispatch),
      handleStartTimeChange: bindActionCreators(handleActionStartTimeChange,dispatch)
  }
}

// subscribe to redux store updates
// anytime it updates mapStateToProps will be called
export default connect(mapStateToProps, mapDispatchToProps)(GraphData)

/*
// old way without extra map functions
export default connect(
  // mapStateToProps
  // declare what part of the store is attached to our component as props
  // can be used to filter or transform the state
  (state) => ({
    metrics: state.metrics,
    startTime: state.startTime,
    endTime: state.endTime,
    isFetching: state.isFetching
  }),
  // mapDispatchToProps
  // declare what actions are exposed to our component as props
  dispatch => ({
    loadMetricsDataOnce: (instanceId) => dispatch(fetchMetricsDataIfNeeded(instanceId)),
    handleStepChange:(steps) => dispatch(handleActionStepsChange(steps)),
    handleStartTimeChange: (startTime) => dispatch(handleActionStartTimeChange(startTime))
  })
)(GraphData);
*/
