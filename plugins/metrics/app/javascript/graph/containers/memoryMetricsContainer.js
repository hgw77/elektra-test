import { connect } from  'react-redux';
// helper to map actions to props
import { bindActionCreators } from 'redux';
// import related view
import memoryMetricsPage from '../components/memoryMetricsPage.jsx';
// import all actions
import * as metricActions from '../actions/memoryMetricActions'
/*
// import dedicated actions
import {
  handleStartTimeChange,
  handlestepChange,
  fetchMetricsDataIfNeeded,
} from '../actions/metrics'
*/

// declare what part of the store we want to attach to our component as props
// state:    is the state within our Redux store
// ownProps: is a reference to the components own props, mostly used to accessing routing related props injected by React Router
function mapStateToProps(state, ownProps) {
  // return an object, each prop on the object will become prop on the container
  console.log(state);
  return {
    metrics: state.memoryMetrics.memory
  };
}

// declare what actions we want to expose to props
function mapDispatchToProps(dispatch) {
  // return an object, each prop on the object will become prop on the container
  return {
      //  will bind the loadMetricsDataOnce function to props so we can call it with "this.props.loadMetricsDataOnce"
      // other way without bindActionCreators -> loadMetricsDataOnce: (instanceId) => dispatch(fetchMetricsDataIfNeeded(instanceId))
      loadMetricsDataOnce:   bindActionCreators(metricActions.fetchMetricsDataIfNeeded,dispatch),
      handleStartTimeChange: bindActionCreators(metricActions.handleStartTimeChange,dispatch)
  }
}

// subscribe to redux store updates
// anytime it updates mapStateToProps and mapDispatchToProps will be called
export default connect(mapStateToProps, mapDispatchToProps)(memoryMetricsPage)

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
    handleStepChange:(step) => dispatch(handlestepChange(step)),
    handleStartTimeChange: (startTime) => dispatch(handleStartTimeChange(startTime))
  })
)(GraphData);
*/
