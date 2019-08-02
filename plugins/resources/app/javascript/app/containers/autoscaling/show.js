import { connect } from  'react-redux';
import AutoscalingView from '../../components/autoscaling/show';

export default connect(
  (state, props) => ({
    autoscalableSubscopes: state.limes.autoscalableSubscopes.bySrvAndRes,
    projectConfigs: state.castellum.projectConfigs,
  }),
  dispatch => ({
  }),
)(AutoscalingView);
