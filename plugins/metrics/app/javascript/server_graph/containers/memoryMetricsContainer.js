import { connect } from  'react-redux';
// helper to map actions to props
import { bindActionCreators } from 'redux';
// import related view
import memoryMetricsPage from '../components/memoryMetricsPage.jsx';
// import all actions
import * as metricActions from '../actions/memoryMetricActions'

// declare what part of the store we want to attach to our component as props
// state:    is the state within our Redux store
// ownProps: is a reference to the components own props, mostly used to accessing routing related props injected by React Router
function mapStateToProps(state, ownProps) {
  // return an object, each prop on the object will become prop on the container
  return {
    metrics: state.memoryMetrics
  };
}

// declare what actions we want to expose to props
function mapDispatchToProps(dispatch) {
  // return an object, each prop on the object will become prop on the container
  return {
      //  will bind the loadMetricsDataOnce function to props so we can call it with "this.props.loadMetricsDataOnce"
      // other way without bindActionCreators -> loadMetricsDataOnce: (instanceId) => dispatch(fetchMetricsDataIfNeeded(instanceId))
      loadMetricsDataOnce:   bindActionCreators(metricActions.fetchMetricsDataIfNeeded,dispatch),
      handleSliderValueChange: bindActionCreators(metricActions.handleSliderValueChange,dispatch)
  }
}

// subscribe to redux store updates
// anytime it updates mapStateToProps and mapDispatchToProps will be called
export default connect(mapStateToProps, mapDispatchToProps)(memoryMetricsPage)
