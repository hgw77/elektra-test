import * as constants from '../constants';
// wrapper for axios -> app/javascript/ajax_helper.js
import { ajaxHelper } from 'ajax_helper';
import { addNotice as showNotice, addError as showError } from 'lib/flashes';
import { ErrorsList } from 'lib/elektra-form/components/errors_list';

// ACTIONS
// const actionName= () => (
//  { type: constant.ACTION_NAME, data: somedata }
//)
// type is the type of action (is a string and comes from constans). It is used
// in the reducer switch to handle the correct action

const requestMetricsData= () => (
  {
    type: constants.REQUEST_METRICS_DATA,
    requestedAt: Date.now()
  }
);

const requestMetricsDataFailure= () => (
  {
    type: constants.REQUEST_METRICS_DATA_FAILURE
  }
);

// this is the data structure that is dispatched as action into the reducer
const receiveMetricsData= (metrics_data, server_id, start_time, end_time, steps) => (
  {
    type: constants.RECEIVE_METRICS_DATA,
    metrics_data: metrics_data,
    receivedAt: Date.now(),
    server_id: server_id,
    start_time: start_time,
    end_time: end_time,
    steps: steps
  }
);

const shouldFetchMetrics= function(state) {
  const { metrics } = state;
  if (metrics.isFetching || metrics.requestedAt) {
    return false;
  } else {
    return true;
  }
};

// DISPATCH ACTIONS
const fetchMetricsDataIfNeeded= (server_id) => (
  function(dispatch, getState) {
    console.log("fetchMetricsDataIfNeeded");
    // check if it is allready fetching
    if (shouldFetchMetrics(getState())) {
      return dispatch(fetchMetricsData(server_id));
    }
  }
);

const handleActionStartTimeChange= (start_time) => (
  function(dispatch, getState) {
    // check if it is allready fetching
    console.log("handleActionStartTimeChange");
    // server_id already in the store
    return dispatch(fetchMetricsData(undefined,start_time));
  }
);

const handleActionStepsChange= (steps) => (
  function(dispatch, getState) {
    // check if it is allready fetching
    console.log("handleActionStepsChange");
    // server_id already in the store
    return dispatch(fetchMetricsData(undefined,undefined,undefined,steps));
  }
);

const handleActionEndTimeChange= (end_time) => (
  function(dispatch, getState) {
    // check if it is allready fetching
    console.log("handleActionEndTimeChange");
    // server_id and start_time already in the store
    return dispatch(fetchMetricsData(undefined,undefined,end_time));
  }
);

// fetch real data from backend and put it into the reducer
const fetchMetricsData= (server_id, start_time, end_time, steps) =>
  function(dispatch, getState) {
    console.log("fetchMetricsData");

    // get default time frame from state
    var state = getState();
    if (!server_id) server_id = state.metrics.server_id;
    if (!start_time) start_time = state.metrics.start_time;
    if (!end_time) end_time = state.metrics.end_time;
    if (!steps) steps = state.metrics.steps;

    if (start_time > end_time) {
      showError("Start time should not bevore end time!");
      console.log("start time:"+start_time+" end time:"+end_time);
    }
    else {
      // 1) start request by setting the date
      dispatch(requestMetricsData());
      // response comes from ajaxHelper
      ajaxHelper.get(`get_metrics/?uuid=${server_id}&start_time=${start_time}&end_time=${end_time}&steps=${steps}`).then( (response) => {
        // 2) to have the data in the store dispatch the response into the reducer
        return dispatch(receiveMetricsData(response.data.cpu_usage_average.values, server_id, start_time, end_time, steps));
      })
      .catch( (error) => {
        dispatch(requestMetricsDataFailure());
        showError(`Could not load metrics data (${error.message})`)
      });
    }
  }

// export actions that are public and used in container where
// actions are dispatched
export {
  fetchMetricsDataIfNeeded,
  handleActionEndTimeChange,
  handleActionStartTimeChange,
  handleActionStepsChange
}
