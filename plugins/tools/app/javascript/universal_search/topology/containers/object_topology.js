import { connect } from  'react-redux';
import ObjectTopology from '../components/object_topology';
import { fetchTopologyObjects, removeLeaves, reset } from '../actions/topology'

export default connect(
  (state,ownProps ) => {
    return { objects: state.topology.objects }
  },
  dispatch => ({
    loadRelatedObjects: (objectId) => dispatch(fetchTopologyObjects(objectId)),
    removeRelatedObjects: (objectId) => dispatch(removeLeaves(objectId)),
    resetState: () => dispatch(reset())
  })
)(ObjectTopology);
