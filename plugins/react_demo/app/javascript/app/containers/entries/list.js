import { connect } from  'react-redux';
import EntryList from '../../components/entries/list';
import {
  fetchEntriesIfNeeded,
  deleteEntry,
  editEntry,
  filterEntries
} from '../../actions/entries'

// where is mapStateToProps und mapDispatchToProps?
// subscribe to redux store updates.
export default connect(
  // mapStateToProps
  // declare what part of the store is attached to our component as props
  // can be used to filter or transform the state
  (state) => ({
    items: state.entries.items,
    isFetching: state.entries.isFetching
  }),
  // mapDispatchToProps
  // declare what actions are exposed to our component as props
  dispatch => ({
    loadEntriesOnce: () => dispatch(fetchEntriesIfNeeded()),
    filterEntries: (term) => dispatch(filterEntries(term)),
    handleDelete: (entryId) => dispatch(deleteEntry(entryId))
  })
)(EntryList);
