import { connect } from  'react-redux';
import GraphData from '../components/graph.jsx';

// import actions!!!!
import {
  handleActionStartTimeChange,
  //handleActionEndTimeChange,
  handleActionStepsChange,
  fetchMetricsDataIfNeeded,
} from '../actions/metrics'

// subscribe to redux store updates.
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
    //handleEndTimeChange: (endTime) => dispatch(handleActionEndTimeChange(endTime))
  })
)(GraphData);
