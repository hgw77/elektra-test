import * as constants from '../constants';
// wrapper for axios -> app/javascript/ajax_helper.js
import { ajaxHelper } from 'ajax_helper';
import { confirm } from 'lib/dialogs';
import { addNotice as showNotice, addError as showError } from 'lib/flashes';
import { ErrorsList } from 'lib/elektra-form/components/errors_list';

// const actionName= () => (
//  { type: constant.ACTION_NAME, data: somedata }
//)
// type is the type of action (is a string and comes from constans). It is used
// in the reducer switch to handle the correct action

//################### ENTRIES #########################
const requestEntries= () => (
  {
    type: constants.REQUEST_ENTRIES,
    requestedAt: Date.now()
  }
);

const requestEntriesFailure= () => (
  {
    type: constants.REQUEST_ENTRIES_FAILURE
  }
);

const receiveEntries= json => (
  {
    type: constants.RECEIVE_ENTRIES,
    entries: json,
    receivedAt: Date.now()
  }
);

const requestEntry= entryId => (
  {
    type: constants.REQUEST_ENTRY,
    entryId,
    requestedAt: Date.now()
  }
);

const requestEntryFailure= entryId => (
  {
    type: constants.REQUEST_ENTRY_FAILURE,
    entryId
  }
);

const receiveEntry= json => (
  {
    type: constants.RECEIVE_ENTRY,
    entry: json
  }
);

const fetchEntries= () =>
  function(dispatch) {
    console.log('fetchEntries');
    // parameter requestEntries() see line 9-13
    // dispatch to reducer -> see reducers -> entries.js
    // 1) switch -> constants.REQUEST_ENTRIES
    // 2) line 11-15
    dispatch(requestEntries());
    ajaxHelper.get('/entries').then( (response) => {
      // save data into store
      // see reducers -> entries.js
      return dispatch(receiveEntries(response.data));
    })
    .catch( (error) => {
      dispatch(requestEntriesFailure());
      showError(`Could not load entries (${error.message})`)
    });
  }

const shouldFetchEntries= function(state) {
  const { entries } = state;
  if (entries.isFetching || entries.requestedAt) {
    return false;
  } else {
    return true;
  }
};

const fetchEntriesIfNeeded= () =>
  function(dispatch, getState) {
    console.log('fetchEntriesIfNeeded');
    if (shouldFetchEntries(getState())) { return dispatch(fetchEntries()); }
  }
;

const requestDelete=entryId => (
  {
    type: constants.REQUEST_DELETE_ENTRY,
    entryId
  }
);

const deleteEntryFailure=entryId => (
  {
    type: constants.DELETE_ENTRY_FAILURE,
    entryId
  }
);

const removeEntry=entryId => (
  {
    type: constants.DELETE_ENTRY_SUCCESS,
    entryId
  }
);

const deleteEntry= entryId =>
  function(dispatch, getState) {
    confirm(`Do you really want to delete the entry ${entryId}?`).then(() => {
      dispatch(requestDelete(entryId));
      ajaxHelper.delete(`/entries/${entryId}`).then((response) => {
        if (response.data && response.data.errors) {
          showError(React.createElement(ErrorsList, {errors: response.data.errors}));
          dispatch(deleteEntryFailure(entryId))
        } else {
          dispatch(removeEntry(entryId));
        }
      }).catch((error) => {
        dispatch(deleteEntryFailure(entryId))
        showError(React.createElement(ErrorsList, {errors: error.message}));
      })
    }).catch((aborted) => null)
  }
;

//################ ENTRY FORM ###################
const submitEditEntryForm= (values) => (
  (dispatch) =>
    new Promise((handleSuccess,handleErrors) =>
      ajaxHelper.put(
        `/entries/${values.id}`,
        { entry: values }
      ).then((response) => {
        if (response.data.errors) handleErrors({errors: response.data.errors});
        else {
          dispatch(receiveEntry(response.data))
          handleSuccess()
        }
      }).catch(error => handleErrors({errors:error.message}))
    )
);

const submitNewEntryForm= (values) => (
  (dispatch) =>
    new Promise((handleSuccess,handleErrors) =>
      ajaxHelper.post(
        `/entries`,
        { entry: values }
      ).then((response) => {
        if (response.data.errors) handleErrors({errors: response.data.errors});
        else {
          dispatch(receiveEntry(response.data))
          handleSuccess()
        }
      }).catch(error => handleErrors({errors: error.message}))
    )
);

const filterEntries= (term) => (
  {
    type: constants.FILTER_ENTRIES,
    term
  }
);

// used in container where actions are dispatched
export {
  fetchEntries,
  fetchEntriesIfNeeded,
  deleteEntry,
  submitNewEntryForm,
  submitEditEntryForm,
  filterEntries
}
