import { connect } from  'react-redux';
import GraphData from '../components/graph.jsx';

// import actions!!!!
import {
  handleActionStartTimeChange,
  handleActionEndTimeChange,
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
    start_time: state.start_time,
    end_time: state.end_time,
    isFetching: state.isFetching
  }),
  // mapDispatchToProps
  // declare what actions are exposed to our component as props
  dispatch => ({
    loadMetricsDataOnce: (server_id) => dispatch(fetchMetricsDataIfNeeded(server_id)),
    handleStepChange:(steps) => dispatch(handleActionStepsChange(steps)),
    handleStartTimeChange: (start_time) => dispatch(handleActionStartTimeChange(start_time)),
    handleEndTimeChange: (end_time) => dispatch(handleActionEndTimeChange(end_time))
  })
)(GraphData);
